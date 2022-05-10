/* eslint-disable react/destructuring-assignment */
/* eslint-disable */
import React from 'react';
import DonutChart from '../common/charts/donut-chart/index';
import {
  getComplianceTestStatusReportAction,
  setSearchQuery,
  getComplianceChartDataAction
} from '../../actions/app-actions';
import {constructGlobalSearchQuery} from '../../utils/search-utils';
import pollable from '../common/header-view/pollable';

class ComplianceTotalTestReport extends React.PureComponent {
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
    const {dispatch, checkType} = this.props;
    const {
      globalSearchQuery,
      alertPanelHistoryBound = this.props.alertPanelHistoryBound || {},
      initiatedByPollable,
    } = pollParams;
    const params = {
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

  componentWillUnmount() {
    const {stopPolling} = this.props;
    stopPolling();
  }

  render() {
    const {data = []} = this.props;
    const sumData = data[0]?.aggs || [];
    const sum = sumData.map(content => content.value).reduce((a, c) => a + c, 0);
    return (
      <div>
        { sum !== 0
        && (
        <div className="total-scan-wrapper">
          <DonutChart
            data={data[0]?.aggs}
            chartHeight={550}
            chartWidth={550}
            // onSectionClick={this.sectionClickHandler}
            sum={sum}
        />
        </div>
        )}
      </div>
    );
  }
}

export default pollable()(ComplianceTotalTestReport);
