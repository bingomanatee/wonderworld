import React from 'react';
import './chapter.scss';
import _ from 'lodash';

import ArticleListItem from '../../../components/ArticleListItem/ArticleListItem';

export class chapter extends React.Component {

  constructor (props) {
    super(props);
    console.log('loading articles');
  }

  static contextTypes = {
    router: React.PropTypes.object
  };

  componentDidMount () {
    this.props.setBreadcrumb([{label: 'Home', path: '/homepage'}]);
    this.props.loadArticles(this.props.params.chapterPath);
  }

  folderLabel (article) {
    if (!article.folder) {
      return '';
    }
    return <b>{article.folder.replace('_', ' ')}:</b>;
  }

  visitArticle (article) {
    this.context.router.push(`/article/${encodeURIComponent(article.path.replace(/\.md$/, ''))}`);
  }

  articlesList () {
    if (!this.props.articles.length) {
      return (<div className='chapter-container'>
        <div className='chapter-container__inner'>
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
        <ArticleListItem key={key(article)} article={article} visitArticle={visitArticle} />)).value();
  }

  render () {
    const list = this.articlesList();
    return (
      <div className='content-frame__scrolling'>
        <h1 className='content-frame__title'>{this.props.params.chapterPath}</h1>
        { list }
      </div>
    );
  }
}

chapter.propTypes = {
  articles: React.PropTypes.array,
  params: React.PropTypes.object,
  loadArticles: React.PropTypes.func.isRequired,
  getArticles: React.PropTypes.func.isRequired,
  setBreadcrumb: React.PropTypes.func
};

export default chapter;
