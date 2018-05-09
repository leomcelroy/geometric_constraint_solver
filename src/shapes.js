import React from 'react';

function distanceSquared(p1, p2) {
  return (p1.x - p2.x)**2 + (p1.y - p2.y)**2;
}

class Line {
  constructor(p1, p2, solver) {
    this.shape = 'line';
    this.p1 = p1;
    this.p2 = p2;
    this.lineSelectDistance = .08;
    this.selected = false;
  }

  selectBoolean(booleanValue) {
    this.selected = (booleanValue === undefined) ? !this.selected : booleanValue;
    this.p1.selectBoolean(this.selected);
    this.p2.selectBoolean(this.selected);

    return this.selected;
  }

  getLength() {
    return Math.sqrt(distanceSquared(this.p1.point, this.p2.point));
  }

  getSlope() {
    let p1x = this.p1.point.x;
    let p2x = this.p2.point.x;
    let p1y = this.p1.point.y;
    let p2y = this.p2.point.y;

    return((p2x-p1x)/(p2y-p1y));
  }

  select(point) {
    let d1 = Math.sqrt(distanceSquared(point, this.p1.point));
    let d2 = Math.sqrt(distanceSquared(point, this.p2.point));

    return d1 + d2 < Math.sqrt(distanceSquared(this.p1.point, this.p2.point)) + this.lineSelectDistance;
  }

  points() {
    return [this.p1, this.p2];
  }

  svgRender(key) { //render function
    let pathData = "M " + [this.p1.point, this.p2.point].map(p => `${p['x']} ${p['y']}`);
    // console.log(pathData);

    let color = (this.selected) ? "red" : "black";
    let style = {
          fill: "none",
          strokeWidth: "3px",
          stroke: color,
          strokeLinejoin: "round",
          strokeLinecap: "round",
        }

    let textStyle = {
          WebkitTouchCallout: "none", /* iOS Safari */
            WebkitUserSelect: "none", /* Safari */
             khtmlUserSelect: "none", /* Konqueror HTML */
               MozUserSelect: "none", /* Firefox */
                msUserSelect: "none", /* Internet Explorer/Edge */
                  userSelect: "none", /* Non-prefixed version, currently
                                          supported by Chrome and Opera */
        }

    let selectedAtAll = this.selected || this.p1.selected || this.p2.selected;

    let length = Math.sqrt(distanceSquared(this.p1.point, this.p2.point));

    //console.log(length)

    return (
      <g key={key}>
        <path d={pathData} style={style} id={`${key}`}/>
        {(selectedAtAll) ? <text dy={"-8"}><textPath href={`#${key}`} startOffset={"43%"} style={textStyle}>{Math.round(length*100)/100}</textPath></text> : null}
      </g>
    )
  }

}

class Point {
  constructor(startingPoint, solver, id) {
    this.shape = 'point';
    this.point = startingPoint;
    // this.x = startingPoint.x;
    // this.y = startingPoint.y;
    this.selected = false;
    this.id = id;
    this.pointSelectDistance = 5;

    solver.addPoint(this.point, id);
  }

  selectBoolean(booleanValue) {
    return this.selected = (booleanValue === undefined) ? !this.selected : booleanValue;
  }

  points() {
    return [this.point];
  }

  select(point) {
    if (distanceSquared(point, this.point) < this.pointSelectDistance**2) {
      return true;
    } else {
      return false;
    }
  }

  svgRender(key) { //render function
    let color = (this.selected) ? "red" : "black";

    return (
      <g key={key}>
        <circle cx={this.point.x} cy={this.point.y} r="5" fill={color}/>
      </g>
    )
  }
}

export {Point, Line};
