// Main functions for canvas manipulation and export
function centerOnContent() {
  const firstElement = listToDraw.length > 0 ? listToDraw[0] : { x: 0, y: 0 };
  cameraOffset.x = firstElement.x + canvas.width / 2;
  cameraOffset.y = firstElement.y + canvas.height / 2;
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
  listToDraw.push(new Pointer(0, 0, 140, 0, "red", 1));
  updateListAndDraw();
}

function addText() {
  listToDraw.push(new Text(20, 20, "Hello World", 20, "red", "Arial"));
  updateListAndDraw();
}

function clearAll(userConfirmed = false) {
  if (!userConfirmed || confirm("Are you sure you want to clear the canvas?")) {
    listToDraw = [];
    updateListAndDraw();
  }
}

function newDocument() {
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
  input.accept = ".pd";
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
        }
      });
      updateListAndDraw();
      document.getElementById("documentName").value = file.name.slice(0, -3);
    };
  };
  input.click();
}

// UI interaction functions
function addItemToList(element) {
  const list = document.getElementById("sortable-list");
  const newItem = document.createElement("li");
  newItem.setAttribute("data-id", element.id);

  newItem.innerHTML = `
    <input value="Element ${element.id}" size="8">
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
            "\nYou can download it from the releases page on GitHub if you run it locally or contact your administrator."
        );
      } else {
        alert("You are using the latest version.");
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
    "https://github.com/2Friendly4You/PointerDiagram/issues/new/choose",
    "_blank"
  );
}

function emailContact(){
  window.open("mailto:pointerdiagram@tobiasrick.de");
}

document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
  dragElement(document.getElementById("list-container"));
});
