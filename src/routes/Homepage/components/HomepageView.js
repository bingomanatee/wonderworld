import React from 'react';
import './homepage.scss';
const moment = require('moment');
import _ from 'lodash';

export class Homepage extends React.Component {

  constructor(props) {
    super(props);
    console.log('loading');
    props.loadArticles();
  }

  folderLabel(article) {
    if (!article.folder) return '';
    return <b>{article.folder}:</b>;
  }

  articlesList() {
    if (!this.props.articles.length) {
      return (<div className="homepage-container">
        <div className="homepage-container__inner">
          <p>Loading...</p>
        </div>
      </div>);
    }
    return _(this.props.articles)
      .sortBy((article) => article.revisedMoment ? -article.revisedMoment.unix() : -100000)
    .map((article) => (
      <div className="homepage-container" key={'homepage-article-' + article.path}>
        <div className="homepage-container__inner">
          <h2>{this.folderLabel(article)}{article.title}</h2>
          <p><span>{article.intro || ' '} </span></p>
          <p className="time"><span>{article.revisedMoment.fromNow() }</span></p>
        </div>
      </div>)).value();
  }

  render() {
    const list = this.articlesList();
    console.log('list: ', list);
    return (
      <div className="content-frame__scrolling">
        { list }
      </div>
    )
  }
}

Homepage.propTypes = {
  articles: React.PropTypes.array,
  loadArticles: React.PropTypes.func.isRequired,
  getArticles: React.PropTypes.func.isRequired
};

export default Homepage;
