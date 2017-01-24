import {injectReducer} from '../../store/reducers';

export default (store) => ({
  path: 'chapter/:chapterPath',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Chapter = require('./containers/ChapterContainer').default;
      const reducer = require('./modules/chapters').default;
      const breadcrumbReducer = require('../../store/breadcrumb').default;

      /*  Add the reducer to the store on key 'homepage'  */
      injectReducer(store, {key: 'chapter', reducer});
      injectReducer(store, {key: 'breadcrumb', reducer: breadcrumbReducer});
      /*  Return getComponent   */
      cb(null, Chapter);

      /* Webpack named bundle   */
    }, 'chapter');
  }
});
