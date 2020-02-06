
var audioCache = {};//音频缓存
var bgmCache = {}//背景缓存
var gameType = require('../data/gametype')

var Aduio = {
    musicOn: true,

    init: function () {
        var local = cc.sys.localStorage.getItem("music");
        this.musicOn = ("" === local || null === local || local == 1);

        if (!WECHATGAME && !QQPLAY)
            this.musicOn = false
    },

    on() {
        this.musicOn = !this.musicOn;

        if (this.musicOn == false)
            this.stopBgm()
        else
            this.playBgm(gameType.BgmType.start)

        cc.sys.localStorage.setItem("music", this.musicOn ? 1 : 0);
    },

    playEffect(name) {
        if (!this.musicOn) return;
        if (audioCache[name] == undefined) {
            if (name == "")
                return
            cc.loader.loadRes("audios/" + name, function (err, audio) {
                audioCache[name] = audio;
                cc.audioEngine.playEffect(audio, false);
            })
        }
        else {
            cc.audioEngine.playEffect(audioCache[name], false);
        }
    },

    playBgm(name) {
        return
        if (!this.musicOn) return;
        if (bgmCache[name] == undefined) {
            cc.loader.loadRes("audios/" + name, function (err, audio) {
                if (err)
                    console.log(err)

                bgmCache[name] = audio
                cc.audioEngine.playMusic(audio, true);
            })
        }
        else {
            cc.audioEngine.playMusic(bgmCache[name], true);
        }
    },

    stopBgm() {
        cc.audioEngine.stopAll();
    }
}

module.exports = Aduio;