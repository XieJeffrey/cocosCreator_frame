//游戏数据
var gamedata = {
    //分享图文
    shareData: new Array(),
    //跳转游戏列表
    gamelist: new Array(),
    //控制数据
    control: {
        showMore: false,//是否显示更多游戏
        showGamelist: false,//是否显示游戏列表
        bannerRefreshTime: 0,//banner刷新时间
        homeBannerRatio: 0,//首页banner显示概率
        uglyShare: false,//诱导分享
    },

    //本地保存的key
    dataKey: "200113_01",

    //#region 头条录屏
    recorder: null,
    isRecord: false,
    recordTimer: 0,
    //#endregion

    //#region 玩家数据
    masterData:{
        gold:0,
        gem:0,
        inviteReward:new Array(),
        friendList:new Array(),
    },
    //#endregion
  
    isInvite: false,//是否好友邀请
    inviteId: 0,//邀请的好友ID
    guideData: {},//引导数据
    drawNum: 0,//抽奖次数,
    signArray: [0, 0, 0, 0, 0, 0, 0],
    screenWidth: 0,
    screenHeight: 0,

    //region 引导
    //初始化引导数据
    initGuideData: function () {
        // this.guideData = {
        //     isGuideSummon: false,//是否引导过召唤
        //     isGuideSell: false,//是否引导过出售
        //     isGuideCompose: false,//是否引导过合成
        //     isGuideFight: false,//是否引导过战斗
        // }
        this.guideData = {
            isGuideSummon: true,//是否引导过召唤
            isGuideSell: true,//是否引导过出售
            isGuideCompose: true,//是否引导过合成
            isGuideFight: true,//是否引导过战斗
        }
    },

    //获取引导数据
    getGuideData: function () {
        var str = cc.sys.localStorage.getItem("guide" + this.dataKey)
        if (str === "" || str === null) {
            //初始化英雄数据
            this.initGuideData()
        }
        else {
            this.guideData = JSON.parse(str)
        }
    },

    //保存引导数据
    saveGuideData: function () {
        cc.sys.localStorage.setItem("guide" + this.dataKey, JSON.stringify(this.guideData))
    },
    //#endregion

    //初始化本地秘钥
    initDataKey: function () {
        var str = cc.sys.localStorage.getItem("datakey")
        if (str === "" || str === null) {
            this.dataKey = new Date().getTime() / 1000
        }
        else {
            this.dataKey = parseInt(str)
        }
    },

    //重置本地秘钥
    resetDataKey: function () {
        cc.sys.localStorage.setItem("datakey", new Date().getTime() / 1000)
    },

    //初始化玩家数据
    initMasterData:function(){
        this.masterData.gold=0
        this.masterData.gem=0
        this.masterData.friendList=new Array()
        this.masterData.inviteReward=new Array()
        for(var i=0;i<5;i++){
            this.masterData.inviteReward.push(0)
        }
    },

    //获取玩家数据
    getMasterData:function(){
        var str = cc.sys.localStorage.getItem("masterData" + this.dataKey)
        if (str === "" || str === null) {
            //初始化英雄数据
            this.initGuideData()
        }
        else {
            this.guideData = JSON.parse(str)
        }
    },

    //保存玩家数据
    saveMasterData:function(){
        cc.sys.localStorage.setItem("masterData" + this.dataKey, JSON.stringify(this.masterData))
    },
};

module.exports = gamedata;
