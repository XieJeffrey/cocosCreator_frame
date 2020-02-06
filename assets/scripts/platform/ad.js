const WX_VIDEO_ADUNITID = 'adunit-5ba9b95931900205';
const WX_BANNER_ADUNITID = 'adunit-b0b9e29a179ec68f';
const WX_INSERT_ADUNITID = 'adunit-6ccdb687b5f4e9ab';

const QQ_VIDEO_ADUNITID = '6433549f9bfa8fe7364afc329656e505';
const QQ_BANNER_ADUNITID = '76e45d75f61e2625d05890865ff62d70';
const QQ_BOX_ID = "161c85fbb64cd2710e8f7b6b2d0e2649"

var ad = {
    banner: null,
    bannerDuring: 0,
    bannerCheck: 0,

    videoad: null,
    videoLoaded: false,
    videoCB: null,
    videoduring: null,

    interstitialad: null,

    load: function () {
        return
        if (!WECHATGAME && !QQPLAY)
            return

        this.createVideo();
        this.createBanner();
        this.createInterstitial();
    },

    createVideo() {
        if (WECHATGAME || QQPLAY) {
            var vedioID = ""
            if (WECHATGAME)
                vedioID = WX_VIDEO_ADUNITID

            if (QQPLAY)
                vedioID = QQ_VIDEO_ADUNITID
            var self = this;
            //视频广告
            this.videoad = platform.createRewardedVideoAd({
                adUnitId: vedioID,
            });

            this.videoad.load().then(
                () => {
                    //console.log("成功加载激励视频");                                    
                }
            ).catch(err => {
                console.log("首次拉取载激励视频失败");
            });
            this.videoduring = 0;
            this.videoLoaded = false;
            this.videoad.onLoad(function () {
                console.log("成功加载激励视频");
                self.videoLoaded = true;
            });
            this.videoad.onError(function () {
                self.videoLoaded = false;
                self.videoCB = null;
                self.videotype = null;
            });
            this.videoad.onClose((status) => {
                console.log("激励视频关闭");
                if (self.bannershowing) {
                    self.banner.show();
                }

                if (status && status.isEnded || status === undefined) {//给奖励
                    if (self.videoCB != null)
                        self.videoCB();

                } else { //不给
                    if (self.videotype != null) { }
                }
                self.videoCB = null;
                self.videotype = null;
            });
        }
    },

    //创建盒子广告
    createBoxAd() {
        if (!QQPLAY)
            return

        if (this.appBoxAd)
            this.appBoxAd.destroy()

        this.appBoxAd = qq.createAppBox({
            adUnitId: QQ_BOX_ID
        })
        var self = this
        this.appBoxAd.load().then(() => {
            self.appBoxAd.show()
        })
    },

    //显示盒子广告
    showBoxAd() {
        this.createBoxAd()
    },

    //隐藏盒子广告
    hideBoxAd() {
        if (this.appBoxAd) {
            this.appBoxAd.destroy()
            this.appBoxAd = null
        }
    },

    createBanner() {
        //banner广告
        var system = platform.getSystemInfoSync();
        var sw = system.screenWidth;
        var sh = system.screenHeight;
        var isFullScreen = (sw * 1.8) < sh;
        var adw = sw
        if (sw / sh > 0.5625) //肥的,如ipad
            adw = sw * 0.7;
        var adh = adw / 4;

        var x = (sw - adw) / 2;
        var y = sh - adh - 4;

        var mid_y = sh / 2 - adh / 2 - 10;
        y = y * (isFullScreen ? 0.96 : 0.99);

        var bannerID = ""
        if (WECHATGAME)
            bannerID = WX_BANNER_ADUNITID

        if (QQPLAY)
            bannerID = QQ_BANNER_ADUNITID

        if (WECHATGAME || QQPLAY) {
            this.banner = platform.createBannerAd({
                adUnitId: bannerID,
                style: {
                    left: x,
                    top: y,
                    width: adw,
                    height: adh
                }
            });
        }

        var self = this;
        if (this.banner != null) {
            this.banner.onLoad(() => {
                if (self.bannershowing) {
                    self.banner.show();
                }
                console.log("成功加载banner广告");
            });
            this.banner.onError(() => {
                console.error("create banner error");
            });
        }
    },

    createInterstitial() {
        if (QQPLAY)
            return

        if (typeof wx.createInterstitialAd == "function") {
            this.interstitialad = wx.createInterstitialAd({
                adUnitId: WX_INSERT_ADUNITID
            })
            console.log("创建插屏广告")
            return;
        }
    },

    update: function (dt) {
        return
        this.videoduring += dt;
        if (WECHATGAME || QQPLAY) {
            if (!this.videoLoaded && this.videoduring > 10) {
                console.log("检测视频");
                var self = this;
                this.videoad.load().then(
                    () => {
                        self.videoLoaded = true;
                        event.emit("videoAdLoaded");
                        console.log("成功加载激励视频 update");
                    }
                ).catch(err => {
                    console.log("拉取广告失败");
                });
                this.videoduring = 0;
            }

            this.bannerCheck += dt;
            if (this.bannerCheck > 2) {
                if (!this.bannershowing) {
                    this.hideBannerAd();
                }
                this.bannerCheck = 0;
            }
        }
    },

    isVideoLoaded: function () {
        return this.videoLoaded;
    },

    showVideoAd: function (callback, adtype) {
        // return
        console.log("showVideoAd");
        if (WECHATGAME || QQPLAY) {
            var self = this;
            var exp = function () {
                self.videoLoaded = false;
                self.videoCB = null;
                platform.showModal({
                    title: "提示",
                    content: "加载视频失败,请稍后重试",
                    showCancel: false,
                    cancelText: "",
                    confirmText: "确定",
                    success: (res) => {
                    }
                });
                self.videoad.load();
            }
            if (this.videoLoaded) {
                this.videoCB = callback;
                this.videoad.show().catch(err => {
                    exp();
                });
                this.videotype = adtype;
                this.hideBannerAd();
            }
            else {
                exp();
            }
        }
    },

    showBannerAd: function () {
        // return
        if (!WECHATGAME && !QQPLAY)
            return
        if (this.banner != null) {
            this.banner.show();
            this.bannershowing = true;
        }
    },

    showInsertAd: function () {
        if (!WECHATGAME)
            return

        if (this.interstitialad) {
            this.interstitialad.show()
        }
    },

    hideBannerAd: function () {
        // return
        if (!WECHATGAME && !QQPLAY)
            return
        if (this.banner != null) {
            this.banner.hide();
            this.bannershowing = false;
        }
    }
}

module.exports = ad;