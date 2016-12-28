import Point from 'point-geometry';
import Gear from './Gear';
import {HEIGHT_OF_SPOKE} from './GearShape';

import {Swatch} from './Swatch';

export default class Gears {
  constructor(store, id) {
    this.init(store, id);
  }

  initCanvas() {
    let element = $(`#${this.id}`);
    const canvasId = `${this.id}_canvas`;
    const bgCanvasId = `${this.id}_back`;

    element.append(`<canvas id="${bgCanvasId}" class="background" width="${this.width}" height="${this.height}"></canvas>
<canvas id="${canvasId}" class="background"  width="${this.width}" height="${this.height}"></canvas>`);
    const stage = new createjs.Stage(canvasId);
   // this.fps = new createjs.Text('FPS', '20px Arial', 'white');
    // this.fps.x = 50;
    // this.fps.y = 30;
    stage.addChild(this.fps);
    this.canvas = stage;

    this.background = new createjs.Stage(bgCanvasId);
  }

  init(store, id) {
    this.gearz = [];
    this.id = id;
    this.initCanvas();
    this.initBackground();

    store.subscribe(() => {
      console.log('container data = ', props.store.getState());
    });
  }

  initBackground() {
    this._swatches = [];
    console.log('setting background');
    let s = new createjs.Shape();
    s.graphics
      .beginFill('grey')
      .drawRect(0, 0, this.width, this.height);

    this.background.addChild(s);

     const last = 40;
     for (let i in _.range(0, last)){
     this._swatches.push(new Swatch(this, i, last));
     }

    this.background.update();

  }

  _canvas

  get canvas() {
    return this._canvas;
  }

  set canvas(value) {
    this._canvas = value;
  }

  play() {
    let letters = 'Wonderland'.split('');
    let targetWidth = this.width / (letters.length + 4);

    let gear = Gear.makeSentence(this, letters, targetWidth);

    gear.x = targetWidth;
    gear.y = this.height / 2;

    this.gearz.push(gear);
    let count = 0;
    setInterval(() => {
   //   let fps = count / 2;
    //  this.fps.text = `FPS: ${fps} frames per second`;
      count = 0;
    }, 2000);
    let handleTick = (event) => {
      this.canvas.update();
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