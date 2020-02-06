var app = require("../app");
var qs = require('querystring')

const NODE_Y = -80;

cc.Class({
    extends: cc.Component,
    properties: {},

    onLoad() {
        this.board = this.node.findChild("board");
        this.arrowBtn = this.board.findChild("arrow")
        this.closeBtn = this.board.findChild("close")
        this.content = this.board.findChild("scroll/view/content");
        this.item = this.content.findChild("item");
        this.item.active = false;
        this.playBreathAnima()
        this.register()
    },

    playBreathAnima() {
        var seq = cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.2, 1.1, 1.1),
                cc.scaleTo(0.2, 1, 1),
                cc.scaleTo(0.2, 0.9, 0.9),
                cc.scaleTo(0.2, 1, 1)
            )
        )
        this.arrowBtn.runAction(seq)
    },

    register() {
        var self = this
        this.board.findChild("arrow").on('click', this.onClickArrow, this);

        this.board.findChild("close").on("click", function () {
            self.board.x = -720
            self.closeBtn.active = false
            self.arrowBtn.active = true
        })

        app.event.on(app.gametype.eventType.SHOWGAMELIST, function () {
            self.onClickArrow()
        }, this)
    },

    onClickArrow() {
        var self = this
        self.board.x = 0
        self.arrowBtn.active = false
        self.closeBtn.active = true

    },

    start() {
        this.everrefresh = false;
    },

    update(dt) {

    },

    onShow() {
        if (QQPLAY) {
            app.ui.hide("gamelist")
            return
        }
        if (!app.config.control.gamelistEnable || app.config.localversion > app.config.netversion) {
            console.log("隐藏列表");
            app.ui.hide('gamelist');
            return;
        }
        else
            this.refresh()
    },

    refresh() {
        console.log(app.gamedata.gamelist)
        if (app.gamedata.gamelist.length == 0) {
            app.ui.hide("gamelist")
            return
        }



        for (var i = 0; i < app.gamedata.gamelist.length; ++i) {
            if (app.gamedata.gamelist[i].appid == app.config.appID) continue;
            var name = i + "";
            var item = this.content.findChild(name);
            if (item == undefined) {
                item = cc.instantiate(this.item);
                item.name = name;
                this.content.addChild(item);
                item.on('click', this.onClickIcon, this);
            }
            item.active = true;
            item.findChild("name").getComponent(cc.Label).string = app.gamedata.gamelist[i].name;
            app.util.createIcon(item.findChild("icon").getComponent(cc.Sprite), app.gamedata.gamelist[i].icon);

        }
    },

    onClickIcon(event) {
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
                    node.findChild("red").active = false;
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
});