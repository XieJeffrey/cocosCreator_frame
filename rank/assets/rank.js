// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        firstImg: cc.SpriteFrame,
        secondImg: cc.SpriteFrame,
        thirdImg: cc.SpriteFrame,
        otherImg: cc.SpriteFrame,
        mineItem: cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var self = this
        console.log("onLoad")
        this.rankKey = "space_jump_190815"
        this.content = this.node.getChildByName("scrollView").getChildByName("view").getChildByName("content")
        this.item = this.node.getChildByName("item")
        this.item.active = false
        this.itemList = new Array()

        this.rankingData = new Array()
        this.pageIdx = 0
        this.itemNum = 6//1页6条
        this.getMyHistoryData()


        platform.onMessage(data => {
            switch (data.action) {
                case 'init':
                    platform.getUserInfo({
                        openIdList: ['selfOpenId'],
                        success: (userRes) => {
                            console.log('success', userRes.data);
                            self.userData = userRes.data[0];
                            self.mineName = self.userData.nickName
                            self.myIcon = self.userData.avatarUrl
                            console.log("获取个人历史数据")
                            console.log(self.mineName)
                            console.log(self.myIcon)
                        },
                        fail: (res) => {
                            console.log("拉取个人信息失败")
                        }
                    });
                    break;
                case 'friend':
                    this.pullRankingData()
                    this.pageIdx = 0
                    break;
                case 'world':
                    this.rankingData = data.data
                    this.showRank("world")
                    break;
                case 'finish':
                    this.submitUserData(data.data)
                    break
            }
        });
    },

    showRank(which) {
        for (var i = 0; i < this.itemList.length; i++) {
            this.itemList[i].active = false
        }

        var tmp = this.mineItem.getChildByName("item")
        tmp.getChildByName("rank").getComponent(cc.Label).string = "??"

        var mineData = undefined

        switch (which) {
            case "friend":
                for (var i = 0; i < this.rankingData.length; i++) {
                    if (this.rankingData[i].avatarUrl == this.myIcon) {
                        mineData = this.rankingData[i]
                    }
                    var item = this.itemList[i]
                    if (item == undefined) {
                        item = cc.instantiate(this.item)
                        item.parent = this.content
                        this.itemList.push(item)
                    }
                    item.active = true
                    this.setRankItem(this.itemList[i], this.rankingData[i], i)
                }
                break;

            case "world":
                for (var i = 0; i < this.rankingData.length; i++) {
                    if (this.rankingData[i].avatarUrl == this.myIcon) {
                        mineData = this.rankingData[i]
                    }

                    var item = this.itemList[i]
                    if (item == undefined) {
                        item = cc.instantiate(this.item)
                        this.content.addChild(item)
                        this.itemList.push(item)
                    }
                    item.active = true
                    this.setRankItem(this.itemList[i], this.rankingData[i], this.rankingData[i].idx - 1)
                }
                break;
        }


        //默认不上榜
        this.mineItem.getChildByName("not").active = true
        this.createIcon(tmp.getChildByName("mask").getChildByName("icon").getComponent(cc.Sprite), this.myIcon)
        tmp.getChildByName("name").getComponent(cc.Label).string = this.mineName
        if (mineData) {
            tmp.getChildByName("score").getComponent(cc.Label).string = mineData.KVDataList[0].value
            this.mineItem.getChildByName("not").active = false
        }
        else {
            tmp.getChildByName("score").getComponent(cc.Label).string = "????"
        }
    },

    createIcon(sprite, url, error) {
        let image = platform.createImage();
        image.onload = function () {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = url;
    },

    setRankItem(item, data, rankIdx) {
        switch (rankIdx) {
            case 0:
                item.getChildByName("rankBg").getComponent(cc.Sprite).spriteFrame = this.firstImg
                break;
            case 1:
                item.getChildByName("rankBg").getComponent(cc.Sprite).spriteFrame = this.secondImg
                break;
            case 2:
                item.getChildByName("rankBg").getComponent(cc.Sprite).spriteFrame = this.thirdImg
                break;
            default:
                item.getChildByName("rankBg").getComponent(cc.Sprite).spriteFrame = this.otherImg
                break;

        }

        console.log(this.myIcon)
        if (this.myIcon == data.avatarUrl) {
            this.mineItem.getChildByName("item").getChildByName("rank").getComponent(cc.Label).string = rankIdx + 1
            switch (rankIdx) {
                case 0:
                    this.mineItem.getChildByName("item").getChildByName("rankBg").getComponent(cc.Sprite).spriteFrame = this.firstImg
                    break;
                case 1:
                    this.mineItem.getChildByName("item").getChildByName("rankBg").getComponent(cc.Sprite).spriteFrame = this.secondImg
                    break;
                case 2:
                    this.mineItem.getChildByName("item").getChildByName("rankBg").getComponent(cc.Sprite).spriteFrame = this.thirdImg
                    break;
                default:
                    this.mineItem.getChildByName("item").getChildByName("rankBg").getComponent(cc.Sprite).spriteFrame = this.otherImg
                    break;

            }
        }

        item.getChildByName("rank").getComponent(cc.Label).string = rankIdx + 1
        this.createIcon(item.getChildByName("mask").getChildByName("icon").getComponent(cc.Sprite), data.avatarUrl)
        item.getChildByName("name").getComponent(cc.Label).string = data.nickname
        item.getChildByName("score").getComponent(cc.Label).string = data.KVDataList[0].value
    },

    //提交个人数据
    submitUserData(data) {
        //KVDataList代表排行数据,可以为多个,多个代表多个排行
        //key-排行类型,value-排行分数
        var self = this
        //分数超过每周最高或者开始新的礼拜直接更新数据      
        var submitData = [
            { key: 'score' + self.rankKey, value: data.score + "" },
            { key: 'time' + self.rankKey, value: self.getLastMondayBeginTimestamp() + "" },
        ]
        console.log("本局分数:" + data.score)
        console.log("本周最高:" + this.weekHighestScore)
        console.log("记录时间:" + this.recordTime)
        console.log("本周时间戳:" + parseInt(this.getLastMondayBeginTimestamp()))
        if (data.score > this.weekHighestScore || parseInt(self.getLastMondayBeginTimestamp()) > this.recordTime) {
            console.log("提交成绩")

            submitData.push({ key: 'weekHighest' + self.rankKey, value: data.score + "" })
            submitData.push({ key: 'lastCommitTime' + self.rankKey, value: self.getLastMondayBeginTimestamp() + "" })
            this.recordTime = self.getLastMondayBeginTimestamp()
            this.weekHighestScore = data.score

            console.log(submitData)
            platform.setUserCloudStorage({
                KVDataList: submitData,
                success: function (res) {
                    self.pullRankingData()
                    console.log(res)
                    console.error("成绩提交成功")
                    self.refreshHistroyData()
                },
                fail: function (res) {
                    self.pullRankingData()
                    console.log('setUserCloudStorage', 'fail')
                    console.log(res)
                }
            });
        }
        else {
            self.pullRankingData()
            console.log("不提交")
        }
    },


    //拉取排行数据
    pullRankingData() {
        console.log("开始获取排行");
        var self = this
        platform.getUserInfo({
            openIdList: ['selfOpenId'],
            success: (userRes) => {
                console.log('success', userRes.data);
                self.userData = userRes.data[0];
                self.myIcon = self.userData.avatarUrl
                //取出所有好友数据
                platform.getFriendCloudStorage({
                    keyList: [
                        'score' + self.rankKey,
                        'time' + self.rankKey,
                    ],
                    success: res => {
                        console.log("wx.getFriendCloudStorage success", res);
                        let data = res.data;
                        data.sort((a, b) => {
                            if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                return 0;
                            }
                            if (a.KVDataList.length == 0) {
                                return 1;
                            }
                            if (b.KVDataList.length == 0) {
                                return -1;
                            }
                            return b.KVDataList[0].value - a.KVDataList[0].value;
                        });

                        //移除上个礼拜的数据
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].KVDataList.length == 0) {
                                data.splice(i, 1)
                                i--
                                continue;
                            }

                            if (parseInt(data[i].KVDataList[1].value) < parseInt(self.getLastMondayBeginTimestamp())) {
                                data.splice(i, 1)
                                i--
                            }
                        }

                        self.rankingData = data
                        self.showRank("friend")

                    },
                    fail: res => {
                        console.log("拉取好友信息失败", res);
                    },
                });
            },
            fail: (res) => {
                console.log("拉取个人信息失败")
            }
        });
    },

    //获取周日00:00:00的时间戳
    getLastMondayBeginTimestamp() {
        var MultiSecondPerWeek = 1000 * 60 * 60 * 24 * 7;
        var now = new Date();
        var d = new Date(2018, 4, 7, 0, 0, 0);  //月数从0开始,所以获得的是5月7日(星期一)的时间戳
        d.setFullYear(2018, 4, 7);
        var diffMultiSecond = now.getTime() - d.getTime();
        var weeknumber = Math.floor(diffMultiSecond / MultiSecondPerWeek);
        var lastMondyTimestamp = d.getTime() + weeknumber * MultiSecondPerWeek;
        return lastMondyTimestamp
    },

    //获取个人历史数据
    getMyHistoryData() {
        var self = this
        platform.getUserCloudStorage({
            keyList: [
                'weekHighest' + self.rankKey,
                'lastCommitTime' + self.rankKey,
            ],
            success: function (res) {
                console.log("获取个人历史数据")
                console.log(res)
                var data = res.KVDataList;
                if (data.length == 0) {
                    self.weekHighestScore = 0
                    self.recordTime = 0
                }
                else {
                    self.weekHighestScore = parseInt(data[0].value)
                    self.recordTime = parseInt(data[1].value)
                }

                console.log(self.weekHighestScore)
                console.log(self.recordTime)
            },
            fail: function (res) {
                console.log("获取个人历史数据失败")
            }
        })
    },

    //刷新个人历史数据
    refreshHistroyData() {
        var self = this
        platform.setUserCloudStorage({
            KVDataList: [
                { key: 'weekHighest' + self.rankKey, value: self.weekHighestScore + "" },//每周最高
                { key: 'lastCommitTime' + self.rankKey, value: self.getLastMondayBeginTimestamp() + "" },//上次提交分数的时间
            ],
            success: function (res) {
                console.log("刷新个人历史记录成功")
            },
            fail: function (res) {
                console.log("刷新个人历史记录失败")
            }
        })
    }

    // update (dt) {},
});
