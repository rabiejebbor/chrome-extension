console.log("sidebarcont", document);
const draggables = document.querySelectorAll(".draggable");
const blocks = document.querySelector(".blocks");

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    console.log("dragstart sidebarcont");
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});
document.addEventListener("dragover", (e) => {
  e.preventDefault;
  console.log("gragging over document");
});

// adding element to sidebar on change
chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log("changes on sidebarcont", changes);
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "toAdd") {
      const { tagName, className, id } = newValue;
      const div = document.createElement("div");
      // div.innerHTML = `<h4>${tagName}-element/ class:${className} / id:${id}</h4>`;
      div.innerText = `${tagName}-element/ class:${className} / id:${id}`;
      div.classList.add("draggable");
      div.addEventListener("mouseover", function () {
        sendAddHighlight({ tagName, className, id });
      });
      div.addEventListener("mouseout", function () {
        sendRemoveHighlight({ tagName, className, id });
      });

      blocks.appendChild(div);
    }
  }
});

function sendAddHighlight(target) {
  chrome.storage.sync.set({ toHighlight: target });
}
function sendRemoveHighlight(target) {
  chrome.storage.sync.set({ toRemoveHighlight: target });
}

// injections
chrome.tabs.query({ active: true, currentWindow: true }).then((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab[0].id },
    files: ["injectJs.js"],
  });
});
