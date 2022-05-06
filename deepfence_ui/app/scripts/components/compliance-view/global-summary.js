import React from 'react';
import PassStats from './global-summary-pass-stats';
// import ScanStats from './global-summary-scan-stats';
// import UniqueScanStats from './global-summary-unique-scan-stats';

class GlobalSummary extends React.PureComponent {
  render() {
    return (
      <div>
        <div className="compliance-stats-view">
          {/* <ScanStats /> */}
          <PassStats />
          {/* <UniqueScanStats /> */}
        </div>
      </div>
    );
  }
}

export default GlobalSummary;
