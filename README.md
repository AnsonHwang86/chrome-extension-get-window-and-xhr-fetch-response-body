## Here is example show how to get inspected page's `window` and response body(not request body).

Using injected js to get `window`, and pass it to content_script.js with window.postMessage, but you need to use a library to stringify the window firstly. Due to window may contain recursive object, it will fail the JSON.stringify. So I use library https://github.com/Canop/JSON.prune here.

There are three solution to get response body in chrome extension;

### 1.using devtools.network api  https://developer.chrome.com/docs/extensions/mv3/devtools/  https://stackoverflow.com/questions/18534771/chrome-extension-how-to-get-http-response-body , use this solution you need to open devtool window
```
chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent((body) => {
    if (request.request && request.request.url) {
      if (request.request.url.includes('facebook.com')) {

         //continue with custom code
         var bodyObj = JSON.parse(body);//etc.
      }
}
});
});
```


### 2.using debugger api  https://stackoverflow.com/questions/18534771/chrome-extension-how-to-get-http-response-body, use this solution the waring messasge of debugger will display above the inspected page all the time.

```
var currentTab;
var version = "1.0";

chrome.tabs.query( //get current Tab
    {
        currentWindow: true,
        active: true
    },
    function(tabArray) {
        currentTab = tabArray[0];
        chrome.debugger.attach({ //debug at current tab
            tabId: currentTab.id
        }, version, onAttach.bind(null, currentTab.id));
    }
)

function onAttach(tabId) {

    chrome.debugger.sendCommand({ //first enable the Network
        tabId: tabId
    }, "Network.enable");

    chrome.debugger.onEvent.addListener(allEventHandler);
}

function allEventHandler(debuggeeId, message, params) {

    if (currentTab.id != debuggeeId.tabId) {
        return;
    }

    if (message == "Network.responseReceived") { //response return 
        chrome.debugger.sendCommand({
            tabId: debuggeeId.tabId
        }, "Network.getResponseBody", {
            "requestId": params.requestId
        }, function(response) {
            // you get the response body here!
            // you can close the debugger tips by:
            chrome.debugger.detach(debuggeeId);
        });
    }

}
```

### 3. using injected js to change prototype of XML and fetch of inspected page (recommend), this example will take this solution

### * be notice that the chrome.webRequest api will only intercepted the request body instead of response body.


## Reference

1. Chrome Extension Api
https://developer.chrome.com/docs/extensions/reference/
2. How to get http(XHR) response body
https://stackoverflow.com/questions/18534771/chrome-extension-how-to-get-http-response-body
https://stackoverflow.com/questions/61789895/electron-how-to-intercept-http-response-body
https://stackoverflow.com/questions/8939467/chrome-extension-to-read-http-response

3. How to get http(Fetch) response body
https://blog.logrocket.com/intercepting-javascript-fetch-api-requests-responses/
