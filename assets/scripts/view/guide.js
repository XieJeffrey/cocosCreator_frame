var app = require("../app");
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.hole = this.node.findChild('hole')
        this.node.on('touchstart', this.onTouchBg, this)
        app.event.on(app.gametype.eventType.HideGuide, this.hideGuide, this)

    },

    start() {

    },

    hideGuide() {
        app.ui.hide('guide')
    },

    onShow(param) {
        this.hole.x = param.x
        this.hole.y = param.y
        this.hole.width = param.size
        this.hole.height = param.size
    },

    onTouchBg(event) {
        let point = event.getLocation()
        let retWorld = this.hole.getBoundingBoxToWorld()

        let space = this.hole.width
        retWorld.x += 720 - space / 2
        retWorld.y += 1600 - space / 2

        retWorld.width = this.hole.width
        retWorld.height = this.hole.height

        if (retWorld.contains(point)) {
            this.node._touchListener.setSwallowTouches(false)
        }
        else {
            this.node._touchListener.setSwallowTouches(true)
        }

    }

});
