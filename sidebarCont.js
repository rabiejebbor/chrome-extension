const draggables = document.querySelectorAll(".draggable");

draggables.forEach((draggable) => {
  draggable.addEventListener("dragstart", async () => {
    console.log("dragstart sidebarcont");
    draggable.classList.add("dragging");
  });

  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

chrome.tabs.query({ active: true, currentWindow: true }).then((tab) => {
  console.log(tab);
  chrome.scripting.executeScript({
    target: { tabId: tab[0].id },
    files: ["injectJs.js"],
  });
});
