const CD = chrome.devtools;

CD.panels.create(
    "seeRequest", //名字叫啥，就是在devtools中展示的名字。
    "N.png",  //使用的图片，暂时没捣鼓出来如何展示
    "../../html/panel.html", //这个devtools拓展真正的操作页面
)

