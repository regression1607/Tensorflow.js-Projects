let x_vals = [];
let y_vals = [];

let m, b;
let ball;
let speed = 2; // Speed factor for ball movement
let gameOver = false; // Game over flag
let startTime, elapsedTime; // Timer variables
let timerRunning = false; // Timer running flag

const learningRate = 0.5;
const optimizer = tf.train.sgd(learningRate);

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight); // Create a canvas that matches the window size
  canvas.parent('canvas-container'); // Attach canvas to the canvas-container div
  m = tf.variable(tf.scalar(0)); // Slope of the line (0 for a straight line)
  b = tf.variable(tf.scalar(0.5)); // Y-intercept of the line (middle of the canvas)
  ball = new Ball(width / 2, height / 2); // Initialize the ball at the center of the canvas
  background(0); // Set background color to black

  let startButton = select('#startButton');
  startButton.mousePressed(startGame);

  let restartButton = select('#restartButton');
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // Resize the canvas when the window is resized
  background(0); // Optionally, reset the background color to black
}

function loss(pred, labels) {
  return pred.sub(labels).square().mean();
}

function predict(x) {
  const xs = tf.tensor1d(x);
  // y = mx + b;
  const ys = xs.mul(m).add(b);
  return ys;
}

function mousePressed() {
  if (!gameOver && timerRunning) {
    let x = map(mouseX, 0, width, 0, 1);
    let y = map(mouseY, 0, height, 1, 0);
    x_vals.push(x);
    y_vals.push(y);
  }
}

function draw() {
  if (gameOver) {
    background(0);
    fill(255, 0, 0);
    textSize(64);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);

    textSize(32);
    text(`Time: ${nf(floor(elapsedTime / 60), 2)}:${nf(elapsedTime % 60, 2)}`, width / 2, height / 2 + 80);

    select('#restartButton').show();
    return;
  }

  if (timerRunning) {
    elapsedTime = floor((millis() - startTime) / 1000);
    select('#timer').html(`Time: ${nf(floor(elapsedTime / 60), 2)}:${nf(elapsedTime % 60, 2)}`);
  }

  tf.tidy(() => {
    if (x_vals.length > 0) {
      const ys = tf.tensor1d(y_vals);
      optimizer.minimize(() => loss(predict(x_vals), ys));
    }
  });

  background(0);

  stroke(255);
  strokeWeight(8);
  for (let i = 0; i < x_vals.length; i++) {
    let px = map(x_vals[i], 0, 1, 0, width);
    let py = map(y_vals[i], 0, 1, height, 0);
    point(px, py);
  }

  const lineX = [0, 1];

  const ys = tf.tidy(() => predict(lineX));
  let lineY = ys.dataSync();
  ys.dispose();

  let x1 = map(lineX[0], 0, 1, 0, width);
  let x2 = map(lineX[1], 0, 1, 0, width);

  let y1 = map(lineY[0], 0, 1, height, 0);
  let y2 = map(lineY[1], 0, 1, height, 0);

  strokeWeight(2);
  line(x1, y1, x2, y2);

  ball.update(x1, x2, y1, y2);
  ball.show();

  if (ball.isGameOver()) {
    gameOver = true;
    timerRunning = false;
  }

  console.log(tf.memory().numTensors);
}

class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 16; // radius of the ball
    this.vx = 0; // x velocity
    this.vy = 0; // y velocity
  }

  update(x1, x2, y1, y2) {
    if (gameOver) return;

    // Apply gravity
    this.vy += 0.1;
    this.y += this.vy;

    // Determine the slope of the line
    const slope = (y2 - y1) / (x2 - x1);

    // Calculate the target Y position on the line for the current X position
    const targetY = map(this.x, 0, width, y1, y2);

    // Check if the ball is on the line
    if (this.y >= targetY - this.r && this.y <= targetY + this.r) {
      this.y = targetY - this.r;
      this.vy = 0; // Reset vertical velocity to make the ball stay on the line

      // Move the ball towards the side with less steep slope
      if (slope > 0) {
        this.vx = speed;
      } else if (slope < 0) {
        this.vx = -speed;
      } else {
        this.vx = 0;
      }
    } else if (this.y > targetY + this.r) {
      // If the ball falls below the line, reset it to the line
      this.y = targetY - this.r;
      this.vy = 0;
    }

    // Update x position
    this.x += this.vx;

    // Keep ball within canvas boundaries
    if (this.x < 0 || this.x > width) {
      this.gameOver();
    }
  }

  show() {
    fill(255);
    stroke(255);
    ellipse(this.x, this.y, this.r * 2);
  }

  gameOver() {
    gameOver = true;
  }

  isGameOver() {
    return gameOver;
  }
}

function startGame() {
  let startButton = select('#startButton');
  startButton.hide();
  timerRunning = true;
  startTime = millis();
}

function restartGame() {
    location.reload(); // Reload the page
  }
