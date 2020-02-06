String.prototype.format = function () {
    if (arguments.length == 0) return this;
    var param = arguments[0];
    var s = this;
    if (typeof (param) == 'object') {
        for (var key in param)
            s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
        return s;
    }
    else {
        for (var i = 0; i < arguments.length; i++)
            s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
        return s;
    }
}

//cocoscreator拓展
cc.Node.prototype.findChild = function (path, com) {
    var paths = path.split("/");
    var parent = this;
    var child = this;
    for (var i = 0; i < paths.length; ++i) {
        child = parent.getChildByName(paths[i]);
        parent = child;
    }
    if (com != undefined) {
        child = child.getComponent(com);
    }
    return child;
}

//转换节点坐标到view
cc.Node.prototype.converToViewPosition = function () {
    var node = this
    var pos = cc.v2(this.x, this.y)
    while (node.parent.name != 'Canvas') {
        pos.x += node.parent.x
        pos.y += node.parent.y
        node = node.parent
    }
    return pos
}

Date.prototype.timestamp = function () {
    return Math.floor(new Date().getTime() / 1e3);
}

var util = {
    audio: undefined,
    //数组去重
    unique(array) {
        var result = new Array()
        for (var i = 0; i < array.length; i++) {
            if (array.indexOf(array[i], i + 1) === -1) {
                result.push(array[i])
            }
        }
        return result
    },

    //数组乱序
    unOrderSort(array) {
        array = array.sort(function () {
            return Math.random() > .5 ? -1 : 1
        })
        return array
    },

    /** 冒泡排序：对象数组 */
    bubbleSort(data, key) {
        if (typeof data[0] == "object") {
            for (var i = 0; i < data.length - 1; i++) {
                for (var j = 0; j < data.length - 1 - i; j++) {
                    if (data[j][key] > data[j + 1][key]) {
                        var temp = data[j];
                        data[j] = data[j + 1];
                        data[j + 1] = temp;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < data.length - 1; i++) {
                for (var j = 0; j < data.length - 1 - i; j++) {
                    if (data[j] > data[j + 1]) {
                        var temp = data[j];
                        data[j] = data[j + 1];
                        data[j + 1] = temp;
                    }
                }
            }
        }
    },

    createIcon(sprite, url, error) {
        if (WECHATGAME || QQPLAY || TTGAME || VIVO) {
            var bt = WECHATGAME ? wx : QQPLAY ? qq : TTGAME ? tt : qg;
            let image = bt.createImage();
            image.onload = function () {
                let texture = new cc.Texture2D();
                texture.initWithElement(image);
                texture.handleLoadedTexture();
                sprite.spriteFrame = new cc.SpriteFrame(texture);
            };
            image.onerror = function (err) {
                if (error)
                    error();
            }
            image.src = url;
        }
        else if (NATIVE) {
            cc.loader.load(url, function (err, tex) {
                var spriteFrame = new cc.SpriteFrame(tex);
                sprite.spriteFrame = spriteFrame;
            });
        }
        else {
            let el = document.createElement('image');
            el.style.width = "120px";
            el.style.height = "120px";
            el.setAttribute('src', url);
            let texture = new cc.Texture2D();
            texture.initWithElement(el);
            texture.handleLoadedTexture();
            sprite.spriteFrame = new cc.SpriteFrame(texture);
        }
    },

    csv2Json(text) {
        var array = [];
        var strs = text.split('\n');
        var keys = strs[0].split(',');
        for (var i = 1; i < strs.length; ++i) {
            var obj = {};
            var values = strs[i].split(',');
            if (values.length != keys.length)
                continue;
            for (var j = 0; j < keys.length; ++j) {
                var key = keys[j].trim().replace(/\"/g, '');  //不加trim最后一个键会出现双引号?!!
                var value = values[j].trim().replace(/\"/g, '');
                Object.defineProperty(obj, key, {
                    value: value
                });
            }
            array.push(obj);
        }
        return array;
    },

    sec2hhmmss(second) {
        var hour = Math.floor(second / 3600);
        var min = Math.floor(second / 60) % 60;
        var sec = second % 60;
        var str = hour + ':' + (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
        return str;
    },

    isInside(pos, node) {
        var x = pos.x;
        var y = pos.y;
        var area = node;
        if (x > area.x - area.width / 2 && x < area.x + area.width / 2
            && y < area.y + area.height / 2 && y > area.y - area.height / 2)
            return true;
        return false;
    },

    transAxis(pos) {
        var design = cc.winSize;
        var real = cc.view.getFrameSize();
        var width = design.width;
        var height = width * real.height / real.width;
        return new cc.Vec2(pos.x - width / 2, pos.y - height / 2);
    },

    system: null,

    createAuthBtn(func) {
        if (WECHATGAME || QQPLAY)
            if (this.system == null) {
                this.system = platform.getSystemInfoSync();
            }
        var sw = this.system.screenWidth;
        var sh = this.system.screenHeight;
        var destWidth = sw / 5;
        var destHeight = destWidth * 1.25; //按比例;
        var x = 0;
        var y = sh / 2 - destHeight * 3.52;
        var userbtn = platform.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: x,
                top: y,
                width: destWidth,
                height: destHeight,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                borderRadius: 4
            }
        });
        userbtn.onTap((res) => {
            var data = res.userInfo;
            if (data != undefined) {
                userbtn.hide();
                func(data);
            }
        })
    },

    getQuakeAnim() {
        return cc.repeatForever(cc.sequence(
            cc.rotateBy(0.1, -10),
            cc.rotateBy(0.1, 20),
            cc.rotateBy(0.1, -20),
            cc.rotateBy(0.1, 20),
            cc.rotateBy(0.1, -10),
            cc.scaleTo(2, 1, 1)
        ));
    },

    getFloatAnim() {
        return cc.repeatForever(cc.sequence(
            cc.moveBy(0.7, cc.v2(0, 30)),
            cc.moveBy(0.7, cc.v2(0, -30)),
        ))
    },

    getQuickFloatAnima() {
        return cc.repeatForever(cc.sequence(
            cc.moveBy(0.25, cc.v2(0, 30)),
            cc.moveBy(0.25, cc.v2(0, -30)),
        ))
    },

    getBreathAnima() {
        var seq = cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.2, 1.1, 1.1),
                cc.scaleTo(0.2, 1, 1),
                cc.scaleTo(0.2, 0.9, 0.9),
                cc.scaleTo(0.2, 1, 1)
            )
        )
        return seq
    },

    randomAverage() {
        if (Math.random() > 0.5)
            return -1
        else
            return 1
    },

    lerp(startPoint, endPoint, t) {
        var delta = endPoint - startPoint
        if (t < 0)
            t = 0

        if (t > 1)
            t = 1

        return startPoint + delta * t
    },

    //把秒数转化成hh:mm:ss
    formatTime: function (second) {
        var min = parseInt(second / 60)
        var hour = ""
        if (min >= 60) {
            hour = parseInt(min / 60)
            if (hour < 10)
                hour = "0" + hour + ":"
        }
        if (min < 10)
            min = "0" + min

        min += ":"

        second = parseInt(second % 60)
        if (second < 10) {
            second = "0" + second
        }

        return hour + min + second
    },

    isWeb:function(){
        return !WECHATGAME&&!QQPLAY&&!TTGAME
    },
}

module.exports = util;
