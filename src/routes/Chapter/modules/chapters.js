import articleModel from '../../../models/Articles';
// ------------------------------------
// Constants
// ------------------------------------
export const GET_ARTICLES = 'GET_ARTICLES';

// ------------------------------------
// Actions
// ------------------------------------

export function getArticles(value = []) {
  return {
    type: GET_ARTICLES,
    payload: value
  };
}

/*  This is a thunk, meaning it is a function that immediately
 returns a function for lazy evaluation. It is incredibly useful for
 creating async actions, especially when combined with redux-thunk!

 NOTE: This is solely for demonstration purposes. In a real application,
 you'd probably want to dispatch an action of COUNTER_DOUBLE and let the
 reducer take care of this logic.  */

export const loadArticles = (chapterPath) => {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      articleModel.getChapter(chapterPath)
        .then((articles) => {
          dispatch(getArticles(articles));
          resolve();
        });
    });
  };
};

export const actions = {
  getArticles,
  loadArticles
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [GET_ARTICLES]: (state, action) => Object.assign({}, state, {articles: action.payload})
};

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  articles: []
};
export default function homepageReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
