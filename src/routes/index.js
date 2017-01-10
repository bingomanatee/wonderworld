// We only need to import the modules necessary for initial render
import CoreLayout from '../layouts/CoreLayout/CoreLayout';
import Home from './Home';
import CounterRoute from './Counter';
import HomepageRoute from './Homepage';
import ArticleRoute from './Article';
import ChapterRoute from './Chapter';
import {hashHistory} from 'react-router';

/*  Note: Instead of using JSX, we recommend using react-router
    PlainRoute objects to build route definitions.   */

export const createRoutes = (store) => ({
  path        : '/',
  component   : CoreLayout,
  indexRoute: { onEnter: (nextState, replace) => replace('/homepage') },
  childRoutes : [
    CounterRoute(store),
    HomepageRoute(store),
    ArticleRoute(store),
    ChapterRoute(store)
  ]
});

/*  Note: childRoutes can be chunked or otherwise loaded programmatically
    using getChildRoutes with the following signature:

    getChildRoutes (location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          // Remove imports!
          require('./HomeView').default(store)
        ])
      })
    }

    However, this is not necessary for code-splitting! It simply provides
    an API for async route definitions. Your code splitting should occur
    inside the route `getComponent` function, since it is only invoked
    when the route exists and matches.
*/

export default createRoutes;
