let parentWindow; 

// inject script to get window object
function injectScript(file_path, tag) {
    var node = document.getElementsByTagName(tag)[0];
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', file_path);
    node.appendChild(script);
}

// run after window is loaded
addEventListener('load', (event) => { injectScript(chrome.runtime.getURL('inject.js'), 'body'); });


/**
 * inject following script to get xhr or fetch response body
 * added "web_accessible_resources": ["interceptXHRorFETCH.js"] to manifest.json
 */
var s = document.createElement('script');
s.src = chrome.runtime.getURL('interceptXHRorFETCH.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);


window.addEventListener('message', function(e) {
    parentWindow = e.data.window||null;
    switch (e.origin){
    case 'https://detail.1688.com':
        if(!e.data.customEvent) break;
        JSON.parse(parentWindow.__GLOBAL_DATA.offerDomain).tradeModel.skuMap.map(item=>{
            console.log(item.specAttrs)
        })
        break;
    case 'https://sellercentral.amazon.com':
        if(!e.data.customEvent) break;
        console.log(JSON.stringify(parentWindow));
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