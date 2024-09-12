// p5Stage v1.0-alpha

class Stage {
  constructor() {
    this.stageObjects = [];
  }

  add(stageObject) {
    this.stageObjects.push(stageObject);
    return stageObject;
  }

  moveObjectToFront(stageObject) {
    // puts the stageObject at the end of the array
    this.stageObjects = this.displayObjects.filter(
      (object) => object !== stageObject
    );
    this.stageObjects.push(stageObject);
  }

  moveObjectToBack(stageObject) {
    // puts the stageObject at the beginning of the array
    this.stageObjects = this.displayObjects.filter(
      (object) => object !== stageObject
    );
    this.stageObjects.unshift(stageObject);
  }

  moveObjectFoward(stageObject) {
    // puts the stageObject one index forward in the array
    let index = this.stageObjects.indexOf(stageObject);
    if (index < this.stageObjects.length - 1) {
      this.stageObjects.splice(index, 1);
      this.stageObjects.splice(index + 1, 0, stageObject);
    }
  }

  moveObjectBackward(stageObject) {
    // puts the stageObjects one index backward in the array
    let index = this.stageObjects.indexOf(stageObject);
    if (index > 0) {
      this.stageObjects.splice(index, 1);
      this.stageObjects.splice(index - 1, 0, stageObject);
    }
  }

  update() {
    // go through stageObjects and update them IF
    // they have an update method
    this.stageObjects.forEach((stageObject) => {
      if (stageObject.update) {
        stageObject.update();
      }
    });
  }

  draw() {
    // go through stageObjects and draw them IF
    // they have a draw method
    this.stageObjects.forEach((stageObject) => {
      if (stageObject.draw) {
        stageObject.draw();
      }
    });
  }
}

// StageObject decorators
class Style {
  constructor() {
    // fill properties
    this.filled = false;
    this.fillColor = null;

    // stroke properties
    this.stroked = false;
    this.strokeColor = null;
    this.strokeWeight = null;

    // text properties
    this.hasText = false;
    this.textSize = null;
    this.textFont = null;
    this.textHorizontalAlign = null;
    this.textVerticalAlign = null;
  }

  express() {
    if (this.filled) {
      fill(this.fillColor);
    } else {
      noFill();
    }

    if (this.stroked) {
      stroke(this.strokeColor);
      strokeWeight(this.strokeWeight);
    } else {
      noStroke();
    }

    if (this.hasText) {
      textSize(this.textSize);
      textFont(this.textFont);
      textAlign(this.textHorizontalAlign, this.textVerticalAlign);
    }
  }
}

class StageObject {
  constructor() {
    this.type = "StageObject";
    this.visible = true;
  }

  // visual methods
  setVisible() {
    this.visible = true;
    return this; // chainable
  }

  setNotVisible() {
    this.visible = false;
    return this; // chainable
  }
}

class StyledStageObject extends StageObject {
  constructor() {
    super();
    this.type = "StyledStageObject";
    this.style = new Style(this);
  }

  setFilled() {
    this.style.filled = true;
    return this; // chainable
  }

  setNotFilled() {
    this.style.filled = false;
    return this; // chainable
  }

  setFillColor(fillColor) {
    this.style.fillColor = fillColor;
    return this; // chainable
  }

  setStroked() {
    this.style.stroked = true;
    return this; // chainable
  }

  setNotStroked() {
    this.style.stroked = false;
    return this; // chainable
  }

  setStrokeColor(strokeColor) {
    this.style.strokeColor = strokeColor;
    return this; // chainable
  }

  setStrokeWeight(strokeWeight) {
    this.style.strokeWeight = strokeWeight;
    return this; // chainable
  }

  // set text style properties. chainable
  setHasText() {
    this.style.hasText = true;
    return this; // chainable
  }

  setNoText() {
    this.style.hasText = false;
    return this; // chainable
  }

  setTextSize(textSize) {
    this.style.textSize = textSize;
    return this; // chainable
  }

  setTextFont(textFont) {
    this.style.textFont = textFont;
    return this; // chainable
  }

  setTextHorizontalAlignLeft() {
    this.style.textHorizontalAlign = LEFT;
    return this; // chainable
  }

  setTextHorizontalAlignCenter() {
    this.style.textHorizontalAlign = CENTER;
    return this; // chainable
  }

  setTextHorizontalAlignRight() {
    this.style.textHorizontalAlign = RIGHT;
    return this; // chainable
  }

  setTextVerticalAlignTop() {
    this.style.textVerticalAlign = TOP;
    return this; // chainable
  }

  setTextVerticalAlignCenter() {
    this.style.textVerticalAlign = CENTER;
    return this; // chainable
  }

  setTextVerticalAlignBottom() {
    this.style.textVerticalAlign = BOTTOM;
    return this; // chainable
  }

  draw() {
    if (this.visible && this.style) {
      push();
      // if the object is visible and has a style
      this.style.express();
      this.render();
      pop();
    }
  }
}

class Follower extends p5.Vector {
  constructor(target) {
    super();
    this.target = target;
    this.offset = createVector(0, 0);
  }

