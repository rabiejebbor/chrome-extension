const iframe = document.createElement("iframe");
iframe.style.height = "100%";
iframe.style.width = "400px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.style.border = "0px";
iframe.id = "sidebarCont";
iframe.src = chrome.runtime.getURL("sidebarCont.html");

chrome.runtime.onMessage.addListener(function (msg, sender) {
  if (msg == "toggle") {
    console.log("message received");
    toggle();
  }
});

function toggle() {
  if (document.body.querySelector("#sidebarCont")) {
    document.body.removeChild(iframe);
  } else {
    document.body.appendChild(iframe);
  }
}
