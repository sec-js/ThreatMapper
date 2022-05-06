import math
import os
import re
from urllib.parse import unquote
from flask import Blueprint, request, make_response
from collections import defaultdict
from flask import current_app as app
from flask_jwt_extended import jwt_required
import networkx as nx
from utils.response import set_response
from utils.helper import split_list_into_chunks, get_deepfence_logs, get_process_ids_for_pod, md5_hash
from utils.esconn import ESConn, GroupByParams
from utils.decorators import user_permission, non_read_only_user, admin_user_only
from collections import defaultdict
from utils.constants import USER_ROLES, TIME_UNIT_MAPPING, CVE_INDEX, ALL_INDICES, CLOUD_COMPLIANCE_SCAN, NODE_TYPE_CONTAINER, NODE_TYPE_CONTAINER_IMAGE
from utils.scope import fetch_topology_data
from utils.node_helper import determine_node_status
from datetime import datetime, timedelta
from utils.helper import is_network_attack_vector, get_topology_network_graph, modify_es_index
from utils.node_utils import NodeUtils
from flask.views import MethodView
from utils.custom_exception import InvalidUsage, InternalError, DFError, NotFound
from models.node_tags import NodeTags
from models.container_image_registry import RegistryCredential
from models.user import User, Role
from models.user_activity_log import UserActivityLog
from models.email_configuration import EmailConfiguration
from config.redisconfig import redis
from utils.es_query_utils import get_latest_cve_scan_id
import json
from flask_jwt_extended import get_jwt_identity
from utils.resource import encrypt_cloud_credential
from resource_models.node import Node
from utils.resource import get_nodes_list, get_default_params

cloud_compliance_api = Blueprint("cloud_compliance_api", __name__)


@cloud_compliance_api.route("compliance/search", methods=["POST"])
# @jwt_required()
# @valid_license_required
def search():
    from_arg = request.args.get("from", 0)
    size_arg = request.args.get("size", 50)
    max_result_window = os.environ.get("MAX_RESULT_WINDOW", 10000)

    number = request.args.get("number")
    time_unit = request.args.get("time_unit")

    if number:
        try:
            number = int(number)
        except ValueError:
            raise InvalidUsage("Number should be an integer value.")

    if bool(number is not None) ^ bool(time_unit):
        raise InvalidUsage("Require both number and time_unit or ignore both of them.")

    if time_unit and time_unit not in TIME_UNIT_MAPPING.keys():
        raise InvalidUsage("time_unit should be one of these, month/day/hour/minute")

    lucene_query_string = request.args.get("lucene_query")
    if lucene_query_string:
        lucene_query_string = unquote(lucene_query_string)

    try:
        max_result_window = int(max_result_window)
    except ValueError:
        raise InvalidUsage("max_result_window should be an integer.")

    try:
        size_arg = int(size_arg)
    except ValueError:
        raise InvalidUsage("Size should be an integer value.")

    sort_order = request.args.get("sort_order", "desc")

    sort_order = sort_order.lower()
    if sort_order not in ["asc", "desc"]:
        raise InvalidUsage("Supported values for sort_order are `asc` and `desc`.")

    sort_by = request.args.get("sort_by", "@timestamp")

    try:
        from_arg = int(from_arg)
    except ValueError:
        raise InvalidUsage("From parameter should be an integer value.")
    if from_arg < 0:
        raise InvalidUsage("From parameter should be a positive integer value.")
    if (from_arg + size_arg) > max_result_window:
        raise InvalidUsage("FROM + SIZE cannot exceed {}".format(max_result_window))

    if not request.is_json:
        raise InvalidUsage("Missing JSON in request")
    if type(request.json) != dict:
        raise InvalidUsage("Request data invalid")
    filters = request.json.get("filters")
    if not filters:
        raise InvalidUsage("filters key is required.")

    _type = request.json.get("_type")
    index_name = modify_es_index(_type)
    if not index_name:
        raise InvalidUsage("_type is required")

    _source = request.json.get("_source", [])

    if index_name not in ALL_INDICES:
        raise InvalidUsage("_type should be one of {}".format(ALL_INDICES))

    # return set_response(data="api is working fine initially as of now")
    
    node_filters = request.json.get("node_filters", {})
    if node_filters:
        if index_name == CLOUD_COMPLIANCE_SCAN:
            tmp_filters = filter_node_for_compliance(node_filters)
            if tmp_filters:
                filters = {**filters, **tmp_filters}
    scripted_sort = None
    # severity_sort = False
    # if index_name == ALERTS_INDEX:
    #     if sort_by == "severity":
    #         severity_sort = True
    # elif index_name == CVE_INDEX:
    #     if sort_by == "cve_severity":
    #         severity_sort = True
    # if severity_sort:
    #     scripted_sort = [
    #         {
    #             "_script": {
    #                 "type": "number",
    #                 "script": {
    #                     "lang": "painless",
    #                     "source": "params.sortOrder.indexOf(doc['" + sort_by + ".keyword'].value)",
    #                     "params": {"sortOrder": ["info", "low", "high", "medium", "critical"]}
    #                 },
    #                 "order": sort_order
    #             }
    #         }
    #     ]
    search_response = ESConn.search_by_and_clause(
        index_name,
        filters,
        from_arg,
        sort_order,
        number,
        TIME_UNIT_MAPPING.get(time_unit),
        lucene_query_string,
        size_arg,
        _source,
        sort_by=sort_by,
        scripted_sort=scripted_sort,
    )

    values_for = request.json.get("values_for", [])

    filters.update({
        "type": _type,
        "masked": "false"
    })

    values_for_response = {}
    if values_for:
        values_for_buckets = ESConn.multi_aggr(
            index_name,
            values_for,
            filters,
            number,
            TIME_UNIT_MAPPING.get(time_unit),
            lucene_query_string=lucene_query_string
        )

        for key, value in values_for_buckets.items():
            value_buckets = value.get("buckets", [])
            value_array = []
            for value_bucket in value_buckets:
                if value_bucket["doc_count"] > 0:
                    value_array.append(value_bucket["key"])
            values_for_response[key] = value_array

    # Add max_result_window to the response.
    search_response["max_result_window"] = max_result_window
    search_response["values_for"] = values_for_response
    search_response["total"] = search_response.get("total", {}).get("value", 0)
    return set_response(data=search_response)
    


