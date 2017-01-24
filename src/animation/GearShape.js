/* global createjs */

export const DIST_BETWEEN_SPOKES = 15;
const SPOKE_ANGLE_DEG = 20;
export const HEIGHT_OF_SPOKE = 8; // radial distance of spoke from edge of gear;
const RING_HEIGHT = 4;

const SPOKE_WIDTH = DIST_BETWEEN_SPOKES / 2; // size of spoke tangent to gear
const SPOKE_Y = -SPOKE_WIDTH / 2;
const SPOKE_ANGLE = SPOKE_ANGLE_DEG * Math.PI / 180;
const HEIGHT_INSET = (HEIGHT_OF_SPOKE / 2) * Math.sin(SPOKE_ANGLE);
const SPOKE_Y_TOP = SPOKE_Y + HEIGHT_INSET;

const circle = (shape, r, x, y, cc) => {
  shape.graphics.arc(x || 0, y || 0, r, 0, Math.PI * 2, !!cc);
  return shape;
};

export default class GearShape {
  /**
   *
   * @param gear {Gear}
   */
  constructor (gear, color) {
    this.gear = gear;
    this.color = color;
    this.init();
  }

  init () {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.gear.radius * 3;
    this.stage = new createjs.Stage(this.canvas);

    const OFFSET = this.gear.radius * 1.5;
    let gearShape = new createjs.Shape();
    gearShape.x = gearShape.y = OFFSET;
    gearShape.graphics.beginFill(this.rgb);
    circle(gearShape, this.gear.radius);
    // circle(gearShape, this.gear.radius - RING_HEIGHT, 0, 0, true);
    this.stage.addChild(gearShape);

    /**
     * a spokes
     */

    const HEIGHT = HEIGHT_OF_SPOKE * this.gear.ani.spokeScale;

    for (let s = 0; s < this.spokeCount; ++s) {
      let angle = s * 360 / this.spokeCount;
      let spokeShape = new createjs.Shape();
      spokeShape.x = spokeShape.y = OFFSET;
      spokeShape.graphics.f(this.rgb)
        .mt(this.gear.radius - RING_HEIGHT / 2, SPOKE_Y * this.gear.ani.spokeScale)
        .lt(this.gear.radius + HEIGHT, SPOKE_Y_TOP * this.gear.ani.spokeScale)
        .lt(this.gear.radius + HEIGHT, -SPOKE_Y_TOP * this.gear.ani.spokeScale)
        .lt(this.gear.radius - RING_HEIGHT / 2, -SPOKE_Y * this.gear.ani.spokeScale)
        .ef();
      spokeShape.rotation = angle;
      this.stage.addChild(spokeShape);
    }
    /*
     let startCircle = new createjs.Shape();
     startCircle.graphics.f('orange')
     .drawCircle(OFFSET + this.gear.radius, OFFSET, 3)
     .beginStroke('orange')
     .setStrokeStyle(5)
     .mt(OFFSET, OFFSET)
     .lt(OFFSET + this.gear.radius, OFFSET);
     this.stage.addChild(startCircle); */

    /*    let axis = new createjs.Shape();
     axis.x = OFFSET;
     axis.y = OFFSET;
     axis.graphics
     .beginStroke('red')
     .setStrokeStyle(4)
     .arc(0, 0, 60, 0, Math.PI / 2)
     .endStroke()
     .beginStroke('green')
     .setStrokeStyle(4)
     .arc(0, 0, 60, Math.PI / 2, Math.PI)
     .endStroke()
     .beginStroke('blue')
     .setStrokeStyle(4)
     .arc(0, 0, 60, Math.PI, Math.PI * 1.5)
     .endStroke()
     .beginStroke('yellow')
     .setStrokeStyle(4)
     .arc(0, 0, 60, Math.PI * 1.5, 2 * Math.PI)
     .endStroke();
     this.stage.addChild(axis); */

    this.stage.update();

    this.shape = new createjs.Bitmap(this.canvas);
    this.shape.regX = this.gear.radius * 1.5;
    this.shape.regY = this.gear.radius * 1.5;
  }

  /* ------------ properties -------------- */

  get spokeCount () {
    return this.gear.spokeCount;
  }

  _gear
  _shape
  _stage

  get gear () {
    return this._gear;
  }

  set gear (value) {
    this._gear = value;
  }

  get shape () {
    return this._shape;
  }

  set shape (value) {
    this._shape = value;
  }

  get stage () {
    return this._stage;
  }

  set stage (value) {
    this._stage = value;
  }

  get color () {
    return this._color;
  }

  set color (value) {
    this._color = value;
  }

  get rgb () {
    return this.color.toString();
  }
}
