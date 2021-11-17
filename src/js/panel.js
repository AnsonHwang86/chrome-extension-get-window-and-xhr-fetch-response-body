const CD = chrome.devtools;

//devtools中不认识console.log。使用自带的api inspectedWindow 来弄一个它认识的
const log = (...params) => CD.inspectedWindow.eval(`console.log(...${JSON.stringify(params)})`);

//服务器状态码对应文字 word 以及描述 desc
// status对应文案 网上找的，如果有不对的，希望指出。
const statusText={
    "200":{
        word:"成功",
        desc: "服务器已成功处理了请求。通常，这表示服务器提供了请求的网页。"
    },
    "201":{
        word: "已创建",
        desc: "请求成功且服务器已创建了新的资源。"
    },
    "202":{
        word:"已接受",
        desc: "服务器已接受了请求，但尚未对其进行处理。"
    },
    "203":{
        word: "非授权信息",
        desc: "服务器已成功处理了请求，但返回了可能来自另一来源的信息。"
    },
    "204":{
        word:"无内容",
        desc: "服务器成功处理了请求，但未返回任何内容。"
    },
    "205":{
        word:"充值内容",
        desc: "服务器成功处理了请求，但未返回任何内容。与 204 响应不同，此响应要求请求者重置文档视图（例如清除表单内容以输入新内容）。 "
    },
    "206":{
        word:"部分内容",
        desc: "服务器成功处理了部分 GET 请求。"
    },
    "300":{
        word:"多种选择",
        desc:"服务器根据请求可执行多种操作。服务器可根据请求者 来选择一项操作，或提供操作列表供其选择。 "
    },
    "301": {
        word: "永久请求",
        desc: "请求的网页已被永久移动到新位置。服务器返回此响应时，会自动将请求者转到新位置。您应使用此代码通知搜索引擎蜘蛛网页或网站已被永久移动到新位置。"
    },
    "302": {
        word: "临时移动",
        desc: " 服务器目前正从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。会自动将请求者转到不同的位置。但由于搜索引擎会继续抓取原有位置并将其编入索引，因此您不应使用此代码来告诉搜索引擎页面或网站已被移动。 "
    },
    "303": {
        word: "查看其他位置",
        desc: "当请求者应对不同的位置进行单独的 GET 请求以检索响应时，服务器会返回此代码。对于除 HEAD 请求之外的所有请求，服务器会自动转到其他位置。 "
    },
    "304": {
        word: "未修改",
        desc: "自从上次请求后，请求的网页未被修改过。服务器返回此响应时，不会返回网页内容。"
    },
    "305": {
        word: "使用代理",
        desc: "请求者只能使用代理访问请求的网页。如果服务器返回此响应，那么，服务器还会指明请求者应当使用的代理。"
    },
    "306": {
        word: "",
        desc: ""
    },
    "307": {
        word: "重定向",
        desc: "服务器目前正从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。会自动将请求者转到不同的位置。但由于搜索引擎会继续抓取原有位置并将其编入索引，因此您不应使用此代码来告诉搜索引擎某个页面或网站已被移动。"
    },
    "400": {
        word: "错误请求",
        desc: "服务器不理解请求的语法。"
    },
    "401": {
        word: "身份验证错误",
        desc: "此页要求授权。您可能不希望将此网页纳入索引。"
    },
    "402": {
        word: "",
        desc: ""
    },
    "403": {
        word: "禁止",
        desc: "服务器拒绝请求。"
    },
    "404": {
        word: "未找到",
        desc: "服务器找不到请求的网页。例如，对于服务器上不存在的网页经常会返回此代码。"
    },
    "405": {
        word: "方法禁用",
        desc: "禁用请求中指定的方法。"
    },
    "406": {
        word: "不接受",
        desc: "无法使用请求的内容特性响应请求的网页。 "
    },
    "407": {
        word: "需要代理授权",
        desc: "请求者必须授权使用代理。如果服务器返回此响应，还表示请求者应当使用代理。 "
    },
    "408": {
        word: "请求超时",
        desc: "服务器等候请求时发生超时。 "
    },
    "409": {
        word: "冲突",
        desc: "服务器在完成请求时发生冲突。服务器必须在响应中包含有关冲突的信息。服务器在响应与前一个请求相冲突的 PUT 请求时可能会返回此代码，以及两个请求的差异列表。 "
    },
    "410": {
        word: "已删除",
        desc: "请求的资源永久删除后，服务器返回此响应。该代码与 404（未找到）代码相似，但在资源以前存在而现在不存在的情况下，有时会用来替代 404 代码。如果资源已永久删除，您应当使用 301 指定资源的新位置。 "
    },
    "411": {
        word: "需要有效长度",
        desc: "服务器不接受不含有效内容长度标头字段的请求。"
    },
    "412": {
        word: "未满足前提条件",
        desc: "服务器未满足请求者在请求中设置的其中一个前提条件。"
    },
    "413": {
        word: "请求实体过大",
        desc: "服务器无法处理请求，因为请求实体过大，超出服务器的处理能力。 "
    },
    "414": {
        word: "URI过长",
        desc: "请求的 URI（通常为网址）过长，服务器无法处理。 "
    },
    "415": {
        word: "不支持的媒体类型",
        desc: "请求的格式不受请求页面的支持。 "
    },
    "416": {
        word: "请求范围不符合要求",
        desc: "如果页面无法提供请求的范围，则服务器会返回此状态码。 "
    },
    "417": {
        word: "未满足期望",
        desc: "服务器未满足‘期望’请求标头字段的要求。"
    },
    "500": {
        word: "服务器内部错误",
        desc: "服务器遇到错误，无法完成请求。 "
    },
    "501": {
        word: "尚未实施",
        desc: "服务器不具备完成请求的功能。例如，当服务器无法识别请求方法时，服务器可能会返回此代码。"
    },
    "502": {
        word: "网关错误",
        desc: "服务器作为网关或代理，从上游服务器收到了无效的响应。 "
    },
    "503": {
        word: "服务器当前不可用",
        desc: "目前无法使用服务器（由于超载或进行停机维护）。通常，这只是一种暂时的状态。"
    },
    "504": {
        word: "网关超时",
        desc: "服务器作为网关或代理，未及时从上游服务器接收请求。 "
    },
    "505": {
        word: "HTTP版本不受支持",
        desc: "服务器不支持请求中所使用的 HTTP 协议版本"
    }
}

