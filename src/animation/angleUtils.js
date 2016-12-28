export const RADIAN_CIRC = (Math.PI * 2);

export function r2a(n) {
  return 360 * n / RADIAN_CIRC;
}
export function a2r(n) {
  return n * RADIAN_CIRC / 360;
}
export function rr(n) {
  let round = _wholeRad(n);

  if (round > Math.PI) {
    return round - RADIAN_CIRC
  }
  else {
    return round;
  }
}

export function rra(n) {
  let round = _wholeAngle(n);
  if (round > 180) {
    return round - 360;
  } else {
    return round;
  }
}

export function _wholeAngle(n) {
  n = n % 360;
  if (n < 0) {
    n += 360;
  }
  return n;
}

export function _wholeRad(n) {
  n = n % RADIAN_CIRC;
  if (n < 0) {
    n += RADIAN_CIRC;
  }
  return n;
}
export function r(n, pow) {
  const scale = Math.pow(10, pow || 1);
  return Math.round(scale * n) / scale;
}

export const drawArc = (container, startAngle, degreeAngle, degreesPerSpoke, lineColor, radius) => {

  container.removeAllChildren();
  if (!radius) {
    radius = 100;
  }

  let shape = new createjs.Shape();
  container.addChild(shape);


  startAngle = _wholeAngle(startAngle);
  degreeAngle = _wholeAngle(degreeAngle);

  shape.graphics.beginStroke('black')
    .setStrokeStyle(6)
    .arc(0, 0, radius, a2r(startAngle), a2r(degreeAngle))
    .mt(0, 0).endStroke();

  shape.graphics.beginStroke(lineColor)
    .setStrokeStyle(3)
    .arc(0, 0, radius, a2r(startAngle), a2r(degreeAngle))
    .lt(0, 0)
    .endStroke();

  const range = degreeAngle - startAngle;
  let spokes = r(range/degreesPerSpoke);
  let text = new createjs.Text(`${r(_wholeAngle(range))}° span, ${r(spokes)} sp`,
    '16px Arial');
  text.x = radius * Math.cos(a2r(degreeAngle));
  text.y = radius * Math.sin(a2r(degreeAngle));
  text.lineWidth = 50;
  container.addChild(text);

  let text2 = new createjs.Text(`${r(_wholeAngle(range))}° span, ${r(spokes)} sp`,
    '16px Arial');
  text2.x = -1 + radius * Math.cos(a2r(degreeAngle));
  text2.y =1 + radius * Math.sin(a2r(degreeAngle));
  text2.lineWidth = 50;
  text2.color = lineColor;
  container.addChild(text2);
}