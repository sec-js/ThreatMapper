/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Route, Link, Redirect, withRouter} from 'react-router-dom';
// import ReactTooltip from 'react-tooltip';
import Tippy from '@tippyjs/react';
import { DfTableV2 } from '../common/df-table-v2';
// import ComplianceSummary from './compliance-summary';
import MORE_IMAGE from '../../../images/more.svg';
import {
  getGlobalSettingsAction,
  addGlobalSettingsAction,
  showModal,
  hideModal,
} from '../../actions/app-actions';

export const ComplianceTable = withRouter((match) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getGlobalSettingsAction());
  }, []);

  const settingsList = useSelector(state => state.get('global_settings')) || [];
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
    console.log(match);
    console.log('Row Clicked'. props);

    // return (
    //   <Route
    //     exact
    //     path={`${match.match.path}/topology`}
    //     render={() => (
    //       <ComplianceSummary
    //         // to={`${match.url}/topology`}
    //         />
    //     )}
    //   />
    // );
    // // return (
    // //   <div>
    // //     <ComplianceSummary />
    // //   </div>
    // // );

    // setRedirect(true);
    // // setLink(`/compliance/details/${encodeURIComponent()}`);
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
    <div style={{ marginLeft: '-25px', marginTop: '-40px'}}>
      <DfTableV2
        data={settingsList}
        onRowClick={row => rowClickHandler(row)}
        columns={[
          {
            Header: 'Platform',
            accessor: 'label',
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
            Header: 'Name & Scope',
            accessor: 'label1',
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
              <Tippy
                arrow
                interactive
                trigger="click"
                hideOnClick
                placement="bottom"
                zIndex={1}
                allowHTML
                content={
                  <div className="table-row-actions-popup">
                    <i
                      className="fa fa-trash-o"
                      style={{ color: 'red', cursor: 'pointer' }}
                      onClick={() => handleDeleteDialog(row.value)}
                      aria-hidden="true"
                    />
                    <i
                      className="fa fa-pencil"
                      style={{ cursor: 'pointer', marginRight: '10px' }}
                      onClick={() => handleEditFile(row)}
                    />
                  </div>
                }
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
            ),
          },
        ]}
        // enableSorting
      />
    </div>
  );
});
