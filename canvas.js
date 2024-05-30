let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let cameraOffset = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cameraZoom = 1;
let MAX_ZOOM = 100;
let MIN_ZOOM = 0.01;
let SCROLL_SENSITIVITY = 0.005;

let nearestMarker = null;

let choosePoint = false;

let connectPoints = false;
let connectPointLocation = null;

function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Translate to the canvas center before zooming
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

  // Draw object that is being added
  if (addingObject != null) {
    if (addingObject instanceof Pointer) {
      drawPointer(addingObject);
    } else if (addingObject instanceof Text) {
      drawText(addingObject);
    }
  }

  if (nearestMarker != null) {
    drawCircle(nearestMarker);
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
  ctx.lineTo(
    x + (length - 1) * Math.cos(angle),
    y + (length - 1) * -Math.sin(angle)
  );
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

function drawCircle(circle) {
  let x = circle.x;
  let y = circle.y;
  let radius = circle.radius;
  let color = circle.color;

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
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

  hideContextMenu();

  if (addingObject != null && e.button == 0) {
    // If the user is adding a pointer, they can choose a point to connect to
    if (nearestMarker != null && choosePoint) {
      addingObject.x = nearestMarker.x;
      addingObject.y = nearestMarker.y;
      // If the user is connecting two points, they can choose two points to connect to
    } else if (nearestMarker != null && connectPoints) {
      if (connectPointLocation == null) {
        connectPointLocation = { x: nearestMarker.x, y: nearestMarker.y };
        return;
      } else {
        let lengthBetweenPoints = Math.sqrt(
          (connectPointLocation.x - nearestMarker.x) ** 2 +
            (connectPointLocation.y - nearestMarker.y) ** 2
        );
        let angleBetweenPoints =
          (-Math.atan2(
            nearestMarker.y - connectPointLocation.y,
            nearestMarker.x - connectPointLocation.x
          ) *
            180) /
          Math.PI;
        let pointer = new Pointer(
          connectPointLocation.x,
          connectPointLocation.y,
          lengthBetweenPoints,
          angleBetweenPoints,
          addingObject.color,
          1
        );
        listToDraw.push(pointer);
        hideAddMenu();
        return;
      }
    }

    listToDraw.push(addingObject);
    hideAddMenu();
  }
}

function onPointerMove(e) {
  if (isDragging) {
    cameraOffset.x = getEventLocation(e).x / cameraZoom - dragStart.x;
    cameraOffset.y = getEventLocation(e).y / cameraZoom - dragStart.y;
  }

  // If an object is being added, update its position
  if (addingObject != null) {
    let eventLocation = getEventLocation(e);
    addingObject.x = mouseLocationToCanvasLocation(
      eventLocation.x,
      eventLocation.y
    ).x;
    addingObject.y = mouseLocationToCanvasLocation(
      eventLocation.x,
      eventLocation.y
    ).y;
  }

  if (choosePoint || connectPoints) {
    nearestMarkerPoint = getNearestEnd({
      x: mouseLocationToCanvasLocation(
        getEventLocation(e).x,
        getEventLocation(e).y
      ).x,
      y: mouseLocationToCanvasLocation(
        getEventLocation(e).x,
        getEventLocation(e).y
      ).y,
    });
    nearestMarker = new Circle(
      nearestMarkerPoint.x,
      nearestMarkerPoint.y,
      5,
      addingObject.color
    );
  }
}

function mouseLocationToCanvasLocation(x, y) {
  return {
    x:
      (x - canvas.width / 2) / cameraZoom + (canvas.width / 2 - cameraOffset.x),
    y:
      (y - canvas.height / 2) / cameraZoom +
      (canvas.height / 2 - cameraOffset.y),
  };
}

function getNearestEnd(object) {
  let nearest = null;
  let nearestDistance = Infinity;
  let listOfPointers = listToDraw.filter((item) => item instanceof Pointer);
  // add the points to the list of points
  let listOfPoints = [];
  for (let i = 0; i < listOfPointers.length; i++) {
    let pointer = listOfPointers[i];
    listOfPoints.push({ x: pointer.x, y: pointer.y });
    listOfPoints.push({
      x: pointer.x + pointer.length * Math.cos((pointer.angle * Math.PI) / 180),
      y: pointer.y - pointer.length * Math.sin((pointer.angle * Math.PI) / 180),
    });
  }
  // check the distance to each point
  for (let i = 0; i < listOfPoints.length; i++) {
    let point = listOfPoints[i];
    let distance = Math.sqrt(
      (object.x - point.x) ** 2 + (object.y - point.y) ** 2
    );
    if (distance < nearestDistance) {
      nearest = point;
      nearestDistance = distance;
    }
  }
  return nearest;
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

function getNearestElement(object) {
  let nearest = null;
  let nearestDistance = Infinity;

  for (let i = 0; i < listToDraw.length; i++) {
    let item = listToDraw[i];
    let distance;

    if (item instanceof Pointer) {
      distance = getDistanceToPointer(object, item);
    } else if (item instanceof Text) {
      distance = getDistanceToText(object, item);
    } else {
      distance = Math.sqrt((object.x - item.x) ** 2 + (object.y - item.y) ** 2);
    }

    if (distance < nearestDistance) {
      nearest = item;
      nearestDistance = distance;
    }
  }

  if (nearestDistance > 5) {
    return null;
  }

  return nearest;
}

function getDistanceToPointer(object, pointer) {
  let x1 = pointer.x;
  let y1 = pointer.y;
  let x2 =
    pointer.x + pointer.length * Math.cos((pointer.angle * Math.PI) / 180);
  let y2 =
    pointer.y + pointer.length * Math.sin((-pointer.angle * Math.PI) / 180);

  let objectX = object.x;
  let objectY = object.y;

  // Calculate the projection of the object point onto the line segment
  let A = objectX - x1;
  let B = objectY - y1;
  let C = x2 - x1;
  let D = y2 - y1;

  let dot = A * C + B * D;
  let len_sq = C * C + D * D;
  let param = -1;

  if (len_sq != 0) {
    // to avoid division by zero
    param = dot / len_sq;
  }

  let nearestX, nearestY;

  if (param < 0) {
    nearestX = x1;
    nearestY = y1;
  } else if (param > 1) {
    nearestX = x2;
    nearestY = y2;
  } else {
    nearestX = x1 + param * C;
    nearestY = y1 + param * D;
  }

  // Calculate the distance to the nearest point
  let distance = Math.sqrt(
    (objectX - nearestX) ** 2 + (objectY - nearestY) ** 2
  );

  return distance;
}

function getDistanceToText(object, text) {
  let x = text.x;
  let y = text.y;
  let width = ctx.measureText(text.text).width;
  let height = parseInt(ctx.font, 10); // Assuming font size is in pixels

  let dx = Math.max(x - object.x, 0, object.x - (x + width));
  let dy = Math.max(y - object.y, 0, object.y - (y + height));

  return Math.sqrt(dx * dx + dy * dy);
}

function onRightClick(e) {
  e.preventDefault();
  // get the closest element to the mouse
  let nearest = getNearestElement({
    x: mouseLocationToCanvasLocation(e.clientX, e.clientY).x,
    y: mouseLocationToCanvasLocation(e.clientX, e.clientY).y,
  });

  if (nearest != null) {
    showContextMenu(e.clientX, e.clientY, nearest);
  } else {
    hideContextMenu();
  }
}

document.addEventListener("contextmenu", (e) => onRightClick(e));
canvas.addEventListener("mousedown", onPointerDown);
canvas.addEventListener("touchstart", (e) => handleTouch(e, onPointerDown));
canvas.addEventListener("mouseup", onPointerUp);
canvas.addEventListener("touchend", (e) => handleTouch(e, onPointerUp));
canvas.addEventListener("mousemove", onPointerMove);
canvas.addEventListener("touchmove", (e) => handleTouch(e, onPointerMove));
canvas.addEventListener("wheel", (e) =>
  adjustZoom(e.deltaY * SCROLL_SENSITIVITY)
);
