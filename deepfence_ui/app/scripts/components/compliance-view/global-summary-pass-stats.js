/* eslint-disable */
import React from 'react';
import {connect} from 'react-redux';
import pollable from '../common/header-view/pollable';
// import StackedPercentChart from '../common/charts/stacked-chart/stacked-percent';

class PassStats extends React.PureComponent {
  render() {
    const {
      passStats = [],
    } = this.props;

    const emptyData = passStats.length === 0;
    return (
      <div className="compliance-pass-stats flex-item flex-item-box margin-right-box">
        {emptyData
          && (
          <div className="absolute-center">
            No Data Available
          </div>
          )}
        <div className="heading">Compliance Pass Percentage</div>
        {/* {!emptyData && <StackedPercentChart
          data={passStats}
          chartHeight={200}
        />} */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    alertPanelHistoryBound: state.get('alertPanelHistoryBound') || [],
    globalSearchQuery: state.get('globalSearchQuery') || [],
    // passStats: state.getIn(['compliance', 'global_stats', 'pass_stats'], []),
  };
}

export default connect(mapStateToProps)(pollable()(PassStats));
