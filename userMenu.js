function centerOnContent() {
  // check, where the first element is, if there is no element, center on 0,0
  if (listToDraw.length > 0) {
    let firstElement = listToDraw[0];
    cameraOffset.x = firstElement.x;
    cameraOffset.y = firstElement.y;
  } else {
    cameraOffset.x = 0;
    cameraOffset.y = 0;
  }

  // add the offset of the window
  cameraOffset.x += canvas.width / 2;
  cameraOffset.y += canvas.height / 2;

  // reset the zoom
  cameraZoom = 1;
}

function exportAsPNG() {
  let link = document.createElement("a");
  let documentName = document.getElementById("documentName").value;
  link.download = documentName + ".png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function exportAsJPG() {
  let link = document.createElement("a");
  let documentName = document.getElementById("documentName").value;
  link.download = documentName + ".jpg";
  link.href = canvas.toDataURL("image/jpeg", 1);
  link.click();
}

function addPointer() {
  let pointer = new Pointer(0, 0, 140, 0, "red", 1);
  listToDraw.push(pointer);
  updateList();
  draw();
}

function addText() {
  let text = new Text(20, 20, "Hello World", 20, "red", "Arial");
  listToDraw.push(text);
  updateList();
  draw();
}

function clearAll(userConfirmed = false) {
  if (userConfirmed && !confirm("Are you sure you want to clear the canvas?")) {
    return;
  }
  listToDraw = [];
  updateList();
  draw();
}

function newDocument() {
  document.getElementById("documentName").value = "New Document";
  clearAll(false);
}

function saveDataToFile() {
  // get the object type and save it to a file with the corresponding data
  let listWithTypes = [];
  for (let i = 0; i < listToDraw.length; i++) {
    let type = listToDraw[i].constructor.name;
    listWithTypes.push({ type: type, data: listToDraw[i] });
  }
  let data = JSON.stringify(listWithTypes);
  let blob = new Blob([data], { type: "text/plain" });
  let url = window.URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  // get the document name
  let documentName = document.getElementById("documentName").value;
  a.download = documentName + ".pd";
  a.click();
}

function loadDataFromFile() {
  let input = document.createElement("input");
  input.type = "file";
  input.accept = ".pd";
  input.onchange = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (readerEvent) => {
      let content = readerEvent.target.result;
      let listWithTypes = JSON.parse(content);
      listToDraw = [];
      for (let i = 0; i < listWithTypes.length; i++) {
        let type = listWithTypes[i].type;
        let data = listWithTypes[i].data;
        if (type == "Pointer") {
          listToDraw.push(
            new Pointer(
              data.x,
              data.y,
              data.length,
              data.angle,
              data.color,
              data.lineWidth,
              data.id
            )
          );
        } else if (type == "Text") {
          listToDraw.push(
            new Text(
              data.x,
              data.y,
              data.text,
              data.size,
              data.color,
              data.font,
              data.id
            )
          );
        }
      }
      draw();
    };

    // set the document name
    let documentName = file.name;
    documentName = documentName.substring(0, documentName.length - 3);
    document.getElementById("documentName").value = documentName;
  };
  input.click();
}

// Add click event listener to select the text when clicked
document.getElementById("documentName").addEventListener("click", function () {
  this.select();
});

document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("sortable-list");

  list.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
      const li = event.target.parentElement;

      // Retrieve the ID from the data attribute
      const id = li.getAttribute("data-id");
      const index = listToDraw.findIndex((item) => item.id == id);
      listToDraw.splice(index, 1);
      updateList();
      draw();
    } else if (event.target.classList.contains("move-up-btn")) {
      const li = event.target.parentElement;

      // Retrieve the ID from the data attribute
      const id = li.getAttribute("data-id");
      const index = listToDraw.findIndex((item) => item.id == id);
      if (index > 0) {
        let temp = listToDraw[index - 1];
        listToDraw[index - 1] = listToDraw[index];
        listToDraw[index] = temp;
      }
      updateList();
      draw();
    } else if (event.target.classList.contains("move-down-btn")) {
      const li = event.target.parentElement;

      // Retrieve the ID from the data attribute
      const id = li.getAttribute("data-id");
      const index = listToDraw.findIndex((item) => item.id == id);
      if (index < listToDraw.length - 1) {
        let temp = listToDraw[index + 1];
        listToDraw[index + 1] = listToDraw[index];
        listToDraw[index] = temp;
      }
      updateList();
      draw();
    }
  });
});

