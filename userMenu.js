let addingObject = null;
let contextObject = null;

// Main functions for canvas manipulation and export
function centerOnContent() {
  const firstElement = listToDraw.length > 0 ? listToDraw[0] : { x: 0, y: 0 };
  cameraOffset.x = -firstElement.x + canvas.width / 2;
  cameraOffset.y = -firstElement.y + canvas.height / 2;
  cameraZoom = 1;
}

function exportAsImage(type) {
  const link = document.createElement("a");
  const documentName = document.getElementById("documentName").value;
  link.download = `${documentName}.${type}`;
  link.href = canvas.toDataURL(
    `image/${type}`,
    type === "jpeg" ? 1 : undefined
  );
  link.click();
}

// Object management functions
function addPointer() {
  if (addingObject != null) {
    alert("You can only add one element at a time.");
    return;
  }

  // show add-pointer menu
  document.getElementById("add-pointer").style.display = "flex";
  // show general add menu
  document.getElementById("add-menu").style.display = "block";

  addingObject = new Pointer(
    0,
    0,
    document.getElementById("pointer-length").value,
    document.getElementById("pointer-angle").value,
    document.getElementById("pointer-color").value,
    1
  );
}

function addText() {
  if (addingObject != null) {
    alert("You can only add one element at a time.");
    return;
  }

  // show add-text menu
  document.getElementById("add-text").style.display = "flex";
  // show general add menu
  document.getElementById("add-menu").style.display = "block";

  addingObject = new Text(
    0,
    0,
    document.getElementById("text-value").value,
    document.getElementById("text-size").value,
    document.getElementById("text-color").value,
    "Arial"
  );
}

function addAngle() {
  if (addingObject != null) {
    alert("You can only add one element at a time.");
    return;
  }
  // if there are less than 2 pointers on the canvas, show an alert
  if (listToDraw.filter((item) => item instanceof Pointer).length < 2) {
    alert("You need to add at least two pointers to create an angle.");
    return;
  }

  // show add-angle menu
  document.getElementById("add-angle").style.display = "flex";
  // show general add menu
  document.getElementById("add-menu").style.display = "block";

  addingObject = new Angle(
    0,
    0,
    50,
    document.getElementById("angle-color").value,
    0,
    0
  );

  addAngleBetweenPointers = true;
}

function clearAll(userConfirmed = false) {
  if (!userConfirmed || confirm("Are you sure you want to clear the canvas?")) {
    listToDraw = [];
    updateListAndDraw();
  }
}

function newDocument() {
  if (!confirm("Are you sure you want to create a new document?")) {
    return;
  }
  document.getElementById("documentName").value = "New Document";
  clearAll(false);
}

// File management functions
function saveDataToFile() {
  const listWithTypes = listToDraw.map((item) => ({
    type: item.constructor.name,
    data: item,
  }));
  const data = JSON.stringify(listWithTypes);
  const blob = new Blob([data], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  const documentName = document.getElementById("documentName").value;
  a.href = url;
  a.download = `${documentName}.pd`;
  a.click();
}

function loadDataFromFile() {
  const input = document.createElement("input");
  input.type = "file";
  // accept .pd and .txt files
  input.accept = ".pd, .txt";
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = (readerEvent) => {
      const listWithTypes = JSON.parse(readerEvent.target.result);
      listToDraw = listWithTypes.map(({ type, data }) => {
        if (type === "Pointer") {
          return new Pointer(
            data.x,
            data.y,
            data.length,
            data.angle,
            data.color,
            data.lineWidth,
            data.id
          );
        } else if (type === "Text") {
          return new Text(
            data.x,
            data.y,
            data.text,
            data.size,
            data.color,
            data.font,
            data.id
          );
        } else if (type === "Circle") {
          return new Circle(data.x, data.y, data.radius, data.color, data.id);
        } else if (type === "Angle") {
          return new Angle(
            data.x,
            data.y,
            data.radius,
            data.color,
            data.startAngle,
            data.endAngle,
            data.id
          );
        }
      });
      updateListAndDraw();
      document.getElementById("documentName").value = file.name.slice(0, -3);
    };
  };
  input.click();
}

function pointerChoosePoint() {
  if (listToDraw.length <= 0) {
    alert("You need to add at least one element to choose a point.");
    return;
  }
  choosePoint = true;
  connectPoints = false;
}

