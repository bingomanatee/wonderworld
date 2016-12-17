import gearData from './gear.json';
import GearShape from './GearShape';
import _ from 'lodash';
import {DIST_BETWEEN_SPOKES, HEIGHT_OF_SPOKE} from './GearShape';
import Color from 'color';
import rebound from'rebound';

let springSystem = new rebound.SpringSystem();

import Point from 'point-geometry';

const TRANSPORT_RATE = 100; // the circular distance every gear should go.
// the larger the radius, the slower the rotation rate needed to achieve this rate.
const RADIAN_CIRC = (Math.PI * 2);

function _wholeRad(n) {
  n = n % RADIAN_CIRC;
  if (n < 0) {
    n += RADIAN_CIRC;
  }
  return n;
}
function r(n) {
  return Math.round(10 * n) / 10;
}

function _randScale(center, scale, min, max) {
  let rand = (center || 0) + (scale || 1) * (_.random(-100, 100) + _.random(-100, 100)) / 400;
  if (arguments.length > 2) {
    rand = _.clamp(rand, min, max);
  }
  return rand;
}

export default class Gear extends Point {

  /**
   *
   * @param ani {Gears}
   * @param x {number}
   * @param y {number}
   * @param rad {number}
   * @param letter {String}
   *
   */
  constructor(ani, x, y, rad, letter) {
    super(x, y);
    this._rad = rad;
    this._ani = ani;
    this.radius = rad;
    this.letter = letter || '';

    this.anglesPerSecond = 360 * TRANSPORT_RATE / this.circumference;
    this.color = Color.rgb(_.random(150, 256), _.random(150, 256), _.random(150, 256));
    // this.colorShadow = this.color.darken(0.25);
    this.initElement();
    this.initTimer();
  }

  initElement() {
    this.gear = new GearShape(this, this.color);
    this.element = new createjs.Container();
    this.element.addChild(this.gear.shape);
    this.element.x = this.x;
    this.element.y = this.y;
    this.ani.canvas.addChild(this.element);
    this.originShape = new createjs.Shape();
    this.letter = new createjs.Text(this.letter.toUpperCase(), `${this.radius}px Helvetica`);
    this.letter.textAlign = 'center';
    this.letter.textBaseline = 'middle';
    this.letter.color = this.color;
    this.element.addChild(this.letter);
  }

  initTimer() {
    createjs.Ticker.addEventListener('tick', (event) => {
      let seconds = event.time / 1000;
      this.element.x = this.x;
      this.element.y = this.y;
      if (this.parentGear) {
        this.setRotationFromParent();
      } else {
        this.rotation = this.anglesPerSecond * seconds;
      }
    });
  }

  addGear(radius, letter) {
    let angle = Math.PI / 2 * _randScale();
    let radians = angle * Math.PI / 180;
    let distance = (this.radius + radius + HEIGHT_OF_SPOKE);
    let x = Math.cos(radians) * distance;
    let y = Math.sin(radians) * distance;
    let other = new Gear(this.ani, x, y, radius, letter);
    other.springAngle(distance, angle + (Math.PI * _.random(-100, 100) / 200), angle);
    other.parentGear = this;

    this.childGears.push(other);
    this.element.addChild(other.element);
    return other;
  }

  springAngle(distance, from, to) {
    console.log('springing from ', distance, from, to);
    this._spring = springSystem.createSpring(_randScale(1, 3, 0.1, 2) * 40, _randScale(1, 3, 0.1, 2) * 3);
    this._spring.setEndValue(1);
    this._spring.addListener({
      onSpringUpdate: (spring) => {
        let radians = (to * spring.getCurrentValue()) + (from * (1 - spring.getCurrentValue()));
        this.x = this.element.x = Math.cos(radians) * distance;
        this.y = this.element.y = Math.sin(radians) * distance;
      },
      onSpringEndStateChange: (spring) => {
        console.log('ending at angle ', angle);
      }
    });
  }

  /* ------------ spoke rotation calculation ---------- */

  get parentSpokeOffset() {
    if (!this.parentGear) {
      return 0;
    }

    let percentOfCircleAroundParent = this.radiansFromOrigin / RADIAN_CIRC;
    return this.parentGear.spokeCount * percentOfCircleAroundParent + 0.5
  }

  get parentSpokeDegreeOffset() {
    return this.parentSpokeOffset * this.degreesPerSpoke;
  }

  setRotationFromParent() {
    let relativeTraversal = -360 * this.parentGear.spokesTraversed / this.spokeCount;
    this.rotation = 360 + this.parentSpokeDegreeOffset + this.degreesFromOrigin + relativeTraversal;
  }

  get degreesPerSpoke() {
    return 360 / this.spokeCount;
  }

  /* ---------- properties ----------- */


  get spokeCount() {
    return this.gear.spokeCount;
  }

  _childGears

  get childGears() {
    if (!this._childGears) {
      this._childGears = [];
    }
    return this._childGears;
  }

  get circumference() {
    return this.diameter * Math.PI;
  }

  /**
   * angle travelled, in degrees
   * @returns {number}
   */
  get rotation() {
    return this._rotation;
  }

  /**
   *
   * @param r
   */
  set rotation(r) {
    this._rotation = r;
    this.gear.shape.rotation = r;
  //  this.letter.rotation = r;
  }

  get spokesTraversed() {
    return this.rotation / 360 * this.spokeCount;
  }

  /**
   * a value from 0 to 1 that indicates how advanced in the rotation cycle
   * the gear is; used to tune the gears' rotation with other gears.
   * @returns {number}
   */

  get radiansFromOrigin() {
    return this.parentGear ? _wholeRad(Math.atan2(this.y, this.x)) : 0;
  }

  get degreesFromOrigin() {
    return 360 * this.radiansFromOrigin / RADIAN_CIRC;
  }

  /**
   *
   * @param value {float}
   */

  get letter() {
    return this._letter || '';
  }

  set letter(letter_value) {
    this._letter = letter_value;
  }

  get ani() {
    return this._ani;
  }

  set ani(value) {
    this._ani = value;
  }

  _gear
  get gear() {
    return this._gear;
  }

  set gear(value) {
    this._gear = value;
  }

  get radius() {
    return this._radius;
  }

  set radius(value) {
    this._radius = value;
  }

  get diameter() {
    return this.radius * 2;
  }

  get circumference() {
    return this.radius * 2 * Math.PI;
  }

  _parentGear

  get parentGear() {
    return this._parentGear;
  }

  set parentGear(value) {
    this._parentGear = value;
  }

  get spokeCount() {
    return Math.round(this.circumference / DIST_BETWEEN_SPOKES);
  }

  static makeSentence(ani, letters, targetWidth) {
    let firstGear = new Gear(ani, 0, 0, Math.max(20, _randScale(1, 1.5) * targetWidth / 2), letters.shift());
    let lastGear = firstGear;
    while (letters.length) {
      lastGear = lastGear.addGear(Math.max(20, _randScale(1, 1.5) * targetWidth / 2), letters.shift());
      ani.gearz.push(lastGear);
    }

    return firstGear;
  }
}