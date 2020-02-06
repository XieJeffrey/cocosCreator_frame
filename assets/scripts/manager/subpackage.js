var subpackage = {
    shareTexture: new Array(),
    fishLoaded: false,

    setFishImg: function (url, i) {
        this.loadSprite(url, (sp) => {
            this.fishImg[i] = sp;
        })
    },

    load: function () {
        if (!WECHATGAME || !QQPlAY) {
            return;
        }

        var self = this;
        platform.loadSubpackage({
            name: 'skeleton', // name 可以填 name 或者 root
            success: function (res) {
                // 分包加载成功后通过 success 回调
                console.log("分包加载成功");
            },
            fail: function (res) {
                // 分包加载失败通过 fail 回调
            }
        })
    },
}

module.exports = subpackage;