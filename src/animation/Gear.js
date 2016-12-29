import GearShape from './GearShape';
import _ from 'lodash';
import {DIST_BETWEEN_SPOKES, HEIGHT_OF_SPOKE} from './GearShape';
import Color from 'color';
import rebound from'rebound';
import {a2r, r2a, RADIAN_CIRC, rr, r, _wholeAngle, _wholeRad, rra, drawArc} from './angleUtils';
import LetterDiv from './LetterDiv';
let springSystem = new rebound.SpringSystem();

import Point from 'point-geometry';

let TRANSPORT_RATE = 100; // the circular distance every gear should go.
// the larger the radius, the slower the rotation rate needed to achieve this rate.

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
    this._rotation = 0;

    this.anglesPerSecond = 360 * TRANSPORT_RATE / this.circumference;
    this.color = Color.rgb(_.random(150, 256), _.random(150, 256), _.random(150, 256));
    // this.colorShadow = this.color.darken(0.25);
    this.initElement();
    this.initTimer();
  }

  initElement() {
    this.gear = new GearShape(this, 'black');
    this.element = new createjs.Container();
    this.gearContainer = new createjs.Container();
    this.gearContainer.addChild(this.gear.shape);
    this.ani.canvas.addChild(this.gearContainer);

    this.element.x = this.x;
    this.element.y = this.y;
    this.ani.canvas.addChild(this.element);
  /*  this.letterShape = new createjs.Text(this.letter.toUpperCase(), `${this.radius}px Helvetica`);
    this.letterShape.textAlign = 'center';
    this.letterShape.textBaseline = 'middle';
    this.letterShape.color = this.color;
    this.gearContainer.addChild(this.letterShape);*/
    // this.element.addChild(_makeAxis());

    this.letterDiv = new LetterDiv(this.ani, this.letter, this.radius, this.color);

    this.syncGear();
  }

  initTimer() {
    createjs.Ticker.addEventListener('tick', (event) => {
      let seconds = event.time / 1000;
      this.element.x = this.x;
      this.element.y = this.y;
      if (!this.parentGear) {
        this.rotation = this.anglesPerSecond * seconds;
      }
      this.syncGear();
    });
  }

  syncGear() {
    let p = this.element.localToGlobal(0, 0);
    this.gearContainer.x = p.x;
    this.gearContainer.y = p.y;
    this.letterDiv.x = p.x;
    this.letterDiv.y = p.y;
  }

  addGear(radius, letter, targetAngle) {
    let initialAngle = targetAngle + 30 * _randScale();
    let other = new Gear(this.ani, 0, 0, radius, letter);
    other.parentGear = this;
    this.childGears.push(other);

    other.jointRotation = initialAngle;
    this.element.addChild(other.parentJoint);

    /*   let pinkArrow = new createjs.Shape();
     pinkArrow.graphics.beginStroke('magenta')
     .setStrokeStyle(2)
     .mt(0, 0)
     .lt(200, 0)
     .lt(190, 10)
     .mt(200, 0)
     .lt(190, -10);
     other.parentJoint.addChild(pinkArrow);

     */
    other.springAngle(0, targetAngle);
    return other;
  }

  springAngle(from, to) {
    this._spring = springSystem.createSpring(1, 0.1);
    this._spring.setEndValue(1);
    this._spring.addListener({
      onSpringUpdate: (spring) => {
        this.jointRotation = (to * spring.getCurrentValue()) + (from * (1 - spring.getCurrentValue()));
      },
      onSpringEndStateChange: (spring) => {
        console.log('ending at angle ', this.radiansFromParent);
      }
    });
  }

  /* ------------ spoke rotation calculation ---------- */

  _parentJoint

  get parentJoint() {
    if (!this._parentJoint) {
      this._parentJoint = new createjs.Container();
      let mid = new createjs.Container();
      mid.x = this.distanceFromParent;
      this._parentJoint.addChild(mid);
      mid.addChild(this.element);
    }
    return this._parentJoint;
  }

  get distanceFromParent() {
    return (this.radius + this.parentGear.radius + HEIGHT_OF_SPOKE);
  }

  get jointRotation() {
    if (!this.parentGear) {
      return 0;
    }
    return this.parentJoint.rotation;
  }

  set jointRotation(angle) {
    this.parentJoint.rotation = angle;
  }

  get absPosition() {
    let p = this.gearContainer.localToGlobal(0, 0);
    return new Point(p.x, p.y);
  }

  get degreesFromParent() {
    if (!this.parentGear) {
      return 0;
    }

    let parentPoint = this.parentGear.absPosition;
    let thisPoint = this.absPosition;
    let v = thisPoint.sub(parentPoint);

    return r2a(Math.atan2(v.y, v.x));
  }

  get degreesToParent() {
    return (this.degreesFromParent + 180) % 360;
  }

  spokesAt(angle) {
    return this.spokeCount * angle / 360;
  }

  drawParentArc() {
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

  drawArcToParent() {
    if (!this.parentGear) {
      return;
    }
    if (!this.myArc) {
      this.myArc = new createjs.Container();
      this.ani.canvas.addChild(this.myArc);
    }
    let p = this.absPosition;
    this.myArc.x = p.x;
    this.myArc.y = p.y;

    drawArc(this.myArc,
      0,
      this.degreesToParent,
      this.degreesPerSpoke,
      'white',
      this.radius * 0.75);
  }

  setRotationFromParent() {
    let parentSpokesToTangent;
    // this.drawParentArc();
    // this.drawArcToParent();
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
    if (isNaN(r)) {
      console.log('non number rotation for ', this.letter, r);
    }

    this._rotation = r;
    this.gear.shape.rotation = r;
    for (let child of this.childGears) {
      child.setRotationFromParent();
    }
  }

  /**
   *
   * @param value {float}
   */

  get letterShape() {
    return this._letter || '';
  }

  set letterShape(letter_value) {
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
    let netAngle = 0;
    while (letters.length) {
      let targetAngle = _randScale(netAngle, 180, -90, 90);
      netAngle -= targetAngle;
      let radius = _randScale(targetWidth / 2, targetWidth * 3, 80, 150);
      lastGear = lastGear.addGear(radius, letters.shift(), targetAngle);
      ani.gearz.push(lastGear);
    }

    return firstGear;
  }
}