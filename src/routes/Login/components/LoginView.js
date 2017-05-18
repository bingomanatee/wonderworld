import React from 'react';
import './login.scss';

export class LoginView extends React.Component {

  constructor (props) {
    super(props);
    console.log('loading logins');
  }

  componentDidMount () {
    this.props.setBreadcrumb([{label: 'Logging In'}]);
    console.log('getting login');
  }

  render () {
    console.log('props:', this.props);
    return (
      <div className='content-frame__scrolling'>
        <h1>Logging In</h1>
      </div>
    );
  }
}

LoginView.propTypes = {
  setUser: React.PropTypes.object,
  setBreadcrumb: React.PropTypes.func
};

export default LoginView;
