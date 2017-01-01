import fetchPolyfill from 'fetch-polyfill'
console.log('fetchPolyfill:', fetchPolyfill);
const moment = require('moment');
class Articles {

  getHomepage () {
    return fetch('http://localhost:3123/articles/homepage')
      .then((response) =>  response.json())
      .then((articles) => _.map(articles, (article) => {
          try {
            article.revisedMoment = moment(article.revised);
          } catch(err) {

          }
          let folder = /^articles\/(.*)\/(.*\.md)$/.exec(article.path);
          if (folder) {
            console.log('found folder: ', folder);
            article.folder = folder[1];
          } else {
            article.folder = '';
          }
          return article;
        }));
  }
}

let articles = new Articles();

export default articles;