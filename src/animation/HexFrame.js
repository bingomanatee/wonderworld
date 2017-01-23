import Point from 'point-geometry';
import _ from 'lodash';

const NEIGHBOR_LIST = [
  new Point(-1, 0),
  new Point(0, -1),
  new Point(1, -1),
  new Point(1, 0),
  new Point(0, 1),
  new Point(-1, 1)
];

export function hexRoundCube (x, y, z) {
  let rx = Math.round(x);
  let ry = Math.round(y);
  let rz = Math.round(z);

  let dx = Math.abs(rx - x);
  let dy = Math.abs(ry - y);
  let dz = Math.abs(rz - z);

  if (dx > dy && dx > dz) {
    rx = -ry - rz;
  } else if (dy > dz) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return [rx, ry, rz];
}

export function pixelToHexFlat (x, y, size) {
  let q = x * (2 / 3) / size;
  let r = (-x / 3 + Math.sqrt(3) / 3 * y) / size;
  return hexRoundCube(q, r, -(q + r));
}

export function hexToPixelFlat (q, r, size) {
  let x = size * (3 / 2) * q;
  let y = size * Math.sqrt(3) * (r + q / 2);
  return [x, y];
}

/**
 *
 * This is a flat topped coordinate system
 * hX == cartesian x
 * hY = NW -- SE
 * hZ = SW -- NE
 */

const COS_30 = Math.cos(Math.PI / 6);

export default class HexFrame {

  constructor (ani, radius) {
    this.ani = ani;
    this.radius = radius;
  }

  hexToPoint (hX, hY) {
    let data = hexToPixelFlat(hX, hY, this.radius);
    return new Point(data[0], data[1]);
  }

  pointToHex (x, y) {
    let data = pixelToHexFlat(x, y, this.radius);
    return new Point(data[0], data[1]);
  }

  hexPoints (hX, hY) {
    let center = this.hexToPoint(hX, hY);

    return {
      hX,
      hY,
      center,
      points: this._hexTemplate.map((p) => p.add(center))
    };
  }

  hexes () {
    let points = _.map(this._boundsRect, (pt) => this.pointToHex(pt.x, pt.y));
    let xs = _.map(points, 'x');
    let ys = _.map(points, 'y');

    let out = [];

    // eval('debugger');

    let count = 0;
    let skipped = 0;

    for (let x of _.range(_.min(xs), _.max(xs) + 1)) {
      for (let y of _.range(_.min(ys), _.max(ys) + 1)) {
        let center = this.hexToPoint(x, y);
        if (this.inBounds(center.x, center.y)) {
          out.push(this.hexPoints(x, y));
          ++count;
        } else {
          ++skipped;
        }
      }
    }
    this.hexesIndex = _.keyBy(out, (item) => this._pointIndex(item.hX, item.hY));
    return out;
  }

  _pointIndex (x, y) {
    return `${x},${y}`;
  }

  neighbors (x, y) {
    let out = _(NEIGHBOR_LIST)
      .map((point) => {
        let index = this._pointIndex(point.x + x, point.y + y);
        return this.hexesIndex[index];
      }).compact().value();
    return out;
  }

  inBounds (x, y) {
    if (x < this._minBound.x) {
      return false;
    }
    if (y < this._minBound.y) {
      return false;
    }
    if (x > this._maxBound.x) {
      return false;
    }
    if (y > this._maxBound.y) {
      return false;
    }
    return true;
  }

  /* --------------- dimension properties ------------ */

  _ani
  get ani () {
    return this._ani;
  }

  set ani (value) {
    this._ani = value;
  }

  get radius () {
    return this._radius;
  }

  set radius (rad) {
    this._radius = rad;
    this.diameter = 2 * rad;
    this.height = COS_30 * rad;

    this._setHexTemplate();

    this._setBounds();
  }

  _setHexTemplate () {
    let top = -this.height;
    let bottom = this.height;
    let right = this.radius;
    let left = -this.radius;
    let rMid = this.radius / 2;
    let lMid = -this.radius / 2;

    this._hexTemplate = [
      new Point(rMid, top),
      new Point(right, 0),
      new Point(rMid, bottom),
      new Point(lMid, bottom),
      new Point(left, 0),
      new Point(lMid, top)
    ];
  }

  _setBounds () {
    /**
     * because the coord system of the hex system is different than
     * the cartesian rectangle, we define the bounds rect as four points
     * and get the range of hex coordinates from them that contain all those points.
     *
     * @type {[Point]}
     * @private
     */
    this._boundsRect = [
      new Point(this.radius * -3, this.radius * -3),
      new Point(this.radius * -3, this.ani.height + (this.radius * 3)),
      new Point(this.ani.width + (this.radius * 3), this.radius * -3),
      new Point(this.ani.width + (this.radius * 3), this.ani.height + (this.radius * 3))
    ];

    this._minBound = new Point(0, 0);
    this._maxBound = new Point(0, 0);
    _.each(this._boundsRect, (boundPoint) => {
      _.each(['x', 'y'], (c) => {
        if (boundPoint[c] < this._minBound[c]) {
          this._minBound[c] = boundPoint[c];
        } else if (boundPoint[c] > this._maxBound[c]) {
          this._maxBound[c] = boundPoint[c];
        }
      });
    });
  }

  _diameter
  get diameter () {
    return this._diameter;
  }

  set diameter (value) {
    this._diameter = value;
  }

  _height
  get height () {
    return this._height;
  }

  set height (value) {
    this._height = value;
  }
}
