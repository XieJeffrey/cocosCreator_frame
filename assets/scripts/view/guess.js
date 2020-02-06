var app = require("../app")

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.item = this.node.findChild("content/item")
        this.content = this.node.findChild("content")
        this.bg = this.node.findChild("bg")
        this.itemlist = new Array()
        this.itemlist.push(this.item)
        this.register()
        this.refreshDelta = 30
        this.timer = this.refreshDelta

        let winSizePixels = cc.director.getWinSizeInPixels();
        this.offsetY = (winSizePixels.height - 1280) / 2

        this.content.y -= this.offsetY
        this.bg.y -= this.offsetY
    },

    register() {
        this.item.on("click", this.onClickItem, this)
    },

    start() {

    },

    onShow(param) {
        if (QQPLAY) {
            app.ui.hide("guess")
            return
        }
        if (!app.config.control.gamelistEnable || app.gamedata.gamelist.length == 0) {
            app.ui.hide("guess")
            return
        }

        var guessIdxList = new Array()
        var tmpArray = new Array()
        for (var i = 0; i < app.gamedata.gamelist.length; i++) {
            if (app.gamedata.gamelist[i].recommend == true) {
                tmpArray.push(i)
            }
        }

        while (tmpArray.length > 0) {
            var idx = Math.floor(tmpArray.length * Math.random())
            guessIdxList.push(tmpArray.splice(idx, 1))
        }

        var midIdx = Math.floor(guessIdxList.length / 2)

        for (var i = 0; i < guessIdxList.length; i++) {
            var item = this.itemlist[i]
            if (item == undefined) {
                item = cc.instantiate(this.item)
                item.parent = this.content
                this.itemlist.push(item)
                item.on("click", this.onClickItem, this)
            }
            item.active = true
            var idx = guessIdxList[i]
            item.name = "" + idx
            if (i == midIdx) {
                item.scaleX = 1.15
                item.scaleY = 1.15
                item.findChild("tip").active = true
            }
            else {
                item.scaleX = 1
                item.scaleY = 1
                item.findChild("tip").active = false
            }
            item.findChild("name").getComponent(cc.Label).string = app.gamedata.gamelist[idx].name;
            app.util.createIcon(item.findChild("icon").getComponent(cc.Sprite), app.gamedata.gamelist[idx].icon);
        }
    },

    onClickItem(event) {
        var self = this;
        var index = parseInt(event.target.name);
        var info = app.gamedata.gamelist[index];
        var appid = info.appid;
        var path = info.path;
        var node = event.target;
        if (typeof wx != "undefined") {
            wx.navigateToMiniProgram({
                appId: appid,
                path: path,
                success: (res) => {
                    node.findChild("tip").active = false;
                    console.log("转跳成功")
                    //统计
                    var key = appid;
                    var empty = cc.sys.localStorage.getItem(key);
                    if (empty === undefined || empty === "") {
                        // 统计
                        var pp = { AppID: app.config.appID + '|' + appid }
                        app.request.post(app.config.configUrl.gamelist, pp, (res) => { });
                        // 打开成功
                        cc.sys.localStorage.setItem(key, "1");
                    }
                },
                fail: (res) => {
                    console.log(res);
                }
            });
        }
    },



    update(dt) {
        this.timer -= dt
        if (this.timer <= 0) {
            this.onShow()
            this.timer = this.refreshDelta
        }
    },
});
