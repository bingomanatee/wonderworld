import Point from 'point-geometry';
import HexFrame from './HexFrame';

const SIZE_PER_TILE = 50;

export default class PageBackground {
  constructor(pageBackgroundId) {
    this.pageBackgroundId = pageBackgroundId;

    this.initCanvas();
    this.initHexGrid();
    //  this.topFocus =  new PointFocus(this.width/2, -(Math.max(this.width, this.height));

    this.draw();
  }

  initHexGrid() {
    this.hexGrid = new HexFrame(SIZE_PER_TILE);
  }

  draw() {
    for (let x = -10; x < 10; x += 1) {
      for (let z = -10; z < 10; z+= 1) {
        let y = -(z + x);
        let shape = new createjs.Shape();
        let center = this.hexGrid.hexToPoint(x, y, z);
        shape.graphics.beginFill('yellow').drawCircle(center.x, center.y, 10);

        let hex =  this.hexGrid.hexPoints(x, y, z);

        shape.graphics.beginFill(`rgba(0,0,0,${Math.random()})`)
          .moveTo(hex[5].x, hex[5].y);
        _.each(hex, (p) => shape.graphics.lineTo(p.x, p.y));

        this.stage.addChild(shape);
        let text = new createjs.Text(`${x},${y}, ${z}`, '20px Arial');
        text.textAlign='left';
        text.x = center.x;
        text.y = center.y;
        this.stage.addChild(text);
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