import auth from '../utils/auth';

const LOAD_USER = 'LOAD_USER';
const SET_USER = 'SET_USER';

export const setUser = (profile) => {
  return {
    type: SET_USER,
    payload: profile
  }
};

export const loadUser = () => {
  return (dispatch) => {
    if (auth.loggedIn()) {
      dispatch(setUser(auth.getProfile()));
    } else {
      dispatch(setUser(false));
    }
  }
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_USER]: (state, action) => Object.assign({}, state, {profile: action.payload, loggedIn: !!action.payload})
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  profile: auth.getProfile(),
  loggedIn: !!auth.getProfile()
};
export default function userReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
