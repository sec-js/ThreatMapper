/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Route, Link, Redirect, withRouter} from 'react-router-dom';
// import ReactTooltip from 'react-tooltip';
import Tippy from '@tippyjs/react';
import { DfTableV2 } from '../common/df-table-v2';
import MORE_IMAGE from '../../../images/more.svg';
import { ComplianceActionModal } from './compliance-action-modal';
import injectModalTrigger from '../common/generic-modal/modal-trigger-hoc';
import {
  getGlobalSettingsAction,
  addGlobalSettingsAction,
  showModal,
  hideModal,
  getComplianceCloudCredentialsAction
} from '../../actions/app-actions';

const ComplianceTable = withRouter((props) => {
  const dispatch = useDispatch();

  const {triggerModal, showModal} = props;

  useEffect(() => {
    dispatch(getComplianceCloudCredentialsAction({cloud_provider: props.cloudType}));
  }, []);

  const accountList = useSelector(state => state.get('cloud_credentials')) || [];

  const handleEditFile = row => {
    const modalProps = {
      title: 'Edit Setting',
      modalContent: renderFormModal,
      modalContentProps: { row },
      contentStyles: {
        width: '400px',
      },
    };
    dispatch(showModal('GENERIC_MODAL', modalProps));
  };

  const rowClickHandler = row => {
    props.history.push(`/compliance/${props.cloudType}/${row.original.node_id}/standard`);
  };



  const triggerComplianceScanModal = () => {
    const isCVE = false;
    const modalProps = {
      title: 'Compliance Scan',
      modalContent: renderModalContent,
      modalContentProps: {
        // selectedDocIndex,
        isCVE,
      },
      contentStyles: {
        width: '400px',
      },
    };
    return triggerModal('GENERIC_MODAL', modalProps);
  };


  const renderModalContent = props => {
    // const { selectedDocIndex = {}, isCVE = false } = props;
    const { isCVE = false } = props;

    const resetSelection = false;
    return (
      <ComplianceActionModal
        // selectedDocIndex={selectedDocIndex} // ['cos-vm:<host>',]
        resetSelection={resetSelection}
        isCVE={isCVE}
      />
    );
  };



  const renderFormModal = ({ row }) => {
    let domainName = row.row.original.value;
    const id = row.row.original.id;
    const handleEditSubmit = e => {
      e.preventDefault();
      const params = {
        key: row.row.original.key,
        value: domainName,
        id,
      };
      dispatch(addGlobalSettingsAction(params));
      dispatch(hideModal());
      dispatch(getGlobalSettingsAction());
    };

    const handleFormChange = e => {
      e.preventDefault();
      domainName = e.target.value;
    };
    return (
      <div>
        <form className="df-modal-form clustering-rule" autoComplete="off">
          <div className="form-field">
            <div className="label" for="domain_name">
              {row.row.original.label}
            </div>
            <div>
              <div>
                <input
                  id="domain_name"
                  type="text"
                  name="domain_name"
                  defaultValue={row.row.original.value}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="form-field" style={{ marginTop: '2rem' }}>
              <button
                className="primary-btn"
                type="submit"
                onClick={e => handleEditSubmit(e)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div style={{ marginLeft: '-25px', marginTop: '-40px', marginBottom: '75px'}}>
      <h5 style={{marginLeft: '25px', color: 'white'}}>Account Detail</h5>
      <DfTableV2
        data={accountList}
        onRowClick={row => rowClickHandler(row)}
        columns={[
          {
            Header: 'Account ID',
            accessor: 'account_id',
          },
          // {
          //   Header: 'Enabled',
          //   cell: row => {
          //     <div className="toggle-switch-container">
          //       <input
          //         {...input}
          //         type="checkbox"
          //         checked={input.value}
          //       />
          //     </div>
          //   }
          // },
          {
            Header: 'Cloud Provider',
            accessor: 'cloud_provider',
          },
          {
            Header: 'Framework',
            accessor: 'value',
            Cell: row => (
              <div style={{ textAlign: 'centre' }}>{row.value}</div>
            ),
          },
          // {
          //   Header: 'Action',
          //   accessor: 'id',
          //   disableSortBy: true,
          //   Cell: row => (
          //     <div className="action-control">
          //       <i
          //         className="fa fa-pencil"
          //         style={{ cursor: 'pointer', marginRight: '10px' }}
          //         onClick={() => handleEditFile(row)}
          //       />
          //       <i
          //         className="fa fa-trash-o"
          //         style={{ color: 'red', cursor: 'pointer' }}
          //         onClick={() => handleDeleteDialog(row.value)}
          //         aria-hidden="true"
          //       />
          //     </div>
          //   ),
          //   style: { textAlign: 'centre' },
          // },
          {
            Header: '',
            width: 60,
            accessor: 'id',
            disableSortBy: true,
            Cell: cell => (
              <div className='row-action-menu'>
                <Tippy
                  arrow
                  interactive
                  trigger='click'
                  hideOnClick
                  placement='bottom'
                  zIndex={1}
                  allowHTML
                  content={(
                    <div className="row-action-dropdown-wrapper">
                      <div className="row-action-dropdown-item" onClick={(e) => {
                        e.stopPropagation();
                        triggerComplianceScanModal();
                      }}>
                        <div className="row-action-item-icon">
                          <i className="fa fa-list" aria-hidden="true" />
                        </div>
                        <div className="row-action-item-text">
                          Start Scan
                        </div>
                      </div>
                      <div className="row-action-dropdown-item" onClick={ev => {
                        ev.stopPropagation();
                        this.handleDeleteDialogScans(cell.value);
                      }}>
                        <div className="row-action-item-icon">
                          <i className="fa fa-trash-o" aria-hidden="true" style={{ color: 'red' }} />
                        </div>
                        <div className="row-action-item-text">
                          Delete
                        </div>
                      </div>
                    </div>
                  )}
                >
                  <img
                    src={MORE_IMAGE}
                    alt="more"
                    className="table-row-actions-target"
                    onClick={e => {
                      e.stopPropagation();
                    }}
                  />
                </Tippy>
              </div>
            ),
          },
        ]}
        // enableSorting
      />
    </div>
  );
});

export default injectModalTrigger(ComplianceTable);
