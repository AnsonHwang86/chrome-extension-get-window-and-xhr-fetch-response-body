let currentLocation = document.location.href;

const passMessageIfInMap = (requestUrl , data, urlMapArray) => {
    urlMapArray = urlMapArray.filter(item=>{
      return item.pageUrl!==undefined&&currentLocation.match(item.pageUrl);
    });
    if(!urlMapArray.length) return;
    urlMapArray[0].requestUrl.map(item=>{
      // only postMessage when requestUrl is in map array
      if(requestUrl.match(item)) window.postMessage({data, customEvent: true, requestUrl:requestUrl});
    })
}

(async function (){
    let oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener('load', function() {
          //siteAndRequestMapArray from siteAndRequestMap.js
          passMessageIfInMap(url, this.responseText, pageAndRequestMapArray); 
     });
     return oldXHROpen.apply(this, arguments);
    }
}());

(function(){
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
      let [resource, config] = args;
      let response = await originalFetch(resource, config);

      // response interceptor
      const json = () =>
        response
          .clone()
          .json()
          .then((data) => {
            // console.log("data:",data)
            //siteAndRequestMapArray from siteAndRequestMap.js
            passMessageIfInMap(resource, data, pageAndRequestMapArray);           
            // return { ...data, title: `Intercepted: ${data.title}` }
            return data;
        });

      response.json = json;
      return response;
    };
}());