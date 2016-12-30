import Point from 'point-geometry';
import Gear from './Gear';
import PageBackground from './PageBackground';

export default class Gears {
  constructor(store, id) {
    this.init(store, id);
  }

  initCanvas() {
    this.canvasElement = $(`#${this.id}`);
    const canvasId = `${this.id}_canvas`;
    this.canvasElement.append(`<canvas id="${this.bgCanvasId}" class="background" width="${this.width}" height="${this.height}"></canvas>
<canvas id="${canvasId}" class="background"  width="${this.width}" height="${this.height}"></canvas><div id="ani-letters"></div>`);
    this.canvas = new createjs.Stage(canvasId);
  }

  _canvasElement

  get canvasElement() {
    return this._canvasElement;
  }

  set canvasElement(value) {
    this._canvasElement = value;
  }

  init(store, id) {
    this.gearz = [];
    this.id = id;
    this.initCanvas();

    store.subscribe(() => {
      console.log('container data = ', props.store.getState());
    });

    this.background = new PageBackground(this.bgCanvasId);
  }

  get bgCanvasId() {
    return `${this.id}_back`;
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
    for (let i in _.range(0, last)) {
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
    let letters = 'Wonderland Labs'.split('');
    let targetWidth = this.width / ((letters.length + 4));

    let gear = Gear.makeSentence(this, letters, targetWidth);

    gear.x = targetWidth;
    gear.y = targetWidth * 1.5;

    let gears = gear.getAllGears();
    console.log('gears:', gears);

    let minY = _(gears)
      .map((gear) =>  gear.parentJoint ? gear.parentJoint.localToGlobal(0,0).y: 1000)
      .compact()
      .min();
    console.log('min y:', minY);

    let maxX = _(gears)
      .map((gear) =>  gear.parentJoint ? gear.parentJoint.localToGlobal(0,0).x: 1000)
      .compact()
      .max();

    if(minY < targetWidth/2) {
      let gap = targetWidth - minY;
      gear.y = gap;
    }

    this.gearz.push(gear);
    let count = 0;
    setInterval(() => {
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

  get spokeScale() {
    if (this.width < 1200) {
      return 0.5;
    } else {
      return 1;
    }
  }
}