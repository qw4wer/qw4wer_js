/**
 * Created by qw4wer on 2016/1/5.
 */

// ==UserScript==
// @name         删除b站直播礼物刷屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       qw4wer
// @include      http://live.bilibili.com/*
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @run-at      document-idle
// ==/UserScript==
/* jshint -W097 */
'use strict';
var document = unsafeWindow.document;
var $ = document.$;
(function () {
    var isOther = location.href.indexOf('http://live.bilibili.com') == -1;

    if (!isOther) {
        setTimeout(function(){
            modifyScript();
        },2000);

    } else {

    }

})();

function modifyScript(){
    var new_script;
    GM_xmlhttpRequest({
        method: "get",
        url: 'http://static.hdslb.com/live-static/js/live.room.min.js',
        synchronous:false,
        onload: function (response) {
            new_script = response.responseText;
            new_script = new_script.replace('if(data.type=="gift"){msgPool.append(data.html)}', 'if(data.type=="gift"){/*msgPool.append(data.html)*/}');
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.text = new_script;
            var heads = document.getElementsByTagName("body");
            if (heads.length)
                heads[0].appendChild(script);
            else
                document.documentElement.appendChild(script);
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.text = player_fullwin.toString();
            var heads = document.getElementsByTagName("body");
            if (heads.length)
                heads[0].appendChild(script);
            else
                document.documentElement.appendChild(script);
        }
    });
}



function player_fullwin(status) {
    var $bodyWidth = $(window).width();
    var $bodyHeight = $(window).height();
    if (status == false) {
        $("#live_player").removeClass("wide");
        $("#live_player, .message-history, .message-sender,.game-room .room-info,.game-room .chat-room, .color-msg-popup, .live-body-container, .room-rank-lists-container").removeAttr("style")
    }
    if (status == false && ff_embed_stack === null)return;
    if (ff_embed_stack === null) {
        ff_embed_stack = [];
        ff_embed_stack_style = [];
        var pObj = $("#live_player").get(0);
        do {
            $(pObj).attr("embed_stack", true);
            ff_embed_stack.push(pObj)
        } while (pObj = pObj.parentNode)
    }
    if (status) {
        $(".rklist ,.head-info-panel").hide()
    } else {
        $(".rklist,.head-info-panel").show()
    }
    var divs = $("div").not("#live_player div, .tip-wrapper div,.live-head,.live-head div,.live-head .room-rank-list-tab, .room-rank-list-tab div, .live-body-container, .live-body-container div");
    for (var i in divs) {
        if (!divs[i] || !divs[i].getAttribute || divs[i].getAttribute("embed_stack"))continue;
        if (!divs[i] || !divs[i].style)continue;
        var last_status;
        if (divs[i].getAttribute("ff_id")) {
            last_status = ff_status[divs[i].getAttribute("ff_id")]
        } else {
            ff_status_id++;
            divs[i].setAttribute("ff_id", ff_status_id);
            ff_status[ff_status_id] = divs[i].style.display
        }
        divs[i].style.display = status ? "none" : last_status
    }
    (function () {
        for (var i in ff_embed_stack) {
            var pObj = ff_embed_stack[i];
            if (!pObj || !pObj.style)continue;
            if (!ff_embed_stack_style[i]) {
                ff_embed_stack_style[i] = {
                    position: pObj.style.position,
                    width: pObj.style.width,
                    height: pObj.style.height,
                    padding: pObj.style.padding,
                    margin: pObj.style.margin,
                    style: pObj.style.cssText
                }
            }
            var new_sender =null;

            if (status) {
                pObj.style.position = "fixed";
                pObj.style.padding = "0 0";
                pObj.style.margin = "0 0";
                msgPool.css("padding", 0);
                var $wid = ($bodyWidth) / $bodyWidth * 100 + "%";
                var $chatRoomHeight = ($bodyHeight - 126) / $bodyHeight * 100 + "%";
                var $mesHeight = ($bodyHeight - 256) / ($bodyHeight - 126) * 100 + "%";
                $("#live_player").css({width: $wid, height: "90%", top: "0px"});
                $(".chat-room").css({position: "fixed", top: "126px", left: $wid, height: $chatRoomHeight});
                msgPool.css("height", $mesHeight);
                $(".color-msg-popup").css("top", "-33px");
                //$(".message-sender").css({position: "fixed", bottom: 0, left: $wid});
                $(".room-rank-lists-container").css({position: "fixed", top: 0, left: $wid, "z-index": "999"})
                if($("#new_sender").length ==0) {
                    new_sender = $(".message-sender").clone();
                    new_sender.attr("id", "new_sender").css({position: "fixed", bottom: 0,width: '100%',left:'0',height:'50px'})
                    $(".live-body-container.left").append(new_sender);
                    var danmInput = $("#danmu-input");
                    $(".btn-send").on("click", function () {
                        window.liveQuickLogin();
                        sendMessage()
                    });
                    danmInput.on("keyup", function (e) {
                        if (e.keyCode === 13) {
                            window.liveQuickLogin();
                            sendMessage()
                        }
                    });
                    danmInput.on("input propertychange", function () {
                        $("#danmu-count").html(danmInput.val().length)
                    });
                }
            } else {
                $("#new_sender").remove();
                pObj.style.cssText = ff_embed_stack_style[i].style;
            }
        }
    })();
    if (!status)ff_embed_stack = null
}