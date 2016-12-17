export const DIST_BETWEEN_SPOKES = 10;

const SPOKE_WIDTH = DIST_BETWEEN_SPOKES / 2; // size of spoke tangent to gear
const SPOKE_Y = -SPOKE_WIDTH / 2;
export const HEIGHT_OF_SPOKE = 8; // radial distance of spoke from edge of gear;
const SPOKE_ANGLE_DEG = 40;
const SPOKE_ANGLE = SPOKE_ANGLE_DEG * Math.PI / 180;
const HEIGHT_INSET = (HEIGHT_OF_SPOKE / 2) * Math.sin(SPOKE_ANGLE);
const SPOKE_Y_TOP = SPOKE_Y + HEIGHT_INSET;
const RING_HEIGHT = 3;

const circle = (shape, r, x, y, cc) => {
  shape.graphics.arc(x || 0, y || 0, r, 0, Math.PI * 2, !!cc);
  return shape;
}

export default class GearShape {
  /**
   *
   * @param gear {Gear}
   */
  constructor(gear, color) {
    this.gear = gear;
    this.color = color;
    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.canvas.height = this.gear.radius * 3;
    this.stage = new createjs.Stage(this.canvas);

    const OFFSET = this.gear.radius * 1.5;
    let gearShape = new createjs.Shape();
    gearShape.x = gearShape.y = OFFSET;
    gearShape.graphics.beginFill(this.rgb);
    circle(gearShape, this.gear.radius)
    circle(gearShape, this.gear.radius - RING_HEIGHT, 0, 0, true);
    this.stage.addChild(gearShape);

    /**
     * a spokes
     */

    for (let s = 0; s < this.spokeCount; ++s) {
      let angle = s * 360 / this.spokeCount;
      let spokeShape = new createjs.Shape();
      spokeShape.x = spokeShape.y = OFFSET;
      spokeShape.graphics.f(this.rgb)
        .mt(this.gear.radius - RING_HEIGHT * 1.125, SPOKE_Y)
        .lt(this.gear.radius + HEIGHT_OF_SPOKE, SPOKE_Y_TOP)
        .lt(this.gear.radius + HEIGHT_OF_SPOKE, -SPOKE_Y_TOP)
        .lt(this.gear.radius - RING_HEIGHT * 1.125, -SPOKE_Y)
        .ef();
      spokeShape.rotation = angle;
      this.stage.addChild(spokeShape);
    }

    this.stage.update();

    this.shape = new createjs.Bitmap(this.canvas);
    this.shape.regX = this.gear.radius * 1.5;
    this.shape.regY = this.gear.radius * 1.5;
  }

  /* ------------ properties -------------- */

  get spokeCount() {
    return this.gear.spokeCount;
  }

  _gear
  _shape
  _stage

  get gear() {
    return this._gear;
  }

  set gear(value) {
    this._gear = value;
  }

  get shape() {
    return this._shape;
  }

  set shape(value) {
    this._shape = value;
  }

  get stage() {
    return this._stage;
  }

  set stage(value) {
    this._stage = value;
  }

  get color() {
    return this._color;
  }

  set color(value) {
    this._color = value;
  }

  get rgb() {
    return this.color.toString();
  }
}