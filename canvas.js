let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cameraZoom = 1;
let MAX_ZOOM = 100;
let MIN_ZOOM = 0.01;
let SCROLL_SENSITIVITY = 0.005;

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Translate to the canvas centre before zooming - so you'll always zoom on what you're looking directly at
  ctx.translate(window.innerWidth / 2, window.innerHeight / 2);
  ctx.scale(cameraZoom, cameraZoom);
  ctx.translate(
    -window.innerWidth / 2 + cameraOffset.x,
    -window.innerHeight / 2 + cameraOffset.y
  );
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Draw everything in the list
  for (let i = 0; i < listToDraw.length; i++) {
    let item = listToDraw[i];
    if (item instanceof Pointer) {
      drawPointer(item);
    } else if (item instanceof Text) {
      drawText(item);
    }
  }

  requestAnimationFrame(draw);
}

// Gets the relevant location from a mouse or single touch event
function getEventLocation(e) {
  if (e.touches && e.touches.length == 1) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  } else if (e.clientX && e.clientY) {
    return { x: e.clientX, y: e.clientY };
  }
}

function drawText(text) {
  let x = text.x;
  let y = text.y;
  let size = text.size;
  let color = text.color;
  let font = text.font;

  ctx.font = `${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.fillText(text.text, x, y);
}

function drawPointer(pointer) {
  let x = pointer.x;
  let y = pointer.y;
  let length = pointer.length;
  let angle = pointer.angle;
  let color = pointer.color;
  let lineWidth = pointer.lineWidth;

  // an arrow is a line with a triangle at the end
  // convert from degrees to radians
  angle = (angle * Math.PI) / 180;
  
  // draw the line in the direction of the angle and the length and the width and the color
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + (length - 1) * Math.cos(angle), y + (length - 1) * -Math.sin(angle));
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // draw the triangle at the end of the line
  ctx.beginPath();
  ctx.moveTo(x + length * Math.cos(angle), y + length * -Math.sin(angle));
  ctx.lineTo(
    x + length * Math.cos(angle) - 10 * Math.cos(angle - 0.5),
    y + length * -Math.sin(angle) - 10 * -Math.sin(angle - 0.5)
  );
  ctx.lineTo(
    x + length * Math.cos(angle) - 10 * Math.cos(angle + 0.5),
    y + length * -Math.sin(angle) - 10 * -Math.sin(angle + 0.5)
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

let isDragging = false;
let dragStart = { x: 0, y: 0 };

function onPointerDown(e) {
  isDragging = true;
  dragStart.x = getEventLocation(e).x / cameraZoom - cameraOffset.x;
  dragStart.y = getEventLocation(e).y / cameraZoom - cameraOffset.y;
}

function onPointerUp(e) {
  isDragging = false;
  initialPinchDistance = null;
  lastZoom = cameraZoom;
}

function onPointerMove(e) {
  if (isDragging) {
    cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x;
    cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y;
  }
}

function handleTouch(e, singleTouchHandler) {
  if (e.touches.length == 1) {
    singleTouchHandler(e);
  } else if (e.type == "touchmove" && e.touches.length == 2) {
    isDragging = false;
    handlePinch(e);
  }
}

let initialPinchDistance = null;
let lastZoom = cameraZoom;

function handlePinch(e) {
  e.preventDefault();

  let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY };

  // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
  let currentDistance = (touch1.x - touch2.x) ** 2 + (touch1.y - touch2.y) ** 2;

  if (initialPinchDistance == null) {
    initialPinchDistance = currentDistance;
  } else {
    adjustZoom(null, currentDistance / initialPinchDistance);
  }
}

function adjustZoom(zoomAmount, zoomFactor) {
  if (!isDragging) {
    if (zoomAmount) {
      cameraZoom += zoomAmount;
    } else if (zoomFactor) {
      cameraZoom = zoomFactor * lastZoom;
    }

    cameraZoom = Math.min(cameraZoom, MAX_ZOOM);
    cameraZoom = Math.max(cameraZoom, MIN_ZOOM);
  }
}

function setZoom(zoom) {
  cameraZoom = zoom;
}

canvas.addEventListener("mousedown", onPointerDown);
canvas.addEventListener("touchstart", (e) => handleTouch(e, onPointerDown));
canvas.addEventListener("mouseup", onPointerUp);
canvas.addEventListener("touchend", (e) => handleTouch(e, onPointerUp));
canvas.addEventListener("mousemove", onPointerMove);
canvas.addEventListener("touchmove", (e) => handleTouch(e, onPointerMove));
canvas.addEventListener("wheel", (e) =>
  adjustZoom(e.deltaY * SCROLL_SENSITIVITY)
);