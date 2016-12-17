import gearData from './gear.json';
import _ from 'lodash';

import Point from 'point-geometry';
function easeLinear(t, b, c, d) {
  return (c / 2) + (-c + ((c / d) * t));
}
export default class Gear extends Point {
  /**
   *
   * @param ani {Gears}
   * @param x
   * @param y
   * @param rad
   */
  constructor(ani, x, y, rad) {
    super(x, y);
    this._rad = rad;
    this._ani = ani;
    this.radius = 100;
    this.outerWidth = _.random(5, 25);
    this.spokeSize = 12;
    this.anglesPerSecond = 60;
    this.color = 'rgb(255,250,220)'
    this.initElement();
    this.canvas
  }

  initElement() {
    this.initCanvas();
    this.gear = new createjs.Bitmap();
    this.gear2 = new createjs.Bitmap();

    this.makeGear(this.gear, 'black', this.topCanvas);
    this.makeGear(this.gear2, 'rgb(225,225,225)', this.bottomCanvas);
    this.gear2.x -= 2;
    this.gear2.y += 2;
    this.element = new createjs.Container();
    this.element.x = this.x;
    this.element.y = this.y;
    this.element.addChild(this.gear);
    this.element.addChild(this.gear2);
    this.ani.canvas.addChild(this.element);
    this.ani.canvas.update();
    this.rotate();
  }

  _ring(shape, outer, width, color) {
    shape.graphics.beginFill(color)
      .arc(0, 0, outer, 0, Math.PI * 2)
      .arc(0, 0, outer - width, 0, Math.PI * 2, true)
      .endFill();
  }

  _initPort(port) {
    let shape = new createjs.Shape();
    shape.x = shape.y = this.radius * 1.5;
    port.stage.addChild(shape);
    return shape;
  }

  _spoke(shape, color) {
    shape.graphics
      .beginFill(color)
      .mt(100, 0);
    let isOut = false;
    for (let a = 0; a < 360; a += 5) {
      let unitX = Math.cos(a * Math.PI / 180);
      let unitY = Math.sin(a * Math.PI / 180);
      let a2 = a + 1.25;
      let unitX2 = Math.cos(a2 * Math.PI / 180);
      let unitY2 = Math.sin(a2 * Math.PI / 180);
      if (isOut) {
        shape.graphics.lt(unitX * this.radiusWithSpoke, unitY * this.radiusWithSpoke)
          .lt(unitX2 * this.radius, unitY2 * this.radius);
      } else {
        shape.graphics.lt(unitX * this.radius, unitY * this.radius)
          .lt(unitX2 * this.radiusWithSpoke, unitY2 * this.radiusWithSpoke);
      }
      isOut = !isOut;
    }
    shape.graphics.arc(0, 0, this.radius - 5, 0, Math.PI * 2, true)
    shape.graphics.endFill();
  }

  makeGear(baseShape, color, port) {
    baseShape.regX = baseShape.regY = this.radius * 1.5;
    let shape = this._initPort(port);

    this._ring(shape, this.radius, this.outerWidth, color);
    this._spoke(shape, color);

    port.stage.update();
  }

  _drawCanvas() {
    let c = document.createElement('canvas');
    c.width = c.height = this.radius * 3;
    let stage = new createjs.Stage(c);
    return {stage, c};
  }

  initCanvas() {
    this.topCanvas = this._drawCanvas();
    this.bottomCanvas = this._drawCanvas();
    this.mergedCanvas = this._drawCanvas();
  }

  /* ---------- properties ----------- */

  get radiusWithSpoke() {
    return this.radius + this.spokeSize;
  }

  rotate() {
    console.log('rotating');
    createjs.Ticker.addEventListener('tick', (event) => {
      // console.log('event: ', event);
      this.element.x = this.x;
      this.element.y = this.y;
      this.gear.rotation = createjs.Ticker.getTime() * this.anglesPerSecond / 1000;
      this.gear2.rotation = this.gear.rotation;
    });
  }

  get ani() {
    return this._ani;
  }

  set ani(value) {
    this._ani = value;
  }

  get rad() {
    return this._rad;
  }

  set rad(value) {
    this._rad = value;
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

  get spokeSize() {
    return this._spokeSize;
  }

  set spokeSize(value) {
    this._spokeSize = value;
  }
}