class Tape {
  canvas; // canvas
  g; // graphics context
  bucketWidth = 60;
  bucketHeight = 80;
  bucketThickness = 1;
  width = 0;
  heigh = 0;
  currentX = 0;
  movingId = null;
  currentPosition = 0;

  constructor(canvas) {
    this.canvas = canvas;
  }

  initialize() {
    console.log('Initializing tape.');
    if (this.canvas.getContext) {
      this.g = this.canvas.getContext('2d');
    } else {
      alert("Canvas not supported. Please try different browser.");
    }
    this.resize();

    var scope = this;
    this.currentPosition = data.position;
    window.addEventListener("resize", function() {scope.redraw();}, true);
  }

  clear() {
    this.redraw();
  }

  drawState(value = '?', x = 0) {
    // Text width
    this.g.font = '32px arial';
    let textWidhtHalf = (this.g.measureText(value).width / 2);
    // Simple fill.
    this.g.fillStyle = "#000";
    this.g.fillRect(
      (this.width/2 - this.bucketWidth/3) - this.bucketThickness - textWidhtHalf + x,
      (this.height/2 - this.bucketHeight/3) - this.bucketThickness * 2 - 37,
      this.bucketWidth/3*2 + textWidhtHalf*2,
      this.bucketHeight/3*2);
    this.g.fillStyle = "#dadada";
    this.g.fillRect(
      (this.width/2 - this.bucketWidth/3) - textWidhtHalf + x,
      (this.height/2 - this.bucketHeight/3) - 37,
      this.bucketWidth/3*2 - this.bucketThickness * 2 + textWidhtHalf*2,
      this.bucketHeight/3*2 - this.bucketThickness * 4);

    // Draw text
    this.g.fillStyle = "#333";
    this.g.fillText(
      value,
      this.width/2 - textWidhtHalf,
      this.height/2 - 30);

    drawArrowhead(
      this.g,
      {
        x: this.width/2 + x,
        y: (this.height/2 - this.bucketHeight)
      }, {
        x: this.width/2 + x,
        y: (this.height/2 - this.bucketHeight) + this.bucketHeight - 5},
      15);
  }

  drawBucket(position=0, value=" ", x=0) {
    // Simple fill.
    if (position !== 0) {
      this.g.fillStyle = "#000";
    } else {
      this.g.fillStyle = "#ff0";
    }
    this.g.fillRect(
      position * this.bucketWidth + (this.width/2 - this.bucketWidth/2) - this.bucketThickness + x,
      (this.height/2 - this.bucketHeight/2 + 40) - this.bucketThickness * 2 ,
      this.bucketWidth,
      this.bucketHeight);
    this.g.fillStyle = "#dadada";
    this.g.fillRect(
      position * this.bucketWidth + (this.width/2 - this.bucketWidth/2) + x,
      (this.height/2 - this.bucketHeight/2 + 40),
      this.bucketWidth - this.bucketThickness * 2,
      this.bucketHeight - this.bucketThickness * 4);

    // Draw text
    this.g.font = '40px arial';
    this.g.fillStyle = "#333";
    let textWidhtHalf = (this.g.measureText(value).width / 2);
    this.g.fillText(
      value,
      position * this.bucketWidth + this.width/2 - textWidhtHalf + x,
      this.height/2 + 55);
  }

  redraw(x=0) {
    // this.resize();
    // Clean Canvas Rectangle
    this.g.clearRect(0, 0, this.width, this.canvas.heigh);

    // Draw empty buckets.
    let visibleBuckets = Math.floor(this.width / this.bucketWidth);
    for (var i = -visibleBuckets; i < visibleBuckets + 1; i++) {
      this.drawBucket(i, " ", x);
    }

    for (let index = 0; index < data.tapeContent.length; index++) {
      //console.log(data.tapeContent.length - this.currentPosition);
      this.drawBucket(index - this.currentPosition, data.tapeContent[index], x);
    }

    // Draw current state indicator
    this.drawState(data.state, 0, x);

    window.requestAnimationFrame(function() {
      if (data.runAnimation) {
        // console.log("Redrawing");
        // console.log("data.tape.currentX: ", data.tape.currentX);
        data.tape.redraw(data.tape.currentX);
      }
    });
  }

  /**
  * Animate moving to left to provided position.
  */
  moveLeft(currentPosition) {
    this.currentPosition = currentPosition;
    data.runAnimation = true;
    data.animationFinished = false;
    data.tape.redraw();
    this.movingId = setInterval(function() {
      data.tape.currentX += data.tape.bucketWidth / (data.animationTime * 1000 / 60);
      if (data.tape.currentX > data.tape.bucketWidth) {
        data.tape.currentX = 0;
        data.runAnimation = false;
        data.animationFinished = true;
        // this.position = data.position;
        clearInterval(data.tape.movingId);
      }
    }, 1000 / 60);
  }

  /**
  * Animate moving to right to provided position.
  */
  moveRight(currentPosition) {
    this.currentPosition = currentPosition;
    data.runAnimation = true;
    data.animationFinished = false;
    data.tape.redraw();
    this.movingId = setInterval(function() {
      data.tape.currentX -= data.tape.bucketWidth / (data.animationTime * 1000 / 60);
      if (data.tape.currentX < -data.tape.bucketWidth) {
        data.tape.currentX = 0;
        data.runAnimation = false;
        data.animationFinished = true;
        // this.position = data.position;
        clearInterval(data.tape.movingId);
      }
    }, 1000 / 60);
  }

  /**
  * Process resising of canvas to fit screen.
  */
  resize() {
    this.canvas.width = this.canvas.parentElement.clientWidth;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }

  destroy() {
    // TODO: Remove event listener for resize
  }

  // Return number of clicked bucket 0 i in middle.
  // If no bucket is clicked return #
  getClickedBucket(mouseX, mouseY) {
    // let width = this.canvas.width;
    // let height = this.canvas.height;

    // if(mouseX > x && mouseX < x + width && mouseY > y && mouseY < y + height) {
    //     return true;
    // }
    return "#";
  }
}


/**
 * Draw an arrowhead on a line on an HTML5 canvas.
 *
 * Based almost entirely off of http://stackoverflow.com/a/36805543/281460 with some modifications
 * for readability and ease of use.
 *
 * @param context The drawing context on which to put the arrowhead.
 * @param from A point, specified as an object with 'x' and 'y' properties, where the arrow starts
 *             (not the arrowhead, the arrow itself).
 * @param to   A point, specified as an object with 'x' and 'y' properties, where the arrow ends
 *             (not the arrowhead, the arrow itself).
 * @param radius The radius of the arrowhead. This controls how "thick" the arrowhead looks.
 *
 * @author https://gist.github.com/jwir3/d797037d2e1bf78a9b04838d73436197
 */
function drawArrowhead(context, from, to, radius) {
	var x_center = to.x;
	var y_center = to.y;

	var angle;
	var x;
	var y;

	context.beginPath();

	angle = Math.atan2(to.y - from.y, to.x - from.x)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.moveTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;

	context.lineTo(x, y);

	angle += (1.0/3.0) * (2 * Math.PI)
	x = radius *Math.cos(angle) + x_center;
	y = radius *Math.sin(angle) + y_center;

	context.lineTo(x, y);

	context.closePath();

	context.fill();
}
