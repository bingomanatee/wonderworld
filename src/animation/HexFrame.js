import Point from 'point-geometry';

export function hexRoundCube(x, y, z) {
  let rx = Math.round(x)
  let ry = Math.round(y)
  let rz = Math.round(z)

  let dx = Math.abs(rx - x)
  let dy = Math.abs(ry - y)
  let dz = Math.abs(rz - z)

  if (dx > dy && dx > dz) {
    rx = -ry - rz
  }
  else if (dy > dz) {
    ry = -rx - rz
  }
  else {
    rz = -rx - ry
  }

  return [rx, ry, rz]
}

export function pixelToHexFlat(x, y, size) {
  let q = x * (2 / 3) / size
  let r = (-x / 3 + Math.sqrt(3) / 3 * y) / size
  return hexRoundCube(q, r, -(q + r));
}

export function hexToPixelFlat(q, r, size) {
  let x = size * (3 / 2) * q
  let y = size * Math.sqrt(3) * (r + q / 2)
  return [x, y]
}

import _ from 'lodash';
/**
 *
 * This is a flat topped coordinate system
 * hX == cartesian x
 * hY = NW -- SE
 * hZ = SW -- NE
 */

const COS_30 = Math.cos(Math.PI / 6);

export default class HexFrame {
  constructor(radius) {
    this.radius = radius;
  }

  hexToPoint(hX, hY) {
    let data = hexToPixelFlat(hX, hY, this.radius)
    return new Point(data[0], data[1]);
  }

  hexPoints(hX, hY, hZ) {
    let center = this.hexToPoint(hX, hY);

    return this._hexTemplate.map((p) => p.add(center));
  }

  /* --------------- dimension properties ------------ */

  get radius() {
    return this._radius;
  }

  set radius(value) {
    this._radius = value;
    this.diameter = 2 * value;
    this.height = COS_30 * value;

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

  _diameter
  get diameter() {
    return this._diameter;
  }

  set diameter(value) {
    this._diameter = value;
  }

  _height
  get height() {
    return this._height;
  }

  set height(value) {
    this._height = value;
  }
}