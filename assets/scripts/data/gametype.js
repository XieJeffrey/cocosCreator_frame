var GameType = {
    eventType: {
        LOGIN: "login",
        HideGuide: 'hide',
    },

    GameState: {
        Guide: 0,//引导中
        Prepare: 1,//准备中
        Fighting: 2,//进入战斗            
    },

    //引导状态
    GuideState: {},

    SoundType: {
        click: "button",
        countdown: "321",
        go: "go",
    },

    BgmType: {
        start: "startBgm",
        menu: "menuBgm",
        fight: "fightBgm"
    },
}

module.exports = GameType;