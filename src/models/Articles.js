const moment = require('moment');
import {SERVER_URL} from '../config.js';
import _ from 'lodash';

class Articles {
  getArticle (path) {
    return fetch(`${SERVER_URL}/articles/article/${encodeURIComponent(path)}`)
      .then((response) => response.json())
      .then((article) => {
        try {
          article.revisedMoment = moment(article.revised);
        } catch (err) {

        }
        let folder = /^articles\/(.*)\/(.*\.md)$/.exec(article.path);

        let breadcrumb = [{path: '/homepage', label: 'home'}];
        if (folder) {
          article.folder = folder[1];
          breadcrumb.push({path: `/chapter/${article.folder}`, label: article.folder});
        } else {
          article.folder = '';
        }
        breadcrumb.push({
          label: article.title,
          static: true,
          path: '/articles/' + encodeURIComponent(article.path.replace(/\.md$/, ''))
        });
        article.breadcrumb = breadcrumb;
        console.log('set breadcrumb to ', breadcrumb);
        return article;
      });
  }

  getHomepage () {
    console.log('getting homepage');
    return fetch(`${SERVER_URL}/articles/homepage`)
      .then((response) => response.json())
      .then((articles) => _.map(articles, (article) => {
        try {
          article.revisedMoment = moment(article.revised);
        } catch (err) {

        }
        let folder = /^articles\/(.*)\/(.*\.md)$/.exec(article.path);
        if (folder) {
          article.folder = folder[1];
        } else {
          article.folder = '';
        }
        return article;
      }));
  }

  getChapter (chapterPath) {
    console.log('getting homepage');
    return fetch(`${SERVER_URL}/articles/chapter/${chapterPath}`)
      .then((response) => response.json())
      .then((articles) => _.map(articles, (article) => {
        try {
          article.revisedMoment = moment(article.revised);
        } catch (err) {

        }
        let folder = /^articles\/(.*)\/(.*\.md)$/.exec(article.path);
        if (folder) {
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
