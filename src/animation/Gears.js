const W = require('./points.json');
import _ from 'lodash';
import Point from 'point-geometry';
import Gear from './Gear';
import {HEIGHT_OF_SPOKE} from './GearShape';

export default class Ani {
  constructor(store, id) {
    this.init(store, id);
  }

  initCanvas() {
    let element = $(`#${this.id}`);
    const canvasId = `${this.id}_canvas`;
    element.append(`<canvas id="${canvasId}" width="${this.width}" height="${this.height}"></canvas>`);
    const stage = new createjs.Stage(canvasId);
    let back = new createjs.Shape();
    back.graphics.beginFill('red').dr(0, 0, this.width, this.height);
    stage.addChild(back);
    this.fps = new createjs.Text('FPS', '20px Arial', 'white');
    stage.addChild(this.fps);
    this.fps.x = 50;
    this.fps.y = 30;
    this.canvas = stage;
  }

  init(store, id) {
    this.gearz = [];
    this.id = id;
    this.initCanvas();

    store.subscribe(() => {
      console.log('container data = ', props.store.getState());
    });
  }

  _canvas

  get canvas() {
    return this._canvas;
  }

  set canvas(value) {
    this._canvas = value;
  }

  play() {
    let gear = new Gear(this, this.width/2, this.height/2, 150)
    let otherGear = gear.addGear(75, 45);
    this.gearz.push(gear);
    let count = 0;
    setInterval(() => {
      let fps = count / 2;
      this.fps.text = `FPS: ${fps} frames per second`;
      count = 0;
    }, 2000);
    let handleTick = (event) => {
      let x = this.canvas.mouseX;
      let y = this.canvas.mouseY;
      let point = new Point(x, y);
      let relPoint = point.sub(gear);
      let desiredDistance = gear.radius + otherGear.radius + HEIGHT_OF_SPOKE;
      let desiredRelPoint = relPoint.mult(desiredDistance/relPoint.mag());
      otherGear.x = desiredRelPoint.x;
      otherGear.y = desiredRelPoint.y;
      this.canvas.update();
      ++count;
    }
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener("tick", handleTick);
  }

  get gearz() {
    return this._gearz;
  }

  set gearz(value) {
    this._gearz = value;
  }

  get width() {
    return window.innerWidth;
  }

  get height() {
    return window.innerHeight;
  }

  get center() {
    return new Point(this.width, this.height).div(2);
  }

}