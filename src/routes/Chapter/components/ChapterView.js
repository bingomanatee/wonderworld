import React from 'react';
import './chapter.scss';
const moment = require('moment');
import _ from 'lodash';
import {browserHistory} from 'react-router';
import ArticleListItem from '../../../components/ArticleListItem/ArticleListItem'

export class chapter extends React.Component {

  constructor(props) {
    super(props);
    console.log('loading articles');
    props.setBreadcrumb([{label: 'Home', path: '/homepage'}]);
  }

  static contextTypes = {
    router: React.PropTypes.object,
  };

  componentDidMount() {
    this.props.loadArticles(this.props.params.chapterPath);
  }

  folderLabel(article) {
    if (!article.folder) {
      return '';
    }
    return <b>{article.folder.replace('_', ' ')}:</b>;
  }

  visitArticle(article) {
    this.context.router.push(`/article/${encodeURIComponent(article.path.replace(/\.md$/, ''))}`);
  }

  articlesList() {
    if (!this.props.articles.length) {
      return (<div className="chapter-container">
        <div className="chapter-container__inner">
          <p>Loading...</p>
        </div>
      </div>);
    }
    const visitArticle = (article) => {
      this.visitArticle(article);
    };
    return _(this.props.articles)
      .sortBy((article) => article.revisedMoment ? -article.revisedMoment.unix() : -100000)
      .map((article) => (
        <ArticleListItem article={article} visitArticle={visitArticle}></ArticleListItem>)).value();
  }

  render() {
    const list = this.articlesList();
    return (
      <div className="content-frame__scrolling">
        <h1 className="content-frame__title">{this.props.params.chapterPath}</h1>
        { list }
      </div>
    )
  }
}

chapter.propTypes = {
  articles: React.PropTypes.array,
  loadArticles: React.PropTypes.func.isRequired,
  getArticles: React.PropTypes.func.isRequired,
  setBreadcrumb: React.PropTypes.func
};

export default chapter;
