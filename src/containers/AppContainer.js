import React, {Component, PropTypes} from 'react';
import {browserHistory, Router} from 'react-router';
import {Provider} from 'react-redux';

import Gears from '../animation/Gears';

class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    if (typeof window !== 'undefined') {
      this.ani = new Gears(this.props.store, 'ani');
      this.ani.play();
    }
  }

  render() {
    const {routes, store} = this.props;

    return (
      <Provider store={store}>
        <div style={{height: '100%'}}>
          <Router history={browserHistory} children={routes}/>
        </div>
      </Provider>
    );
  }
}

export default AppContainer;
