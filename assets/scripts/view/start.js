var app = require("../app");
var gameMgr = require("../platform/gameMgr")
cc.Class({
    extends: cc.Component,
    properties: {},

    onLoad() {
        this.isDataInit = true

        this.soundBtn_on = this.node.findChild("sound/on")
        this.soundBtn_off = this.node.findChild("sound/off")
        this.startBtn = this.node.findChild("startBtn")

        this.loadingContent = this.node.findChild('loadingContent')
        this.loadingImg = this.loadingContent.findChild("loading")
        this.loadingContent.active = true

        if (app.util.isWeb()) {
            app.time.init()
            app.gamedata.initDataKey()//获取本地秘钥
            app.gamedata.initMasterData()
            this.isDataInit = false
            this.loadingContent.active = false
        }
        else {
            var res = wx.getSystemInfoSync()
            app.gamedata.screenWidth = res.screenWidth
            app.gamedata.screenHeight = res.screenHeight

            app.time.init(() => {
                //获取服务器时间之后本地化数据
                console.log("time init")
                gameMgr.getGameControl()
                gameMgr.getShareContent()
                gameMgr.login()
                app.gamedata.initHeroUID()
                gameMgr.initChestData()
                app.gamedata.getSelectHeroList()
                this.isDataInit = false
                this.loadingContent.active = false
            })

            //#region 头条录屏代码
            if (TTGAME) {
                app.gamedata.recorder = tt.getGameRecorderManager()

                app.gamedata.recorder.onStart(() => {
                    app.gamedata.recordTimer = 0
                    app.gamedata.isRecord = true
                    console.log("开始录屏")
                })

                app.gamedata.recorder.onStop((res) => {
                    console.log("停止录屏")
                    if (app.gamedata.recordTimer <= 3) {
                        event.emit(event.EventType.TIP, "录制分享不得少于3秒钟")
                        return
                    }
                    app.gamedata.recordTimer = 0
                    app.gamedata.isRecord = false
                    var path = res.videoPath;
                    tt.showModal({
                        title: '提示',
                        content: '录屏成功\n录制的视频可以分享哦！',
                        confirmText: "分享视频",
                        cancelText: '取消',
                        success(res) {
                            if (res.confirm) {
                                tt.shareVideo({
                                    videoPath: path,
                                    success() {
                                        console.log(`分享成功！`);
                                    },
                                });
                            }
                        },
                    });
                })
                app.gamedata.recorder.onError((res) => {
                    console.log(res.errMsg)
                })
            }
            //#endregion
        }


        this.isloading = true
        app.ui.showLoading()
        app.res.load(this.resourceLoad.bind(this))
        this.register()
    },

    register() {
        this.soundBtn_on.on("click", this.onSound, this)
        this.soundBtn_off.on("click", this.onSound, this)
        this.startBtn.on("click", this.onStart, this)
    },

    resourceLoad(value) {
        if (value >= 1) {
            app.ui.hideLoading()
            this.isloading = false
        }
    },

    onlogined() {

    },

    onShow(params) {
        console.log(app.audio.musicOn)
        this.soundBtn_on.active = app.audio.musicOn
        this.soundBtn_off.active = !app.audio.musicOn

        app.audio.playBgm(app.gametype.BgmType.start)
    },

    onHide(param) {
    },

    update(dt) {
        if (this.isDataInit == false)
            this.loadingImg.angle -= 200 * dt
    },

    onStart() {
        app.audio.playEffect(app.gametype.SoundType.click)
        if (this.isloading)
            return
        if (this.isDataInit)
            return

    },

    onSound() {
        // var startPos = this.startBtn.converToViewPosition()
        // app.ui.showGuide(startPos.x, startPos.y, this.startBtn.width + 30)
        // return
        app.audio.on()
        this.soundBtn_on.active = app.audio.musicOn
        this.soundBtn_off.active = !app.audio.musicOn
    },
});