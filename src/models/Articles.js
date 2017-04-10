const moment = require('moment');
import {SERVER_URL} from '../config.js';
import _ from 'lodash';

class Articles {
  getArticle (path) {
    return fetch(`${SERVER_URL}/article/${encodeURIComponent(path)}`)
      .then((response) => response.json())
      .then((article) => {
        try {
          article.revisedMoment = moment(article.revised);
        } catch (err) {

        }
        let breadcrumb = [{path: '/homepage', label: 'home'}];
        if (article.directory.length > 'articles/'.length) {
          breadcrumb.push({
            path: '/chapter/' + encodeURIComponent(article.directory),
            label: article.directory.replace(/^articles\//i, '')
          })
        }
        breadcrumb.push({
          label: article.title,
          static: true,
          path: '/article/' + encodeURIComponent(article.path)
        });
        article.breadcrumb = breadcrumb;
        console.log('set breadcrumb to ', breadcrumb);
        return article;
      });
  }

  getHomepage () {
    console.log('getting homepage');
    return fetch(`${SERVER_URL}/homepage-articles`)
      .then((response) => response.json())
      .then((articles) => _.map(articles, (article) => {
        try {
          article.revisedMoment = moment(article.file_created);
          article.crteatedMoment = moment(article.file_revised);
        } catch (err) {

        }
        return article;
      }));
  }

  getChapter (chapterPath) {
    console.log('getting homepage');
    return fetch(`${SERVER_URL}/article-collection/${chapterPath}`)
      .then((response) => response.json())
      .then((articles) => _.map(articles, (article) => {
        try {
          article.revisedMoment = moment(article.revised);
        } catch (err) {

        }
        return article;
      }));
  }
}

let articles = new Articles();

export default articles;
