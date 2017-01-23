import React from 'react';
import './article.scss';
const moment = require('moment');
import _ from 'lodash';
import marked from 'marked';
import {SERVER_URL} from '../../../config';
export class ArticleView extends React.Component {

  constructor(props) {
    super(props);
    console.log('loading articles');
  }

  componentDidMount() {
    this.props.setBreadcrumb([{label: 'Home', path: '/homepage'}]);
    console.log('getting article', this.props.params.articlepath);
    this.props.loadArticle(this.props.params.articlepath);
  }

  folderLabel(article) {
    if (!article.folder) return '';
    return <b>{article.folder}:</b>;
  }

  content() {
    if (!(this.props.article && this.props.article.content)) {
      return {__html: '<p>loading...</p>'};
    } else {
      return {__html: marked(this.props.article.content)};
    }
  }

  render() {
    console.log('props:', this.props)
    return (
      <div className="content-frame__scrolling">
        <article className="article">
        <h1>{this.props.article.title || 'loading...'}</h1>
          <blockquote className="article__intro">
            {this.props.article.intro}
          </blockquote>
          <div className="article__content" dangerouslySetInnerHTML={this.content()}>
          </div>
        </article>
      </div>
    )
  }
}

ArticleView.propTypes = {
  article: React.PropTypes.object,
  articlepath: React.PropTypes.string,
  loadArticle: React.PropTypes.func.isRequired,
  getArticle: React.PropTypes.func.isRequired,
  setBreadcrumb: React.PropTypes.func
};

export default ArticleView;
