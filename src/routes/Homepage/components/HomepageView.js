import React from 'react';
import './homepage.scss';
const moment = require('moment');
import _ from 'lodash';
import {browserHistory} from 'react-router';

export class Homepage extends React.Component {

  constructor(props) {
    super(props);
    console.log('loading articles');
    props.setBreadcrumb([{label: 'Home', path: '/homepage'}]);
  }

  static contextTypes = {
    router: React.PropTypes.object,
  };

  componentDidMount() {
    this.props.loadArticles();
  }

  folderLabel(article) {
    if (!article.folder) {
      return '';
    }
    return <b>{article.folder.replace('_', ' ')}:</b>;
  }

  visitArticle(path) {
    setTimeout(() => this.context.router.push(`article/${encodeURIComponent(path.replace(/\.md$/, ''))}`), 500);
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
        <div className="homepage-container"
             onClick={() =>  this.visitArticle(article.path)}
             key={'homepage-article-' + article.path}>
          <div className="homepage-container__inner">
            <h2>{this.folderLabel(article)}{article.title}</h2>
            <p><span>{article.intro || ' '} </span></p>
            <p className="time"><span>{article.revisedMoment.fromNow() }</span></p>
          </div>
        </div>)).value();
  }

  render() {
    const list = this.articlesList();
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
  getArticles: React.PropTypes.func.isRequired,
  setBreadcrumb: React.PropTypes.func
};

export default Homepage;
