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

let addAngleBetweenPointers = false;

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
    } else if (item instanceof Angle) {
      drawAngle(item);
    } else if (item instanceof Circle) {
      drawCircle(item);
    }
  }

  // Draw object that is being added
  if (addingObject != null) {
    if (addingObject instanceof Pointer) {
      drawPointer(addingObject);
    } else if (addingObject instanceof Text) {
      drawText(addingObject);
    } else if (addingObject instanceof Angle) {
      drawAngle(addingObject);
    } else if (addingObject instanceof Circle) {
      drawCircle(addingObject);
    }
  }

  // Highlight the contextObjects
  if (contextObject.length > 0) {
    let localContextObject = contextObject.map((item) => cloneObject(item));

    for (let i = 0; i < localContextObject.length; i++) {
      let item = localContextObject[i];
      if (item instanceof Pointer) {
        item.lineWidth = 3;
        drawHighlightPointer(item);
      } else if (item instanceof Text) {
        // make it gray
        item.color = "#808080";
        drawText(item);
      } else if (item instanceof Angle) {
        item.lineWidth = 3;
        drawAngle(item);
      }
    }
  }

  if (nearestMarker != null) {
    drawCircle(nearestMarker);
  }

  requestAnimationFrame(draw);
}

// clones with the same prototype
function cloneObject(obj) {
  if (obj instanceof Pointer || obj instanceof Text || obj instanceof Angle) {
    return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
  } else {
    return structuredClone(obj); // deep clone
  }
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

  // Convert angle from degrees to radians
  angle = (angle * Math.PI) / 180;

  // Draw the line
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x + (length - 3) * Math.cos(angle),
    y + (length - 3) * -Math.sin(angle)
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Draw the arrowhead
  ctx.beginPath();
  ctx.moveTo(x + length * Math.cos(angle), y + length * -Math.sin(angle));
  ctx.lineTo(
    x + length * Math.cos(angle) - 10 * Math.cos(angle - 0.2),
    y + length * -Math.sin(angle) - 10 * -Math.sin(angle - 0.2)
  );
  ctx.lineTo(
    x + length * Math.cos(angle) - 10 * Math.cos(angle + 0.2),
    y + length * -Math.sin(angle) - 10 * -Math.sin(angle + 0.2)
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function drawHighlightPointer(pointer) {
  let x = pointer.x;
  let y = pointer.y;
  let length = pointer.length;
  let angle = pointer.angle;
  let color = pointer.color;
  let lineWidth = pointer.lineWidth;

  // Convert angle from degrees to radians
  angle = (angle * Math.PI) / 180;

  // Draw the line
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x + (length - 8) * Math.cos(angle),
    y + (length - 8) * -Math.sin(angle)
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();

  // Draw the arrowhead
  ctx.beginPath();
  ctx.moveTo(x + length * Math.cos(angle), y + length * -Math.sin(angle));
  ctx.lineTo(
    x + length * Math.cos(angle) - 20 * Math.cos(angle - 0.2),
    y + length * -Math.sin(angle) - 20 * -Math.sin(angle - 0.2)
  );
  ctx.lineTo(
    x + length * Math.cos(angle) - 20 * Math.cos(angle + 0.2),
    y + length * -Math.sin(angle) - 20 * -Math.sin(angle + 0.2)
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

function drawAngle(angle) {
  let x = angle.x;
  let y = angle.y;
  let radius = angle.radius;
  let color = angle.color;
  let startAngle = angle.startAngle;
  let endAngle = angle.endAngle;
  let lineWidth = angle.lineWidth;

  // convert from degrees to radians
  startAngle = (startAngle * Math.PI) / 180;
  endAngle = (endAngle * Math.PI) / 180;

  // the circle in the function goes the opposite way
  // so we need to add 180 degrees to the start angle
  // and subtract 180 degrees from the end angle
  startAngle = Math.PI * 2 - startAngle;
  endAngle = Math.PI * 2 - endAngle;

  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
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

  // if the contextMenu is open don't clear the contextObject
  if (document.getElementById("context-menu").style.display == "none") {
    contextObject = [];
  }

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
    } else if (addAngleBetweenPointers && addingObject != null) {
      if (
        document.getElementById("angle-pointer1").value != "" &&
        document.getElementById("angle-pointer2").value != ""
      ) {
        addAngleBetweenPointers = false;
        document.getElementById("angle-pointer1").value = "";
        document.getElementById("angle-pointer2").value = "";

        listToDraw.push(addingObject);
        hideAddMenu();
        updateList();
        return;
      }

      // get nearest pointer to click
      let nearestPointer = getNearestElement({
        x: mouseLocationToCanvasLocation(e.clientX, e.clientY).x,
        y: mouseLocationToCanvasLocation(e.clientX, e.clientY).y,
      });

      // if it is a pointer, add the id to the input field
      if (nearestPointer instanceof Pointer) {
        if (document.getElementById("angle-pointer1").value == "") {
          document.getElementById("angle-pointer1").value = nearestPointer.id;
          return;
        } else if (
          document.getElementById("angle-pointer2").value == "" &&
          document.getElementById("angle-pointer1").value != nearestPointer.id
        ) {
          // check if the lines are parallel
          let pointer1 = listToDraw.find(
            (item) => item.id == document.getElementById("angle-pointer1").value
          );
          let pointer2 = nearestPointer;
          if (getIntersectionPoint(pointer1, pointer2) == null) {
            alert("Lines are parallel");
            return;
          }
          document.getElementById("angle-pointer2").value = nearestPointer.id;
          return;
        } else {
          return;
        }
      } else {
        return;
      }
    }

    listToDraw.push(addingObject);
    hideAddMenu();

    updateList();
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

  if (
    document.getElementById("angle-pointer1").value != "" &&
    document.getElementById("angle-pointer2").value != ""
  ) {
    // draw the angle between the two pointers
    let pointer1 = listToDraw.find(
      (item) => item.id == document.getElementById("angle-pointer1").value
    );
    let pointer2 = listToDraw.find(
      (item) => item.id == document.getElementById("angle-pointer2").value
    );

    // make a copy of the object pointer1 and pointer2
    pointer1 = { ...pointer1 };
    pointer2 = { ...pointer2 };

    // get intersection point of the two lines
    let intersection = getIntersectionPoint(pointer1, pointer2);

    // get distance between the intersection and the mouse
    let distance = Math.sqrt(
      (intersection.x -
        mouseLocationToCanvasLocation(e.clientX, e.clientY).x) **
        2 +
        (intersection.y -
          mouseLocationToCanvasLocation(e.clientX, e.clientY).y) **
          2
    );

    // Get the angle of the mouse from the intersection
    // Right side is 0 degrees and it goes counterclockwise
    let mouseLocation = mouseLocationToCanvasLocation(e.clientX, e.clientY);

    let angleFromIntersection = Math.atan2(
      mouseLocation.y - intersection.y,
      mouseLocation.x - intersection.x
    );

    // Convert angle from radians to degrees
    angleFromIntersection = (angleFromIntersection * 180) / Math.PI;

    // Adjust the angle to be in the range [0, 360)
    if (angleFromIntersection < 0) {
      angleFromIntersection += 360;
    }

    angleFromIntersection = 360 - angleFromIntersection;

    let pointer1Angle = parseFloat(pointer1.angle);
    let pointer2Angle = parseFloat(pointer2.angle);

    // round to 4 decimal places
    pointer1Angle = Math.round(pointer1Angle * 10000) / 10000;
    pointer2Angle = Math.round(pointer2Angle * 10000) / 10000;

    // check if the pointer looks towards the intersection or away from it and flip the angle if needed
    if (towardsPoint(pointer1, intersection)) {
      pointer1Angle += 180;
    }

    if (towardsPoint(pointer2, intersection)) {
      pointer2Angle += 180;
    }

    // Normalize pointer angles
    pointer1Angle = normalizeAngle(pointer1Angle);
    pointer2Angle = normalizeAngle(pointer2Angle);

    // Check if the mouse is between the two pointers
    if (
      (pointer1Angle < pointer2Angle &&
        angleFromIntersection > pointer1Angle &&
        angleFromIntersection < pointer2Angle) ||
      (pointer1Angle > pointer2Angle &&
        (angleFromIntersection > pointer1Angle ||
          angleFromIntersection < pointer2Angle))
    ) {
      // Set the angle between the two pointers
      addingObject.startAngle = pointer2Angle;
      addingObject.endAngle = pointer1Angle;
    } else {
      // Set the angle between the two pointers
      addingObject.startAngle = pointer1Angle;
      addingObject.endAngle = pointer2Angle;
    }

    // set it as the radius of the angle
    addingObject.radius = distance;

    // set the x and y of the angle
    addingObject.x = intersection.x;
    addingObject.y = intersection.y;

    // set the color of the angle
    addingObject.color = document.getElementById("angle-color").value;
  }
}

// checks if the pointer looks towards a point or away from it
// returns a boolean
function towardsPoint(pointer, point) {
  let x1 = pointer.x;
  let y1 = pointer.y;
  let x2 =
    pointer.x + pointer.length * Math.cos((pointer.angle * Math.PI) / 180);
  let y2 =
    pointer.y - pointer.length * Math.sin((pointer.angle * Math.PI) / 180);

  let x3 = point.x;
  let y3 = point.y;

  // round to 4 decimal places
  x1 = Math.round(x1 * 10000) / 10000;
  y1 = Math.round(y1 * 10000) / 10000;
  x2 = Math.round(x2 * 10000) / 10000;
  y2 = Math.round(y2 * 10000) / 10000;
  x3 = Math.round(x3 * 10000) / 10000;
  y3 = Math.round(y3 * 10000) / 10000;

  // if the pointer is on the point return false
  if (x1 == x3 && y1 == y3) {
    return false;
  }

  let dotProduct = (x3 - x1) * (x2 - x1) + (y3 - y1) * (y2 - y1);

  return dotProduct > 0;
}

// Normalize angle to be in the range [0, 360]
function normalizeAngle(angle) {
  let normalizedAngle = angle % 360;
  if (normalizedAngle < 0) {
    normalizedAngle += 360;
  }
  return normalizedAngle;
}

function getIntersectionPoint(pointer1, pointer2) {
  let x1 = pointer1.x;
  let y1 = pointer1.y;
  let x2 =
    pointer1.x + pointer1.length * Math.cos((pointer1.angle * Math.PI) / 180);
  let y2 =
    pointer1.y - pointer1.length * Math.sin((pointer1.angle * Math.PI) / 180);
  let x3 = pointer2.x;
  let y3 = pointer2.y;
  let x4 =
    pointer2.x + pointer2.length * Math.cos((pointer2.angle * Math.PI) / 180);
  let y4 =
    pointer2.y - pointer2.length * Math.sin((pointer2.angle * Math.PI) / 180);

  let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

  // Use a small threshold to check for near-zero values
  let epsilon = 1e-10;
  if (Math.abs(denominator) < epsilon) {
    return null;
  }

  let intersectionX =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    denominator;
  let intersectionY =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    denominator;

  return { x: intersectionX, y: intersectionY };
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
    } else if (item instanceof Angle) {
      distance = getDistanceToSemicircle(object, item);
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

function getDistanceToSemicircle(object, semicircle) {
  let cx = semicircle.x;
  let cy = semicircle.y;
  let radius = semicircle.radius;
  let startAngle = (semicircle.startAngle * Math.PI) / 180;
  let endAngle = (semicircle.endAngle * Math.PI) / 180;

  let dx = object.x - cx;
  let dy = object.y - cy;
  let distanceToCenter = Math.sqrt(dx * dx + dy * dy);

  // Check if the point is within the semicircle's angle range
  let angleToObject = Math.atan2(dy, dx);
  if (angleToObject < 0) angleToObject += 2 * Math.PI;

  angleToObject = 2 * Math.PI - angleToObject;

  // Adjust angleToObject to be in the range [0, 2 * Math.PI]
  angleToObject = angleToObject % (2 * Math.PI);

  // Convert start and end angles to range [0, 2 * Math.PI]
  startAngle = startAngle % (2 * Math.PI);
  endAngle = endAngle % (2 * Math.PI);

  let isWithinAngleRange =
    (startAngle < endAngle &&
      angleToObject >= startAngle &&
      angleToObject <= endAngle) ||
    (startAngle > endAngle &&
      (angleToObject >= startAngle || angleToObject <= endAngle));

  isWithinAngleRange = !isWithinAngleRange;

  // Calculate the shortest distance to the endpoints of the semicircle
  let startX = cx + radius * Math.cos(startAngle);
  let startY = cy + radius * Math.sin(startAngle);
  let endX = cx + radius * Math.cos(endAngle);
  let endY = cy + radius * Math.sin(endAngle);

  let distanceToStart = Math.sqrt(
    (object.x - startX) ** 2 + (object.y - startY) ** 2
  );
  let distanceToEnd = Math.sqrt(
    (object.x - endX) ** 2 + (object.y - endY) ** 2
  );

  if (isWithinAngleRange) {
    return Math.abs(distanceToCenter - radius); // Distance to the arc of the semicircle
  }

  // If not within the angle range, return the minimum distance to the endpoints
  return Math.min(distanceToStart, distanceToEnd);
}

function onRightClick(e) {
  e.preventDefault();
  // get the closest element to the mouse
  let nearest = getNearestElement({
    x: mouseLocationToCanvasLocation(e.clientX, e.clientY).x,
    y: mouseLocationToCanvasLocation(e.clientX, e.clientY).y,
  });

  if (nearest != null) {
    document.getElementById("context-values").innerHTML = "";
    // show important values of the element
    if(nearest instanceof Pointer) {
      // round to 4 decimal places
      document.getElementById("context-values").innerHTML += `<p>Length: ${Math.round(nearest.length * 10000) / 10000} <br> Angle: ${Math.round(nearest.angle * 10000) / 10000}</p>`;
    } else if (nearest instanceof Angle) {
      // calculate the angle of the angle and round to 4 decimal places
      let angle = Math.abs(nearest.startAngle - nearest.endAngle);
      angle = Math.round(angle * 10000) / 10000;
      document.getElementById("context-values").innerHTML += `<p>Angle: ${angle}</p>`;
    }

    // if strg is pressed, add the element to the contextObject without removing the previous ones
    if (e.ctrlKey && contextObject != null) {
      contextObject.push(nearest);
    } else {
      contextObject = [nearest];
    }
    // delete all null values from the contextObject
    contextObject = contextObject.filter((item) => item != null);
    showContextMenu(e.clientX, e.clientY);
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
