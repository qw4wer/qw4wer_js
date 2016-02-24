/**
 * Created by qw5we on 2016/1/27.
 */

// ==UserScript==
// @name         exhentai
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       qw4wer
// @match        http://exhentai.org/s/*
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @run-at      document-idle
// @require     http://code.jquery.com/jquery-2.1.1.min.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

$ = $ || unsafeWindow.$;
document = document || unsafeWindow.document;
(function () {
    var isOther = location.href.indexOf('http://exhentai.org/s') == -1;

    if (!isOther) {
        setTimeout(function () {
            init();
            loadTools();
        }, 2000);

    } else {

    }

})();

function loadTools() {
    $("#i1 h1").append("<input type='button' onclick='method(this)'/>");
    loadJs(method.toString()+reloadImg.toString());
}

function reloadImg(img){
    //$(img).parent().append($(img).next().remove());

    $(img).next().attr("src",$(img).next().attr("src")+"?t="+Date.parse(new Date()));
}

function method(btn) {
    debugger;
    $(btn).attr("disabled","disabled");
    var div = $("<div><span style='width: 10px;height: 10px;background-color: red;display: inline;position: absolute' onclick='reloadImg(this)'></span></div>");

    var max = $("#i2 div a:last").attr('href').substring($("#i2 div a:last").attr('href').indexOf("-")+1);

    var nextPage = $("#i2 div a:eq(2)").attr("href");

    var first = $("#i3 img");

    $("#i3 a").remove();

    $("#i3").append(div.clone().append(first));

    var arr = [];
    loadImage(nextPage,arr);
    function loadImage(url,arr){
        $.ajax({
            url:url,
            dataType:'html',
            async:true,
            success:function(data){
                arr.push($("#i3 img",data));
                $("#i3 div:last").after(div.clone().append($("#i3 img",data)));
                var next = $("#i2 div a:eq(2)",data).attr("href");
                var page = next.substring(next.indexOf("-")+1);
                if(parseInt(page)  < parseInt(max))
                    setTimeout(loadImage(next,arr),1500);

            }

        });
    }
}



function init() {
    GM_xmlhttpRequest({
        method: "get",
        url: 'http://code.jquery.com/jquery-2.1.1.min.js',
        synchronous: false,
        onload: function (response) {
            loadJs(response.responseText);
        }
    });

}


// 工具方法  //
function loadJs(jsStr) {
    var oHead = document.getElementsByTagName('HEAD')[0],
        oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.text = jsStr;
    oHead.appendChild(oScript);
}
