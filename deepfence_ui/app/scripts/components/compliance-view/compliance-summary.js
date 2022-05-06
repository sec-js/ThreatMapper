/* eslint-disable */





/* eslint-disable react/destructuring-assignment */
/* eslint-disable consistent-return */
/* eslint-disable react/no-string-refs */
import React from 'react';
import {Route, Link, Redirect} from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';

import SideNavigation from '../common/side-navigation/side-navigation';
import HeaderView from '../common/header-view/header-view';
import { ADMIN_SIDE_NAV_MENU_COLLECTION, USER_SIDE_NAV_MENU_COLLECTION } from '../../constants/menu-collection';
import {getUserRole} from '../../helpers/auth-helper';
import {complianceViewMenu} from './menu';
import GlobalSummary from './global-summary';

class ComplianceSummary extends React.PureComponent {
  constructor(props) {
    super(props);
    this.sideNavMenuCollection = (getUserRole() === 'admin') ? ADMIN_SIDE_NAV_MENU_COLLECTION : USER_SIDE_NAV_MENU_COLLECTION;
    this.state = {
      activeMenu: this.sideNavMenuCollection[0],
    };
  }

  render() {
    const {match, isSideNavCollapsed, isFiltersViewVisible} = this.props;
    const divClassName = classnames({
      'collapse-side-nav': isSideNavCollapsed,
      'expand-side-nav': !isSideNavCollapsed,
      'show-filters-view': isFiltersViewVisible,
      'hide-filters-view': !isFiltersViewVisible,
    });
    const contentClassName = classnames(
      'summary',
      { 'collapse-side-nav': isSideNavCollapsed },
      { 'expand-side-nav': !isSideNavCollapsed }
    );
    return (
      <div className="compliance-summary-view">
        <SideNavigation
          navMenuCollection={this.sideNavMenuCollection}
          activeMenu={this.state.activeMenu}
        />
        <div ref="compilanceResizeRef" style={{overflow: 'hidden'}}>
          <HeaderView />
          <div className={divClassName}>
            <GlobalSummary />
          </div>
        </div>
        <div className={contentClassName}>
          <div className="df-tabs">
            <div className="tabheading">
              <ul>
                {complianceViewMenu.map(complianceView => (
                  <Route
                    key={complianceView.id}
                    path={`${match.path}/${complianceView.id}`}
                    children={({match: linkMatch}) => (
                      <li key={complianceView.id} className={classnames('tab', {active: linkMatch})}>
                        <Link
                          to={`${match.url}/${complianceView.id}`}
                          >
                          {complianceView.displayName}
                        </Link>
                      </li>
                    )}
                    />
                ))}
              </ul>
            </div>
            {complianceViewMenu.map(complianceView => (
              <Route
                key={complianceView.id}
                exact
                path={`${match.path}/${complianceView.id}`}
                render={(props) => <complianceView.component {...props} />}
                />
            ))}
            <Route
              exact
              path={match.path}
              render={() => (
                <Redirect
                  to={`${match.url}/${complianceViewMenu[0].id}`}
                  />
              )}
              />
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
)(ComplianceSummary);