function pointerConnect() {
  if (listToDraw.length <= 0) {
    alert("You need to add at least one element to connect two points.");
    return;
  }
  connectPoints = true;
  choosePoint = false;
}

// UI interaction functions
function addItemToList(element) {
  const list = document.getElementById("sortable-list");
  const newItem = document.createElement("li");
  newItem.setAttribute("data-id", element.id);

  newItem.innerHTML = `
    <input value="${element.id}" size="8">
    <button class="move-btn move-up-btn">⏫</button>
    <button class="move-btn move-down-btn">⏬</button>
    <button class="delete-btn">Delete</button>
  `;

  list.appendChild(newItem);
}

function updateList() {
  const list = document.getElementById("sortable-list");
  list.innerHTML = "";
  listToDraw.forEach(addItemToList);
}

function updateListAndDraw() {
  updateList();
  draw();
}

function setupEventListeners() {
  document
    .getElementById("documentName")
    .addEventListener("click", function () {
      this.select();
    });

  const list = document.getElementById("sortable-list");
  list.addEventListener("click", (event) => {
    const li = event.target.parentElement;
    const id = li.getAttribute("data-id");
    const index = listToDraw.findIndex((item) => item.id == id);

    if (event.target.classList.contains("delete-btn")) {
      listToDraw.splice(index, 1);
    } else if (event.target.classList.contains("move-up-btn") && index > 0) {
      [listToDraw[index], listToDraw[index - 1]] = [
        listToDraw[index - 1],
        listToDraw[index],
      ];
    } else if (
      event.target.classList.contains("move-down-btn") &&
      index < listToDraw.length - 1
    ) {
      [listToDraw[index], listToDraw[index + 1]] = [
        listToDraw[index + 1],
        listToDraw[index],
      ];
    }

    updateListAndDraw();
  });

  document.getElementById("hide-list").addEventListener("click", hideList);
  document.getElementById("hide-list").addEventListener("touchstart", hideList);
}

function dragElement(elmnt) {
  const header = document.getElementById(`${elmnt.id}-header`);

  const dragMouseDown = (e) => {
    e.preventDefault();
    let pos3 = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    let pos4 = e.type === "touchstart" ? e.touches[0].clientY : e.clientY;

    const elementDrag = (e) => {
      e.preventDefault();
      const pos1 =
        pos3 - (e.type === "touchmove" ? e.touches[0].clientX : e.clientX);
      const pos2 =
        pos4 - (e.type === "touchmove" ? e.touches[0].clientY : e.clientY);
      pos3 = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
      pos4 = e.type === "touchmove" ? e.touches[0].clientY : e.clientY;

      const newLeft = Math.max(
        0,
        Math.min(elmnt.offsetLeft - pos1, window.innerWidth - elmnt.offsetWidth)
      );
      const newTop = Math.max(
        0,
        Math.min(
          elmnt.offsetTop - pos2,
          window.innerHeight - elmnt.offsetHeight
        )
      );
      elmnt.style.left = `${newLeft}px`;
      elmnt.style.top = `${newTop}px`;
    };

    const closeDragElement = () => {
      document.removeEventListener("mouseup", closeDragElement);
      document.removeEventListener("touchend", closeDragElement);
      document.removeEventListener("mousemove", elementDrag);
      document.removeEventListener("touchmove", elementDrag);
    };

    document.addEventListener("mouseup", closeDragElement);
    document.addEventListener("touchend", closeDragElement);
    document.addEventListener("mousemove", elementDrag);
    document.addEventListener("touchmove", elementDrag, { passive: false });
  };

  if (header) {
    header.addEventListener("mousedown", dragMouseDown);
    header.addEventListener("touchstart", dragMouseDown, { passive: false });
  }
}

function hideList() {
  document.getElementById("list-container").style.display = "none";
}

function showList() {
  document.getElementById("list-container").style.display = "block";
  updateList();
  const listContainer = document.getElementById("list-container");
  listContainer.style.left = `${
    (window.innerWidth - listContainer.offsetWidth) / 2
  }px`;
  listContainer.style.top = `${
    (window.innerHeight - listContainer.offsetHeight) / 2
  }px`;
}

function hideAddMenu() {
  document.getElementById("add-menu").style.display = "none";
  // hide all submenus
  document.getElementById("add-pointer").style.display = "none";
  document.getElementById("add-text").style.display = "none";
  document.getElementById("add-angle").style.display = "none";

  // clear angle input
  document.getElementById("angle-pointer1").value = "";
  document.getElementById("angle-pointer2").value = "";

  addingObject = null;
  nearestMarker = null;
  choosePoint = false;
  connectPoints = false;
  connectPointLocation = null;
  addAngleBetweenPointers = false;
}

