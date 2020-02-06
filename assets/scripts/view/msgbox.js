var app = require("../app");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.params = null;

        var btn = this.node.getChildByName("btns");

        this.cancleBtn = btn.getChildByName("cancle")
        this.cancleBtn.on('click', this.onCancel, this);

        this.sureBtn = btn.getChildByName("sure")
        this.sureBtn.on('click', this.onSure, this);

        this.vedioTip = this.sureBtn.getChildByName("vedio")
        this.shareTip = this.sureBtn.getChildByName("share")
        this.emptyTip = this.sureBtn.getChildByName("empty")

        this.content = this.node.getChildByName("content").getComponent(cc.Label)
        this.title = this.node.getChildByName("title").getComponent(cc.Label)

        this.sureBtnTxt = this.sureBtn.getChildByName("txt").getComponent(cc.Label)
        this.cancleTxt = this.cancleBtn.getChildByName("txt").getComponent(cc.Label)

        this.sureBtn.on('click', this.onSure, this)
        this.cancleBtn.on("click", this.onCancel, this)
    },

    start() {

    },


    onShow(params) {
        if (params == undefined) {
            console.error("invaild params to msgbox!");
            app.ui.hide("msgbox");
            return;
        }
        this.params = params;

        if (typeof params.vedioTip == "undefined")
            params.vedioTip = false

        if (typeof params.shareTip == "undefined")
            params.shareTip = false

        if (typeof params.showCancle == "undefined")
            params.showCancle = false

        if (typeof params.cancleTxt == "undefined")
            params.cancleTxt = "取消"

        if (typeof params.sureTxt == "undefined")
            params.sureTxt = "确认"

        this.content.string = params.content
        this.title.string = params.title
        this.sureFunc = params.sure
        this.cancleFunc = params.cancle
        this.cancleBtn.active = params.showCancle
        this.vedioTip.active = params.vedioTip
        this.shareTip.active = params.shareTip
        this.sureBtnTxt.string = params.sureTxt
        this.cancleTxt.string = params.cancleTxt

        if (this.vedioTip.active | this.shareTip.active)
            this.emptyTip.active = false
        else
            this.emptyTip.active = true

    },

    onHide() {
    },

    onSure() {
        app.ui.hide("msgbox");
        if (this.sureFunc) {
            this.sureFunc()
            this.sureFunc = null
        }
    },

    onCancel() {
        app.ui.hide("msgbox");
        if (this.cancleFunc) {
            this.cancleFunc()
            this.cancleFunc = null
        }
    }
});
