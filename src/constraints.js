import React from 'react';

class Coincident { //this had multiple eqs
  constructor(p1, p2) {
    this.points = [p1, p2];
    this.name = "coincident";

    let p1x = `x${p1.id}`;
    let p1y = `y${p1.id}`;
    let p2x = `x${p2.id}`;
    let p2y = `y${p2.id}`;

    this.eq = [`${p2x} - ${p1x}`, `${p2y} - ${p1y}`] ;
  }

}

class SetX {
  constructor(p, x) {
    this.points = [p];
    this.name = "setX";

    let px = `x${p.id}`;
    this.eq = [`${x} - ${px}`];
  }
}

class SetY {
  constructor(p, y) {
    this.points = [p];
    this.name = "setY";

    let py = `y${p.id}`;
    this.eq = [`${y} - ${py}`];
  }
}

class Fixed {
  constructor(p, x, y) {
    this.points = [p];
    this.name = "fixed";

    let px = `x${p.id}`;
    let py = `y${p.id}`;
    this.eq = [`${x} - ${px}`, `${y} - ${py}`];
  }
}

class Distance {
  constructor(p1, p2, dist) {
    this.points = [p1, p2]
    this.distance = dist;
    this.name = "distance";

    let p1x = `x${p1.id}`;
    let p1y = `y${p1.id}`;
    let p2x = `x${p2.id}`;
    let p2y = `y${p2.id}`;

    this.eq = [`${dist} - sqrt((${p2x}-${p1x})**2+(${p2y}-${p1y})**2)`];
  }
}

class Vertical {
  constructor(p1, p2) {
    this.points = [p1, p2]
    this.name = "vertical";

    let p1x = `x${p1.id}`;
    let p2x = `x${p2.id}`;

    this.eq = [`${p2x}-${p1x}`];
  }
}

class Horizontal {
  constructor(p1, p2) {
    this.points = [p1, p2]
    this.name = "horizontal";

    let p1y = `y${p1.id}`;
    let p2y = `y${p2.id}`;

    this.eq = [`${p2y}-${p1y}`];
  }
}

class Parallel { //this had multiple eqs
  constructor(line1, line2) {
    this.points = [line1.p1, line1.p2, line2.p1, line2.p2];
    this.name = "parallel";

    let l1p1x = `x${line1.p1.id}`;
    let l1p1y = `y${line1.p1.id}`;

    let l1p2x = `x${line1.p2.id}`;
    let l1p2y = `y${line1.p2.id}`;

    let l2p1x = `x${line2.p1.id}`;
    let l2p1y = `y${line2.p1.id}`;

    let l2p2x = `x${line2.p2.id}`;
    let l2p2y = `y${line2.p2.id}`;

    let top = `(-${l1p2x} + ${l1p1x}) * (${l2p2y} - ${l2p1y}) + (${l1p2y} - ${l1p1y}) * (${l2p2x} - ${l2p1x})`

    this.eq = [`${top}`];
  }

}

class Perpendicular { //this had multiple eqs
  constructor(line1, line2) {
    this.points = [line1.p1, line1.p2, line2.p1, line2.p2];
    this.name = "perpendicular";

    let l1p1x = `x${line1.p1.id}`;
    let l1p1y = `y${line1.p1.id}`;

    let l1p2x = `x${line1.p2.id}`;
    let l1p2y = `y${line1.p2.id}`;

    let l2p1x = `x${line2.p1.id}`;
    let l2p1y = `y${line2.p1.id}`;

    let l2p2x = `x${line2.p2.id}`;
    let l2p2y = `y${line2.p2.id}`;

    this.eq = [`(${l1p2x}-${l1p1x}) * (${l2p2x}-${l2p1x}) + (${l1p2y}-${l1p1y}) * (${l2p2y}-${l2p1y})`];
  }

}

class Angle { //this had multiple eqs
  constructor(line1, line2, angle) {
    this.points = [line1.p1, line1.p2, line2.p1, line2.p2];
    this.name = "angle";
    this.angle = angle;

    let l1p1x = `x${line1.p1.id}`;
    let l1p1y = `y${line1.p1.id}`;

    let l1p2x = `x${line1.p2.id}`;
    let l1p2y = `y${line1.p2.id}`;

    let l2p1x = `x${line2.p1.id}`;
    let l2p1y = `y${line2.p1.id}`;

    let l2p2x = `x${line2.p2.id}`;
    let l2p2y = `y${line2.p2.id}`;

    let l1Slope = `(${l1p2y}-${l1p1y})/(${l1p2x}-${l1p1x})`;
    let l2Slope = `(${l2p2y}-${l2p1y})/(${l2p2x}-${l2p1x})`;
    let top = `(${l1p2y} - ${l1p1y}) * (${l2p2y} - ${l2p1y}) + (${l1p2x} - ${l1p1x}) * (${l2p2x} - ${l2p1x})`
    let bottom = `(sqrt((${l1p2y} - ${l1p1y})**2 + (${l1p2x} - ${l1p1x})**2) * sqrt((${l2p2y} - ${l2p1y})**2 + (${l2p2x} - ${l2p1x})**2))`

    this.eq = [`${l1Slope} - ${angle}`];
  }

}
export {Coincident, SetY, SetX, Distance, Vertical, Horizontal, Perpendicular, Angle, Parallel, Fixed}
