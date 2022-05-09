/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/destructuring-assignment */
/*eslint-disable*/
import React from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import DFTable from '../common/df-table/index';
import { dateTimeFormat } from '../../utils/time-utils';
import {
  showModal,
  deleteScanActions,
  toaster,
} from '../../actions/app-actions';
import NotificationToaster from '../common/notification-toaster/notification-toaster';
import MORE_IMAGE from '../../../images/more.svg';

class HostReportRowDetail extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { tableAction: false, cellValue: 0 };
    this.handleDeleteDialogScans = this.handleDeleteDialogScans.bind(this);
    this.deleteScanActions = this.deleteScanActions.bind(this);
    this.handleActionEditDelete = this.handleActionEditDelete.bind(this);
  }

  handleDeleteDialogScans(scanId) {
    const params = {
      dialogTitle: 'Delete Results ?',
      dialogBody: 'Are you sure you want to delete?',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      onConfirmButtonClick: () => this.deleteScanActions(scanId),
      contentStyles: {
        width: '375px',
      },
    };
    this.props.dispatch(showModal('DIALOG_MODAL', params));
  }

  handleActionEditDelete(cellID) {
    this.setState({
      tableAction: !this.state.tableAction,
      cellValue: cellID,
    });
  }

  handleResetEditDeleteActionState() {
    this.setState({
      tableAction: false,
      cellValue: 0
    });
  }

  deleteScanActions(scanId) {
    const params = {
      scan_id: scanId,
      doc_type: 'compliance',
      time_unit: 'all',
      number: '0',
    };
    const successHandler = (response) => {
      const { success, error: apiError } = response;
      if (success) {
        this.props.dispatch(toaster('Successfully deleted'));
        setTimeout(this.props.onDelete, 2000);
      } else {
        this.props.dispatch(toaster(`ERROR: ${apiError.message}`));
      }
    };
    const apiErrorHandler = () => {
      this.props.dispatch(toaster('Something went wrong'));
    };
    return this.props
      .dispatch(deleteScanActions(params))
      .then(successHandler, apiErrorHandler);
  }

  render() {
    const {
      data,
      testValueColumns,
      rowClickHandler,
      handleDownload,
      isToasterVisible,
    } = this.props;
    return (
      <div>
        <DFTable
          data={this.props.data}
          getTrProps={(state, rowInfo) => ({
            onClick: () => rowClickHandler(rowInfo.original.scan_id),
            style: {
              cursor: 'pointer',
            },
          })}
          // TheadComponent={() => null}
          columns={[
            {
              Header: '',
              minWidth: 290,
            },
            {
              Header: 'Timestamp',
              accessor: row => dateTimeFormat(row.time_stamp),
              id: 'timestamp',
              // minWidth: 290,
            },
            {
              Header: 'Compliance',
              accessor: 'compliant',
              maxWidth: 130,
            },
            ...testValueColumns,
            {
              Header: '',
              maxWidth: 40,
              accessor: 'scan_id',
              style: { opacity: '0' },
            },
            {
              Header: '',
              maxWidth: 60,
              accessor: 'scan_id',
              Cell: cell => (
                <OutsideClickHandler
                  onOutsideClick={() => {
                    this.handleResetEditDeleteActionState();
                  }}
                  disabled={(this.state.cellValue !== cell.value) || !this.state.tableAction}
                >
                  <img
                    src={MORE_IMAGE}
                    alt="more"
                    className="action-table-target"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.handleActionEditDelete(cell.value);
                    }}
                  />
                  {this.state.cellValue === cell.value
                    && this.state.tableAction && (
                      <div className="action-table" style={{ zIndex: '1' }}>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(cell.value, cell.original.node_type);
                          }}
                        >
                          <i className="fa fa-download" />
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            this.handleDeleteDialogScans(cell.value);
                          }}
                        >
                          <i className="fa fa-trash-o red cursor" />
                        </div>
                      </div>
                    )}
                </OutsideClickHandler>
              ),
            },
          ]}
        />
        {isToasterVisible && <NotificationToaster />}
      </div>
    );
  }
}

export default HostReportRowDetail;
