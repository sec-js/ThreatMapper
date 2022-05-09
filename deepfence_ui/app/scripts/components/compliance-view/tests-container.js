/* eslint-disable */

import React from 'react';
import { connect} from 'react-redux';
import {formValueSelector} from 'redux-form/immutable';
import {Map} from 'immutable';
import ComplianceTests from './tests';

class ComplianceTestsContainer extends React.PureComponent {
  render() {
    const {
      testList = {}, nodeId, checkType, ...rest
    } = this.props;
    // const hostIndexIm = testList && testList.get(nodeId) || Map();
    // const checkIndexIm = hostIndexIm.get(checkType) || Map();
    // const testIndex = checkIndexIm.get('index') || {};
    // const total = checkIndexIm.get('total');
    /* eslint-disable no-underscore-dangle */
    // const tests = Object.keys(testIndex).map(key => ({
    //   ...testIndex[key]._source,
    //   _id: key,
    //   _index: testIndex[key]._index,
    //   _type: testIndex[key]._type,
    // }));
    /* eslint-enable */
    return (
      <ComplianceTests
        // tests={tests}
        // testIndex={testIndex}
        // nodeId={nodeId}
        // total={total}
        // checkType={checkType}
        {...rest}
      />
    );
  }
}

const maskFormSelector = formValueSelector('compliance-mask-filter-form');

function mapStateToProps(state) {
  const testList = state.getIn(['compliance', 'list_view']);
  return {
    testList,
    hideMasked: maskFormSelector(state, 'hideMasked'),
  };
}

export default connect(mapStateToProps)(ComplianceTestsContainer);
