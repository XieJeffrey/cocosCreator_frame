var c = require("../common/config");
var userdata = require("../data/userdata");
var native = require("../platform/native");
var gamedata = require('../data/gamedata')

var share = {
    isCancel: false,
    simulateshare: null,
    text: "",
    img: "",

    init: function () {
        //头条能到分享回调
        if (TTGAME)
            return
        var self = this;
        cc.game.on(cc.game.EVENT_SHOW, function () {
            if (self.simulateshare != null) {
                var now = new Date().getTime();
                var section = Math.random() < 0.2 ? 6000 : 3000;

                if (WECHATGAME) {
                    if (now - self.simulateshare.time < section) {
                        self.isCancel = true;
                    }
                }

                if (self.isCancel) {
                    console.log("分享失败");
                    if (this.simulateshare.fail) {
                        this.simulateshare.fail();
                    }
                    if (this.simulateshare.success) {
                        platform.showModal({
                            title: '提示',
                            content: '邀请不同好友才可获得奖励!',
                            confirmColor: '#3cc51f',
                        })
                    }
                }
                else {
                    console.log("分享成功");
                    if (self.simulateshare.success) {
                        self.simulateshare.success();
                        platform.showToast({
                            title: '分享成功',
                            icon: 'success',
                            duration: 2000
                        })
                        self.simulateshare = null;
                    }
                }
            }
            else {
                console.log("没有分享,不用判断")
            }
            self.simulateshare = null
        }, this);
    },

    do(title, imgUrl, query, success, cancel, complete) {
        if (success) {
            //本地版本号大于线上版本号或者关闭分享的时候直接调用成功回调函数
            if (gamedata.control.uglyShare == false) {
                success()
                return
            }
        }
        if (CC_PREVIEW) {
            if (success) success();
            return;
        }

        this.text = title
        this.img = imgUrl

        var solid = "inviteId=" + userdata.openid
        if (query == "")
            query = solid
        else
            query = solid + "&" + (query);

        console.log("query: " + query);
        var now = new Date().getTime();
        this.simulateshare = { time: now, success: success, fail: cancel }
        var self = this;
        self.isCancel = false;
        if (WECHATGAME || QQPLAY) {
            platform.shareAppMessage({
                title: title,
                imageUrl: imgUrl,
                query: query,
                cancel: (res) => {
                    self.isCancel = true;
                },
            })
        }
    },
}

module.exports = share;