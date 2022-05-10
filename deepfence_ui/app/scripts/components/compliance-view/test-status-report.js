/* eslint-disable react/destructuring-assignment */
/* eslint-disable */
import React from 'react';
import SemiDonutChart from '../common/charts/semi-donut-chart/index';
import {
  getComplianceTestStatusReportAction,
  setSearchQuery,
} from '../../actions/app-actions';
import {constructGlobalSearchQuery} from '../../utils/search-utils';
import pollable from '../common/header-view/pollable';
import {complianceViewMenuIndex} from './menu';

class ComplianceTestStatusReport extends React.PureComponent {
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

  componentWillUnmount() {
    const {stopPolling} = this.props;
    stopPolling();
  }

  getReport(pollParams) {
    const {
      globalSearchQuery,
      alertPanelHistoryBound = this.props.alertPanelHistoryBound || {},
      initiatedByPollable,
    } = pollParams;
    const {
      dispatch, nodeId, scanId, checkType
    } = this.props;
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
    // return dispatch(getComplianceTestStatusReportAction(params));
  }

  sectionClickHandler(point) {
    if (!point.label) {
      return;
    }
    const {
      globalSearchQuery: existingQuery = [],
      dispatch,
    } = this.props;
    const newSearchParams = {
      status: point.label,
    };
    const searchQuery = constructGlobalSearchQuery(existingQuery, newSearchParams);
    const globalSearchQuery = {
      searchQuery,
    };
    dispatch(setSearchQuery(globalSearchQuery));
  }

  render() {
    const {
      data, checkType = '', timeOfScan, nodeName = '', compliant
    } = this.props;
    const menuItem = complianceViewMenuIndex[checkType] || {};
    const title = menuItem.displayName || '';
    const scannedAt = timeOfScan ? ` - ${timeOfScan.fromNow()}` : '';
    const compliantPercent = compliant ? `(${compliant} Compliant)` : '';
    const subtitle = `${nodeName} ${compliantPercent} ${scannedAt}`;
    return (
      <div>
        <div className="cis-title">{title}</div>
        <SemiDonutChart
          data={data}
          title={title.toUpperCase()}
          subtitle={subtitle}
          chartHeight={200}
          chartWidth={200}
          innerRadius={0.7}
          // onSectionClick={this.sectionClickHandler}
        />
        {/* <div className="totalscaned">{subtitle}</div> */}
      </div>
    );
  }
}

export default pollable()(ComplianceTestStatusReport);
