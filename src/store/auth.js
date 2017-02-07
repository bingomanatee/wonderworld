import {SERVER_URL} from '../config';
import Auth0Lock from 'auth0-lock';

export const lock = new Auth0Lock('_AUTH_CLIENT__', '__AUTH_DOMAIN__', {
  auth: {
    redirectUrl: `${SERVER_URL}/login`,
    responseType: 'token'
  }
});

export function getIdToken() {
  // First, check if there is already a JWT in local storage
  var idToken = localStorage.getItem('id_token');
  var authHash = this.lock.parseHash(window.location.hash);
  // If there is no JWT in local storage and there is one in the URL hash,
  // save it in local storage
  if (!idToken && authHash) {
    if (authHash.id_token) {
      idToken = authHash.id_token
      localStorage.setItem('id_token', authHash.id_token);
    }
    if (authHash.error) {
      // Handle any error conditions
      console.log("Error signing in", authHash);
    }
  }
  return idToken;
}

const LOAD_USER = 'LOAD_USER';
const SET_USER = 'SET_USER';

export const setUser = (profile) => {
  return {
    type: SET_USER,
    payoad: profile
  }
};

export const loadUser = () => {
  return (dispatch) => {
    let token = getIdToken();
    if (!token) {
      dispatch(setUser(false));
    } else {
      lock.getProfile(token, (err, profile) => {
        dispatch.setUser(profile || false);
      });
    }
  }
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [SET_USER]: (state, action) => Object.assign({}, state, {profile: action.payload})
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  profile: {}
};
export default function userReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
