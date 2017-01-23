import React from 'react';
import { IndexLink, Link } from 'react-router';
import './FolderLabel.scss';
import '../FolderLabel/FolderLabel';

export class FolderLabel extends React.Component {
  render () {
    if (!this.props.article.folder) {
      return null;
    }
    return <div className='article-list-item-folder'>
      <div className='article-list-item-folder__inner'>
        {this.props.article.folder.replace('_', ' ')}:
      </div>
    </div>;
  }
}

FolderLabel.propTypes = {
  article: React.PropTypes.object.isRequired
};

export default FolderLabel;
