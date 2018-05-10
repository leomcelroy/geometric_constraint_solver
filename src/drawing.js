import React, { Component } from 'react';
import {ReactSVGPanZoom} from 'react-svg-pan-zoom';
import {solveSystem, evaluate, test} from './myAutoDiff.js';
import {Point, Line} from './shapes.js';
import {Coincident, SetY, SetX, Distance, Vertical, Horizontal, Perpendicular, Angle, Parallel, Fixed} from './constraints.js';

import './drawing.css';

class Solver {
  constructor(eqs = [], vars = {}) {
    this.eqs = eqs;
    this.vars = vars;
  }

  addEq(eq) {
    return this.eqs.unshift(eq);
  }

  addVar(singleVar) {
    return this.vars.push(singleVar);
  }

  setVar(varName, value) {
    this.vars[varName] = value;
  }

  addPoint(point, id) {
    let xID = `x${id}`;
    let yID = `y${id}`;

    this.vars[xID] = point.x;
    this.vars[yID] = point.y;
  }

  solve() {
    return solveSystem(this.eqs, this.vars);
  }

}

class DrawArea extends React.Component {
  constructor() {
    super();

    this.state = {
      shapes: [], //will be a list of shapes
      mousedown: false,
      svgMouse: undefined,
      dragging: false,
      workpieceSize: {x:500, y:500},
      pivot: undefined,
      firstFire: true,
      firstPoint: undefined,
      pointState: false,
      pivotID: undefined,
      constraints: [],
      tool:"SELECT",
      IDcounter: 0,
      isDrawing: false,
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.solver = new Solver();
  }

  updatePoints() { //TODO: lines without points
    // console.log("solver", JSON.stringify(this.solver));
    // console.log("sols", JSON.stringify(this.solver.solve()[1]));



    // let c = this.state.constraints.map(c => c.eq);
    // console.log("c", c);
    // let c2 = [].concat.apply([], c);
    // console.log("c2", c2)
    let c = this.state.constraints.reduce((acc, cur) => acc.concat(cur.eq), []);
    // console.log("c3", c)


    this.solver.eqs = c;
    // console.log(this.solver.eqs);

    let sols = this.solver.solve()[1];

    Object.entries(sols).forEach(([variable, value]) => {
      // console.log(variable);

      this.state.shapes.forEach(shape => {
        if (shape.shape === "point" && variable.slice(1) === shape.id) {
          if (variable.slice(0,1) === "x") {
            shape.point.x = value;
          } else if (variable.slice(0,1) === "y") {
            shape.point.y = value;
          }
        }
      })

      this.solver.vars[variable] = sols[variable];
    })
  }

  async asyncUpdate() {
    this.updatePoints();
    return this.forceUpdate();
  }

  handleMouseDown(mouseEvent) {
    //console.log("down")
    let point = this.state.svgMouse;
    let selectedList = [];

    this.setState({
      mousedown: true,
      pivot: point,
    });

    if (mouseEvent.button !== 0) { //only handle left-clicks
      return;
    }

    switch (this.state.tool) {
      case "SELECT":
        this.state.shapes.forEach(shape => {
          let bool = shape.select(point)
          if (bool) {
            this.setState({
              pivotID: shape.id,
              pointState: shape.selected,
            });

            shape.selectBoolean(true);
            selectedList.push(shape.id);

          }
        })

        if (selectedList.length === 0) {
            this.state.shapes.forEach(shape => {
              shape.selectBoolean(false);
            })
        }
        break;
      case "POINT":
        let intID = this.state.IDcounter + 1;
        let stringID = intID.toString();

        let newPoint = new Point({x:point.x, y:point.y}, this.solver, stringID);

        let oldShapes = this.state.shapes;
        oldShapes.push(newPoint);

        this.setState({
          shapes: oldShapes,
          IDcounter: intID,
        });
        break;
      case "POLYLINE": // TODO: turn into lines and add all those features
        if (!this.state.isDrawing) {
          let intID1 = this.state.IDcounter + 1;
          let intID2 = intID1 + 1;
          let stringID1 = intID1.toString();
          let stringID2 = intID2.toString();

          let newPoint1 = new Point({x:point.x, y:point.y}, this.solver, stringID1);
          let newPoint2 = new Point({x:point.x, y:point.y}, this.solver, stringID2);
          let line = new Line(newPoint1, newPoint2);

          //newPoint2.selectBoolean(true);

          let oldShapes = this.state.shapes;
          oldShapes.push(newPoint1);
          oldShapes.push(newPoint2);
          oldShapes.push(line);

          this.setState({
            shapes: oldShapes,
            IDcounter: intID2,
            isDrawing: true,
            firstPoint: newPoint1,
          });
        } else { //TODO: add auto constraints (check!), auto closing (check!), and length display
          let lastPoint = this.state.shapes[this.state.shapes.length - 2];
          let firstPoint = this.state.firstPoint;

          let closed = Math.abs(firstPoint.point.x - lastPoint.point.x) < 10 && Math.abs(firstPoint.point.y - lastPoint.point.y) < 10;

          // console.log(closed);
          if (closed) {
            let oldConstraints = this.state.constraints;
            let newCoin = new Coincident(lastPoint, firstPoint);
            oldConstraints.push(newCoin);

            this.setState({
              isDrawing: false,
              constraints: oldConstraints,
            });

            this.updatePoints();
          } else {
            let intID1 = this.state.IDcounter + 1;
            let intID2 = intID1 + 1;
            let stringID1 = intID1.toString();
            let stringID2 = intID2.toString();

            let newPoint1 = new Point({x:point.x, y:point.y}, this.solver, stringID1);
            let newPoint2 = new Point({x:point.x, y:point.y}, this.solver, stringID2);
            let line = new Line(newPoint1, newPoint2);

            //console.log(newPoint1, lastPoint);

            let oldShapes = this.state.shapes;
            oldShapes.push(newPoint1);
            oldShapes.push(newPoint2);
            oldShapes.push(line);

            let oldConstraints = this.state.constraints;
            let newCoin = new Coincident(newPoint1, lastPoint);
            oldConstraints.push(newCoin);

            //console.log(oldShapes)

            this.setState({
              shapes: oldShapes,
              constraints: oldConstraints,
              IDcounter: intID2,
            });
          }
        }
        break;
      default:
        return;
    }
  }

  handleMouseMove(mouseEvent) {
    let point = this.state.svgMouse;

    switch (this.state.tool) {
      case "SELECT":
        if (this.state.mousedown === true) {
          let bool = this.state.shapes.some(shape => {
            if (shape.selected === true /*&& shape.shape === "point"*/) { return shape.select(point) === true }
          });

          if (bool) { this.setState( { dragging:true } )};
        }

        if (this.state.dragging) {
          //console.log("pivot", point);
          //console.log("pivotID", this.state.pivotID)
          this.setState({
            pivot:point,
          });

          this.state.shapes.forEach(shape => {

            if (shape.selected === true && shape.shape === "point") {

              let xID = `x${shape.id}`;
              let yID = `y${shape.id}`;

              let xOffset = shape.point.x-this.state.pivot.x;
              let yOffset = shape.point.y-this.state.pivot.y;

              if (shape.id === this.state.pivotID) { //if point fixed it should not have a new suggestion
                // suggestion method
                this.solver.vars[xID] = point.x;
                this.solver.vars[yID] = point.y;

              } else { //if points coincident each should be suggested
                this.solver.vars[xID] = point.x + (xOffset);
                this.solver.vars[yID] = point.y + (yOffset);
                // console.log("this is what I say oh", shape.id)
              }

              this.state.constraints.forEach(c => {
                if (c.name === "coincident") {
                  let p1 = c.points[0];
                  let p2 = c.points[1];

                  let xID1 = `x${p1.id}`;
                  let yID1 = `y${p1.id}`;
                  let xID2 = `x${p2.id}`;
                  let yID2 = `y${p2.id}`;


                  if (!p1.selected && p2.selected){
                    this.solver.vars[xID1] = this.solver.vars[xID2]
                    this.solver.vars[yID1] = this.solver.vars[yID2]
                  } else if (p1.selected && !p2.selected){
                    this.solver.vars[xID2] = this.solver.vars[xID1]
                    this.solver.vars[yID2] = this.solver.vars[yID1]
                  }

                }
              })
            }

          });


          this.updatePoints();
        }
        break;
      case "POLYLINE":
        if (this.state.isDrawing) {
          let xID = `x${this.state.IDcounter}`;
          let yID = `y${this.state.IDcounter}`;

          this.solver.vars[xID] = point.x;
          this.solver.vars[yID] = point.y;

          this.updatePoints();
        }
        break;
      default:
        return;
    }
  }

  handleMouseUp(mouseEvent) {

    //this is to prevent double firing
    let firstFire = !this.state.firstFire;
    this.setState({firstFire: firstFire})
    if (firstFire) { return }

    //console.log("up");
    let point = this.state.svgMouse;

    switch (this.state.tool) {
      case "SELECT":
        this.state.shapes.forEach(shape => {
          let bool = (point) ? shape.select(point) : false; //for first click outside of drawarea
          if (bool && !this.state.dragging) {
            //console.log("pointState", this.state.pointState);
            shape.selectBoolean(!this.state.pointState);
          }
        })
        break;
      case "POLYLINE":
        break;
      default:
        return;
    }

    this.setState({
      mousedown: false,
      dragging: false,
    })
  }

//------------------------constraints------------------------

removeConstraint(index) {
  //console.log("pre", JSON.stringify(this.solver.eqs));

  let oldConstraints = this.state.constraints;

  let newConstraintsFirstHalf = oldConstraints.slice(index+1);
  let newConstraintsSecondHalf = oldConstraints.slice(0, index);

  let newConstraints = newConstraintsFirstHalf.concat(newConstraintsSecondHalf);

  return this.setState({constraints: newConstraints});
}

async updateWithConstraints(c) {
  await this.setState({ constraints : c });
  return this.asyncUpdate();
  // return this.forceUpdate();
}

makeHorizontal() {
  let selectedPoints = [];

  this.state.shapes.forEach(shape => {
    if (shape.shape === "point" && shape.selected) {
      selectedPoints.push(shape);
    }
  })

  // console.log(selectedPoints);

  let firstPoint = selectedPoints[0];

  let horizontalConstraints = selectedPoints.slice(1).map(point => {
    return new Horizontal(firstPoint, point)
  })

  let oldConstraints = this.state.constraints;

  let newConstraints = oldConstraints.concat(horizontalConstraints);

  this.updateWithConstraints(newConstraints);
}

makeVertical() {
  let selectedPoints = [];

  this.state.shapes.forEach(shape => {
    if (shape.shape === "point" && shape.selected) {
      selectedPoints.push(shape);
    }
  })

  // console.log(selectedPoints);

  let firstPoint = selectedPoints[0];

  let verticalConstraints = selectedPoints.slice(1).map(point => {
    return new Vertical(firstPoint, point)
  })

  let oldConstraints = this.state.constraints;

  let newConstraints = oldConstraints.concat(verticalConstraints);

  this.updateWithConstraints(newConstraints);
}

makeX() {
  let selectedPoints = [];

  this.state.shapes.forEach(shape => {
    if (shape.shape === "point" && shape.selected) {
      selectedPoints.push(shape);
    }
  })

  let xConstraints = selectedPoints.map(point => {
    return new SetX(point, point.point.x)
  })

  let oldConstraints = this.state.constraints;
  let newConstraints = oldConstraints.concat(xConstraints);

  this.updateWithConstraints(newConstraints);
}

makeY() {
  let selectedPoints = [];

  this.state.shapes.forEach(shape => {
    if (shape.shape === "point" && shape.selected) {
      selectedPoints.push(shape);
    }
  })

  let yConstraints = selectedPoints.map(point => {
    return new SetY(point, point.point.y)
  })

  let oldConstraints = this.state.constraints;
  let newConstraints = oldConstraints.concat(yConstraints);

  this.updateWithConstraints(newConstraints);
}

makeFixed() {
  let selectedPoints = [];

  this.state.shapes.forEach(shape => {
    if (shape.shape === "point" && shape.selected) {
      selectedPoints.push(shape);
    }
  })

  let constraints = selectedPoints.map(point => {
    return new Fixed(point, point.point.x, point.point.y)
  })

  let oldConstraints = this.state.constraints;
  let newConstraints = oldConstraints.concat(constraints);

  this.updateWithConstraints(newConstraints);
}

makeCoincident() {
  let selectedPoints = [];

  this.state.shapes.forEach(shape => {
    if (shape.shape === "point" && shape.selected) {
      selectedPoints.push(shape);
    }
  })

  let firstPoint = selectedPoints[0];

  let coinConstraints = selectedPoints.slice(1).map(point => {
    return new Coincident(firstPoint, point)
  })

  let oldConstraints = this.state.constraints;

  let newConstraints = oldConstraints.concat(coinConstraints);

  this.updateWithConstraints(newConstraints);
}

makeDistance(){
  let dist = parseInt(document.getElementById('length').value);

  let selectedPoints = [];
  this.state.shapes.forEach(shape => {
    if (shape.shape === "point" && shape.selected) {
      selectedPoints.push(shape);
    }
  })

  let p1 = selectedPoints[selectedPoints.length - 1]
  let p2 = selectedPoints[selectedPoints.length - 2]

  let newCon = new Distance(p1, p2, dist);

  let oldConstraints = this.state.constraints;

  let newConstraints = oldConstraints.concat(newCon);

  this.updateWithConstraints(newConstraints);
}

makeAngle(){
  let angle = parseInt(document.getElementById('angle').value);

  let selectedLines = [];
  this.state.shapes.forEach(shape => {
    if (shape.shape === "line" && shape.selected) {
      selectedLines.push(shape);
    }
  })

  let firstLine = selectedLines[0];

  let newCon = new Angle(firstLine, firstLine, angle);

  let oldConstraints = this.state.constraints;

  let newConstraints = oldConstraints.concat(newCon);

  this.updateWithConstraints(newConstraints);
}

makeParallel(){
  let selectedLines = [];
  this.state.shapes.forEach(shape => {
    if (shape.shape === "line" && shape.selected) {
      selectedLines.push(shape);
    }
  })

  let firstLine = selectedLines[0];

  let parConstraints = selectedLines.slice(1).map(line => {
    return new Parallel(firstLine, line)
  })

  let oldConstraints = this.state.constraints;

  let newConstraints = oldConstraints.concat(parConstraints);

  this.updateWithConstraints(newConstraints);
}

makePerpendicular(){
  let selectedLines = [];
  this.state.shapes.forEach(shape => {
    if (shape.shape === "line" && shape.selected) {
      selectedLines.push(shape);
    }
  })

  let firstLine = selectedLines[0];

  let perConstraints = selectedLines.slice(1).map(line => {
    return new Perpendicular(firstLine, line)
  })

  let oldConstraints = this.state.constraints;

  let newConstraints = oldConstraints.concat(perConstraints);

  this.updateWithConstraints(newConstraints);
}

// ------------------------------benchmark------------------------------------

// construct piston and see how long it takes to resolve, displace each point randomly
// have it construct many pistons

makePiston(startID) {
  let randomPoint = (oldID) => {
    let stringID = oldID.toString();

    let x = Math.floor(Math.random() * 100);
    let y = Math.floor(Math.random() * 100);

    //console.log(intID);
    return new Point({x, y}, this.solver, stringID)
  }

  let intID = (startID === undefined) ? this.state.IDcounter + 1 : startID + 1;

  let p1 = randomPoint(intID);
  let p2 = randomPoint(intID + 1);
  let p3 = randomPoint(intID + 2);
  let p4 = randomPoint(intID + 3);

  let d1 = new Distance(p1, p2, 50);
  let d2 = new Distance(p3, p4, 60);
  let v = new Vertical(p1, p4);
  let fix = new Fixed(p1, p1.point.x, p1.point.y);
  let coin = new Coincident(p2, p3);

  let oldShapes = this.state.shapes;
  let oldConstraints = this.state.constraints;

  oldShapes.push(p1);
  oldShapes.push(p2);
  oldShapes.push(p3);
  oldShapes.push(p4);

  oldConstraints.push(d1);
  oldConstraints.push(d2);
  oldConstraints.push(v);
  oldConstraints.push(fix);
  oldConstraints.push(coin);

  return this.setState({shapes:oldShapes, IDcounter: intID + 3, constraints:oldConstraints})
}

async getId() {
  return this.state.IDcounter;
}

async makePistons(num) {
  for (let i = 0; i<num; i++) {
    let id = await this.getId();
    // console.log("id", id)
    this.makePiston(id);
  }

  return
}

async benchmark() {
  let n = parseInt(document.getElementById('bm').value);

  await this.makePistons(n);
  let t0 = performance.now();
  this.updatePoints();
  this.forceUpdate();
  let t1 = performance.now();

  return console.log("Call to updatePoints took " + (t1 - t0) + " milliseconds.");
}

clearDrawing() {
  return this.setState({
            shapes: [], //will be a list of shapes
            mousedown: false,
            svgMouse: undefined,
            dragging: false,
            workpieceSize: {x:500, y:500},
            pivot: undefined,
            firstFire: true,
            firstPoint: undefined,
            pointState: false,
            pivotID: undefined,
            constraints: [],
            tool:"SELECT",
            IDcounter: 0,
            isDrawing: false,
          });
}

async trial(i) {
  await this.makePistons(i);
  // await this.logPistons();
  let t0 = performance.now();
  this.updatePoints();
  this.forceUpdate();
  let t1 = performance.now();
  // console.log(result)
  return (t1-t0);
}

async autoBenchmark(pistons, trials) {
  let allResults = []
  for (let j = 1; j <= trials; j++) {
    let results = [];
    for (let i = 1; i <= pistons; i++) {
      let temp = await this.trial(i)
      results.push(temp);
      this.clearDrawing();
    }
    allResults.push(results);
  }


  return allResults;
}

//------------------------component mount functions------------------------
  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

//------------------------------------------------

  updateSVGMouse(event) { //for tracking mouse position
    this.setState({
      svgMouse : {x:event.x, y:event.y}
    })
  }

  onClickTool(toolName) {
    if (toolName) {
      this.setState({
        tool: toolName,
      });
    } else {
      this.setState({
          tool: undefined,
      });
    }
  }

//---------------------- experimental
  async loop() {
    let constraints = this.state.constraints;
    let length = constraints.length;
    let remove = false;

    for (let i = 0; i < length; i++) {
      let cur = constraints[i];
      let shapeIDs = this.state.shapes.map(shape => shape.id);

      remove = cur.points.some(point => shapeIDs.indexOf(point.id) < 0);

      if (remove) {
        // console.log("index", i);
        this.removeConstraint(i);
        break;
      };
    };

    if (remove) {this.loop()};

    return;
  }

  async updateMissingConstraints(s) {
    await this.setState({ shapes : s });
    return this.loop();
  }

//--------------------------

  handleKeyPress(e) {
    let code = (e.keyCode ? e.keyCode : e.which);
    console.log("key", code);
    // console.log(e);

    let cmdDown = e.metaKey;

    let oldShapes = this.state.shapes;
    let lastShape = oldShapes[oldShapes.length -1];
    let newShapes = oldShapes.slice(0, oldShapes.length - 1);

    switch (code) {
      case 13: //enter
        console.log(this.state.shapes);
        switch (this.state.tool) {
          case "POLYLINE":
              this.setState({isDrawing:false})
            break;
          default:
            return;
        }
        break;
      case 27: //esc
        switch (this.state.tool) {
          case "POLYLINE":
              if (this.state.isDrawing === true) {
                let newShapes = oldShapes.slice(0, oldShapes.length - 3);
                this.updateMissingConstraints(newShapes);
                this.setState({
                  isDrawing:false,
                })
              }
            break;
          default:
            return;
        }
        break;
      case 80: //p
        this.setState({tool:"POINT"})
        break;
      case 76: //p
        this.setState({tool:"POLYLINE"})
        break;
      case 65: //a
        this.setState({tool:"SELECT"})
        break;
      case 72: //h
        this.setState({tool:"PAN"})
        break;
      case 8: //delete
        let unselectedShapes = [];
        this.state.shapes.forEach(shape => {
          if (shape.selected === false) {
            unselectedShapes.push(shape);
          }
        })

        this.updateMissingConstraints(unselectedShapes)
        break;
      case 84: //test
        // console.log(this.solver.eqs);
        // console.log(JSON.stringify(this.solver.vars));

        // ----- speed tests -----
        // let eq = parseComb(this.solver.eqs);
        // minimize(eq, this.solver.vars)

        // var t0 = performance.now();
        // this.updatePoints(); // place function of interest here
        // var t1 = performance.now();
        // console.log("Call to updatePoints took " + (t1 - t0) + " milliseconds.");

        test();
        // console.log(this.state.shapes);
        // console.log(this.autoBenchmark(10, 20));
        break;
      case 82: //r: reset
        this.clearDrawing();
        break;
      case 66: //b: run resolve timer
        let t0 = performance.now();
        this.updatePoints();
        this.forceUpdate();
        let t1 = performance.now();

        console.log("Time to Resolve: ", t0 - t1);
        break;
      default:
        return;
    }
  }

  render() {
    let pointer;
    switch (this.state.tool) { //tooltips
      case "POLYLINE":
        pointer = "crosshair";
        break;
      case "SELECT":
        pointer = "default";
        break;
      default:
        pointer = "default";
    }

    let activeStyle = {
      color: "blue",
    }

    let inactiveStyle = {
      color: "black",
    }

    // ----- piston drawing -----
    let circle = <circle cx="120" cy="120" r="50" stroke="grey" strokeWidth="2" fill="none" />;
    let dotted = <line strokeDasharray="5, 5" stroke="grey" x1="120" y1="120" x2="120" y2="10" />;

    let tool;
    switch (this.state.tool) {
      case "PAN":
        tool = "pan";
        break;
      default:
        tool = "none";
        break;
    }

    //main render of program
    return (
      <div className={"grid"}>
        <div
          className={"drawAreaStyle"}
          style = {{cursor: pointer}}
          ref="drawArea"
          onMouseMove={this.handleMouseMove}
          onMouseDown={this.handleMouseDown}
          onMouseUp={this.handleMouseUp}
          onKeyDown={(e) => this.handleKeyPress(e)}
          tabIndex="0"
        >
          <ReactSVGPanZoom
            width={300} height={300}
            onMouseMove={event => this.updateSVGMouse(event)}
            toolbarPosition={"none"}
            miniaturePosition={"none"}
            detectAutoPan={false}
            tool={tool}>

              <svg width={this.state.workpieceSize.x} height={this.state.workpieceSize.y}>
                {}
                {this.state.shapes.map((shape,index) => shape.svgRender(`shapes:${index}`))};
              </svg>
          </ReactSVGPanZoom>
        </div>
        <div className={"constraints"}>
          <b>Constraints</b>
          {this.state.constraints.map((c, index) => <div className={"constraint"} key={`constraints:${index}`}>
            <a
              onClick={() => {
                let bool = c.points.every(p => p.selected === true)
                c.points.map(p => {
                  if (bool) {
                    p.selectBoolean(false);
                  } else {
                    p.selectBoolean(true);
                  }

                  this.forceUpdate();})}
              }
              className={"c"}>
                {c.name} {c.eq.some(e => evaluate(e, this.solver.vars).val**2 > Math.sqrt(0.00001)) && "!"}
            </a>

            <a
              onClick={() => this.removeConstraint(index)}
              className={"x"}>
                x
            </a>
          </div>)}
        </div>
        <div className={"sidebar"}>
          <b>Tools</b><br/>
          <em>Drawing</em><br/>
          <a className={"tools"} style={this.state.tool === "POLYLINE" ? activeStyle : inactiveStyle} onClick={(e) => this.onClickTool("POLYLINE")}>Polyline (L)</a><br/>
          <a className={"tools"} style={this.state.tool === "POINT" ? activeStyle : inactiveStyle} onClick={(e) => this.onClickTool("POINT")}>Point (P)</a><br/>
          <a className={"tools"} style={this.state.tool === "SELECT" ? activeStyle : inactiveStyle} onClick={(e) => this.onClickTool("SELECT")}>Select (A)</a><br/>
          <a className={"tools"} style={this.state.tool === "PAN" ? activeStyle : inactiveStyle} onClick={(e) => this.onClickTool("PAN")}>Pan (H)</a><br/>
          <em>Parametric</em><br/>
          <a className={"tools"} onClick={() => this.makeVertical()}>Vertical</a><br/>
          <a className={"tools"} onClick={() => this.makeHorizontal()}>Horizontal</a><br/>
          <a className={"tools"} onClick={() => this.makeCoincident()}>Coincident</a><br/>
          <a className={"tools"} onClick={() => this.makeX()}>Set X</a><br/>
          <a className={"tools"} onClick={() => this.makeY()}>Set Y</a><br/>
          <a className={"tools"} onClick={() => this.makeFixed()}>Fix</a><br/>
          <a className={"tools"} onClick={() => this.makeDistance()}>Distance</a><input type="text" id="length" style={{fontSize:14, width: "30px"}}/><br/>
          <a className={"tools"} onClick={() => this.makeParallel()}>Parallel</a><br/>
          <a className={"tools"} onClick={() => this.makePerpendicular()}>Perpendicular</a><br/>
          {/*<a className={"tools"} onClick={() => this.benchmark()}>Run Benchmark</a><input type="text" id="bm" style={{fontSize:14, width: "30px"}}/><br/>*/}
          {/*<a className={"tools"} onClick={() => this.makeAngle()}>Angle</a><input type="text" id="angle" style={{fontSize:14, width: "30px"}}/><br/> */}
        </div>

      </div>
    );
  }
}

export {DrawArea, Point}
