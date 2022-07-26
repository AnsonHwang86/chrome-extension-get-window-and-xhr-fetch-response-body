let color = '#3aa757';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
});



// chrome.webRequest.onCompleted.addListener(function(data){
//     console.log(data)
// },{'urls':["<all_urls>"]},[]);

chrome.webRequest.onBeforeRequest.addListener(
  function(info) {
    console.log("Cat intercepted: " + JSON.stringify(info));
    // Redirect the lolcal request to a random loldog URL.
    var i = Math.round(Math.random());
    return {redirectUrl: 222};
  },
  // filters
  {
    urls: [
      "<all_urls>"
    ]
  },
  // extraInfoSpec
  ["requestBody"]
);

// chrome.search({text:"hello world"})