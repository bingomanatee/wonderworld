import {fetch, Request, Response, Headers} from 'fetch-polyfill'

class Articles {

  getHomepage () {
    return fetch('http://localhost:3123/homepage');
  }
}

let articles = new Articles();

export default articles;