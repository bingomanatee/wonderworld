import React from 'react';
import Header from '../../containers/HeaderContainer';
import './CoreLayout.scss';
import '../../styles/core.scss';
import Login from '../../containers/LoginContainer';
import {lock} from '../../store/auth'

export const CoreLayout = ({children}) => (
  <div className='core-layout'>
    <Login lock={lock} />
    <Header />
    <div className='core-layout__viewport'>
      {children}
    </div>
  </div>
);

CoreLayout.propTypes = {
  children: React.PropTypes.element.isRequired
};

export default CoreLayout;
