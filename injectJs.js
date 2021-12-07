console.log("injected", document);
const containers = document.querySelectorAll("div");

document.addEventListener("dragover", (e) => {
  e.preventDefault;
  console.log("gragging over");
});

const MOUSE_VISITED_CLASSNAME = "crx_mouse_visited";
let prevDOM = null;

document.addEventListener(
  "mousemove",
  function (e) {
    let srcElement = e.srcElement;
    console.log("move");
    if (srcElement.nodeName == "DIV") {
      if (prevDOM != null) {
        prevDOM.classList.remove(MOUSE_VISITED_CLASSNAME);
      }

      srcElement.classList.add(MOUSE_VISITED_CLASSNAME);
      prevDOM = srcElement;
    }
  },
  false
);
