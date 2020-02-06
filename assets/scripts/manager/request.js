var qs = require("querystring");
var event = require("../manager/event");

function post(url, params, callback) {
    var pStr = new Array();
    var str = qs.stringify(params);

    console.log('request:' + url + "?" + str);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            console.log(response)
            if (response != "") {
                var msg = JSON.parse(response);
                callback(msg);
            }
        }
    };
    xhr.open("POST", url, true);
    xhr.send(str);
}

function get(url, params, callback) {
    var pStr = new Array();
    var str = qs.stringify(params)

    console.log('request:' + url + "?" + str);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            console.log(response)
            if (response != "") {
                var msg = JSON.parse(response);
                callback(msg);
            }
        }
    };
    xhr.open("GET", url + "?" + str, true);
    xhr.send(null);
}

module.exports = {
    post: post,
    get: get,
};