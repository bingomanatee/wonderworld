import Color from 'color';
import _ from 'lodash';

let swatchBasis = _.map([
  Color.rgb(0, 0, 0),
  Color.rgb(0, 0, 0),
  Color.rgb(90, 156, 221), // sky blue
  Color.rgb(181, 199, 206), // cloud
  Color.rgb(96, 118, 133), // mountain mist
  Color.rgb(124, 122, 76),
  Color.rgb(22, 31, 26),
  Color.rgb(190, 184, 84),
  Color.rgb(106, 76, 56),
  Color.rgb(49, 64, 7),
  Color.rgb(67, 80, 17),
  Color.rgb(90, 79, 23),
  Color.rgb(39, 25, 24),
  Color.rgb(255, 255, 255)
], (c) => c.saturate(2));

console.log(swatchBasis);

const COUNT = 4;

export const SWATCH_HEIGHT = 80;
const INCREMENT = 10;

function _randomYs (count) {
  let seed = _.map([0, 0], () => _.random(-SWATCH_HEIGHT, SWATCH_HEIGHT));

  while (seed.length < count) {
    seed = _(seed)
      .reduce((out, value) => {
        if (!out) {
          return [value];
        }
        let last = _.last(out);
        let mag = Math.max(Math.abs(value - last), 10);
        let mid = _.mean([value, last]);
        out.push(mid + _.random(-mag, mag));
        out.push(value);
        return out;
      }, false)
      .reduce((out, value) => {
        if (!out) {
          return [value];
        }
        let last = _.last(out);
        out.push(last, _.mean([last, value]));
        return out;
      }, false);
  }

  return seed;
}

export class Swatch {

  constructor (ani, index, range) {
    let si = Math.floor(swatchBasis.length * index / range);
    let baseColor = swatchBasis[_.clamp(si, 0, swatchBasis.length)];
    let mixColor = _.shuffle(swatchBasis).pop();
    this.color = baseColor.mix(mixColor, 0.75);

    this.ani = ani;
    this.index = index;
    this.range = range;

    this.initElement();
  }

  /**
   *
   * @returns {Gears}
   */
  get ani () {
    return this._ani;
  }

  /**
   *
   * @param value {Gears}
   */
  set ani (value) {
    this._ani = value;
  }

  get index () {
    return this._index;
  }

  set index (value) {
    this._index = value;
  }

  get range () {
    return this._range;
  }

  set range (value) {
    this._range = value;
  }

  initElement () {
    this.element = new createjs.Container();
    this.ani.background.addChild(this.element);
    this.element.y = this.ani.height * (this.index - 2) / this.range;

    _.each(_.range(0, COUNT), () => {
      this.addShape();
    });
  }

  addShape () {
    let s = new createjs.Shape();
    s.alpha = 0.5 / COUNT;
    s.x = 0;
    s.y = _.random(-20, 20);
    s.graphics.beginFill(this.color);
    s.graphics.mt(this.ani.width, this.ani.height)
      .lt(0, this.ani.height);

    let ys = _randomYs(this.ani.width / INCREMENT);
    let width = this.ani.width;
    s.graphics
      .lt(0, ys[0]);

    _.each(ys, (y, index) => {
      s.graphics.lt(width * index / (ys.length - 1), y);
    });

    this.element.addChild(s);
  }
}
