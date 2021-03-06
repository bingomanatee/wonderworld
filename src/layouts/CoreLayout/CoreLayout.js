import React from 'react';
import Header from '../../containers/HeaderContainer';
import './CoreLayout.scss';
import '../../styles/core.scss';

export const CoreLayout = ({children}) => (
  <div className='core-layout'>
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
