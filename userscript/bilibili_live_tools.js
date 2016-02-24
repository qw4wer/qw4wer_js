/**
 * Created by qw4wer on 2016/1/22.
 */

// ==UserScript==
// @name         bili.live 直播工具
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  b站直播观看工具
// @author       qw4wer
// @include      http://live.bilibili.com/*
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @run-at      document-idle

// ==/UserScript==
//debugger;
$ = $ || unsafeWindow.$;
document = document || unsafeWindow.document;
(function () {
    var isOther = location.href.indexOf('http://live.bilibili.com') == -1;

    if (!isOther) {
        setTimeout(function () {
            loadTools();
        }, 2000);

    } else {

    }

})();

var panel_html = "<div id='other_tools_panel' ms-controller='other_tools' style='display: inline-block'> </div>";
var button_html = "<div role='button'></div>";

var tools = [
    {
        id: 'fullScreen',
        title: '网页全屏',
        className: 'full-win',
        position: [{x: 0, y: 0, s: ''}, {x: 0, y: -20, s: '.active'}],
        flag: 'hasFullScreen',
        fn: function (e) {
            e ? $(document.body).addClass("full-win") : $(document.body).removeClass("full-win");
        }

    },
    {
        id: 'cleanGift',
        title: '隐藏礼物',
        className: 'hidden-gift',
        position: [{x: -20, y: 0, s: ''}, {x: -20, y: -20, s: '.active'}],
        flag: 'hasHiddenGift',
        fn: function (e) {
            e ? $(document.body).addClass("hidden-gift") : $(document.body).removeClass("hidden-gift");
        }
    },
    {
        id: 'hiddenSuperGift',
        title: '隐藏礼物连击',
        className: 'hidden-supper-gift',
        position: [{x: -40, y: 0, s: ''}, {x: -40, y: -20, s: '.active'}],
        flag: 'hasHiddenSuperGift',
        fn: function (e) {
            e ? $(document.body).addClass("hidden-supper-gift") : $(document.body).removeClass("hidden-supper-gift");
        }
    },
    {
        id: 'addDanmu',
        title: '添加弹幕监听',
        className: 'addDanmu',
        position: [{x: -40, y: 0, s: ''}, {x: -40, y: -20, s: '.active'}],
        flag: 'hasAddDanmu',
        fn: function (e) {
            e ? addSection(unsafeWindow.liveRoomFuncs, "addDanmu") : sections.remove();
        }
    },


];

var base64img = "data:image/png;base64,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";


function initCss() {
    var css = "body.hidden-gift .gift-msg{display:none} body.player-full-win.full-win .video-section .chat-ctnr{display:none} body.player-full-win.full-win .video-section .player-area{width:100%;height:calc(100% - 50px);} body.hidden-supper-gift .super-gift-ctnr{display:none}";
    var b = ".chat-ctrl-panel .chat-ctrl-btns .btn.{0}{1}{  background-image: url({2});background-position: {3}px {4}px; }";

    for (var i = 0; i < tools.length; i++) {
        for (var j = 0; j < tools[i].position.length; j++) {
            css += format(b, [tools[i].className, tools[i].position[j].s, base64img, tools[i].position[j].x, tools[i].position[j].y]);
        }
    }
    return css;
}

function loadTools() {
    console.log("tools start init");
    GM_addStyle(initCss());

    var panel = $(panel_html);
    var button = $(button_html);
    for (var i = 0; i < tools.length; i++) {
        button = button.clone();
        button.attr("class", "btn").attr("title", tools[i].title).attr("ms-click", tools[i].id).addClass(tools[i].className).attr("ms-class", "active: " + tools[i].flag);
        panel.append(button);
    }


    $("#chat-ctrl-panel .btns").append(panel);

    var vm = avalon.define({
        $id: "other_tools",
        fullScreen: function () {
            vm.hasFullScreen = !vm.hasFullScreen;
        },
        cleanGift: function () {
            vm.hasHiddenGift = !vm.hasHiddenGift;
        },
        hiddenSuperGift: function () {
            vm.hasHiddenSuperGift = !vm.hasHiddenSuperGift;
        },
        addDanmu: function () {
            vm.hasAddDanmu = !vm.hasAddDanmu;
        },
        hasHiddenGift: false,
        hasFullScreen: false,
        hasHiddenSuperGift: false,
        hasAddDanmu: false
    });


// 取消闭包影响
    for (var i in tools) {
        (function (ii) {
            vm.$watch(tools[ii].flag, tools[ii].fn);
        })(i);
    }


    //弹幕控制初始化


    avalon.scan();
}
// 工具方法  //
/**
 * 加载js 到页面
 * @param jsStr
 */

function loadJs(jsStr) {
    var oHead = document.getElementsByTagName('HEAD')[0],
        oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.text = jsStr;
    oHead.appendChild(oScript);
}

/**
 * 占位符格式化字符串
 * @param str
 * @param arguments
 * @returns {*}
 */

function format(str, arguments) {
    for (var s = str, i = 0; i < arguments.length; i++)
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return s;
}
// 页面方法 //
/**
 * 用于执行方法
 * @param fn
 * @param fnArg
 * @returns {*}
 */

function executeFn(fn, fnArg) {

    if (fn != "" && typeof fn == "function") {

        if (fnArg != undefined && fnArg.length > 0) {

            var argLength = fnArg.length;
            var arr = new Array([argLength]);
            $(fnArg).each(function (index) {
                arr[index] = fnArg[index];
            });
            return fn.apply(fn, arr);
        } else {

            return fn();
        }
    }
}

/**
 * js环绕切面
 * @param options
 * @returns {{remove: remove}}
 */

function section(options) {
    var defaults = {
        object: window,
        methodName: '',
        preposition: '',
        prepositionArg: [],
        postposition: '',
        postpositionArg: [],
        hasRuturn: false,

    };
    options = $.extend(defaults, options);


    var exist = options.object[options.methodName];
    var previous = function () {
        return exist.apply(options.object, arguments);
    };
    var advised = function advice() {
        var res = undefined;
        if (options.preposition != '' && typeof(options.preposition) == 'function') {
            options.prepositionArg.unshift(arguments[0]);
            if (executeFn(options.preposition, options.prepositionArg)) {
                console.log('stop');
                return;
            }
        }
        res = previous.apply(this, arguments);
        if (options.postposition != '' && typeof(options.postposition) == 'function') {
            options.postpositionArg.unshift(arguments[0]);
            executeFn(options.postposition, options.postpositionArg);
        }
        return options.hasRuturn === true ? res : undefined;
    }
    options.object[options.methodName] = function () {
        return advised ? advised.apply(options.object, arguments) : previous.apply(options.object, arguments);
    };

    return {
        remove: function () {
            advised = null;
            advice = null;
        }
    }


}

function addSection(object, methodName) {
    console.log('addSection');
    sections = section({
        //object: avalon.vmodels.chatListCtrl.$events.addDanmu[0],
        object: object,
        //methodName: 'handler',
        methodName: methodName,
        preposition: function (args) {
            console.log('start');
            console.dir(args);
        },
        postposition: function (args) {
            //console.log('end');
        }

    });

}
/**
 * 弹幕处理
 * @param args
 */
function danmuHandler(danmu) {
    var danmuMsg = '';
    if (danmu) {
        danmuMsg = danmu.info[0];
    }
}
