import React from 'react';
import {Link} from 'react-router';
import './Login.scss';

export const Login = (props) => (
  <div className="login">
    <div onClick={() => props.lock.show() } className="login__avatar">
    <img src="/svg/user-out.svg"/>
      </div>
    </div>
);
Login.propTypes = {
  lock: React.PropTypes.object.isRequired
};

export default Login;
