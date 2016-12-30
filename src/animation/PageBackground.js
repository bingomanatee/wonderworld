import Point from 'point-geometry';
import HexFrame from './HexFrame';
import _ from 'lodash';

const SIZE_PER_TILE = 20;
const SHADOW_SCALE = 0.015;
const CRAWLER_COLORS = [
  'hsl(180,40%,40%)',
  'hsl(190,40%,40%)',
  'hsl(200,40%,40%)',
  'hsl(210,40%,40%)',
  'hsl(220,40%,40%)'
];
const GREENS = _.map(_.range(0, 255), (green) => `hsl(200,${_.random(35, 45)}%, ${Math.min(100, green / 2)}%)`);
const MAX_TAILS = 20;
const MAX_LIFE = 40;
const MAX_CRAWLERS = 12;
function hexShape(hexData, color) {
  let shape = new createjs.Shape();
  let hex = hexData.points;
  shape.graphics.beginFill(color)
    .moveTo(hex[5].x, hex[5].y);
  _.each(hex, (p) => shape.graphics.lineTo(p.x, p.y))
  shape.graphics.endFill();
  return shape;
}

let _cid = 0;
class Crawler {
  constructor(background) {
    this.id = ++_cid;
    this._background = background;
    this._hexData = _(this.background.hexGrid.hexesIndex)
      .values()
      .shuffle()
      .slice(0, 5)
      .reduce((out, hex) => {
        if (out && (out.center.y < hex.center.y)) {
          return out;
        }
        return hex;
      }, false);

    this.updates = 0;
    this.color = _(CRAWLER_COLORS).shuffle().pop();
    let shape = hexShape(this._hexData, this.color);
    this.background.crawlStage.addChild(shape);
    this.tail.push(shape);
  }

  animate() {
      ++this.updates;

      if (this.updates < MAX_LIFE) {
        // this.background.crawlStage.removeChild(this._shape);
        let neighbors = this.background.hexGrid.neighbors(this._hexData.hX, this._hexData.hY);
        this._hexData = _(neighbors)
          .shuffle()
          .slice(0, 2)
          .reduce((out, hex) => {
            if (!out) {
              return hex;
            }
            if (out.center.y > hex.center.y) {
              return out;
            }
            return hex;
          }, false);

        let shape = hexShape(this._hexData, this.color);
        this.background.crawlStage.addChild(shape);
        this.tail.push(shape);
      } else {
        this.tail.push(false);
      }
      this.recolorTail();
      if (this.updates > MAX_LIFE + MAX_TAILS) {
        this.destroy();
      }
  }

  recolorTail() {
    while (this.tail.length > MAX_TAILS) {
      let deadTail = this.tail.splice(0, 1);
      for (let item of deadTail) {
        if (item) this.background.crawlStage.removeChild(item);
      }
    }
    let reversed = this.tail.slice(0).reverse();
    _.each(reversed, (item, index) => {
      if (item) item.alpha = ((MAX_TAILS - index) / (MAX_TAILS + 1))  * 0.5;
    });
  }

  /* --------------------- properties -------------------------------- */

  _tail

  get tail() {
    if (!this._tail) this._tail = [];
    return this._tail;
  }

  get hexData() {
    return this._hexData;
  }

  set hexData(value) {
    this._hexData = value;
  }
  get shape() {
    return this._shape;
  }

  set shape(value) {
    this._shape = value;
  }

  get background() {
    return this._background;
  }

  set background(value) {
    this._background = value;
  }

  destroy() {
    clearInterval(this._update);
    this.background.removeCrawler(this);
  }
}

export default class PageBackground {
  constructor(ani, pageBackgroundId, crawlBackgroundId, hilightBackgroundId) {
    this.ani = ani;
    this.pageBackgroundId = pageBackgroundId;
    this.hlPageBackgroundId = hilightBackgroundId;
    this.crawlBackgroundId = crawlBackgroundId;

    this.initCanvas();
    this.initHexGrid();
    this.draw();
    this.initCrawlers();
    this.lastTime = createjs.Ticker.getTime();
  }

  initHexGrid() {
    this.hexGrid = new HexFrame(this, SIZE_PER_TILE * Math.sqrt(this.ani.spokeScale));
  }