def filter_node_for_compliance(node_filters):
    host_names = []
    node_names = []
    k8_names = []
    k8s_namespaces = node_filters.get("kubernetes_namespace", [])
    if k8s_namespaces and type(k8s_namespaces) != list:
        k8s_namespaces = [k8s_namespaces]
    if node_filters.get("host_name"):
        host_names.extend(node_filters["host_name"])
    if node_filters.get("kubernetes_cluster_name"):
        k8_names.extend(node_filters["kubernetes_cluster_name"])
    if node_filters.get("container_name"):
        node_names.extend(node_filters["container_name"])
    container_filters = {k: v for k, v in node_filters.items() if k in [
        "user_defined_tags"]}
    if container_filters:
        containers = get_nodes_list(get_default_params({"filters": {
            "type": NODE_TYPE_CONTAINER, **node_filters}, "size": 50000})).get("data", [])
        if containers:
            for container in containers:
                if container.get("container_name") and container.get("host_name"):
                    container_name = "{0}/{1}".format(
                        container["host_name"], container["container_name"])
                    if container_name not in node_names:
                        if k8s_namespaces:
                            for table in container.get("tables", []):
                                if table.get("id") == "docker_label_":
                                    for row in table.get("rows", []):
                                        if row.get("id") == "label_io.kubernetes.pod.namespace":
                                            if row.get("entries", {}).get("value", "") in k8s_namespaces:
                                                node_names.append(
                                                    container_name)
                        else:
                            node_names.append(container_name)
    if node_filters.get("image_name_with_tag"):
        node_names.extend(node_filters["image_name_with_tag"])
    image_filters = {k: v for k, v in node_filters.items() if k in [
        "user_defined_tags"]}
    if image_filters:
        images = get_nodes_list(get_default_params({"filters": {
            "type": NODE_TYPE_CONTAINER_IMAGE, **node_filters}, "size": 50000})).get("data", [])
        if images:
            for image in images:
                if image.get("image_name_with_tag") and image["image_name_with_tag"] not in node_names:
                    node_names.append(image["image_name_with_tag"])
    filters = {}
    if host_names:
        filters["node_name"] = host_names
    if node_names:
        node_names.extend(host_names)
        filters["node_name"] = node_names
    if k8_names:
        filters["kubernetes_cluster_name"] = k8_names
    return filters


