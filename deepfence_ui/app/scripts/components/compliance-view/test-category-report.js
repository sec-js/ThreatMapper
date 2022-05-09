/* eslint-disable react/destructuring-assignment */
/* eslint-disable */
import React from 'react';
import StackedColumnChart from '../common/charts/stacked-chart/column-stacked';
import {
  getComplianceTestCategoryReportAction,
  setSearchQuery,
} from '../../actions/app-actions';
import {constructGlobalSearchQuery} from '../../utils/search-utils';
import pollable from '../common/header-view/pollable';

class ComplianceTestCategoryReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getReport = this.getReport.bind(this);
    this.sectionClickHandler = this.sectionClickHandler.bind(this);
  }

  componentDidMount() {
    const {registerPolling, startPolling} = this.props;
    registerPolling(this.getReport);
    startPolling();
  }

  getReport(pollParams) {
    const {
      dispatch, nodeId, scanId, checkType
    } = this.props;
    const {
      globalSearchQuery,
      alertPanelHistoryBound = this.props.alertPanelHistoryBound || {},
      initiatedByPollable,
    } = pollParams;
    const params = {
      nodeId,
      scanId,
      checkType,
      lucene_query: globalSearchQuery,
      // Conditionally adding number and time_unit fields
      ...(alertPanelHistoryBound.value
        ? {number: alertPanelHistoryBound.value.number} : {}),
      ...(alertPanelHistoryBound.value
        ? {time_unit: alertPanelHistoryBound.value.time_unit} : {}),
      initiatedByPollable,
    };
    // return dispatch(getComplianceTestCategoryReportAction(params));
  }

  sectionClickHandler(point) {
    if (!point.node) {
      return;
    }
    const {
      globalSearchQuery: existingQuery = [],
      dispatch,
    } = this.props;
    const newSearchParams = {
      test_category: point.node,
    };
    const searchQuery = constructGlobalSearchQuery(existingQuery, newSearchParams);
    const globalSearchQuery = {
      searchQuery,
    };
    dispatch(setSearchQuery(globalSearchQuery));
  }

  componentWillUnmount() {
    const {stopPolling} = this.props;
    stopPolling();
  }

  render() {
    const {data} = this.props;
    return (
      <div>
        <StackedColumnChart
          data={data}
          onSectionClick={this.sectionClickHandler}
          chartHeight={200}
        />
      </div>
    );
  }
}

export default pollable()(ComplianceTestCategoryReport);
