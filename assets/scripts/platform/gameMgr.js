var c = require('../common/config');
var gameConfig = require("../common/gameConfig")
var request = require('../manager/request');
var time = require("../manager/time");
var launch = require("../platform/launch");
var audio = require("../manager/audio")

var ui = require("../manager/ui");
var userdata = require("../data/userdata");
var gamedata = require("../data/gamedata");
var gametype = require("../data/gametype");
var util = require("../common/util");
var event = require("../manager/event")
var ui = require("../manager/ui")

const localSave = false
const data_key = "191211_8"

var gameMgr = {
    login: function (callback, showLoading = true) {
        console.log("login");
        if (showLoading)
            ui.showLoading({
                title: "登录中"
            });

        var self = this;

        if (WECHATGAME || QQPLAY) {
            var res = platform.getLaunchOptionsSync();
            var channel = res.query.channel
            if (channel == undefined)
                channel = ""

            platform.login({
                success: (res) => {
                    console.log("res.code:" + res.code)
                    var params = {
                        Code: res.code
                    }

                    if (QQPLAY)
                        params = {
                            QQCode: res.code,
                        }

                    request.post(c.configUrl.url, params, function (data) {
                        if (data.Result == 0) {
                            console.log("Get OpenID:" + data.Member.OpenID)
                            userdata.openid = data.Member.OpenID


                            gamedata.drawNum = parseInt(data.Member.LuckDrawCount)//抽奖次数

                            //签到数据
                            var strArray = data.Member.SignStr.split(',')
                            for (var i = 0; i < strArray.length; i++) {
                                gamedata.signArray[i] = parseInt(strArray[i]) == 1
                            }
                         
                            gamedata.getGuideData()
                            platform.getUserInfo({
                                lang: "zh_CN",
                                success: (res) => {
                                    console.log(res)
                                    userdata.isGetUserData = true
                                    userdata.nickname = res.userInfo.nickName
                                    userdata.icon = res.userInfo.avatarUrl
                                    self.updateUserInfo()
                                },
                                fail: (res) => {
                                    console.log("授权失败")
                                    userdata.isGetUserData = false
                                    userdata.userInfoBtn = wx.createUserInfoButton({
                                        type: 'image',
                                        image: '',
                                        style: {
                                            left: 0,
                                            top: 0,
                                            width: gamedata.screenWidth,
                                            height: gamedata.screenHeight
                                        }
                                    })

                                    userdata.userInfoBtn.onTap((res) => {
                                        userdata.userInfoBtn.hide()
                                        userdata.isGetUserData = true
                                        userdata.nickname = res.userInfo.nickName
                                        userdata.icon = res.userInfo.avatarUrl
                                        self.updateUserInfo()
                                    })
                                },
                            })
                        }
                    })
                },
                fail: (res) => {
                    ui.showFloatTip("登录失败，请稍后重试")
                },
                complete: () => {
                    ui.hideLoading()
                }
            })
        }
    },

    //获取游戏控制数据
    getGameControl() {
        var params = {
            AppID: c.appID,
        }
        request.post(c.configUrl.control, params, (data) => {
            console.log(data)
            var info = data.GameControlInfo
            gamedata.control.showGamelist = parseInt(info.ShowGameList) == 1
            gamedata.control.bannerRefreshTime = parseInt(info.RefreshTime)
            gamedata.control.homeBannerRatio = parseInt(info.Banner)
            gamedata.control.showMore = parseInt(info.Recharge) == 1
            gamedata.control.uglyShare = parseInt(info.Share) == 1
            c.netversion = parseInt(info.Edition)
            if (info.Edition > c.localversion) {
                gamedata.control.uglyShare = true
            }
        })
    },

    //获取分享文案
    getShareContent() {
        var params = {
            AppID: c.appID,
        }
        request.post(c.configUrl.share, params, (data) => {
            gamedata.shareData = new Array()
            for (var i = 0; i < data.Copywriting.length; i++) {
                var item = {
                    text: data.Copywriting[i].Text,
                    img: data.Copywriting[i].Img
                }
                gamedata.shareData.push(item)
            }
            console.log(gamedata.shareData)
        })
    }, 


    //抽奖
    draw: function (func) {
        if (WECHATGAME || QQPLAY) {
            if (gamedata.drawNum <= 0) {
                ui.showFloatTip("抽奖次数已用完~")
                return
            }

            var params = {
                LuckDraw: userdata.openid
            }

            request.post(c.configUrl.url, params, function (data) {
                if (data.Result == 0) {
                    var type = parseInt(data.LuckDrawType)
                    gamedata.drawNum = parseInt(data.LuckDrawCount)
                    if (func)
                        func(type)
                }
            })
        }
    },


    addDrawNum: function () {
        if (WECHATGAME || QQPLAY) {
            var params = {
                AddLuckDrawCount: userdata.openid
            }

            request.post(c.configUrl.url, params, function (data) {
                if (data.Result == 0) {
                    gamedata.drawNum = parseInt(data.LuckDrawCount)
                    event.emit(gametype.eventType.UpdateDrawNum)
                    event.emit(gametype.eventType.RedTip)
                }
            })
        }
    },

    //清除用户数据
    Delete: function () {
        gamedata.resetDataKey()

        var params = {
            ClearUser: userdata.openid
        }

        request.post(c.configUrl.url, params, function () {
            this.clearChestData()
            ui.showFloatTip("重启后生效")
        }.bind(this))
    }, 

    //签到
    sign(idx) {
        var self = this
        if (gamedata.signArray[idx])
            return
        var params = {
            RepairSign: userdata.openid + "|" + idx
        }

        request.post(c.configUrl.url, params, function (data) {
            if (data.Result == 0) {
                var signStr = data.SignStr.split(',')
                gamedata.signArray = new Array()
                for (var i = 0; i < signStr.length; i++) {
                    gamedata.signArray.push(parseInt(signStr[i]) == 1)
                }
                var gold = gameConfig.sign[idx].reward.split('|')[0]
                var diamond = gameConfig.sign[idx].reward.split('|')[1]
                var gift = gameConfig.sign[idx].reward.split('|')[2]
                if (gold > 0) {
                    self.AddGold(gold)
                }
                if (diamond > 0) {
                    self.addDiamond(diamond)
                }
                event.emit(gametype.eventType.RedTip)

                if (gift > 0) {
                    //礼包模块待做
                }
                event.emit(gametype.eventType.Sign)
                event.emit(gametype.eventType.RedTip)
            }
        })
    },

    //领主加金币接口
    AddGold(num) {
        gamedata.masterData.gold += parseInt(num)
        if (num > 0) {
            ui.showFloatTip("获得"+num+"金币")
        }
        gamedata.saveMasterData()
        event.emit(gametype.eventType.GOLD)
        event.emit(gametype.eventType.RedTip)
    },

    //领主加钻石接口
    addDiamond(num) {
        gamedata.masterData.gem += parseInt(num)
        if (num > 0) {
            ui.showFloatTip("获得"+num+"钻石")
        }
        gamedata.saveMasterData()
        event.emit(gametype.eventType.Diamond)
        event.emit(gametype.eventType.RedTip)
    },

    //更新玩家信息
    updateUserInfo() {
        var self = this
        var params = {
            UpdateUserInfo: userdata.openid + "|" + userdata.nickname + "|" + userdata.icon
        }
        request.post(c.configUrl.url, params, function (data) {
            if (data.Result == 0) {
                console.log("更新玩家数据成功")
                if (gamedata.battleValue == 0) {
                    self.updateBattleValue()
                }
            }
        })
    },

    //获取排行数据
    getRankingData(func) {
        if (!WECHATGAME) {
            //本地测试数据
            var data = JSON.parse("{\"Result\":\"0\",\"Ranking\":[{\"OpenID\":\"obBqq5Z1Lrq3Sy1ahGiYIme4Ax2M\",\"Head\":\"https://wx4.sinaimg.cn/mw690/006ys9Gfgy1fxto237bq2j302a02a743.jpg\",\"Name\":\"殇　　　　　　　　\",\"Score\":45000056,\"CreateTime\":\"2019-12-08T01:59:44.9870929+08:00\",\"Index\":1},{\"OpenID\":\"obBqq5ZB56Ot7g5OA5KFNt8wg_R4\",\"Head\":\"https://wx3.sinaimg.cn/mw690/006ys9Gfgy1fxto4jdpibj302a02aa9u.jpg\",\"Name\":\"拾贰\",\"Score\":387,\"CreateTime\":\"2019-11-16T18:38:26.813\",\"Index\":2},{\"OpenID\":\"obBqq5RqfxY4mkbbt2i9Ii1gWdgs\",\"Head\":\"https://wx4.sinaimg.cn/mw690/006ys9Gfgy1fxto27b5pqj302a02aa9u.jpg\",\"Name\":\"Ken\",\"Score\":50,\"CreateTime\":\"2019-12-27T12:43:21.9363307+08:00\",\"Index\":72},{\"OpenID\":\"obBqq5bxifjYfa-Po7ER8ELx5oYo\",\"Head\":\"https://wx3.sinaimg.cn/mw690/006ys9Gfgy1fxto0oqthuj302a02aa9u.jpg\",\"Name\":\"不礼不才\",\"Score\":46,\"CreateTime\":\"2019-11-22T09:59:30.237\",\"Index\":100}]}")
            if (data.Result == 0) {
                gamedata.rankData = new Array()
                for (var i = 0; i < data.Ranking.length; i++) {
                    gamedata.rankData.push(data.Ranking[i])
                }
                if (func)
                    func()
            }
            return
        }

        var params = {
            GetRanking: ""
        }
        request.post(c.configUrl.url, params, function (data) {
            console.log(data)
            if (data.Result == 0) {
                gamedata.rankData = new Array()
                for (var i = 0; i < data.Ranking.length; i++) {
                    gamedata.rankData.push(data.Ranking[i])
                }
                if (func)
                    func()
            }
        })
    },

    //领取好友助力奖励~
    getInviteReward() {
        for (var i = 0; i < gamedata.masterData.inviteReward.length; i++) {
            if (gamedata.masterData.inviteReward[i] == 0) {
                if (gamedata.masterData.friendList.length >= parseInt(gameConfig.friend[i].num)) {
                    this.addDiamond(parseInt(gameConfig.friend[i].reward))
                    gamedata.masterData.inviteReward[i] = 1
                    this.saveMaster()
                    event.emit(gametype.eventType.Friend)
                    return
                }
            }
        }
    }, 
}


module.exports = gameMgr;