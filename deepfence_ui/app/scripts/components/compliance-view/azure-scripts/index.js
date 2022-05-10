/* eslint-disable import/no-cycle */
import React from 'react';

import Select from 'react-select';
import { withRouter } from 'react-router-dom';
import ComplianceTable from '../compliance-table';

const themeCb = theme => ({
  ...theme,
  borderRadius: 5,
  colors: {
    ...theme.colors,
    primary25: '#1c1c1c', // hover
    neutral20: '#c0c0c0', // border
    primary: '#000',
    neutral0: '#1c1c1c', // '#22252b', // background
    neutral80: '#bfbfbf', // placeholder
    neutral90: 'white',
  },
});

const styles = {
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? '#0080ff' : '#999999',
    backgroundColor: state.isSelected ? '#1c1c1c' : provided.backgroundColor,
    '&:hover': {
      backgroundColor: '#333333',
    },
  }),
  control: provided => ({
    ...provided,
    width: 400,
    borderColor: '#1c1c1c',
  }),
  container: provided => ({
    ...provided,
    width: 400,
  }),
};

export const AzureTerraFormScript = withRouter((props) => {
    const options = [ {
        label: 'USE EAST-01', value: 'US EAST-01'
    }] ; 
  return (
    <>
      <div className="btn-wrapper" style={{ justifyContent: 'left' }}>
        <div className="go-back-btn" onClick={() => props.history.push('/compliance')}>
          <i className="fa fa-arrow-left" aria-hidden="true" />{' '}
          <span
            style={{ paddingLeft: '5px', color: '#0276C9', fontSize: '15px' }}
          >
            {' '}
            Go Back
          </span>
        </div>
      </div>
      <div style={{ marginTop: '57px' }}>
        <p1>
          Deploy Deepfence Compliance Scanner with Terraform using the
          code samples below for a single subscription.
        </p1>
      </div>
      <h6 style={{ color: 'white', marginTop: '20px' }}>
        {' '}
        Single subscription{' '}
      </h6>
      <div style={{ marginTop: '15px' }}>
        <span style={{ fontSize: '11px' }}>
          Copy the code below and paste it into a .tf file on your local
          machine.
        </span>
        <div
          style={{ backgroundColor: 'black', padding: '10px', color: 'white' }}
        >
          <pre style={{ color: 'white' }}>{`provider "azurerm" {
  features { }
  subscription_id = ""
}

module "deepfence-compliance-single-subscription" {
  source = "deepfence/azurerm/single-subscription"

  management_console_url = "https://dev.deepfence.com"
  api_key = ""
}
`}</pre>
        </div>
      </div>
      <div style={{ marginTop: '15px' }}>
        <span style={{ fontSize: '11px' }}>then run:</span>
        <div
          style={{
            backgroundColor: 'black',
            color: 'white',
            marginBottom: '100px',
          }}
        >
          <pre style={{ color: 'white' }}>
            {' '}
            terraform init && terraform apply{' '}
          </pre>
        </div>
      </div>
      <ComplianceTable cloudType={props.match.params.cloudType} />
    </>
  );
});
