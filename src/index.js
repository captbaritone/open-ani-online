// import "./styles.css";

/*

# TODO

- [ ] Prompt them to move their cursor
- [ ] Add option to reset
- [ ] Ensure we have a single paint
- [ ] Support Paste
- [ ] Include a demo file?

*/

const style = document.createElement("style");
document.head.appendChild(style);

const drop = document.getElementById("drop");
const current = document.getElementById("current");

const fileButton = document.getElementById("file-button");

const input = document.createElement("input");
input.type = "file";
input.multiple = false;

fileButton.addEventListener("click", (e) => {
  input.click();
});

input.addEventListener("change", async (e) => {
  const firstFile = input.files[0];
  await loadFile(firstFile);
});

document.getElementById("example").addEventListener("click", () => {
  loadExample();
});

async function loadExample() {
  const response = await fetch("assets/butterfly.ani");
  const buffer = await response.arrayBuffer();
  await loadArrayBuffer(buffer, "butterfly.ani");
}

async function loadArrayBuffer(buffer, fileName) {
  // We attempted to preload this after JS started loading so we probably have
  // it already loaded.
  const AniCursor = await import("ani-cursor");
  const arr = new Uint8Array(buffer);
  reset();
  try {
    const css = AniCursor.convertAniBinaryToCSS(".preview", arr);
    style.innerHTML = css;
  } catch (e) {
    alert(`Error parsing .ani file: ${e.message}`);
    return;
  }
  populateCurrent(fileName);
}

function populateCurrent(fileName) {
  const fileNameElement = document.createElement("span");
  fileNameElement.style.fontWeight = "bold";
  fileNameElement.style.fontFamily = "monospace";
  fileNameElement.innerText = fileName;

  current.appendChild(fileNameElement);
  drop.classList.add("preview");
}

function reset() {
  style.innerHTML = "";
  current.innerHTML = "";
  drop.classList.remove("preview");
}

async function loadFile(file) {
  if (file == null) {
    alert("You must select a file");
    return;
  }
  const arrayBuffer = await getFileAsArrayBuffer(file);
  await loadArrayBuffer(arrayBuffer, file.name);
}

function dragEnterHandler(e) {
  drop.classList.add("dragging");
}

function dragLeaveHandler(e) {
  drop.classList.remove("dragging");
}

window.document.addEventListener("drop", dropHandler);
window.document.addEventListener("dragover", dragOverHandler);
drop.addEventListener("dragenter", dragEnterHandler);
drop.addEventListener("dragleave", dragLeaveHandler);

function dropHandler(ev) {
  drop.classList.remove("dragging");
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.files.length > 1) {
    alert("Only drop one .ani file at a time.");
    return;
  }

  const firstFile = ev.dataTransfer.files[0];
  loadFile(firstFile);
}

function dragOverHandler(ev) {
  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

async function getFileAsArrayBuffer(file) {
  if (file.arrayBuffer != null) {
    return file.arrayBuffer();
  } else {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.readAsArrayBuffer(file);
    });
  }
}

// Start downloading `ani-cursor` immediately.
/* eslint-disable-next-line no-unused-expressions */
import("ani-cursor");
