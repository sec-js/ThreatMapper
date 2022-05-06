/* eslint-disable */

/* eslint-disable react/destructuring-assignment */
import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import moment from 'moment';
import {Redirect} from 'react-router-dom';
// import ComplianceTestsView from './tests-container';
// import ComplianceTestCategoryReportContainer from './test-category-report-container';
// import ComplianceTestStatusReportContainer from './test-status-report-container';
import SideNavigation from '../common/side-navigation/side-navigation';
import HeaderView from '../common/header-view/header-view';
import { ADMIN_SIDE_NAV_MENU_COLLECTION, USER_SIDE_NAV_MENU_COLLECTION } from '../../constants/menu-collection';
import {getUserRole} from '../../helpers/auth-helper';
// import MaskFilterForm from './mask-filter-form';

class ComplianceDetailsView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.sideNavMenuCollection = (getUserRole() === 'admin') ? ADMIN_SIDE_NAV_MENU_COLLECTION : USER_SIDE_NAV_MENU_COLLECTION;
    this.state = {
      activeMenu: this.sideNavMenuCollection[0],
      redirectBack: false,
    };
    this.handleBackButton = this.handleBackButton.bind(this);
  }

  handleBackButton(checkType) {
    this.setState({
      redirectBack: true,
      link: `/compliance/summary/${checkType}?b`,
    });
  }

  render() {
    console.log('IS THIS WORKING????');
    const {redirectBack, link} = this.state;
    if (redirectBack) {
      return (<Redirect to={link} />);
    }

    const {
      match: {
        params: {
          scanId,
          checkType,
        } = {},
      } = {}
    } = this.props;


    // parsing node id from scan_id
    // scan_id format <compliance check type>_<node id>_<scan time string>
    // text between 1st underscore and last underscore is the nodeID
    // Also removing checktype from scan id because the underscore
    // in checktype messes with the logic
    const scanIdWithoutChecktype = scanId.replace(checkType, '');
    const lastUnderscoreIndex = scanIdWithoutChecktype.lastIndexOf('_');
    const firstUnderscoreIndex = scanIdWithoutChecktype.indexOf('_');
    const nodeId = scanIdWithoutChecktype.substring(firstUnderscoreIndex + 1, lastUnderscoreIndex);
    const timeOfScanStr = scanIdWithoutChecktype.substring(lastUnderscoreIndex + 1);
    const timeOfScan = moment.utc(timeOfScanStr);

    const { isSideNavCollapsed, isFiltersViewVisible} = this.props;
    const divClassName = classnames(
      {'collapse-side-nav': isSideNavCollapsed},
      {'expand-side-nav': !isSideNavCollapsed}
    );
    const contentClassName = classnames(
      'navigation',
      {'with-filters': isFiltersViewVisible},
    );
    return (
      <div className="compliance-details">
        <SideNavigation
          navMenuCollection={this.sideNavMenuCollection}
          activeMenu={this.state.activeMenu}
        />
        <div className={divClassName}>
          <HeaderView />
          <div className="" style={{paddingTop: '64px'}} />
          <div className={`report ${this.props.isFiltersViewVisible ? 'collapse-fixed-panel-header' : ''}`}>
            <div className="test-status-report test-status-report-comliance">
              {/* <ComplianceTestStatusReportContainer
                nodeId={nodeId}
                scanId={scanId}
                checkType={checkType}
                timeOfScan={timeOfScan}
              /> */}
            </div>
            <div className="test-category-report test-category-report-compliance">
              {/* <ComplianceTestCategoryReportContainer
                nodeId={nodeId}
                scanId={scanId}
                checkType={checkType}
              /> */}
            </div>
          </div>
          <div className="table">
            <div className="compliance-table">
              <div className="table-title absolute">
                <span>Compliance Tests</span>
              </div>
              <div className="mask-filter absolute">
                <MaskFilterForm />
              </div>
            </div>
            {/* <ComplianceTestsView
              nodeId={nodeId}
              scanId={scanId}
              checkType={checkType}
            /> */}
          </div>
          <div className={contentClassName}>
            {/* <button
              className="df-btn primary-btn"
              onClick={() => this.handleBackButton(checkType)}
            >
              <span className="fa fa-long-arrow-left">
                <span>Back to Summary</span>
              </span>
            </button> */}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isSideNavCollapsed: state.get('isSideNavCollapsed'),
    isFiltersViewVisible: state.get('isFiltersViewVisible')
  };
}

export default connect(
  mapStateToProps
)(ComplianceDetailsView);
