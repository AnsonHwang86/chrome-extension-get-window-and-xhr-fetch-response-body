let currentLocation = document.location.href;

const passMessageIfInMap = (url, urlMapArray, data) => {
    urlMapArray = urlMapArray.filter(item=>{
      return Object.keys(item)[0]!==undefined&&currentLocation.match(Object.keys(item)[0]);
    })
    if(!urlMapArray.length) return;
    urlMapArray[0][Object.keys(urlMapArray[0])[0]].map(item=>{
      // only postMessage when url is in map array
      if(url.match(item)) window.postMessage({data, customEvent: true});
    }) 
}

(async function (){
    let oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener('load', function() {
          //siteAndRequestMapArray from siteAndRequestMap.js
          passMessageIfInMap(url, siteAndRequestMapArray, this.resposneText); 
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
            //siteAndRequestMapArray from siteAndRequestMap.js
            passMessageIfInMap(resource, siteAndRequestMapArray, data);           
            // return { ...data, title: `Intercepted: ${data.title}` }
            return data;
        });

      response.json = json;
      return response;
    };
}());