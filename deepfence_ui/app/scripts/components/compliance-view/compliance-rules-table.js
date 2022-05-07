/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */

import React from 'react';
import {connect} from 'react-redux';
import {
  getComplianceTestsAction,
  updateComplianceTestsAction,
  toaster,
} from '../../actions/app-actions';
import DFTable from '../common/df-table/index';
import withMultiSelectColumn from '../common/df-table/with-multi-select-column';
import NotificationToaster from '../common/notification-toaster/notification-toaster';

class ComplianceRulesTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.complianceTests,
      filteredData: props.complianceTests,
      searchInput: ''
    };
    this.getComplianceTests = this.getComplianceTests.bind(this);
    this.updateComplianceTests = this.updateComplianceTests.bind(this);
    this.enableRules = this.enableRules.bind(this);
    this.disableRules = this.disableRules.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.globalSearch = this.globalSearch.bind(this);
  }

  handleChange(event) {
    this.setState({ searchInput: event.target.value }, () => {
      this.globalSearch();
    });
  }

  globalSearch() {
    const { searchInput } = this.state;
    const data = this.props.complianceTests;
    if (searchInput) {
      const filteredData = data.filter(value => (
        value.test_category.toLowerCase().includes(searchInput.toLowerCase())
      ));
      this.setState({ filteredData });
    } else {
      this.setState({filteredData: this.props.complianceTests});
    }
  }

  componentDidMount() {
    this.getComplianceTests();
    const {registerActions} = this.props;
    const actionList = [
      {
        name: 'Enable',
        icon: (<i className="fa fa-eye cursor" />),
        onClick: this.enableRules,
        postClickSuccess: this.getComplianceTests,
        showConfirmationDialog: false,
        confirmationDialogParams: {
          dialogTitle: 'Enable Rule?',
          dialogBody: 'Are you sure you want to Enable the selected rule?',
          confirmButtonText: 'Yes, Enable',
          cancelButtonText: 'No, Keep',
        },
      },
      {
        name: 'Disable',
        icon: (<i className="fa fa-eye-slash cursor" />),
        onClick: this.disableRules,
        postClickSuccess: this.getComplianceTests,
        showConfirmationDialog: false,
        confirmationDialogParams: {
          dialogTitle: 'Disable Rule?',
          dialogBody: 'Are you sure you want to Disable the selected rule?',
          confirmButtonText: 'Yes, Disable',
          cancelButtonText: 'No, Keep',
        },
      },
    ];
    registerActions(actionList);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const {
      info: newInfo,
      error: newError,
    } = newProps;

    const {
      info: currentInfo,
      error: currentError,
      toaster: toasterAction,
    } = this.props;

    if (newInfo || newError) {
      if (currentInfo !== newInfo) {
        toasterAction(newInfo);
      }
      if (currentError !== newError) {
        toasterAction(newError);
      }
    }
  }

  enableRules(selectedIndex) {
    const idList = Object.keys(selectedIndex);
    return this.updateComplianceTests('enable', idList);
  }

  disableRules(selectedIndex) {
    const idList = Object.keys(selectedIndex);
    return this.updateComplianceTests('disable', idList);
  }

  updateComplianceTests(action, idList) {
    const {
      complianceChecktype,
    } = this.props;
    const params = {
      action,
      rule_id_list: idList,
      checkType: complianceChecktype,
    };
    const {
      updateComplianceTestsAction: updateAction,
    } = this.props;
    return updateAction(params);
  }

  getComplianceTests() {
    const {
      complianceChecktype,
      getComplianceTestsAction: action,
    } = this.props;
    return action({checkType: complianceChecktype});
  }

  render() {
    const {
      complianceTests = [],
      multiSelectColumn,
      isToasterVisible,
    } = this.props;
    const {filteredData, searchInput } = this.state;
    let complianceSearchResults = [];
    if (searchInput) {
      complianceSearchResults = filteredData;
    } else {
      complianceSearchResults = complianceTests;
    }

    return (
      <div>
        <div className="" style={{marginLeft: '41px', marginBottom: '21px', paddingRight: '41px'}}>
          <input
            type="text"
            size="large"
            name="searchInput"
            value={searchInput || ''}
            onChange={this.handleChange}
            label="Search"
            placeholder="Search"
        />
        </div>
        <DFTable
          showPagination
          defaultPageSize={50}
          // eslint-disable-next-line max-len
          data={complianceSearchResults}
          minRows={0}
          columns={[
            {
              Header: '#',
              id: 'id',
              Cell: row => (
                <div>
                  {' '}
                  {row.index + 1}
                  {' '}
                </div>
              ),
              maxWidth: 100,
            },
            {
              Header: 'Category',
              accessor: 'test_category',
              maxWidth: 250,
            },
            {
              Header: 'Description',
              accessor: 'test_desc',
              minWidth: 300,
            },
            {
              Header: 'Status',
              id: 'status',
              maxWidth: 100,
              accessor: (row) => {
                if (row.is_enabled) {
                  return 'Active';
                }
                return 'Inactive';
              },
            },
            multiSelectColumn,
          ]}
        />
        { isToasterVisible && <NotificationToaster /> }
      </div>
    );
  }
}

const mapStateToProps = (state, {complianceChecktype}) => ({
  complianceTests: state.getIn(['compliance', 'compliance_tests', 'data', complianceChecktype], []),
  error: state.getIn(['compliance', 'compliance_tests', 'error', complianceChecktype]),
  info: state.getIn(['compliance', 'compliance_tests', 'info', complianceChecktype]),
  isToasterVisible: state.get('isToasterVisible'),
});

export default connect(mapStateToProps, {
  getComplianceTestsAction,
  updateComplianceTestsAction,
  toaster,
})(withMultiSelectColumn({
  name: 'compliance-tests',
  column: {
    name: 'Action',
    accessor: 'id',
    maxWidth: 140,
  },
})(ComplianceRulesTable));