function addItemToList(element) {
  const list = document.getElementById("sortable-list");
  const newItem = document.createElement("li");

  // Store the ID in a data attribute
  newItem.setAttribute("data-id", element.id);

  const input = document.createElement("input");
  input.value = "Element " + element.id;
  // set size of the input to the length of the value
  input.size = 8;
  newItem.appendChild(input);

  const upBtn = document.createElement("button");
  upBtn.textContent = "⏫";
  upBtn.classList.add("move-btn", "move-up-btn");
  newItem.appendChild(upBtn);

  const downBtn = document.createElement("button");
  downBtn.textContent = "⏬";
  downBtn.classList.add("move-btn", "move-down-btn");
  newItem.appendChild(downBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  newItem.appendChild(deleteBtn);

  list.appendChild(newItem);
}

function updateList() {
  const list = document.getElementById("sortable-list");
  list.innerHTML = "";
  // add items in reverse order, so the first element is on top
  for (let i = 0; i < listToDraw.length; i++) {
    addItemToList(listToDraw[i]);
  }
}

// Make the DIV element draggable:
dragElement(document.getElementById("list-container"));

document.getElementById("hide-list").addEventListener("click", hideList);
document.getElementById("hide-list").addEventListener("touchstart", hideList);

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  var header = document.getElementById(elmnt.id + "-header");

  if (header) {
    header.addEventListener("mousedown", dragMouseDown, false);
    header.addEventListener("touchstart", dragMouseDown, { passive: false });
  }

  function dragMouseDown(e) {
    e.preventDefault();
    if (e.type == "touchstart") {
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
    } else {
      pos3 = e.clientX;
      pos4 = e.clientY;
    }

    document.addEventListener("mouseup", closeDragElement, false);
    document.addEventListener("touchend", closeDragElement, false);
    document.addEventListener("mousemove", elementDrag, false);
    document.addEventListener("touchmove", elementDrag, { passive: false });
  }

  function elementDrag(e) {
    e.preventDefault();
    if (e.type == "touchmove") {
      pos1 = pos3 - e.touches[0].clientX;
      pos2 = pos4 - e.touches[0].clientY;
      pos3 = e.touches[0].clientX;
      pos4 = e.touches[0].clientY;
    } else {
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
    }

    // Calculate new position with constraints
    var newLeft = elmnt.offsetLeft - pos1;
    var newTop = elmnt.offsetTop - pos2;

    // Constrain the movement within the viewport
    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - elmnt.offsetWidth));
    newTop = Math.max(0, Math.min(newTop, window.innerHeight - elmnt.offsetHeight));

    elmnt.style.left = newLeft + "px";
    elmnt.style.top = newTop + "px";
  }

  function closeDragElement() {
    document.removeEventListener("mouseup", closeDragElement, false);
    document.removeEventListener("touchend", closeDragElement, false);
    document.removeEventListener("mousemove", elementDrag, false);
    document.removeEventListener("touchmove", elementDrag, false);
  }
}

function hideList() {
  document.getElementById("list-container").style.display = "none";
}


function showList() {
  document.getElementById("list-container").style.display = "block";
  updateList();
  // Center the list in the middle of the screen
  let listContainer = document.getElementById("list-container");
  listContainer.style.left =
    window.innerWidth / 2 - listContainer.offsetWidth / 2 + "px";
  listContainer.style.top =
    window.innerHeight / 2 - listContainer.offsetHeight / 2 + "px";
}