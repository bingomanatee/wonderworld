import React from 'react';
import auth from './../../utils/auth';

import './Logout.scss';
const PropTypes = React.PropTypes;

const signOut = () => {
  console.log('signing out');
  auth.logout();
  window.location.reload();
}

export const Logout = (props) => (
  <div className="logout">
    <div onClick={signOut}>
      Sign out
    </div>
  </div>
);
Logout.propTypes = {
  profile: PropTypes.object
};

export default Logout;
