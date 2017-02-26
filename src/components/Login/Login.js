import React from 'react';
import {Link} from 'react-router';
import auth from './../../utils/auth';

import './Login.scss';
const PropTypes = React.PropTypes;

export const Login = (props) => (
  <div className="login">
    <div onClick={() => auth.login()} className="login__avatar">
      {auth.loggedIn() ? (<img src="/svg/user-in.svg"/>) : (<img src="/svg/user-out.svg"/>)}
      </div>
    </div>
);
Login.propTypes = {
};

export default Login;
