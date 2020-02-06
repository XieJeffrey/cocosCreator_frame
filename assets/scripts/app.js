var ui = require("./manager/ui");
var event = require("./manager/event");
var audio = require("./manager/audio");
var request = require("./manager/request");
var subpackage = require("./manager/subpackage");
var time = require("./manager/time");
var res = require("./manager/res");

var ad = require("./platform/ad");
var launch = require("./platform/launch");
var gameMgr = require("./platform/gameMgr");
var share = require("./platform/share");

var userdata = require("./data/userdata");
var gamedata = require("./data/gamedata");
var gametype = require("./data/gametype");

var config = require("./common/config")
var gameConfig = require("./common/gameConfig")
var util = require("./common/util");

var url = "https://z1.shaoweiwy.cn/SpaceBounce/Bounce.aspx";
var app = {
    init: function (callback) {
        var func = function () {
            res.load();
            launch.init();
            //ad.load();
            audio.init()
            ui.load(callback);
            share.init();
        }
        if (util.isWeb()) {
            func()
        }
        else {
            var subResCount = 2
            cc.loader.downloader.loadSubpackage('skeleton', function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('load subpackage skeleton successfully.');
                subResCount--
                if (subResCount <= 0)
                    func()
            });

            cc.loader.downloader.loadSubpackage('audios', function (err) {
                if (err) {
                    return console.error(err);
                }
                console.log('load subpackage audios successfully.');
                subResCount--
                if (subResCount <= 0)
                    func()
            });
        }

    },

    update(dt) {
        time.update(dt)
        this.fixedUpdate.do(dt);
    },

    share: share,
    launch: launch,
    ad: ad,

    ui: ui,
    event: event,
    audio: audio,
    request: request,
    res: res,
    time: time,

    userdata: userdata,
    gamedata: gamedata,
    gametype: gametype,

    config: config,
    gameConfig: gameConfig,
    util: util,

    fixedUpdate: {
        list: [],
        add: function (idx, func, field) {
            this.list.push({ idx: idx, func: func, field: field });
        },

        remove: function (idx) {
            for (var i = 0; i < this.list.length; ++i) {
                var obj = this.list[i];
                if (obj.idx == idx) {
                    this.list.splice(idx, 1);
                    break;
                }
            }
        },

        do: function (dt) {
            if (this.list.length == 0) return;
            this.list.forEach(obj => {
                if (typeof obj.func == "function") obj.func.call(obj.field, dt);
            })
        },
    }
};

module.exports = app;