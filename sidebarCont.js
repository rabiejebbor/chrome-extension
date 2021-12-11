const blocks = document.querySelector(".blocks");
const MOUSE_VISITED_CLASSNAME = "crx_mouse_visited";
const POPUP_CLASSNAME = "popup_active";

// injections
chrome.tabs.query({ active: true, currentWindow: true }).then((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab[0].id },
    files: ["injectJs.js"],
  });
});

// adding element to sidebar on change
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "toAdd") {
      const { tagName, className, id, htmlOfElement, parentInfo } = newValue;

      const div = document.createElement("div");
      div.innerHTML = `<h4>${tagName}-element/ class:${className} / id:${id}</h4>`;
      // div.innerText = `${tagName}-element/ class:${className} / id:${id}`;
      div.classList.add("draggable");
      div.addEventListener("mouseover", function () {
        chrome.tabs.query({ active: true }, function (tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: highlightInParentPage,
            args: [className, id, MOUSE_VISITED_CLASSNAME],
          });
        });
      });
      div.addEventListener("mouseout", function () {
        chrome.tabs.query({ active: true }, function (tabs) {
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: removeHighlightInParentPage,
            args: [className, id, MOUSE_VISITED_CLASSNAME],
          });
        });
      });

      blocks.appendChild(div);
    }
  }
});

function highlightInParentPage(className, id, MOUSE_VISITED_CLASSNAME) {
  const target =
    document.getElementsByClassName(className)[0] ||
    document.getElementById(id);

  target.classList.add(MOUSE_VISITED_CLASSNAME);
}
function removeHighlightInParentPage(className, id, MOUSE_VISITED_CLASSNAME) {
  const target =
    document.getElementsByClassName(className)[0] ||
    document.getElementById(id);

  target.classList.remove(MOUSE_VISITED_CLASSNAME);
}

//adding D&D
const draggables = document.querySelectorAll(".draggable");
let dragging = false;
draggables.forEach((draggable) => {
  // draggable.addEventListener("dragstart", (e) => {
  //   console.log("e", e);
  //   draggable.classList.add("dragging");
  // });
  // draggable.addEventListener("dragend", () => {
  //   draggable.classList.remove("dragging");
  // });
  draggable.addEventListener("mousedown", (e) => {
    e.stopPropagation();
    e.preventDefault();
    dragging = true;
  });
});
document.addEventListener("mousemove", (e) => {
  if (dragging) {
    console.log("moving", e);
    console.log("X", e.clientX, "Y", e.clientY);
    // if (e.clientX == 0) {
    //   console.log("out");
    // }
  }
});
// document.addEventListener("dragover", (e) => {
//   e.preventDefault;
//   console.log("gragging over document");
// });
// window.addEventListener("dragleave", (e) => {
//   console.log("gragging left document", e);
// });
// window.addEventListener("dragenter", (e) => {
//   console.log("gragenter document", e);
// });
