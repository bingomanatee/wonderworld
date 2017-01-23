import PointIndexed from 'animation/PointIndexed';
import Point from 'point-geometry';
import _ from 'lodash';
import cdt from 'cdt2d';

export const MAX_OUTER_WIDTH = 100;
export const OUTER_PAD = 10;

export const lerp = (start, end, ratio) => {
  let vector = end.sub(start);
  return vector.mult(ratio).add(start);
};

export const seriesToSegments = (series) => {
  let segments = _(series)
    .reduce((out, tri) => {
      out.push([tri[0], tri[1]]);
      out.push([tri[1], tri[2]]);
      out.push([tri[2], tri[0]]);
      return out;
    }, []);

  return _(segments)
    .map((segment) => [_.min(segment), _.max(segment)])
    .uniqBy((segment) => segment.join(','))
    .sortBy((segment) => segment[0])
    .value();
};

export function list (ptArray) {
  return _.reduce(ptArray, (list, pt, i) => {
    let prev = (i === 0) ? _.last(ptArray) : ptArray[i - 1];
    list.push([prev.index, pt.index]);
    return _.sortBy(list, (series) => series[0]);
  }, []);
}

export class CdtPrepare {
  constructor (innerPoints, topLeft, bottomRight) {
    this._index = [];
    this._outerRegion = [];
    this._innerPoints = [];
    this.registerInnerPoints(innerPoints);
    this.registerOuterRegion(topLeft, bottomRight);
  }

  cdt () {
    let points = _.map(this.index, (pt) => pt.array());
    let inner = list(this.innerPoints);
    let outer = list(this.outerPoints);
    //   console.log('points: ', JSON.stringify(points, true, 2));
    //   console.log('inner: ', JSON.stringify(inner, true, 2));
    //   console.log('outer: ', JSON.stringify(outer, true, 2));
    return cdt(points, inner.concat(outer), { exterior: false, interior: true });
  }

  _triangulate (series) {
    return _.map(series, (indexes) => {
      return _.map(indexes, (i) => {
        return this.index[i];
      });
    });
  }

  triangles (maxLength, maxIters) {
    let series;
    let iters = 0;
    if (maxLength) do {
      series = this.cdt();
    } while ((++iters < maxIters) && this._tesselate(maxLength, series, iters));
    return this._triangulate(series);
  }

  _tesselate (max, series, iters) {
    let segments = seriesToSegments(series);
    let tooLong = false;
    let map = new Map();
    let maxLength = (iters < 2 ? 2 * max : max);

    for (let point of this.index) {
      //  console.log('indexing ', point.x, point.y, point.index, 'mid point');
      map.set(point.index, 'mid');
    }
    for (let point of this.innerPoints) {
      //  console.log('indexing ', point.x, point.y, point.index, 'inner point');
      map.set(point.index, 'inner');
    }
    for (let point of this.outerPoints) {
      //  console.log('indexing ', point.x, point.y, point.index, 'outer point');
      map.set(point.index, 'outer');
    }
    for (let segment of segments) {
      let aIndex = segment[0];
      let bIndex = segment[1];

      let a = this.index[aIndex];
      let b = this.index[bIndex];

      let aPlace = map.get(aIndex);
      let bPlace = map.get(bIndex);

      if (bPlace === aPlace) {
        if (aPlace !== 'mid') {
          continue;
        }
      }

      if (a.dist(b) > maxLength) {
        let midpoints = this._midpoints(a, b, maxLength, 1);
        for (let point of midpoints) {
          if (!this.hasPoint(point)) {
            this.addPoint(point);
            tooLong = true;
          }
        }
      }
    }
    //  if (!tooLong) console.log('!! PASS !!');
    return tooLong;
  }

  hasPoint (pt) {
    return !!_.find(this.index, (other) => {
      other.dist(pt) < 3;
    });
  }

  registerInnerPoints (points) {
    for (let point of points) {
      this.innerPoints.push(this.addPoint(point));
    }
  }

  registerOuterRegion (topLeft, bottomRight) {
    let top = topLeft.y - OUTER_PAD;
    let bottom = bottomRight.y + OUTER_PAD;
    let left = topLeft.x - OUTER_PAD;
    let right = bottomRight.x + OUTER_PAD;

    let topLeftIndexed = this.addPoint(left, top);
    this.outerPoints.push(topLeftIndexed);
    let topRightIndexed = this.addPoint(right, top);
    this.registerOuterRegionMidpoints(topLeftIndexed, topRightIndexed);
    this.outerPoints.push(topRightIndexed);
    let bottomRightIndexed = this.addPoint(right, bottom);
    this.registerOuterRegionMidpoints(topRightIndexed, bottomRightIndexed);
    this.outerPoints.push(bottomRightIndexed);
    let bottomLeftIndexed = this.addPoint(left, bottom);
    this.registerOuterRegionMidpoints(bottomRightIndexed, bottomLeftIndexed);
    this.outerPoints.push(bottomLeftIndexed);
    this.registerOuterRegionMidpoints(bottomLeftIndexed, topLeftIndexed);
  }

  addPoint (point, y) {
    if (arguments.length > 1) {
      point = new Point(point, y);
    }
    let pointIndexed = new PointIndexed(point.x, point.y, this.index.length);
    this._index.push(pointIndexed);
    return pointIndexed;
  }

  get innerPoints () {
    return this._innerPoints;
  }

  set innerPoints (value) {
    this._innerPoints = value;
  }

  get outerPoints () {
    return this._outerRegion;
  }

  set outerPoints (value) {
    this._outerRegion = value;
  }

  _midpoints (a, b, size, min) {
    let distance = a.dist(b);
    let ratio = Math.ceil(distance / size);
    let divisor = Math.max(min, ratio);
    let out = [];
    for (let numerator = 1; numerator < divisor; ++numerator) {
      let point = lerp(a, b, numerator / divisor);
      out.push(point);
    }
    return out;
  }

  registerOuterRegionMidpoints (a, b) {
    for (let point of this._midpoints(a, b, MAX_OUTER_WIDTH, 2)) {
      this.outerPoints.push(this.addPoint(point));
    }
  }

  get index () {
    return this._index;
  }
}