function contextDelete() {
  if (contextObject != null) {
    listToDraw = listToDraw.filter((item) => item.id != contextObject.id);
    updateListAndDraw();
  }
  hideContextMenu();
}

function contextFront() {
  if (contextObject != null) {
    listToDraw = listToDraw.filter((item) => item.id != contextObject.id);
    listToDraw.push(contextObject);
    updateListAndDraw();
  }
  hideContextMenu();
}

function contextBack() {
  if (contextObject != null) {
    listToDraw = listToDraw.filter((item) => item.id != contextObject.id);
    listToDraw.unshift(contextObject);
    updateListAndDraw();
  }
  hideContextMenu();
}

function showContextMenu(x, y, object) {
  let contextMenu = document.getElementById("context-menu");
  contextMenu.style.display = "flex";
  contextMenu.style.left = x + "px";
  contextMenu.style.top = y + "px";
  contextObject = object;

  // if the menu would be outside of the window, move it inside
  if (contextMenu.getBoundingClientRect().right > window.innerWidth) {
    contextMenu.style.left = window.innerWidth - contextMenu.offsetWidth + "px";
  }
  if (contextMenu.getBoundingClientRect().bottom > window.innerHeight) {
    contextMenu.style.top =
      window.innerHeight - contextMenu.offsetHeight + "px";
  }
}

function hideContextMenu() {
  let contextMenu = document.getElementById("context-menu");
  contextMenu.style.display = "none";
  contextObject = null;
}

function checkForUpdates() {
  // get version from meta tag
  let version = document.querySelector('meta[name="version"]').content;
  // delete everything except numbers and dots
  version = version.replace(/[^0-9.]/g, "");

  fetch("https://api.github.com/repos/2Friendly4You/PointerDiagram/releases")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let latest = data[0].tag_name;
      // delete everything except numbers and dots
      latest = latest.replace(/[^0-9.]/g, "");
      if (version != latest) {
        alert(
          "There is a new version available: " +
            latest +
            "\n" +
            "You are currently using: " +
            version +
            "\nYou can download it from the releases page on GitHub if you run it locally or contact your administrator to update the site."
        );
      } else {
        alert(
          "You are using the latest version: " +
            version +
            "\nNo updates available."
        );
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to check for updates. Please try again later.");
    });
}

function openGithubPage() {
  window.open("https://github.com/2Friendly4You/PointerDiagram", "_blank");
}

function newBugOrFeature() {
  window.open(
    "https://github.com/2Friendly4You/PointerDiagram/issues/new",
    "_blank"
  );
}

function emailContact() {
  window.open("mailto:pointerdiagram@tobiasrick.de");
}

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  dragElement(document.getElementById("list-container"));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideAddMenu();
  }
});

document.getElementById("pointer-length").addEventListener("input", (event) => {
  const length = event.target.value;
  if (addingObject instanceof Pointer && addingObject != null) {
    addingObject.length = length;
  }
});

document.getElementById("pointer-angle").addEventListener("input", (event) => {
  const angle = event.target.value;
  if (addingObject instanceof Pointer && addingObject != null) {
    addingObject.angle = angle;
  }
});

document.getElementById("pointer-color").addEventListener("input", (event) => {
  const color = event.target.value;
  if (addingObject instanceof Pointer && addingObject != null) {
    addingObject.color = color;
  }
});

document.getElementById("text-value").addEventListener("input", (event) => {
  const text = event.target.value;
  if (addingObject instanceof Text && addingObject != null) {
    addingObject.text = text;
  }
});

document.getElementById("text-size").addEventListener("input", (event) => {
  const size = event.target.value;
  if (addingObject instanceof Text && addingObject != null) {
    addingObject.size = size;
  }
});

document.getElementById("text-color").addEventListener("input", (event) => {
  const color = event.target.value;
  if (addingObject instanceof Text && addingObject != null) {
    addingObject.color = color;
  }
});

document.getElementById("angle-color").addEventListener("input", (event) => {
  const color = event.target.value;
  if (addingObject instanceof Angle && addingObject != null) {
    addingObject.color = color;
  }
});

hideAddMenu();
