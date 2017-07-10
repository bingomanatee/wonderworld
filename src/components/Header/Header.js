import React from 'react';
import {Link} from 'react-router';
import './Header.scss';
import Login from '../../containers/LoginContainer';

function linkClasses (crumb) {
  const classes = ['header__link'];
  if (crumb.static) {
    classes.push('header__link-static');
  }
  return classes.join(' ');
}

function crumbInner (crumb) {
  return crumb.static ? crumb.label : <Link to={crumb.path}>{crumb.label}</Link>;
}

export const Header = (props) => (
  <div className='header'>
    <div className="header__breadcrumb">
    {props.breadcrumb.map((crumb, i) => (
      <span className={linkClasses(crumb)} key={`breadcrumb_${i}`}>
        {crumbInner(crumb)}
        <span className='header__bullet'>&#9670;</span>
      </span>))}
    </div>
    <div className="header__padding">&nbsp;</div>
    <Login />
  </div>
);
Header.propTypes = {
  breadcrumb: React.PropTypes.array.isRequired
};

export default Header;
