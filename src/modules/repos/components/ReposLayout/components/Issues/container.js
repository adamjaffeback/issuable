import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import _ from 'lodash';

import { selectors, actions } from 'modules/repos';

import {
  selectors as uiSelectors,
  actions as uiActions,
} from 'modules/ui';

import presenter from './presenter';

// =======
// container-specific selectors
// =======

// get own props
const getProps = (state, props) => props;

// get route id param
const getIdParam = createSelector(
  [getProps],
  props => props.match.params.id,
);

// pre-sorted issues
const getSortedIssues = createSelector(
  [
    selectors.getIssues,
    getIdParam,
    uiSelectors.getIssuesSortProperty,
    uiSelectors.getIssuesSortDir,
  ],
  (issues, idParam, prop, dir) => {
    if (issues && idParam) {
      const repoIssues = issues[idParam] || [];
      return _.orderBy(repoIssues, [prop], [dir]);
    }

    return [];
  },
);

const mapStateToProps = createStructuredSelector({
  issues: getSortedIssues,
  fetchingIssues: selectors.getFetchingIssues,
  idParam: getIdParam,
  sortStringValue: uiSelectors.getSortStringValue,
});

const mapDispatchToProps = {
  requestIssues: actions.requestIssues,
  setIssuesSort: uiActions.setIssuesSort,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(presenter);
