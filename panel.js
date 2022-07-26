chrome.devtools.network.onRequestFinished.addListener(request => {
  request.getContent((body) => {
    if (request.request && request.request.url) {
      if (request.request.url.includes('https://sellercentral.amazon.com/orders-st/resolve')) {
        // chrome.runtime.sendMessage({
        //     response: body
        // });
      }
    }
  });
});