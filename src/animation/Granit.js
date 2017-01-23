const W = require('./points.json');
import { CdtPrepare } from 'animation/CdtPrepare';
import Point from 'point-geometry';
import _ from 'lodash';

import Triangle from 'animation/Triangle';

export default class Ani {
  constructor (store, id) {
    this.init(store, id);
  }

  init (store, id) {
    this.id = id;
    this.snap = Snap(id);
    this.initW();

    store.subscribe(() => {
      console.log('container data = ', props.store.getState());
    });
  }

  reset () {
    this.snap.clear();
    this.triangles = [];
  }

  remove (triangle) {
    let index = _.findIndex(this.triangles, (o) => o.id === triangle.id);
    if (index >= 0) {
      this.triangles.splice(index, 1);
    } else {
      console.log('cannot find triangle ', triangle.id);
    }
  }

  get triangles () {
    return this._triangles;
  }

  set triangles (t) {
    this._triangles = t;
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

  burnout () {
    this.reset();
    let Wpoly = this.snap.polyline(this.wPolyPointsList)
      .attr({
        fill: 'white'
      });

    this.snap.circle(this.center.x, this.center.y, 3).attr({ fill: 'black' });

    let prep = new CdtPrepare(this.wPolyPoints.reverse(), new Point(0, 0), new Point(this.width, this.height));
    let triangles = prep.triangles(60, 3);

    console.log('triangles', triangles);

    for (let t of triangles) {
      this.triangles.push(new Triangle(t, this));
    }

    setTimeout(() => {
      this.fadeGroup();
      this.fadeGroup();
    }, 2000);
  }

  fadeGroup () {
    let triangle;
    let triangles;
    let center = this.center;
    if (!_.filter(this.triangles, (t) => t.state === 'on').length) {
      return;
    }
    if (this.triangles.length < 100) {
      triangles = _.filter(this.triangles, (t) => t.state === 'on');
    } else {
      triangle = _(this.triangles)
        .filter((t) => t.state === 'on')
        .shuffle()
        .slice(0, 3)
        .reduce((out, pt) => {
          if ((!out) || (out.center.dist(center) < pt.center.dist(center))) {
            return pt;
          }
          return out;
        }, null);

      if (!triangle) {
        console.log('did not find a triangle that is on');
      } else {
        triangles = _(triangle.neighbors(true))
          .map((triangle) => triangle.neighbors(true))
          .flatten()
          .map((triangle) => triangle.neighbors(true))
          .flatten()
          .filter((triangle) => triangle.state === 'on')
          .uniqBy('id')
          .value();
      }
    }

    if (triangles.length < 3) {
      triangles = _(this.triangles)
        .filter((t) => t.state === 'on')
        .value()
        .slice(0, 8);
    }

    if (triangles.length) {
      _.each(triangles, (triangle) => {
        triangle.state = 'faded';
      });
      let group = this.snap.g.apply(this.snap, _.map(triangles, 'element'));
      let center = this.center;
      let scale = _.random(125, 600) / 100;
      let rotate = _.random(-50, 50);
      let matrix = new Snap.Matrix()
        .rotate(rotate, center.x, center.y)
        .scale(scale, scale, center.x, center.y / -2);

      group.animate({
        transform: matrix,
        opacity: 0.75
      }, _.random(400, 1500),
        window.mina.easein, () => {
          group.animate({ opacity: 0 }, _.random(800, 1500), window.mina.easein, () => {
            group.remove();
            _.each(triangles, (triangle) => triangle.destroy());
          });
        });
    }

    if (this.triangles.length) {
      setTimeout(() => this.fadeGroup(), _.range(100, 400));
    }
  }

  fadeOrphans () {
    let orphans = _(this.triangles)
      .map((triangle) => triangle.neighbors())
      .flatten()
      .reject((triangle) => (triangle.state !== 'on') || triangle.hasActiveNeighbors())
      .value();
    if (orphans.length) {
      setTimeout(() => this.fadeGroup(orphans));
    }
  }

  _red1 () {
    let trianglesCopy = (this.triangles);

    this.groups = [];
    let center = this.center;
    let radius = Math.max(this.width, this.height) / 2;
    console.log('center:', center, 'radius:', radius);
    while (trianglesCopy.length) {
      let clumpSize = _.random(2, 10);
      let clump = trianglesCopy.splice(0, clumpSize);
      let sprites = _.map(clump, 'element');
      let group = this.snap.g.apply(this.snap, sprites);
      let matrix = new Snap.Matrix();
      let randDegree = _.random(-45, 45);
      matrix.rotate(randDegree, center.x, center.y);

      let triangle = clump[0];
      let samplePoint = triangle.points[Math.floor(triangle.points.length / 2)];
      let distanceFromCenter = Math.round(center.dist(samplePoint));
      let ratio = Math.max(0.25, distanceFromCenter / radius);
      ratio *= ratio;
      //  console.log('sample point: ', samplePoint, 'ratio:', Math.round(ratio * 100), 'distance: ', distanceFromCenter);
      let minExtreme = Math.ceil(100 / ratio);
      let maxExtreme = 2 * minExtreme;

      // console.log('extremes', minExtreme, maxExtreme);

      setTimeout(() => {
        group.animate({ transform: matrix }, _.random(250, 1000),
          window.mina.easeout,
          () => {
            group.animate({ opacity: 0 }, _.random(100, 500));
          }
        );
      }, _.random(minExtreme, maxExtreme));
      this.groups.push(group);
    }
  }

  get groups () {
    return this._groups;
  }

  set groups (g) {
    this._groups = g;
  }

  get wPolyPoints () {
    let offset = this.center.sub(this.range.mid);
    let out = [];
    for (let p of this.wPoints) {
      let offP = p.add(offset);
      out.push(offP);
    }
    return out;
  }

  get wPolyPointsList () {
    let offset = this.center.sub(this.range.mid);
    let out = [];
    for (let p of this.wPolyPoints) {
      out.push(p.x);
      out.push(p.y);
    }
    return out;
  }

  initW () {
    let values = W.points.slice();
    this.wPoints = [];
    while (values.length) {
      let x = values.shift();
      let y = values.shift();
      this.wPoints.push(new Point(x, y));
    }

    this.range = _.reduce(this.wPoints, (extent, pt) => {
      if (!extent) {
        return {
          min: pt.clone(),
          max: pt.clone()
        };
      } else {
        if (pt.x < extent.min.x) {
          extent.min.x = pt.x;
        } else if (pt.x > extent.max.x) {
          extent.max.x = pt.x;
        }

        if (pt.y < extent.min.y) {
          extent.min.y = pt.y;
        } else if (pt.y > extent.max.y) {
          extent.max.y = pt.y;
        }
        return extent;
      }
    }, null);

    this.range.mid = this.range.max.add(this.range.min).div(2);
    this.range.size = this.range.max.sub(this.range.min);
  }

}
