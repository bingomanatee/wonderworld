import _ from 'lodash';

const cc = (n) => _.clamp(n, 0, 255);

const _pointsToLine = (list) => {
  return _.reduce(list, (out, pt) => {
    out.push(pt.x);
    out.push(pt.y);
    return out;
  }, []);
};

let _id = 0;
export default class Triangle {
  constructor (points, ani) {
    this.id = ++_id;
    this.points = points;
    _.each(this.points, (point) => point.triangles.push(this));
    this._ani = ani;
    this._state = 'on';
    this.draw();
    this.indices = _(this.points)
      .map('index')
      .reduce((out, i) => {
        out[i] = true;
        return out;
      }, {});

    if (Math.random() < 0.05) {
      this.startTint();
    }
  }

  get state () {
    return this._state;
  }

  get center () {
    return _.reduce(this.points, (out, pt) => {
      if (!out) {
        return pt;
      }
      return out.add(pt);
    }, false).div(3);
  }

  set state (value) {
    this._state = value;
    /* if (value !== 'on'){
     this.ani.snap.circle(this.center.x, this.center.y, 2)
     .attr({
     fill: 'black'
     });
     } */
  }

  startTint () {
    let tint = {
      r: _.random(-20, 50),
      g: _.random(-20, 50),
      b: _.random(-20, 50)
    };

    this.tint(tint);
  }

  tint (tint) {
    if (!this.tinted) {
      this.color.r += tint.r;
      this.color.g += tint.g;
      this.color.b += tint.b;
      this.colorElement();
      this.tinted = true;
    }

    setTimeout(() => {
      let nextTriangle = _(this.neighbors(false))
        .filter((t) => t.state === 'on')
        .shuffle()
        .pop();
      if (nextTriangle) {
        nextTriangle.tint(tint);
      }
    }, 5);
  }

  setColor () {
    let ys = _(this.points).map('y').sortBy().uniq().value();
    let top = _.max(ys);
    let bottom = _.min(ys);
    let range = top - bottom;
    let average = _.sum(_.map(ys, (y) => y - bottom)) / ys.length;
    let balance = average / (2 * range);
    balance = _.clamp(Math.pow(balance, 1 / 4), 0.3, 0.6);
    balance += _.random(-5, 6) / 100;
    let color = 255 * balance;
    let loColor = Math.floor(color * 0.8);
    this.color = {
      r: loColor / 2,
      g: loColor,
      b: color
    };
  }

  get color () {
    return this._color;
  }

  set color (value) {
    this._color = value;
  }

  get colorRGB () {
    return `rgb(${cc(this._color.r)},${cc(this._color.g)},${cc(this._color.b)})`;
  }

  draw () {
    let line = _pointsToLine(this.points);

    this.setColor();
    this.element = this.ani.snap.polyline(line);
    this.colorElement();
  }

  colorElement () {
    this.element.attr({
      fill: this.colorRGB,
      stroke: this.colorRGB
    });
  }

  get element () {
    return this._et;
  }

  set element (value) {
    this._et = value;
  }

  get points () {
    return this._t;
  }

  set points (value) {
    this._t = value;
  }

  get ani () {
    return this._ani;
  }

  set ani (value) {
    this._ani = value;
  }

  neighbors (includeThis, all) {
    return _(this.points)
      .map((point) => point.triangles)
      .flatten()
      .uniqBy('id')
      .filter((other) => includeThis || (other.id !== this.id) && (all || this.near(other)))
      .value();
  }

  near (other) {
    let sharedPoints = 0;
    for (let prop in this.indices) {
      if (other.indices[prop]) {
        ++sharedPoints;
        if (sharedPoints > 1) {
          return true;
        }
      }
    }
    return false;
  }

  hasActiveNeighbors () {
    return _(this.neighbors())
      .filter((other) => other._state === 'on')
      .value().length;
  }

  destroy () {
    this.element.remove();
    _.each(this.points, (point) => {
      point.removeTriangle(this);
    });
    this.ani.triangles = _.reject(this.ani.triangles, (other) => other.id === this.id);
  }
}
