import React from 'react';
import {connect} from 'react-redux';
import {Map} from 'immutable';
import ComplianceTestStatusReport from './test-status-report';
import { getResultDonutDataAction } from '../../actions';
import {getHostNameWithoutSemicolon} from '../../utils/string-utils';
import Loader from '../loader';

const loaderStyle = {
  top: '50%',
};

class ComplianceTestStatusReportContainer extends React.PureComponent {

  componentDidMount() {
    const { checkType, scanId, nodeId} = this.props;
    this.props.dispatch(getResultDonutDataAction({checkType, nodeId}));
  }

  render() {
    const {
      reportView, nodeId, checkType, hostReportView, ...rest
    } = this.props;
    const hostReport = reportView && reportView.get(nodeId) || Map();
    const checkTypeReport = hostReport.get(checkType) || Map();
    const compliant = checkTypeReport.get('compliant', '');
    const checkTypeHostReport = hostReportView && hostReportView.get(checkType) || Map();
    const nodeIndex = checkTypeHostReport.get('report') || {};
    const nodeDetails = nodeIndex[nodeId] || {};
    const nodeName = nodeDetails.node_name || getHostNameWithoutSemicolon(nodeId);
    const initiatedByPollable = checkTypeReport.get('initiatedByPollable');
    const loading = checkTypeReport.get('loading') && !initiatedByPollable;
    const data = [];
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
          && (
          <div className="absolute-center">
            No Data Available
          </div>
          )}
        <ComplianceTestStatusReport
          data={data}
          nodeId={nodeId}
          nodeName={nodeName}
          compliant={compliant}
          checkType={checkType}
          {...rest}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  donutData:  state.get('compliance_result_donut'),
  reportView: state.getIn(['compliance', 'test_status_report_view']),
  hostReportView: state.getIn(['compliance', 'host_report_view']),
  globalSearchQuery: state.get('globalSearchQuery')
});

export default connect(mapStateToProps)(ComplianceTestStatusReportContainer);
