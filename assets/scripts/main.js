var app = require("./app");

cc.Class({
    extends: cc.Component,
    properties: {},

    /** 设配iPad */
    fitiPad() {
        var size = cc.view.getFrameSize();
        if (size.height / size.width < 1.4) {
            var cvs = cc.find("Canvas").getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = false;
        }
    },

    onLoad() {
        window.TTGAME = typeof tt != 'undefined'
        this.loadingContent = this.node.findChild("loadingContent")
        this.loading = this.loadingContent.findChild("loading")
        //this.fitiPad();
        var self = this;
        app.init(function () {
            self.uiInited();
        });

    },

    update(dt) {
        if (this.loadingContent.active)
            this.loading.angle -= 200 * dt
        app.update(dt);
        app.ad.update(dt);
    },

    //UI初始化结束
    uiInited() {
        console.log("uiinited");
        app.ui.show("start");
        this.loadingContent.active = false
    }
});