  get x() {
    // if target has a location property, return the x property of the target's location
    // else return the super's x property
    return this.target.location
      ? this.target.location.x + this.offset.x
      : super.x;
  }

  get y() {
    // if target has a location property, return the y property of the target's location
    // else return the super's y property
    return this.target.location
      ? this.target.location.y + this.offset.y
      : super.y;
  }

  set x(x) {}

  set y(y) {}

  setTarget(target) {
    this.target = target;
    return this;
  }

  setOffset(x, y) {
    this.offset.set(x, y);
    return this;
  }
}

class OrbitAround extends Follower {
  constructor(target) {
    super(target);
    this.radius = 0;
    this.startAngle = 0;
    this.angularVelocity = 0.1; // in radians per second
  }
  get x() {
    return this.target.location.x + this.radius * cos(this.getCurrentAngle());
  }

  get y() {
    return this.target.location.y + this.radius * sin(this.getCurrentAngle());
  }

  set x(x) {}

  set y(y) {}

  setStartAngleRadiams(startAngle) {
    // in radians
    this.startAngle = startAngle;
    return this;
  }

  setStartAngleDegrees(startAngle) {
    // convert start angle from degrees to radians
    this.startAngle = startAngle * (PI / 180);
    return this;
  }

  setRadius(radius) {
    // in pixels
    this.radius = radius;
    return this;
  }

  setVelocityRadians(angularVelocity) {
    this.angularVelocity = angularVelocity;
    return this;
  }

  setVelocityDegrees(angularVelocity) {
    // convert angular velocity from degrees per second to radians per second
    this.angularVelocity = angularVelocity * (PI / 180);
    return this;
  }

  getCurrentAngle() {
    return this.startAngle + (this.angularVelocity * millis()) / 1000;
  }
}

class Point extends StyledStageObject {
  constructor() {
    super();
    this.type = "Point";

    this.location = createVector(0, 0);

    this.setStroked()
      .setNotFilled()
      .setStrokeWeight(10)
      .setStrokeColor(color(0));
  }

  get x() {
    return this.location.x;
  }

  get y() {
    return this.location.y;
  }

  set x(x) {
    this.location.x = x;
  }

  set y(y) {
    this.location.y = y;
  }

  setXY(x, y) {
    this.location.set(x, y);
    return this; // chainable
  }

  render() {
    point(this.location.x, this.location.y);
  }
}

class Line extends StyledStageObject {
  constructor() {
    super();
    this.type = "Line";

    this.location1 = createVector(0, 0);
    this.location2 = createVector(0, 0);

    this.setNotFilled() //
      .setStroked()
      .setStrokeWeight(1)
      .setStrokeColor(0);
  }

  setStart(l) {
    this.location1 = l;
  }

  setEnd(l) {
    this.location2 = l;
  }

  render() {
    line(
      this.location1.x,
      this.location1.y,
      this.location2.x,
      this.location2.y
    );
  }
}

class Rect extends Point {
  constructor() {
    super();
    this.type = "Rect";

    this.setStroked()
      .setStrokeWeight(1)
      .setStrokeColor(color(0))
      .setFilled()
      .setFillColor(color(255));

    this.width = 0;
    this.height = 0;
  }

  setWidth(width) {
    this.width = width;
    return this; // chainable
  }

  setHeight(height) {
    this.height = height;
    return this; // chainable
  }

  render() {
    rectMode(CENTER);
    rect(this.location.x, this.location.y, this.width, this.height);
  }
}

class Circle extends Point {
  constructor() {
    super();
    this.type = "Circle";

    this.setStroked()
      .setStrokeWeight(1)
      .setStrokeColor(color(0))
      .setFilled()
      .setFillColor(color(255));

    this.radius = 50;
  }

  setRadius(radius) {
    this.radius = radius;
    return this; // chainable
  }

  setWidth(width) {
    this.radius = width / 2;
    return this; // chainable
  }

  setHeight(height) {
    this.radius = height / 2;
    return this; // chainable
  }

  // mouseWithin() {
  //   let mouseVector = createVector(mouseX, mouseY);
  //   let distance = p5.Vector.dist(mouseVector, this.location.getLocation());
  //   return distance < this.radius;
  // }

  render() {
    ellipseMode(CENTER);
    ellipse(this.location.x, this.location.y, this.radius * 2, this.radius * 2);
  }
}

class Text extends Point {
  constructor() {
    super();
    this.type = "Text";

    this.text = null;

    this.setText("Text")
      // visual properties
      .setVisible()
      // style properties
      // drawing properties
      .setNotStroked()
      .setFilled()
      .setFillColor(color(0))
      // text properties
      .setHasText()
      .setTextSize(12)
      .setTextFont("Arial")
      .setTextHorizontalAlignCenter()
      .setTextVerticalAlignCenter();
  }

  setText(text) {
    this.text = text;
    return this; // chainable
  }

  render() {
    text(this.text, this.location.x, this.location.y);
  }
}
