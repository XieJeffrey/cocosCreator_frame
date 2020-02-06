var request = require("../manager/request");
var config = require("../common/config");

var Time = {
    serviceTime: null,
    offset: 0,

    update: function (dt) {
        if (dt < 0.5) {
            this.offset += dt
        }
    },

    //同步服务器时间
    sync: function (func) {
        var param = {
            GetCurrentTime: ""
        }

        request.post(config.configUrl.url, param, function (data) {
            console.log(data)
            this.serviceTime = parseInt(data.CurrentTime)
            this.offset = 0
            if (func)
                func()
        }.bind(this))
    },

    //初始化
    init: function (func) {
        if (!WECHATGAME) {
            this.serviceTime = parseInt(new Date().getTime() / 1000)
            this.offset = 0
        }
        else
            this.sync(func)
    },

    //获取现在的时间
    now: function () {
        var timeNow = this.serviceTime + this.offset
        return parseInt(timeNow)
    },
}

module.exports = {
    sync: Time.sync,
    init: Time.init,
    now: Time.now,
    update: Time.update,
};