(function (){
    let oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener('load', function() {
        window.postMessage({data:this.responseText, customEvent: true});
      // console.log('data: ' + this.responseText);
      
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
            window.postMessage({data, customEvent: true});
            return { ...data, title: `Intercepted: ${data.title}` } });

      response.json = json;
      return response;
    };
}());