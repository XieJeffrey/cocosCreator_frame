var uitype = //新加UI需要在这个数组里面添加
{
    "loading": { prefab: "loading", order: 50, script: "loading" },
    "msgbox": { prefab: "msgBox", order: 52, script: "msgbox" },
    "start": { prefab: "start", order: 3, script: "start" },
    "gamelist": { prefab: "gamelist", order: 54, script: "gamelist" },
    "guess": { prefab: "guess", order: 31, script: "guess" },
    "float": { prefab: "float", order: 51, script: "float" },
    "guide": { prefab: "guide", order: 100, script: "guide" }
}



var preLoad = ["loading", "start", "msgbox", "float"]

var panelList = new Array();
var inited = false;

module.exports = {
    inited: inited,

    show: function (name, params) {
        if (panelList[name] != undefined) {
            panelList[name].node.active = true;
            if (panelList[name].script && panelList[name].script.onShow != undefined)
                panelList[name].script.onShow(params);
        }
        else {
            var url = "prefab/view/"

            url += uitype[name].prefab
            cc.loader.loadRes(url, cc.Prefab, function (err, assets) {
                if (err) {
                    cc.error(err);
                }
                var name = assets.name.toLowerCase();
                console.log("Load " + name + " successfully");
                var node = cc.instantiate(assets);
                node.name = name;
                node.zIndex = uitype[name].order

                panelList[name] = {};
                panelList[name].node = node;
                cc.find("Canvas").addChild(node);
                panelList[name].script = node.addComponent(uitype[name].script)
                if (panelList[name].script == undefined) {
                    console.error(name + "add component " + uitype[name].script + " failure");
                }
                node.active = true
                panelList[name].script.onShow(params)

            });

        }
    },

    hide: function (name, params) {
        if (panelList[name] != undefined) {
            if (panelList[name].node.active) {
                panelList[name].node.active = false;
                if (panelList[name].script && panelList[name].script.onHide != undefined)
                    panelList[name].script.onHide(params);
            }
        }
    },

    isShow: function (name) {
        if (panelList[name] != undefined) {
            return panelList[name].node.active
        }
        return false
    },

    load(callback) {
        if (inited) {
            console.log("uimanager has been loaded");
            if (callback != undefined)
                callback();
            return;
        }
        console.log("uimanager load");
        var r = cc.find("Canvas");
        if (r.childrenCount > 0) {
            for (var i = 0; i < r.childrenCount; ++i) {
                if (r.children[i].name !== "Main Camera")  //cocos creator 2.0.0有个摄像机
                    r.children[i].destroy();
            }
        }
        //ui管理
        var urls = new Array();

        for (var k in preLoad) {
            urls[k] = "prefab/view/" + uitype[preLoad[k]].prefab;
        }

        console.log(urls)
        cc.loader.loadResArray(urls, cc.Prefab, function (err, assets) {
            if (err) {
                cc.error(err);
            }
            for (var i = 0; i < assets.length; ++i) {
                var name = assets[i].name.toLowerCase();
                console.log("Load " + name + " successfully");
                var node = cc.instantiate(assets[i]);
                node.name = name;
                panelList[name] = {};
                panelList[name].node = node;
                node.zIndex = uitype[name].order
                cc.find("Canvas").addChild(node);
                panelList[name].script = node.addComponent(uitype[name].script)
                if (panelList[name].script == undefined) {
                    console.error(name + "add component " + uitype[name].script + " failure");
                }
            }
            inited = true;
            if (callback != undefined)
                callback();
        });
    },

    //ui部分
    showFloatTip(content, during) {
        if (during == undefined) during = 1;
        if (content == undefined) content = "";
        this.show("float", {
            during: during,
            content: content,
        })
    },

    showMessageBox(params) {
        var p = {};
        if (params == undefined) {
            console.error("invaild params to msgbox");
            return;
        }
        if (params.content == undefined) {
            p.content = "null";
        }
        this.show("msgbox", params);
    },

    showGuide(x, y, size) {
        this.show('guide', { x: x, y: y, size: size })
    },

    showLoading(params) {
        if (WECHATGAME) {
            wx.showLoading(params);
            return
        }

        if (QQPLAY) {
            qq.showLoading(params)
            return
        }


        this.show("loading", params);
    },

    hideLoading() {
        if (WECHATGAME) {
            wx.hideLoading()
            return
        }
        if (QQPLAY) {
            qq.hideLoading();
            return
        }

        this.hide("loading");
    },
}