import gearData from './gear.json';
import GearShape from './GearShape';
import _ from 'lodash';
import {DIST_BETWEEN_SPOKES, HEIGHT_OF_SPOKE} from './GearShape';
import Color from 'color';

import Point from 'point-geometry';

const TRANSPORT_RATE = 0; // the circular distance every gear should go.
// the larger the radius, the slower the rotation rate needed to achieve this rate.
const RADIAN_CIRC = (Math.PI * 2);

export default class Gear extends Point {

  /**
   *
   * @param ani {Ani}
   * @param x
   * @param y
   * @param rad
   */
  constructor(ani, x, y, rad, offset) {
    super(x, y);
    this._rad = rad;
    this._ani = ani;
    this.radius = rad;
    this.offset = offset || 0;

    this.anglesPerSecond = 360 * TRANSPORT_RATE / this.circumference;
    this.color = Color.rgb(245, 245, 255);
   // this.colorShadow = this.color.darken(0.25);
    this.initElement();
    this.initTimer();
    this._sec = 0;
  }

  initElement() {
    this.gear = new GearShape(this, this.color);
    this.element = new createjs.Container();
    this.element.addChild(this.gear.shape);
    this.element.x = this.x;
    this.element.y = this.y;
    this.ani.canvas.addChild(this.element);
    this.originShape = new createjs.Shape();
    this.originShape.graphics.beginFill('yellow').drawCircle(0, 0, 5);
    this.element.addChild(this.originShape);

    this.angleLabel = new createjs.Text('angle', '20px Arial');
    this.angleLabel.x = 5;
    this.angleLabel.y = -5;
    this.element.addChild(this.angleLabel);

    this.angleFromOrigin = new createjs.Text('angle', '16px Arial');
    this.angleFromOrigin.x = 5;
    this.angleFromOrigin.y = 35;
    this.element.addChild(this.angleFromOrigin);
    
    this.traversalText = new createjs.Text('angle', '16px Arial');
    this.traversalText.x = 5;
    this.traversalText.y = 55;
    this.element.addChild(this.traversalText);

    this.localTraversalSpot = new createjs.Shape();
    this.drawTraversal();
    this.element.addChild(this.localTraversalSpot);
  }

  drawTraversal() {
    this.localTraversalSpot.graphics.clear()
    .beginStroke('black')
      .moveTo(0, 0)
      .lineTo(this.radius, 0)
      .arc(0, 0, this.radius, 0, this.localTraversalAngle * RADIAN_CIRC/360)
      .lineTo(0,0);
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
      if (true || (this._sec !== Math.floor(seconds))) {
        this._sec = Math.floor(seconds);
        this.angleLabel.text = `${Math.floor(this.rotation)} deg`;
        this.angleFromOrigin.text = `${Math.floor(this.radiansFromOrigin * 360 / RADIAN_CIRC)} deg rot`;
        this.traversalText.text = `${Math.floor(this.localTraversalAngle)} deg trav`;
        this.drawTraversal();
      }
    });
  }

  addGear(radius, angle) {
    let radians = angle * Math.PI / 180;
    let distance = (this.radius + radius + HEIGHT_OF_SPOKE);
    let x = Math.cos(radians) * distance;
    let y = Math.sin(radians) * distance;
    let other = new Gear(this.ani, x, y, radius);
    other.parentGear = this;
    console.log('adding gear offset by ', x, y);
    this.childGears.push(other);
    this.element.addChild(other.element);
    return other;
  }

  setRotationFromParent() {
    // eval('debugger');
  //  let periodAngleAdd = 360 * DIST_BETWEEN_SPOKES / this.circumference;
    this.rotation = this.parentGear.rotation * (-this.parentGear.radius / this.radius) + this.localTraversalAngle;
  }

  /* ---------- properties ----------- */

  get spokeCount() {
    return this.gear.spokeCount;
  }

  get relativeTraversal () {
    if (!this.parentGear) return 0;
   return (this.radiansFromOrigin / RADIAN_CIRC) * this.parentGear.circumference;
  }

  get localTraversalAngle () {
    if (!this.parentGear) return 180;
    return 360 * this.relativeTraversal/this.circumference * this.parentGear.spokeCount / this.spokeCount;
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

  get cyclesDone() {
    return this.rotation / 360;
  }

  /**
   * angle travelled, in degrees
   * @returns {number}
   */
  get rotation() {
    return this._rotation;
  }

  set rotation(r) {
    this._rotation = r;
    this.gear.shape.rotation = r;
  }

  get diameter() {
    return this.radius * 2;
  }

  /**
   * a value from 0 to 1 that indicates how advanced in the rotation cycle
   * the gear is; used to tune the gears' rotation with other gears.
   * @returns {number}
   */

  get radiansFromOrigin() {
    if (!this.parentGear) {
      return 0;
    }
    return Math.atan2(this.y, this.x);
  }

  /**
   *
   * @param value {float}
   */
  set offset(value) {
    this._offset = value;
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
}