const MOUSE_VISITED_CLASSNAME = "crx_mouse_visited";
const POPUP_CLASSNAME = "popup_active";
let parents = [];
let children = [];
let parentsAndChildren = [];
let popupActive = false;

window.addEventListener("mouseover", function (e) {
  if (isInPopUp(e.target, "add")) return;

  addHighlight(e.target);
});

window.addEventListener("mouseout", function (e) {
  if (isInPopUp(e.target, "remove")) return;

  removeHighlight(e.target);
});

function showPopup() {
  //this works only on non clickable elements
  console.log("dblclick");
  if (document.querySelector(`.${POPUP_CLASSNAME}`)) {
    document.querySelector(`.${POPUP_CLASSNAME}`).remove();
  }
  const target = document.querySelector(`.${MOUSE_VISITED_CLASSNAME}`);
  parents = getParents(target, 2);
  children = getChildren(target, 2);
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
      // console.log("clivked", parentsAndChildren[i]);
      addElementToSidebar(parentsAndChildren[i]);
    });
    ul.appendChild(li);
  }
  div.appendChild(ul);
  target.appendChild(div);
}
function getParents(target, numberOfParents) {
  let parents = [];
  let element = target.parentElement;
  while (element && parents.length < numberOfParents) {
    parents.unshift(element);
    element = element.parentElement;
  }
  return parents;
}

function getChildren(target, numberOfChildren) {
  const unwantedElements = ["STYLE", "DIALOG"];
  let children = [];
  let i = 0;
  let element = target.children[i];
  while (element && children.length < numberOfChildren) {
    if (!unwantedElements.includes(element.tagName)) {
      children.push(element);
    }
    i++;
    element = target.children[i];
  }

  return children;
}

function addElementToSidebar(element) {
  element.classList.remove(MOUSE_VISITED_CLASSNAME);
  const parent = element.parentElement;
  const parentInfo = {
    tagName: parent?.tagName,
    className: parent?.className,
    id: parent?.id,
    // innerHTML: parent?.innerHTML,
  };
  const { tagName, className, id } = element;
  const htmlOfElement = element.cloneNode().outerHTML;
  chrome.storage.sync.set({
    toAdd: { tagName, className, id, htmlOfElement, parentInfo },
  });
}

function isInPopUp(target, action) {
  if (document.querySelector(`.${POPUP_CLASSNAME}`)?.contains(target)) {
    if (target.tagName === "LI") {
      const index = findIndexInUl(target);
      HighlightWhenInPopup(index, action);
    }
    return true;
  }
}

function addHighlight(target) {
  target.addEventListener("dblclick", showPopup);
  target.classList.add(MOUSE_VISITED_CLASSNAME);
}

function removeHighlight(target) {
  target.removeEventListener("dblclick", showPopup);
  target.classList.remove(MOUSE_VISITED_CLASSNAME);
}

function HighlightWhenInPopup(IndexInUl, action) {
  let elementToHighlight = parentsAndChildren[IndexInUl];
  if (elementToHighlight && action === "add") {
    // console.log("elemetToHighlight innerhtml", elemetToHighlight.outerHTML);
    // console.log(
    //   "elemetToHighlight clone innerhtml",
    //   elemetToHighlight.cloneNode().outerHTML
    // );
    elementToHighlight.classList.add(MOUSE_VISITED_CLASSNAME);
  } else if (elementToHighlight && action === "remove") {
    elementToHighlight.classList.remove(MOUSE_VISITED_CLASSNAME);
  }
}

function findIndexInUl(target) {
  let li = target.closest("li");
  let nodes = Array.from(li?.closest("ul").children);
  return nodes.indexOf(li);
}
