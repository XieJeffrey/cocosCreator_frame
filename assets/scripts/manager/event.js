var eventList = new Array();
var callbacks = {};

function on(event, callback, node) {
    if (callbacks[event] == undefined) {
        callbacks[event] = new Array();
    }
    callbacks[event].push({ f: callback, n: node });
}

function emit(event, params) {
    var fArray = callbacks[event];
    if (fArray != undefined) {
        for (var i = 0; i < fArray.length; ++i) {
            var a = fArray[i];
            if (a != undefined) {
                if (a.n.node.active) {
                    a.f.call(a.n, params);
                }
            }
            else {
                console.error(event + " hasn't callback");
            }
        }
    }
}

module.exports = {
    on: on,
    emit: emit,
}