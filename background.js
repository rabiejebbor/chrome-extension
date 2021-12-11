chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, "toggle");
  console.log("message sent");
});

// // Example of a simple user data object
// const user = {
//   username: "demo-user",
// };
// let data;

// chrome.runtime.onMessage.addListener((obj, sender, sendResponse) => {
//   // 2. A page requested user data, respond with a copy of `user`
//   console.log("backgroundjs obj", obj);
//   if (obj.msg === "get-user-data") {
//     sendResponse(user);
//   } else if (obj.msg === "set-data") {
//     data = obj.data;
//     console.log("setdata", data, sender);
//     // chrome.tabs.query({ active: true, currentWindow: true }).then((tab) => {
//     //   console.log("current tab", tab);
//     //   chrome.runtime.sendMessage(tab.id, "dataModified");
//     // });
//     sendResponse(user);
//   } else if (obj.msg === "get-data") {
//     console.log("getdata", data, sender);

//     sendResponse(data);
//   }
// });
