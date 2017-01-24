import Point from 'point-geometry';
import Gear from './Gear';
import PageBackground from './PageBackground';
import _ from 'lodash';
/* global $, createjs */
export default class Gears {
  constructor (store, id) {
    this.init(store, id);
    this.initCanvas();
    $(window).resize(_.debounce(() => {
      this.initCanvas();
    }, 500));
  }

  initCanvas () {
    this.canvasElement = $(`#${this.id}`);
    this.canvasElement.empty();
    const canvasId = `${this.id}_canvas`;
    this.canvasElement.append(`
<div id="background_canvases">
<canvas id="${this.bgCanvasId}" class="background" width="${this.width}" height="${this.height}"></canvas>
<canvas id="${this.bgCanvasIdCrawl}" class="background" width="${this.width}" height="${this.height}"></canvas>
<canvas id="${this.bgCanvasId2}" class="background" width="${this.width}" height="${this.height}"></canvas>
<canvas id="${canvasId}" class="background"  width="${this.width}" height="${this.height}"></canvas>
</div>
<div id="ani-letters"></div>
`);
    this.canvas = new createjs.Stage(canvasId);
    if (this.background) {
      this.background.destroy();
    }
    this.background = new PageBackground(this, this.bgCanvasId, this.bgCanvasIdCrawl, this.bgCanvasId2);

    let letters = 'Wonderland Labs'.split('');
    let targetWidth = Math.min(180, this.width / ((letters.length + 4)));

    let gear = Gear.makeSentence(this, letters, targetWidth);
    gear.x = targetWidth;
    gear.y = 50;

    this.gearz.push(gear);
  }

  _canvasElement

  get canvasElement () {
    return this._canvasElement;
  }

  set canvasElement (value) {
    this._canvasElement = value;
  }

  init (store, id) {
    this.gearz = [];
    this.id = id;
    store.subscribe(() => {
      console.log('container data = ', store.getState());
    });

    let handleTick = (event) => {
      if (this.canvas) {
        this.canvas.update();
      }
      if (this.background) {
        this.background.update(event);
      }
    };
    createjs.Ticker.framerate = 60;
    createjs.Ticker.addEventListener('tick', handleTick);
  }

  get bgCanvasId () {
    return `${this.id}_back`;
  }

  get bgCanvasIdCrawl () {
    return `${this.id}_back_crawl`;
  }

  get bgCanvasId2 () {
    return `${this.id}_back_2`;
  }

  _canvas

  get canvas () {
    return this._canvas;
  }

  set canvas (value) {
    this._canvas = value;
  }

  get gearz () {
    return this._gearz;
  }

  set gearz (value) {
    this._gearz = value;
  }

  get width () {
    return window.innerWidth;
  }

  get height () {
    return window.innerHeight;
  }

  get center () {
    return new Point(this.width, this.height).div(2);
  }

  get spokeScale () {
    if (this.width < 1200) {
      return 0.5;
    } else {
      return 1;
    }
  }
}
