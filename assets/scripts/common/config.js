
window.QQPLAY = typeof qq != "undefined";
window.TTGAME = typeof tt != "undefined";
window.WECHATGAME = typeof wx != "undefined" && typeof qq == "undefined" && typeof tt == "undefined";
window.VIVO = typeof qg != "undefined";
window.IOS = cc.sys.isNative && cc.sys.os == cc.sys.OS_IOS;
window.ANDROID = cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID;
window.NATIVE = IOS || ANDROID;
window.platform = window.WECHATGAME ? wx : window.QQPLAY ? qq : null


const cfg = {
    gamelist: "https://list.ty200772.com/GameList.aspx",
    share: "https://list.ty200772.com/CopywritingList.aspx",
    control: "https://list.ty200772.com/GetGameControlInfo.aspx",
    url: "https://z1.shaoweiwy.cn/DragonSlayer/DragonSlayer.aspx",
}


var config = {
    appID: "wx63f948f281abf42d",//微信ID
    QQ_appID: "1109792590",//QQID
    tt_appID: "",//头条ID
    localversion: 1,
    netversion: 0,
    configUrl: cfg,
}

module.exports = config;