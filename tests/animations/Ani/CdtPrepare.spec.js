import {CdtPrepare, list, lerp, seriesToSegments} from 'animation/CdtPrepare';
import Point from 'point-geometry';
import PointIndexed from 'animation/PointIndexed';

describe('(function) lerp', () => {
  let pointA, pointB, pointC;
  beforeEach(() => {
    pointA = new Point(100, 50);
    pointB = new Point(200, 75);
  });
  it('should give a point close to second argument with ratio 1', () => {
    pointC = lerp(pointA, pointB, 1);
    expect(pointB.dist(pointC)).to.be.at.most(2);
  });

  it('should give the midpoint when passed 0.5', () => {
    pointC = lerp(pointA, pointB, 0.5);
    let midDistance = pointA.dist(pointB) / 2;

    expect(pointB.dist(pointC)).to.be.within(midDistance - 2, midDistance + 2);
    expect(pointA.dist(pointC)).to.be.within(midDistance - 2, midDistance + 2);
  });
});

describe('seriesToSegments', () => {
  let series = [
    [1, 2, 4],
    [1, 2, 3],
    [2, 3, 4]
  ];
  it('should make segments', () => {
    let segments = seriesToSegments(series);
    expect(segments).to.eql([[1, 2], [1, 4], [1, 3], [2, 4], [2, 3], [3, 4]]);
  });
});

describe('(function) list', () => {
  let ptList;
  beforeEach(() => {
    let points = [
      new PointIndexed(0, 50, 10),
      new PointIndexed(0, 100, 11),
      new PointIndexed(50, 100, 12),
      new PointIndexed(0, 100, 13)
    ];
    ptList = list(points);
  });

  it('should process points', () => {
    expect(ptList).to.eql([[10, 11], [11, 12], [12, 13], [13, 10]]);
  });
});

describe('(Class) CdtPrepare', () => {
  let prep;
  const width = 600;
  const height = 400;

  beforeEach(() => {
    let inners = [
      new Point(width / 4, height / 4).round(),
      new Point(width / 2, height / 4).round(),
      new Point(width / 3, height / 2).round()
    ];

    prep = new CdtPrepare(inners, new Point(0, 0), new Point(width, height));
  });

  describe('inner points', () => {
    let indexes;
    let values;
    beforeEach(() => {
      values = [];
      indexes = [];
      for (let point of prep.innerPoints) {
        indexes.push(point.index);
        point = point.round();
        values.push(point.x);
        values.push(point.y);
      }
    });

    it('should have expected inner points', () => {
      expect(values).to.eql([150, 100, 300, 100, 200, 200]);
    });

    it('should have expected indexes', () => {
      expect(indexes).to.eql([0, 1, 2]);
    });
  });

  describe('outer points', () => {
    let indexes;
    let values;
    beforeEach(() => {
      values = [];
      indexes = [];
      for (let point of prep.outerPoints) {
        indexes.push(point.index);
        point = point.round();
        values.push(point.x);
        values.push(point.y);
      }
    });

    it('should have the interpolated points in the values', () => {
      expect(values).to.eql(
        [-10, -10,
          79, -10,
          167, -10,
          256, -10,
          344, -10,
          433, -10,
          521, -10,
          610, -10,
          610, 74,
          610, 158,
          610, 242,
          610, 326,
          610, 410,
          521, 410,
          433, 410,
          344, 410,
          256, 410,
          167, 410,
          79, 410,
          -10, 410,
          -10, 326,
          -10, 242,
          -10, 158,
          -10, 74]);
    });
  });

  describe('cdt, triangles', () => {
    it('should give us massive triangles!', () => {
      let triangles = prep.triangles();
      let _expect = require('./fixtures/triangles.json');
      for (let i = 0; i < triangles.length; ++i) {
        let e = _expect[i];
        let t = triangles[i];
        for (let ii = 0; ii < e.length; ++ii) {
          expect(e[ii].x).to.eql(t[ii].x);
          expect(e[ii].y).to.eql(t[ii].y);
        }
      }
    });
  });
});
