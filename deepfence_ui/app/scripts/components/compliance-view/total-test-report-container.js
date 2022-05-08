/* eslint-disable */

import React from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import { getComplianceChartDataAction  } from '../../actions';
import ComplianceTotalTestReport from './total-test-report';
import Loader from '../loader';

const loaderStyle = {
  top: '50%',
};

class ComplianceTotalTestReportContainer extends React.PureComponent {

  componentDidMount() {
    // Please use this for ChartAPI.
    const { nodeId, checkType } = this.props;
   this.props.dispatch(getComplianceChartDataAction({nodeId, checkType}));
  }

  render() {
    const {reportView, checkType, ...rest} = this.props;
    const checkTypeReport = reportView && reportView.get(checkType) || Map();
    const data = checkTypeReport && checkTypeReport.get('labelled_report') || [];
    const initiatedByPollable = checkTypeReport && checkTypeReport.get('initiatedByPollable');
    const loading = checkTypeReport && checkTypeReport.get('loading') && !initiatedByPollable;
    const emptyData = data.length === 0 && !loading;
    return (
      <div>
        {loading && data.length === 0
          && (
          <Loader
            small
            style={loaderStyle}
          />
          )
        }
        {emptyData
          &&
          (
            <div className="" style={{margin: '250px', position: 'relative'}}>
              <div className="absolute-center-compliance">
                No Data Available
              </div>
            </div>
          )}
        <ComplianceTotalTestReport
          data={data}
          checkType={checkType}
          {...rest}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  reportView: state.getIn(['compliance', 'test_status_report_view']),
  globalSearchQuery: state.get('globalSearchQuery'),
  chartData: state.get('compliance_chart_data')
});

export default connect(mapStateToProps)(ComplianceTotalTestReportContainer);
