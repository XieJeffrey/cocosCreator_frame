var event = require("../manager/event")
var gameType = require("../data/gametype")
cc.Class({
    extends: cc.Component,
    properties: {

    },

    onLoad() {
        this.enterEvtList = new Array()
        this.stayEventList = new Array()
        this.exitEventList = new Array()
    },

    registerEnterEvt: function (func) {
        this.enterEvtList.push(func)
    },

    registerStayEvt: function (func) {
        this.stayEventList.push(func)
    },

    registerExitEvt: function (func) {
        this.exitEventList.push(func)
    },

    onCollisionEnter: function (other, self) {
        event.emit(gameType.eventType.TRIGGERENTER, [other, self])
    },

    onCollisionStay: function (other, self) {
        event.emit(gameType.eventType.TRIGGERSTAY, [other, self])
    },

    onCollisionExit: function (other, self) {
        event.emit(gameType.eventType.TRIGGEREXIT, [other, self])
    }


});