  draw() {
    let hexes = this.hexGrid.hexes();
    const BLOOM = 10;
    let MIN_GREEN = 30;
    let MAX_GREEN = 35;
    for (let hex of hexes) {
      hex.green = _.random(MIN_GREEN, MAX_GREEN);
    }
    for (let hex of hexes) {
      let neighbors = this.hexGrid.neighbors(hex.hX, hex.hY);
      if (Math.random() > 0.975) {
        let add = Math.random() > 0.5 ? BLOOM : -0.75 * BLOOM;
        hex.green += add;
        hex.green = _.clamp(hex.green, 0, 255);
        _.each(neighbors, (neighbor) => {
            if (neighbor) {
              neighbor.green += add;
              neighbor.green = _.clamp(neighbor.green, 0, 255);
            }
          }
        );
      }
    }

    /** stroke - to fill in irregularities */
    for (let hexData of hexes) {
      let shape = new createjs.Shape();
      let hex = hexData.points;

      shape.graphics.beginStroke(this.green(hexData.green))
        .setStrokeStyle(4)
        .moveTo(hex[5].x, hex[5].y);
      _.each(hex, (p) => shape.graphics.lineTo(p.x, p.y));
      this.stage.addChild(shape);
    }

    let scaleCenter = this.center.mult(0.75);

    const _scaleShadowPoint = (point) => {
      return scaleCenter.mult(SHADOW_SCALE).add(point.mult(1 - SHADOW_SCALE));
    }
    /** fill (dark back) */
    for (let hexData of hexes) {
      if (hexData.green <= MAX_GREEN) {
        let shape = new createjs.Shape();
        let hex = hexData.points;

        shape.graphics.beginFill(this.green(hexData.green))
          .moveTo(hex[5].x, hex[5].y);
        _.each(hex, (p) => shape.graphics.lineTo(p.x, p.y))
        shape.graphics.endFill();

        this.stage.addChild(shape);
      }
    }

    /** shadow */
    for (let hexData of hexes) {
      if (hexData.green > MAX_GREEN) {
        let shape = new createjs.Shape();
        let hex = hexData.points;

        let last = _scaleShadowPoint(hex[5]);

        shape.graphics.beginFill(`rgba(0,0,0,${0.125 * this.ani.spokeScale})`)
          .moveTo(last.x, last.y);
        _.each(hex, (p) => {
          let pShadow = _scaleShadowPoint(p);
          shape.graphics.lineTo(pShadow.x, pShadow.y);
        });
        shape.graphics.endFill();

        this.hlStage.addChild(shape);
        this.hlStage.update();
      }
    }

    /** fill - light */
    for (let hexData of hexes) {
      if (hexData.green > MAX_GREEN) {
        let color = this.green(hexData.green);
        let shape = hexShape(hexData, color);
        let hex = hexData.points;

        /** bevel */
        shape.graphics.beginLinearGradientFill(
          [
            // 'rgba(0,204,204,0.125)',
            'rgba(0,0,0,0)', 'rgba(102,102,0,0.125)'],
          [
            //0.25,
            0.33, 1],
          hexData.center.x, hexData.center.y - 1.25 * SIZE_PER_TILE,
          hexData.center.x, hexData.center.y + SIZE_PER_TILE / 2
        )
          .moveTo(hex[5].x, hex[5].y);
        _.each(hex, (p) => shape.graphics.lineTo(p.x, p.y))
        shape.graphics.endFill();

        this.hlStage.addChild(shape);
      }
    }
    this.stage.update();
    this.crawlStage.update();
    this.hlStage.update();
  }

  initCrawlers() {
    this._crawlerInterval = setInterval(() => {
      if (this.crawlers.length < MAX_CRAWLERS) {
        this.crawlers.push(new Crawler(this));
      }
    }, 400);
  }

  destroy() {
    for (let crawler of this.crawlers) {
      crawler.destroy();
    }
    clearInterval(this._crawlerInterval);
  }

  removeCrawler(deadCrawler) {
    this.crawlers = _.reject(this.crawlers, (crawler) => crawler.id === deadCrawler.id);
  }

  /* ----------- properties ------------------ */

  _crawlers

  get crawlers() {
    if (!this._crawlers) {
      this._crawlers = [];
    }
    return this._crawlers;
  }

  set crawlers(value) {
    this._crawlers = value;
  }

  update(event) {
    this.crawlStage.update(event);
    let time = createjs.Ticker.getTime();
    if (time - this.lastTime > 100) {
     for (let crawler of this.crawlers) {
       crawler.animate();
     }
     this.lastTime = time;
    }
  }

  get crawlBackgroundId() {
    return this._crawlBackgroundId;
  }

  set crawlBackgroundId(value) {
    this._crawlBackgroundId = value;
  }

  get ani() {
    return this._ani;
  }

  set ani(value) {
    this._ani = value;
  }

  green(n) {
    n = _.clamp(Math.floor(n));
    return GREENS[n];
  }

  initCanvas() {
    this.stage = new createjs.Stage(this.pageBackgroundId);
    this.crawlStage = new createjs.Stage(this.crawlBackgroundId);
    this.hlStage = new createjs.Stage(this.hlPageBackgroundId);
  }

  _crawlStage

  get crawlStage() {
    return this._crawlStage;
  }

  set crawlStage(value) {
    this._crawlStage = value;
  }

  _stage
  get stage() {
    return this._stage;
  }

  set stage(value) {
    this._stage = value;
  }

  _hlPageBackgroundId

  get hlPageBackgroundId() {
    return this._hlPageBackgroundId;
  }

  set hlPageBackgroundId(value) {
    this._hlPageBackgroundId = value;
  }

  get pageBackgroundId() {
    return this._pageBackgroundId;
  }

  set pageBackgroundId(value) {
    this._pageBackgroundId = value;
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