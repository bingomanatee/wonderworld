import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path: 'article/:articlepath',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
     and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
       dependencies for bundling   */
      const Article = require('./containers/ArticleContainer').default;
      const reducer = require('./modules/article').default;
      const breadcrumbReducer = require('../../store/breadcrumb').default;

      /*  Add the reducer to the store on key 'article'  */
      injectReducer(store, { key: 'article', reducer });
      injectReducer(store, { key: 'breadcrumb', reducer: breadcrumbReducer });
      /*  Return getComponent   */
      cb(null, Article);

      /* Webpack named bundle   */
    }, 'article');
  }
});
