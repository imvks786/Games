/**
 * @file main.js
 * @description This script handles the logic for a circle drawing game, including canvas interactions, drawing, and accuracy calculations.
 */

const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");
const resultElement = document.getElementById("result");
let isDrawing = false;
let points = [];

/**
 * @constant {object} centerPoint
 * @description The center point of the circle, used as a guide for the user.
 * @property {number} x - The x-coordinate of the center point.
 * @property {number} y - The y-coordinate of the center point.
 */
const centerPoint = { x: canvas.width / 2, y: canvas.height / 2 };

/**
 * @function drawCenterPoint
 * @description Draws a red dot at the center of the canvas to guide the user.
 */
function drawCenterPoint() {
  ctx.beginPath();
  ctx.arc(centerPoint.x, centerPoint.y, 5, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

/**
 * @function clearCanvas
 * @description Clears the entire canvas and redraws the center point.
 */
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCenterPoint();
}

// Initial draw of the center point
clearCanvas();

/**
 * @function getPosition
 * @description Determines the user's touch or mouse position relative to the canvas.
 * @param {Event} event - The mouse or touch event.
 * @returns {{x: number, y: number}} The coordinates of the user's input.
 */
function getPosition(event) {
  if (event.touches) {
    const touch = event.touches[0];
    return {
      x: touch.clientX - canvas.getBoundingClientRect().left,
      y: touch.clientY - canvas.getBoundingClientRect().top,
    };
  }
  return {
    x: event.offsetX,
    y: event.offsetY,
  };
}

/**
 * @function startDrawing
 * @description Initializes the drawing process when the user starts interacting with the canvas.
 * @param {Event} event - The mouse or touch event that triggers the drawing.
 */
function startDrawing(event) {
  isDrawing = true;
  points = [];
  clearCanvas(); // Clear canvas and redraw the center point
  const pos = getPosition(event);
  points.push(pos);
}

/**
 * @function draw
 * @description Draws lines on the canvas as the user moves their mouse or finger.
 * @param {Event} event - The mouse or touch event.
 */
function draw(event) {
  if (!isDrawing) return;
  const pos = getPosition(event);
  points.push(pos);

  // Draw points
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  const prevPoint = points[points.length - 2];
  ctx.moveTo(prevPoint.x, prevPoint.y);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
}

/**
 * @function stopDrawing
 * @description Stops the drawing process when the user releases the mouse or lifts their finger.
 */
function stopDrawing() {
  isDrawing = false;
}

/**
 * @function calculateCircleAccuracy
 * @description Calculates how accurately the user has drawn a circle based on the collected points.
 *              It then displays the accuracy score to the user.
 */
function calculateCircleAccuracy() {
  if (points.length < 3) {
    resultElement.innerText = "Not enough points to evaluate!";
    return;
  }

  // Calculate average radius and deviation
  const radii = points.map(
    (point) =>
      Math.sqrt(
        Math.pow(point.x - centerPoint.x, 2) +
          Math.pow(point.y - centerPoint.y, 2)
      )
  );
  const averageRadius =
    radii.reduce((sum, radius) => sum + radius, 0) / radii.length;

  const deviation = Math.sqrt(
    radii.reduce(
      (sum, radius) => sum + Math.pow(radius - averageRadius, 2),
      0
    ) / radii.length
  );

  // Calculate accuracy (lower deviation -> higher accuracy)
  const accuracy = Math.max(0, 100 - deviation * 10).toFixed(2);
  resultElement.innerText = `Circle Accuracy: ${accuracy}%`;
}

// Add event listeners for both touch and mouse inputs
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseout", stopDrawing);

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  startDrawing(e);
});
canvas.addEventListener("touchmove", (e) => {
  e.preventDefault();
  draw(e);
});
canvas.addEventListener("touchend", stopDrawing);

// Button click event
document.getElementById("checkCircle").addEventListener("click", () => {
  calculateCircleAccuracy();
});