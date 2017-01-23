import articleModel from '../../../models/Articles';
import {setBreadcrumb} from '../../../store/breadcrumb';
import {SERVER_URL} from '../../../config';
// ------------------------------------
// Constants
// ------------------------------------
export const GET_ARTICLE = 'GET_ARTICLE';

// ------------------------------------
// Actions
// ------------------------------------

export function getArticle(value = {}) {
  return {
    type: GET_ARTICLE,
    payload: value
  };
}

/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */

export const loadArticle = (articlepath) => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      articleModel.getArticle(articlepath)
        .then((article) => {
        console.log('retrieved article: ', article);
          if (article.content){
            article.content = article.content.replace(new RegExp('/blog_image/', 'g'), `${SERVER_URL}/images/`);
          }
          dispatch(getArticle(article));
          console.log('resolving with breadcrumb: ', article.breadcrumb);
          dispatch(setBreadcrumb(article.breadcrumb));
          resolve();
        });
    });
  };
};

export const actions = {
  getArticle,
  loadArticle
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_ARTICLE]: (state, action) => Object.assign({}, state, {article: action.payload})
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  article: {}
};
export default function articleReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
