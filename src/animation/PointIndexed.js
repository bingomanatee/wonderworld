import Point from 'point-geometry';
import _ from 'lodash';

export default class PointIndexed extends Point {
  constructor (x, y, index) {
    if (_.isObject(x)) {
      index = y;
      y = x.y;
      x = x.x;
    }
    super(Math.round(x), Math.round(y));
    this._index = index;
    this._triangles = [];
  }

  removeTriangle (triangle) {
    this.triangles = _.filter(this.triangles, (other) => {
      triangle.id === other.id;
    });
  }

  get triangles () {
    return this._triangles;
  }

  set triangles (value) {
    this._triangles = value;
  }

  get index () {
    return this._index;
  }

  set index (value) {
    this._index = value;
  }

  array () {
    let rx = this.round();
    return [rx.x, rx.y];
  }
}
