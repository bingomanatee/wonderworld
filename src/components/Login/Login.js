import React from 'react';
import Logout from '../Logout/Logout';
import auth from './../../utils/auth';

import './Login.scss';
const PropTypes = React.PropTypes;

const pp = (profile) => {
  try {
    return JSON.stringify(profile) || '--';
  } catch (err) {
    return '??';
  }
}

export const Login = (props) => (
  <div className="login">
    <div onClick={() => auth.login()} className="login__avatar">
      {auth.loggedIn() ? (<div>
        <img src={props.profile.picture} width="30" height="30"/>
      </div>) : (<img src="/svg/user-out.svg"/>)}
    </div>
    <p className="login__text">
      {auth.loggedIn() ? auth.getProfile().name || 'logged in' : ''}
      {auth.loggedIn() ? <Logout /> : ''}</p>
  </div>
);
Login.propTypes = {
  profile: PropTypes.object
};

export default Login;
