const iframe = document.createElement("iframe");
iframe.style.height = "100%";
iframe.style.width = "200px";
iframe.style.position = "fixed";
iframe.style.top = "0px";
iframe.style.right = "0px";
iframe.style.zIndex = "9000000000000000000";
iframe.style.border = "0px";
iframe.id = "sidebarCont";
iframe.src = chrome.runtime.getURL("sidebarCont.html");

const link = document.createElement("link");
link.href = chrome.runtime.getURL("injectCss.css");
link.type = "text/css";
link.rel = "stylesheet";
document.getElementsByTagName("head")[0].appendChild(link);

chrome.runtime.onMessage.addListener(function (msg, sender) {
  if (msg == "toggle") {
    console.log("message received");
    toggle();
  }
});

function toggle() {
  if (document.body.querySelector("#sidebarCont")) {
    if (iframe.style.display === "none") {
      iframe.style.display = "";
    } else {
      iframe.style.display = "none";
      //stop the extesion functionalities
    }
  } else {
    document.body.appendChild(iframe);
  }
}
