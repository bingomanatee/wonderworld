// ------------------------------------
// Constants
// ------------------------------------
export const BREADCRUMB_CHANGE = 'BREADCRUMB_CHANGE';

// ------------------------------------
// Actions
// ------------------------------------
export function setBreadcrumb (breadcrumb = []) {
  return {
    type: BREADCRUMB_CHANGE,
    payload: breadcrumb
  };
}

// ------------------------------------
// Specialized Action Creator
// ------------------------------------
export const actions = {
  setBreadcrumb
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = [];
export default function breadcrumbReducer (state = initialState, action) {
  return action.type === BREADCRUMB_CHANGE
    ? action.payload
    : state;
}
