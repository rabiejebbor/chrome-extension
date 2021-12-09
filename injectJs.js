// console.log("injected", document);

// document.addEventListener("dragover", (e) => {
//   e.preventDefault;
//   console.log("gragging over");
// });

const MOUSE_VISITED_CLASSNAME = "crx_mouse_visited";
const POPUP_CLASSNAME = "popup_active";
let parents = [];
let children = [];
let parentsAndChildren = [];
let popupActive = false;

window.addEventListener("mouseover", function (e) {
  if (document.querySelector(`.${POPUP_CLASSNAME}`)?.contains(e.target)) {
    if (e.target.tagName === "LI") {
      const index = findIndexInUl(e.target);
      HighlightWhenInPopup(index, "add");
    }
    return;
  }
  addHighlight(e.target);
});

window.addEventListener("mouseout", function (e) {
  if (document.querySelector(`.${POPUP_CLASSNAME}`)?.contains(e.target)) {
    if (e.target.tagName === "LI") {
      const index = findIndexInUl(e.target);
      HighlightWhenInPopup(index, "remove");
    }
    return;
  }
  removeHighlight(e.target);
});

function addHighlight(target) {
  target.addEventListener("dblclick", showPopup);
  target.classList.add(MOUSE_VISITED_CLASSNAME);
}

function removeHighlight(target) {
  target.removeEventListener("dblclick", showPopup);
  target.classList.remove(MOUSE_VISITED_CLASSNAME);
}

function showPopup() {
  //this works only on non clickable elements
  console.log("dblclick");
  const target = document.querySelector(`.${MOUSE_VISITED_CLASSNAME}`);
  parents = [target?.parentElement?.parentElement, target?.parentElement];
  // children = [target.children[0], target.children[1]];
  children = [];
  for (let i = 0; i < 2; i++) {
    if (target.children[i]) {
      children.push(target.children[i]);
    }
  }
  parentsAndChildren = [...parents, ...children];

  const div = document.createElement("div");
  div.classList.add(POPUP_CLASSNAME);

  const ul = document.createElement("ul");
  for (let i = 0; i < parentsAndChildren.length; i++) {
    const { tagName, className, id } = parentsAndChildren[i];
    const li = document.createElement("li");
    if (i < 2) {
      li.innerHTML = `Parent: ${tagName} ${
        className && "/class:" + className
      } ${id && "/ id:" + id}`;
    } else {
      li.innerHTML = `Child: ${tagName} ${className && "/class:" + className} ${
        id && "/ id:" + id
      }`;
    }
    li.addEventListener("click", () => {
      console.log("clivked", parentsAndChildren[i]);
      addElementToSidebar(parentsAndChildren[i]);
    });
    ul.appendChild(li);
  }
  div.appendChild(ul);
  target.appendChild(div);
}

function HighlightWhenInPopup(IndexInUl, action) {
  let elemetToHighlight = parentsAndChildren[IndexInUl];
  if (elemetToHighlight && action === "add") {
    console.log(elemetToHighlight);
    elemetToHighlight.classList.add(MOUSE_VISITED_CLASSNAME);
  } else if (elemetToHighlight && action === "remove") {
    elemetToHighlight.classList.remove(MOUSE_VISITED_CLASSNAME);
  }
}
function findIndexInUl(target) {
  let li = target.closest("li");
  let nodes = Array.from(li?.closest("ul").children);
  return nodes.indexOf(li);
}
function addElementToSidebar(element) {
  // const iframe = document.getElementById("sidebarCont");
  // console.log(iframe.contentDocument || iframe.contentWindow.document);

  element.classList.remove(MOUSE_VISITED_CLASSNAME);
  const { tagName, className, id } = element;
  chrome.storage.sync.set({ toAdd: { tagName, className, id } });
}

//communication between iframe and dom (find better way)
//this aproach has a write limit per min
//for now only works with elements with classname or id
chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log("changes on Injectjs", changes);
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === "toHighlight") {
      const { tagName, className, id } = newValue;
      const target =
        document.getElementsByClassName(className)[0] ||
        document.getElementById(id);
      console.log("target on Injectjs", target);
      target.classList.add(MOUSE_VISITED_CLASSNAME);
    }
    if (key == "toRemoveHighlight") {
      const { tagName, className, id } = newValue;
      // className = className.replaceAll(" ", ".");
      // const target = document.querySelector(`.${className}`);
      const target =
        document.getElementsByClassName(className)[0] ||
        document.getElementById(id);
      console.log("target on Injectjs", target);
      target.classList.remove(MOUSE_VISITED_CLASSNAME);
    }
  }
});
