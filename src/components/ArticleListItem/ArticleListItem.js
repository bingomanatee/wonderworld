import React from 'react';
import {IndexLink, Link} from 'react-router';
import './articleListItem.scss';
import {FolderLabel} from '../FolderLabel/FolderLabel';

export const ArticleListItem = (props) => (
  <div className="article-list-item"
       onClick={() => props.visitArticle(props.article)}
       key={'article-list-item-' + props.article}>
    <div className="article-list-item-inner">
      <div className="article-list-item-title-group">
        <FolderLabel className="article-list-item-folder" article={props.article}>
        </FolderLabel>
        <div className="article-list-item-title">
          <h2 className="article-list-item-title__inner">
            {props.article.title}</h2>
        </div>
      </div>
      <div className="article-list-item-description-group">
        <div className="article-list-item-intro">
          <p className="article-list-item-intro__inner">{props.article.intro || ' '} </p>
        </div>
        <div className="article-list-item-time">
          <span className="article-list-item-time__inner">{props.article.revisedMoment.fromNow() }</span>
        </div>
      </div>
    </div>
  </div>
);

ArticleListItem.propTypes = {
  article: React.PropTypes.object.isRequired,
  visitArticle: React.PropTypes.func.isRequired
};

export default ArticleListItem;