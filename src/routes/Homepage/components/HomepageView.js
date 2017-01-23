import React from 'react';
import './homepage.scss';
const moment = require('moment');
import _ from 'lodash';
import {browserHistory} from 'react-router';
import ArticleListItem from '../../../components/ArticleListItem/ArticleListItem'

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

  visitArticle(article) {
    this.context.router.push(`article/${encodeURIComponent(article.path.replace(/\.md$/, ''))}`);
  }

  articlesList() {
    if (!this.props.articles.length) {
      return (<div className="article-list-item">
        <div className="article-list-item-inner">
          <p>Loading...</p>
        </div>
      </div>);
    }

    const visitArticle = (article) => {
      this.visitArticle(article);
    };

    const key = (article) => `article-key-${article.path}`;

    return _(this.props.articles)
      .sortBy((article) => article.revisedMoment ? -article.revisedMoment.unix() : -100000)
      .map((article) => (
        <ArticleListItem key={key(article)} article={article} visitArticle={visitArticle}></ArticleListItem>)).value();
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
