/* eslint-disable */


/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import {Redirect} from 'react-router-dom';
import { connect } from 'react-redux';
import DFTable from '../common/df-table/index';
import {
  // getComplianceHostReportAction,
  // saveComplianceHostReportTableStateAction,
  // breadcrumbChange,
  // fetchLicenseStatus,
} from '../../actions/app-actions';
import pollable from '../common/header-view/pollable';
import HostReportRowDetail from './host-report-row-detail';
// import LicenseExpiredModalView from '../common/license-expired-modal-view/license-expired-modal-view';
import NodesFilter from '../../charts/nodes-filter';

class HostReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.rowClickHandler = this.rowClickHandler.bind(this);
    this.onExpandedChange = this.onExpandedChange.bind(this);
    // this.handlePageChange = this.handlePageChange.bind(this);
    // this.tableChangeHandler = this.tableChangeHandler.bind(this);
    this.setRowCount = this.setRowCount.bind(this);
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const defaultExpandedRows = arr.reduce((acc, el) => {
      acc[el] = {};
      return acc;
    }, {});
    this.defaultExpandedRows = defaultExpandedRows;
    this.handleDownload = this.handleDownload.bind(this);
    this.state = {
      expandedRowIndex: 0,
    };
    // this.getComplianceHostReport = this.getComplianceHostReport.bind(this);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      filterValues: currentFiltervalues,
    } = this.props;
    if (newProps.filterValues && currentFiltervalues !== newProps.filterValues) {
      this.getComplianceHostReport({
        filters: newProps.filterValues,
      });
      this.handlePageChange(0);
    }
    if ((newProps.isLicenseActive && !newProps.isLicenseExpired)
    && (newProps.licenseResponse.license_status === 'expired' || newProps.licenseResponse.license_status === 'hosts_exceeded')) {
      /* eslint-disable */
      this.setState({
        licenseResponse: newProps.licenseResponse,
        isLicenseExpiryModalVisible: true
      });
    } else {
      this.setState({
        isLicenseExpiryModalVisible: false
      });
    }
  }

  componentDidMount() {
    // pollable: register the function which needs to be polled
    const {
      registerPolling,
      startPolling,
      dispatch,
      checkType,
      urlLocation: {
        search = '',
      } = {},
    } = this.props;
    // this.pollLicenseStatus();
    const changedCheckType = {
      standard: 'Standard',
      cis: 'CIS',
      nist_master: 'NIST Master',
      nist_slave: 'NIST Slave',
      pcidss: 'PCI-DSS',
      hipaa: 'Hipaa',
      mission_critical_classified: 'NIST Mission Critical'
    };
    registerPolling(this.getComplianceHostReport);
    startPolling();
    // if (search.length === 0) {
    //   // set save table page number to 0 if there is no search query
    //   // This resets the page number if user navigates to this page for the 1st time.
    //   // If user navigates from vulnerability details page, that sets a search query
    //   // and the page number is not reset. it will should previous page number.
    //   dispatch(saveComplianceHostReportTableStateAction({pageNumber: 0}));
    // }
    // this.props.dispatch(breadcrumbChange([{name: 'Compliance', link: '/compliance'}, {name: changedCheckType[checkType]}]));
  }

  componentWillUnmount() {
    // pollable: stop polling on unmount
    const {stopPolling} = this.props;
    stopPolling();
  }

  // pollLicenseStatus() {
  //   this.props.dispatch(fetchLicenseStatus());
  // }

  handleDownload(scanId, nodeType) {
    const {
      handleDownload,
    } = this.props;
    return handleDownload({
      scanId,
      nodeType,
    });
  }

  rowClickHandler(scanId) {
    const {checkType} = this.props;
    this.setState({
      redirect: true,
      link: `/compliance/summary/${scanId}/${checkType}`,
    });
  }

  // tableChangeHandler(params = {}) {
  //   // pollable: on any change in the DF Table params, update the polling params,
  //   // which will update and restart polling with new params.
  //   const {updatePollParams} = this.props;
  //   updatePollParams(params);
  // }

  // getComplianceHostReport(pollParams = {}) {
  //   const {
  //     dispatch,
  //     checkType,
  //     filterValues = {},
  //   } = this.props;

  //   const {
  //     globalSearchQuery,
  //     page = 0,
  //     pageSize = 10,
  //     alertPanelHistoryBound = this.props.alertPanelHistoryBound || {},
  //   } = pollParams;

  //   const tableFilters = pollParams.filters || filterValues;
  //   const nonEmptyFilters = Object.keys(tableFilters).filter(
  //     key => tableFilters[key].length
  //   ).reduce((acc, key) => {
  //     // replacing back the dot which was removed redux-form as it considers that a nested field.
  //     acc[[key.replace('-', '.')]] = tableFilters[key];
  //     return acc;
  //   }, {});

  //   const params = {
  //     checkType,
  //     lucene_query: globalSearchQuery,
  //     // Conditionally adding number and time_unit fields
  //     ...(alertPanelHistoryBound.value
  //       ? {number: alertPanelHistoryBound.value.number} : {}),
  //     ...(alertPanelHistoryBound.value
  //       ? {time_unit: alertPanelHistoryBound.value.time_unit} : {}),
  //     node_filters: nonEmptyFilters,
  //     start_index: page ? page * pageSize : page,
  //     size: pageSize,
  //   };
  //   return dispatch(getComplianceHostReportAction(params));
  // }

  onExpandedChange(rowInfo) {
    const expandedRowIndex = {
      ...this.state.expandedRowIndex,
    };
    const pageIndex = rowInfo.index;
    if (expandedRowIndex[pageIndex]) {
      expandedRowIndex[pageIndex] = !expandedRowIndex[pageIndex];
    } else {
      expandedRowIndex[pageIndex] = {};
    }
    this.setState({
      expandedRowIndex,
    });
  }

  // handlePageChange(pageNumber) {
  //   this.setState({
  //     expandedRowIndex: this.defaultExpandedRows
  //   });
  //   const {
  //     dispatch,
  //   } = this.props;
  //   dispatch(saveComplianceHostReportTableStateAction({pageNumber}));
  // }

  setRowCount(e) {
    const rowCount = Number(e.target.value);
    this.setState({
      rowCountValue: rowCount
    });
  }

  render() {
    const {redirect, link, rowCountValue = 10} = this.state;
    const { isLicenseExpiryModalVisible } = this.state;
    const {isToasterVisible} = this.props;
    if (redirect) {
      return (<Redirect to={link} />);
    }
    const {
      data = [],
      total,
      testValueConfig = [],
      checkType,
      savedTablePageNumber = 0,
    } = this.props;
    const {expandedRowIndex} = this.state;
    const testValueColumnsWithHeaders = testValueConfig.map(el => ({
      Header: el.display,
      maxWidth: 90,
      resizable: false,
      sortable: false,
    }));
    const rowCounts = [{
      label: 10,
      value: 10
    },
    {
      label: 25,
      value: 25
    },
    {
      label: 50,
      value: 50
    },
    {
      label: 100,
      value: 100
    }];
    const testValueColumnsWithValues = testValueConfig.map(el => ({
      Header: el.value,
      accessor: `status.${el.value}`,
      maxWidth: 90,
      Cell: row => (
        <div>
          <div className={`compliance-${checkType}-${el.value} value`}>
            {row.value || 0}
          </div>
        </div>
      ),
    }));
    return (
      <div>
        {/* { isLicenseExpiryModalVisible && <LicenseExpiredModalView /> } */}
        <div style={{marginBottom: '-45px', display: 'flex'}}>
          <div className="dataTables_length d-flex justify-content-start">
            <label htmlFor="true">
              Show
              <select
                style={{
                  backgroundColor: '#252525', color: 'white', borderRadius: '4px', borderColor: '#252525'
                }}
                onChange={this.setRowCount}>
                {rowCounts.map(el => (<option key={el.value} value={el.value}>{el.label}</option>))}
              </select>
              Entries
            </label>
          </div>
          <div className="d-flex justify-content-end">
            <NodesFilter
              resourceType="compliance"
              extraArgs={{
                compliance_check_type: checkType,
              }}
            />
          </div>
        </div>
        <DFTable
          data={data}
          manual
          page={savedTablePageNumber}
          // onFetchData={this.tableChangeHandler}
          defaultPageSize={rowCountValue}
          minRows={0}
          pages={total}
          showPagination
          expanded={expandedRowIndex}
          onPageChange={this.handlePageChange}
          getTrProps={(state, rowInfo) => (
            {
              onClick: () => this.onExpandedChange(rowInfo),
              style: {
                cursor: 'pointer',
              },
            }
          )}
          SubComponent={row => (
            <div className="sub-row">
              <HostReportRowDetail
                data={row.original.scans}
                rowClickHandler={this.rowClickHandler}
                testValueColumns={testValueColumnsWithValues}
                handleDownload={this.handleDownload}
                dispatch={this.props.dispatch}
                isToasterVisible={isToasterVisible}
                onDelete={this.getComplianceHostReport}
              />
            </div>
          )}
          columns={[
            {
              Header: 'Node Type',
              accessor: 'node_type',
              Cell: (row) => {
                let displayValue = row.value || 'container image';
                displayValue = displayValue.replace('_', ' ');
                return displayValue;
              },
              maxWidth: 150,
            },
            {
              Header: 'Node',
              accessor: 'node_name',
              width: 550,
              resizable: true,
              sortable: false,
            },
            {
              Header: '',
              maxWidth: 80,
              resizable: false,
              sortable: false,
            },
          ]}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    // License details states
    isLicenseActive: state.get('isLicenseActive'),
    isLicenseExpired: state.get('isLicenseExpired'),
    licenseResponse: state.get('licenseResponse'),
  };
}

export default connect(mapStateToProps)(pollable()(HostReport));

