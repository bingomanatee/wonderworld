import React from 'react';

export const Homepage = (props) => (
  <div style={{ margin: '0 auto' }} >
    <h2>Homepage</h2>
  </div>
);

Homepage.propTypes = {
  loadArticles     : React.PropTypes.func.isRequired,
  getArticles : React.PropTypes.func.isRequired
};

export default Homepage;
