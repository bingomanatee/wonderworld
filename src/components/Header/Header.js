import React from 'react';
import { IndexLink, Link } from 'react-router';
import './Header.scss';

export const Header = (props) => (
  <div className="header">
    {props.breadcrumb.map((crumb, i) => (
      <span className="header__link" key={`breadcrumb_${i}`}>
      <Link to={crumb.path}>{crumb.label}</Link>
        <span className="header__bullet">~</span>
      </span>))}
  </div>
);
Header.propTypes = {
  breadcrumb: React.PropTypes.array.isRequired
};

export default Header;