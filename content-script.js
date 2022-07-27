let parentWindow; 
// console.log(getSiteAndRequestMap())
// inject script to get window object
function injectScript(file_path, node) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
    script.onload = function() {
        // this.remove();
    };
}

// run after window is loaded
addEventListener('load', (event) => { injectScript(chrome.runtime.getURL('inject.js'), document.getElementsByTagName("body")[0]); });

/**
 * inject following script to get xhr or fetch response body
 * added "web_accessible_resources": ["interceptXHRorFETCH.js"] to manifest.json
 */
injectScript(chrome.runtime.getURL('siteAndRequestMap.js'), (document.head || document.documentElement));
injectScript(chrome.runtime.getURL('interceptXHRorFETCH.js'), (document.head || document.documentElement));

window.addEventListener('message', function(e) {
    parentWindow = e.data.window||null;
    switch (e.origin){
    case 'https://detail.1688.com':
        if(!e.data.customEvent) break;
        console.log(e.data);
        JSON.parse(parentWindow.__GLOBAL_DATA.offerDomain).tradeModel.skuMap.map(item=>{
            console.log(item.specAttrs)
        })
        break;
    case 'https://sellercentral.amazon.com':
        if(!e.data.customEvent) break;
        console.log(e.data);
        // console.log(JSON.stringify(parentWindow));
        break;
    default:
        console.log("nothing happened");
    }
})

// do sth you want to do with data intercepted
// function save1688DataToNeo4j (data, apiUrl) {

// }

// function dataMapper (data, schema) {
//     schema["listing.sellingProduct.productName.0.text"]             = jsonpath(data.listing.sellingProduct.product)
//     schema["listing.sellingProduct.productName.0.languageTagCode"]  = jsonpath(data.listing.sellingProduct.product)
//     schema["listing.sellingProduct.productName.1.text"]             = jsonpath(data.listing.sellingProduct.product)
//     schema["listing.sellingProduct.productName.1.text"]             = jsonpath(data.listing.sellingProduct.product)
// }