import _ from 'lodash';
import GearShape, {HEIGHT_OF_SPOKE, DIST_BETWEEN_SPOKES} from './GearShape';
import rebound from 'rebound';
import {r2a, drawArc} from './angleUtils';
import LetterDiv from './LetterDiv';
let springSystem = new rebound.SpringSystem();
/* global createjs */
import Point from 'point-geometry';

const SLOW_AT = 6;
const SLOW_RATE = 2;
const STOP_AT = 10;
let TRANSPORT_RATE = 25; // the circular distance every gear should go.
// the larger the radius, the slower the rotation rate needed to achieve this rate.
const GEAR_COLOR = 'black'; // 'hsl(200, 50%, 25%)';
const LETTER_COLOR = 'hsl(200, 62%, 80%)';
function _randScale (center, scale, min, max) {
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
  constructor (ani, x, y, rad, letter, letterSize) {
    super(x, y);
    this.ani = ani;
    this.radius = rad;
    this.letter = letter || '';
    this._rotation = 0; // do NOT use the property! will start things churning
    this.letterSize = letterSize;

    this.anglesPerSecond = 360 * TRANSPORT_RATE / this.circumference;
    this.color = LETTER_COLOR;
    // this.colorShadow = this.color.darken(0.25);
    this.initElement();
    this.initTimer();
  }

  initElement () {
    this.gear = new GearShape(this, GEAR_COLOR);
    this.element = new createjs.Container();
    this.gearContainer = new createjs.Container();
    this.gearContainer.addChild(this.gear.shape);
    this.ani.canvas.addChild(this.gearContainer);

    this.element.x = this.x;
    this.element.y = this.y;
    this.ani.canvas.addChild(this.element);

    this.letterDiv = new LetterDiv(this.ani, this.letter, this.radius, this.color, this.letterSize);

    this.syncGear();
  }

  initTimer () {
    createjs.Ticker.addEventListener('tick', (event) => {
      let seconds = event.time / 1000;
      if (seconds > SLOW_AT) {
        seconds = Math.min(STOP_AT, SLOW_AT + (seconds - SLOW_AT) / SLOW_RATE);
      }
      this.element.x = this.x;
      this.element.y = this.y;
      if (!this.parentGear) {
        this.rotation = this.anglesPerSecond * seconds;
      }
      this.syncGear();
    });
  }

  syncGear () {
    let p = this.element.localToGlobal(0, 0);
    this.gearContainer.x = p.x;
    this.gearContainer.y = p.y;
    this.letterDiv.x = p.x;
    this.letterDiv.y = p.y;
  }

  addGear (radius, letter, targetAngle, letterWidth) {
    let initialAngle = targetAngle + 30 * _randScale();
    let other = new Gear(this.ani, 0, 0, radius, letter, letterWidth);
    other.parentGear = this;
    this.childGears.push(other);

    other.jointRotation = targetAngle;
    this.element.addChild(other.parentJoint);

    other.springAngle(initialAngle, targetAngle);
    return other;
  }

  springAngle (from, to) {
    this._spring = springSystem.createSpring(4, 1);
    this._spring.setEndValue(1);
    this._spring.addListener({
      onSpringUpdate: (spring) => {
        this.jointRotation = (to * spring.getCurrentValue()) + (from * (1 - spring.getCurrentValue()));
      },
      onSpringEndStateChange: (spring) => {
        console.log('-- ending at angle ', this.radiansFromParent);
      }
    });
  }

  /* ------------ spoke rotation calculation ---------- */

  _parentJoint

  get parentJoint () {
    if (!this.parentGear) {
      return null;
    }
    if (!this._parentJoint) {
      this._parentJoint = new createjs.Container();
      let mid = new createjs.Container();
      mid.x = this.distanceFromParent;
      this._parentJoint.addChild(mid);
      mid.addChild(this.element);
    }
    return this._parentJoint;
  }

  get distanceFromParent () {
    return (this.radius + this.parentGear.radius + HEIGHT_OF_SPOKE * this.ani.spokeScale);
  }

  get jointRotation () {
    if (!this.parentGear) {
      return 0;
    }
    return this.parentJoint.rotation;
  }

  set jointRotation (angle) {
    this.parentJoint.rotation = angle;
  }

  get absPosition () {
    let p = this.gearContainer.localToGlobal(0, 0);
    return new Point(p.x, p.y);
  }

  get degreesFromParent () {
    if (!this.parentGear) {
      return 0;
    }

    let parentPoint = this.parentGear.absPosition;
    let thisPoint = this.absPosition;
    let v = thisPoint.sub(parentPoint);

    return r2a(Math.atan2(v.y, v.x));
  }

  get degreesToParent () {
    return (this.degreesFromParent + 180) % 360;
  }

  spokesAt (angle) {
    return this.spokeCount * angle / 360;
  }

  drawParentArc () {
    if (!this.parentGear) {
      return;
    }
    if (!this.parentArc) {
      this.parentArc = new createjs.Container();
      this.ani.canvas.addChild(this.parentArc);
    }
    let p = this.parentGear.absPosition;
    this.parentArc.x = p.x;
    this.parentArc.y = p.y;

    drawArc(this.parentArc,
      this.parentGear.rotation,
      this.degreesFromParent,
      this.parentGear.degreesPerSpoke,
      'yellow',
      this.parentGear.radius / 2);
  }

  setRotationFromParent () {
    let parentSpokesToTangent;
    if (!isNaN(this.rotation)) {
      parentSpokesToTangent = this.parentGear.spokesAt(this.degreesFromParent - this.parentGear.rotation);
      let netRotation = this.degreesToParent + (0.5 + parentSpokesToTangent) * this.degreesPerSpoke;
      if (isNaN(netRotation)) {
        console.log('bad calculus: stopping set of rotation for ', this.letter);
      } else {
        this.rotation = netRotation;
      }
    } else {
      console.log('skipping parent rotation set for ', this.letter, this.parentGear);
    }
  }

  get degreesPerSpoke () {
    return 360 / this.spokeCount;
  }

  /* ---------- properties ----------- */

  get spokeCount () {
    return Math.round(this.circumference / (DIST_BETWEEN_SPOKES * this.ani.spokeScale));
  }

  _childGears

  get childGears () {
    if (!this._childGears) {
      this._childGears = [];
    }
    return this._childGears;
  }

  /**
   * angle travelled, in degrees
   * @returns {number}
   */
  get rotation () {
    return this._rotation;
  }

  /**
   *
   * @param r
   */
  set rotation (r) {
    if (isNaN(r)) {
      console.log('non number rotation for ', this.letter, r);
    }

    this._rotation = r;
    this.gear.shape.rotation = r;
    for (let child of this.childGears) {
      child.setRotationFromParent();
    }
  }

  get ani () {
    return this._ani;
  }

  set ani (value) {
    this._ani = value;
  }

  _gear
  get gear () {
    return this._gear;
  }

  set gear (value) {
    this._gear = value;
  }

  get radius () {
    return this._radius;
  }

  set radius (value) {
    this._radius = value;
  }

  get diameter () {
    return this.radius * 2;
  }

  get circumference () {
    return this.diameter * Math.PI;
  }
  _parentGear

  get parentGear () {
    return this._parentGear;
  }

  set parentGear (value) {
    this._parentGear = value;
  }

  static makeSentence (ani, letters, targetWidth) {
    const _getRadius = () => Math.round(_randScale(targetWidth / 2, targetWidth / 4, targetWidth / 4, targetWidth));
    let radius = _getRadius();
    let letterSize = Math.max(36, targetWidth * 0.8);
    let firstGear = new Gear(ani, 0, 0, radius, letters.shift(), letterSize);
    let lastGear = firstGear;
    while (letters.length) {
      radius = _getRadius();
      lastGear = lastGear.addGear(radius, letters.shift(), 0, letterSize);
      ani.gearz.push(lastGear);
    }

    return firstGear;
  }

  getAllGears () {
    let gears = [this];
    gears.push(_.map(this.childGears, (g) => g.getAllGears()));
    return _.flattenDeep(gears);
  }

}
