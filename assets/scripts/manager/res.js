var gameConfig = require("../common/gameConfig");
var util = require("../common/util");

var Res = {     
    load: function (callback) {
        var cur = 0
        var total =0

        if(cur==total&&cur==0){
            if(callback)
                callback(1)
        }

        //#region 加载图片(例子)
        // this.buffSprite = new Array()
        // for (var i = 0; i < gameConfig.buffContent.length; i++) {
        //     this.buffSprite.push("")

        //     cc.loader.loadRes("image/skill/" + i, cc.SpriteFrame, function (err, spriteFrame) {
        //         if (err) {
        //             console.error(err)
        //         }
        //         var idx = parseInt(spriteFrame.name)
        //         this.buffSprite[idx] = spriteFrame
        //         cur++
        //         if (callback)
        //             callback(cur / total)
        //     }.bind(this))
        // }
        //#endregion    

    },
}

module.exports = Res;