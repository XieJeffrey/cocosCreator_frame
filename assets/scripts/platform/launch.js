var c = require('../common/config');
var userdata = require("../data/userdata");
var gamedata = require("../data/gamedata")
var event = require("../manager/event");
var gametype = require("../data/gametype")
var request = require("../manager/request")

var Launch = {
    query: {},
    feedback: null,
    system: {},
    network: 0,
    scene: "",      //记录游戏进入时的场景值

    init: function () {
        if (WECHATGAME || QQPLAY) {
            var res = platform.getLaunchOptionsSync();
            this.query = res.query;
            this.scene = res.scene;
            console.log("启动:" + JSON.stringify(this.query));

            platform.onShow((res) => {
                this.query = res.query;
                this.scene = res.scene;
                event.emit("wxshow");

            });
        }
    }
}

module.exports = Launch;