// var ui = require("../manager/ui");
// const HippoAdSDK = require('HippoAdSDK');

// // 河马SDK激励视频广告位id
// const HIPPO_AD_REWARD_ID = (cc.sys.os === cc.sys.OS_ANDROID)
//     ? "04f915875f05f97b4847f979fd7cb5dd"
//     : "85691cdbd96fa7d9f6baa9b717ec0945";
// const HIPPO_AD_FULLSCREENVIDEO_ID = (cc.sys.os === cc.sys.OS_ANDROID)
//     ? "f83d24296a85442e06d120dc1aba122c"
//     : "bfe4445553d1ff53dea7354c516c8441";
// const HIPPO_AD_INTERSTITIAL_ID = (cc.sys.os === cc.sys.OS_ANDROID)
//     ? "f83d24296a85442e06d120dc1aba1221"
//     : "bfe4445553d1ff53dea7354c516c8442";
// const HIPPO_AD_BANNER_ID = (cc.sys.os === cc.sys.OS_ANDROID)
//     ? "f83d24296a85442e06d120dc1aba1222"
//     : "a3c8295837a1c047f8c0872e17fae681";

// module.exports = {
//     /** 退出游戏 */
//     exitGame() {
//         if (IOS)
//             jsb.reflection.callStaticMethod("SDKHelper", "exitGame");
//         else if (ANDROID)
//             jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "exitGame", "()V");
//     },

//     /** 获取UUID */
//     getUUID() {
//         if (IOS)
//             return jsb.reflection.callStaticMethod("AppController", "getUUID");
//         else if (ANDROID)
//             return jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getUUID", "()V");
//     },

//     /** 分享（调用OC静态函数） */
//     share(text, imgUrl, callback) {
//         try {
//             this.callback = callback;
//             if (IOS) {
//                 // 调用 AppController 类中的 Share 方法，并且传递参数
//                 jsb.reflection.callStaticMethod("AppController", "Share:imgUrl:", text, imgUrl);
//                 // 分享回调
//                 window.shareCallback = () => {
//                     if (this.callback) this.callback();
//                 }
//             } else if (this.callback) {
//                 this.callback();
//             }
//         } catch (err) {
//             console.log(err.message);
//             if (this.callback) this.callback();
//         }
//     },

//     initHippoSDK() {
//         const _this = this;
//         // HippoAdSDK.logMode();
//         HippoAdSDK.init((success) => {
//             _this.isInitSuccess = success;
//             _this.loadHippoBannerAd();
//             _this.loadHippoRewardVideoAd();
//             console.log("hippo_sdk", "SDK init, success:" + success);
//         });
//     },

//     loadHippoBannerAd() {
//         if (!this.isInitSuccess) {
//             console.log("hippo_sdk", "请先初始化SDK");
//             return;
//         }
//         HippoAdSDK.initBannerAd([HIPPO_AD_BANNER_ID], (hippoPlacementId, success, errorMessage) => {
//             console.log("hippo_sdk", " banner id:" + hippoPlacementId + " loaded, success:" + success + ", errorMessage:" + (errorMessage || ""));
//         });
//     },

//     showHippoBannerAd() {
//         HippoAdSDK.showBannerAd(HIPPO_AD_BANNER_ID, (success, errorMessage) => { // 展示回调
//             console.log("hippo_sdk", "show banner success:" + success);

//         }, () => { // 点击回调
//             console.log("hippo_sdk", "cocos showHippoBannerAd clicked.");
//         });
//     },

//     hideHippoBannerAd() {
//         HippoAdSDK.hideBannerAd(HIPPO_AD_BANNER_ID);
//     },

//     loadHippoInterstitialAd() {
//         if (!this.isInitSuccess) {
//             console.log("hippo_sdk", "请先初始化SDK");
//             return;
//         }
//         HippoAdSDK.initInterstitialAd([HIPPO_AD_INTERSTITIAL_ID], (hippoPlacementId, success) => {
//             console.log("hippo_sdk", " Interstitial id:" + hippoPlacementId + " loaded, success:" + success);
//         });
//     },

//     showHippoInterstitialAd() {
//         HippoAdSDK.showInterstitialAd(HIPPO_AD_INTERSTITIAL_ID, (success, errorMessage) => {
//             console.log("hippo_sdk", "show Interstitial success:" + success);
//         }, () => {
//             console.log("hippo_sdk", "cocos showHippoInterstitialAd clicked.");
//         });
//     },

//     loadHippoFullScreenVideoAd() {
//         if (!this.isInitSuccess) {
//             console.log("hippo_sdk", "请先初始化SDK");
//             return;
//         }
//         HippoAdSDK.initFullScreenVideoAd([HIPPO_AD_FULLSCREENVIDEO_ID], (hippoPlacementId, success) => {
//             console.log("hippo_sdk", " fullscreenvideo id:" + hippoPlacementId + " loaded, success:" + success);
//         });
//     },

//     showFullScreenVideoAd() {
//         HippoAdSDK.showFullScreenVideoAd(HIPPO_AD_FULLSCREENVIDEO_ID, (success, errorMessage) => {
//             console.log("hippo_sdk", "show FullScreenVideo success:" + success);
//         }, () => {
//             console.log("hippo_sdk", "cocos showFullScreenVideoAd clicked.");
//         });
//     },

//     loadHippoRewardVideoAd() {
//         if (!this.isInitSuccess) {
//             console.log("hippo_sdk", "请先初始化SDK");
//             return;
//         }
//         HippoAdSDK.initRewardedVideoAd([HIPPO_AD_REWARD_ID], (hippoPlacementId, success) => {
//             require("../platform/ad").videoLoaded = success;
//             console.log("hippo_sdk", " reward id:" + hippoPlacementId + " loaded, success:" + success);
//         });
//     },

//     showHippoRewardVideoAd(callback) {
//         ui.showMessageBox({
//             content: "确定要看视频获取奖励吗？",
//             confirm: () => {
//                 HippoAdSDK.showRewardVideoAd(HIPPO_AD_REWARD_ID, (success, errorMessage, isRewarded) => { // 展示回调
//                     console.log("hippo_sdk", "showRewardVideoAd success:" + success + ", isRewarded:" + isRewarded);
//                     if (success && isRewarded) {
//                         // 给奖励
//                         if (callback) callback();
//                     }
//                 }, () => { // 点击回调
//                     console.log("hippo_sdk", "cocos showRewardVideoAd clicked.");
//                 });
//             },
//             cancel: () => { }
//         });
//     },

//     checkAdLoaded() {
//         const isLoaded = HippoAdSDK.isLoaded(HIPPO_AD_REWARD_ID);
//         console.log("hippo_sdk", "reward ad " + HIPPO_AD_REWARD_ID + " isLoaded:" + isLoaded);
//     },

//     sendUmengCustomEvent() {
//         HippoAdSDK.sendEvent("test_event", { "parma1": "value1", "param2": "value2" });
//     }
// }