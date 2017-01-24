import PointIndexed from 'animation/PointIndexed';
import Point from 'point-geometry';

describe('(Class) PointIndexed', () => {
  let pti;
  const X = 100;
  const Y = 200;
  const INDEX = 3;
  const fromPoint = new Point(X, Y);
  it('should create expected point from values', () => {
    pti = new PointIndexed(X, Y, INDEX);
    expect(pti.x).to.equal(X);
    expect(pti.y).to.equal(Y);
    expect(pti.index).to.equal(INDEX);
  });

  it('should create expected point from seed point', () => {
    pti = new PointIndexed(fromPoint, INDEX);
    expect(pti.x).to.equal(X);
    expect(pti.y).to.equal(Y);
    expect(pti.index).to.equal(INDEX);
  });
});