//注册回调函数，每一个http请求完成后，都会执行。
CD.network.onRequestFinished.addListener((...args)=>{
    const [{
        request,
        response
    }] = args;


    // log(request);

    // fetch('http://example.com/movies.json')
    //     .then(response => response.json())
    //     .then(data => console.log(data));
    //本事件 每一次请求都会触发，所以使用jq的append
    $(".list").append(`<tr class="${response.status !== 200 ? 'red' : ''}">
            <td class="method"><div>${request.method}</div></td>
            <td class="url"><div>${request.url}</div></td>
            <td class="status">
                <span>${response.status}</span>
            </td>
            <td class="statusText">
                <span class='word'>${statusText[response.status].word}</span>
                <span class='desc'>${statusText[response.status].desc}</span>
            </td>
        </tr>`);


});

// retrived responseBody;
// CD.network.onRequestFinished.addListener(request => {
//     request.getContent((body) => {
//         if (request.request && request.request.url) {
//             if (request.request.url.includes('facebook.com')) {
//
//                 //continue with custom code
//                 var bodyObj = JSON.parse(body);//etc.
//                 log(bodyObj);
//             }
//         }
//     });
// });

$("body").on("mouseenter", ".statusText .word", function () {
    $(this).next().show();
});
$("body").on("mouseleave", ".statusText .word", function () {
    $(this).next().hide();
});

