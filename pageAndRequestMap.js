const pageAndRequestMapArray = [
{
	pageUrl:"http.*?:\\\/\\\/sellercentral.*?\\.amazon\\.com\\\/", 
	requestUrl: [
		"\\\/orders-api\\\/search\\?limit"
	],
	handler: function (data, doc, win){
		console.log(data, doc);alert(JSON.stringify(data));
	}
},
{
	pageUrl:"http.*?:\\\/\\\/detail\\.1688\\.com\\\/offer\\\/", 
	requestUrl: [
		"https:\/\/turbo-meta\.insights\.1688\.com\/meta\.json"
	],
	handler: function (data, doc, win){
		console.log(data, doc,1688);alert(JSON.stringify(data));
	}
}]
