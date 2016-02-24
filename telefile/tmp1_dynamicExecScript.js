// ==UserScript==
// @name         test1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       qw4wer
// @include      http://172.16.6.53:8082/login_pc_new.jsp
// @grant       unsafeWindow
// @grant       GM_setClipboard
// @run-at      document-idle
// ==/UserScript==
/* jshint -W097 */
'use strict';
var document = unsafeWindow.document;
var $ = document.$;
(function () {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.text = login.toString();
    var heads = document.getElementsByTagName("head");
    if (heads.length)
        heads[0].appendChild(script);
    else
        document.documentElement.appendChild(script);

    //for (var i in unsafeWindow) {
    //    console.log(i + "=" + unsafeWindow[i]);
    //}
})();


function login() {
    alert("S");
    var userAgent = navigator.userAgent.toLowerCase();
    if (!(userAgent.indexOf("chrome") > 0
        || userAgent.indexOf("firefox") > 0 || userAgent
            .indexOf("safari") > 0)) {

        swal("请使用谷歌浏览器");
        return false;
    }
    run_waitMe('ios');
    var count = 0;

    var userName = $("#userName").val();

    if (userName == '') {
        $('.login_box > form').waitMe('hide');
        swal("请输入用户名");
        return false;
    }

    var userPwd = $("#userPwd").val();

    if (userPwd == '') {
        $('.login_box > form').waitMe('hide');
        swal("请输入密码");
        return false;
    }

    var code = $("#code").val();
    if ($(".code").css('display') == 'block') {
        if (code == '') {
            $('.login_box > form').waitMe('hide');
            swal("验证码不能为空");
            return false;
        }
    }
    var d = new Date().getTime();
    $.ajax({
        url: './user/loginUserAccountByAjax.action?userAccount.userName='
        + escape(userName)
        + '&userAccount.userPwd='
        + escape(userPwd)
        + '&code=' + code
        + '&t=' + d
        ,
        dataType: 'json',
        //async:false,
        beforeSend: function (XHR) {

        },
        success: function (data) {

            $('.login_box > form').waitMe('hide');
            if (data.type) {
                window.location.href = data.action + "?t=" + d;
                return true;
            } else {
                reloadImage();
                if ("账号密码错误" == data.msg) {
                    if (data.count >= 2) {
                        $(".code").css({
                            display: 'block'
                        });
                        swal({
                            title: "是否忘记密码",
                            text: "",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "忘记密码",
                            cancelButtonText: "不，再试试",
                            closeOnConfirm: true,
                            closeOnCancel: true
                        }, function (isConfirm) {
                            if (isConfirm) {
                                $("#retrieve").click();
                            } else {

                            }
                        });

                    } else
                        swal("错误", data.msg, "error");
                } else {
                    swal("错误", data.msg, "error");
                }
                return false;
            }
        },
        error: function () {
            $('.login_box > form').waitMe('hide');
            swal("网络连接异常，请重试", data.msg, "error");
            return false;
        }
    });
    return false;
}