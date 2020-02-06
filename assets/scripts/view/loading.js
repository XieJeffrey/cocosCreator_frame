
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.img = this.node.getChildByName("img");
    },

    start() {

    },

    update(dt) {

    },

    onShow() {
        console.log("loadingshow");
        this.img.angle = 0;
        this.img.stopAllActions();
        var rep = cc.repeatForever(
            cc.rotateBy(2, 360)
        )
        this.img.runAction(rep);
    },

    onHide() {
        console.log("loadinghide");
    }
});
