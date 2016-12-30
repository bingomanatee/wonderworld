import Point from 'point-geometry';
import HexFrame from './HexFrame';

const SIZE_PER_TILE = 20;

const GREENS = _.map(_.range(0, 255), (green) => `hsl(200, 80%, ${Math.min(100, green/5)}%)`);

export default class PageBackground {
  constructor(pageBackgroundId) {
    this.pageBackgroundId = pageBackgroundId;

    this.initCanvas();
    this.initHexGrid();
    //  this.topFocus =  new PointFocus(this.width/2, -(Math.max(this.width, this.height));

    this.draw();
  }

  initHexGrid() {
    this.hexGrid = new HexFrame(this, SIZE_PER_TILE);
  }

  green(n) {
    n = _.clamp(Math.floor(n));
    return GREENS[n];
  }

  draw() {
    let hexes = this.hexGrid.hexes();
    const BLOOM = 20;
    let MAX_GREEN = 50;
    for (let hex of hexes) {
      hex.green = _.random(25, MAX_GREEN);
    }
    for (let hex of hexes) {
      let neighbors = this.hexGrid.neighbors(hex.hX, hex.hY);
      if (Math.random() > 0.975) {
        let add = Math.random() > 0.5 ? BLOOM : -BLOOM;
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

      shape.graphics.beginStroke(`rgb(0,${hexData.green},${Math.floor(hexData.green / 2)})`)
        .setStrokeStyle(2)
        .moveTo(hex[5].x, hex[5].y);
      _.each(hex, (p) => shape.graphics.lineTo(p.x, p.y));
      this.stage.addChild(shape);
    }

    const SHADOW_SCALE = 0.025;

    const _scaleShadowPoint = (point) => {
      return this.center.mult(SHADOW_SCALE).add(point.mult(1 - SHADOW_SCALE));
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

        shape.graphics.beginFill('rgba(0,0,0,0.5)')
          .moveTo(last.x, last.y);
        _.each(hex, (p) => {
          let pShadow = _scaleShadowPoint(p);
          shape.graphics.lineTo(pShadow.x, pShadow.y);
        });
        shape.graphics.endFill();

        this.stage.addChild(shape);
      }
    }

    /** fill - light */
    for (let hexData of hexes) {
      if (hexData.green > MAX_GREEN) {
        let shape = new createjs.Shape();
        let hex = hexData.points;

        shape.graphics.beginFill(this.green(hexData.green))
          .moveTo(hex[5].x, hex[5].y);
        _.each(hex, (p) => shape.graphics.lineTo(p.x, p.y))
        shape.graphics.endFill();

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

        this.stage.addChild(shape);
      }
    }
    this.stage.update();
  }

  initCanvas() {
    this.stage = new createjs.Stage(this.pageBackgroundId);
  }

  get pageBackgroundId() {
    return this._pageBackgroundId;
  }

  set pageBackgroundId(value) {
    this._pageBackgroundId = value;
  }

  _stage
  get stage() {
    return this._stage;
  }

  set stage(value) {
    this._stage = value;
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