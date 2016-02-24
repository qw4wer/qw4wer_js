(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a)return a(o, !0);
                if (i)return i(o, !0);
                throw new Error("Cannot find module '" + o + "'")
            }
            var f = n[o] = {exports: {}};
            t[o][0].call(f.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, f, f.exports, e, t, n, r)
        }
        return n[o].exports
    }

    var i = typeof require == "function" && require;;
    for (var o = 0; o < r.length; o++)s(r[o]);
    return s
})({
    1: [function (require, module, exports) {
        /*
         *  Live App Configuration By LancerComet at 11:23, 2015/11/25.
         *  # Carry Your World #
         *  ---
         *  程序信息设置.
         *
         */

        var explorerDetective = require("../functions/func-explorer-detective/explorer-detective");

        module.exports = {};

        module.exports.appInfo = {
            name: "Bilibili Live",
            version: "V3.3.9.1-Worker",
            codeName: "450",
            author: ["Felix", "LancerComet"]
        };

        module.exports.appConfig = {
            xhrTimeout: 1000 * 30
        };

        module.exports.consoleText = {
            info: module.exports.appInfo.name + " Info: ",
            success: module.exports.appInfo.name + " Success: ",
            caution: module.exports.appInfo.name + " Caution: ",
            error: module.exports.appInfo.name + " Error: "
        };


// Avalon Config. | Avalon 配置函数.
        module.exports.avalonConfig = function () {
            avalon.config({
                interpolate: ["[[", "]]"],
                debug: false,
                loader: false
            });
        };


// Global Config. | 全局配置.
        module.exports.globalConfig = function (window) {

            // 设置 console 函数.
            // console.log 将在构建阶段被清除, 所以使用 consoleText 进行输出.
            window.consoleText = window.console;

            // 修复 IE8 下的 trim 原型方法.
            if (explorerDetective() === "IE 8") {
                String.prototype.trim = function () {
                    return this.replace(/(^\s*)|(\s*$)/g, '');
                }
            }

            // ES3 环境增加 Bind 原型方法 By LancerComet at 16:54, 2016.01.29.
            if (!Function.prototype.bind) {
                Function.prototype.bind = function () {
                    var self = this;  // 函数自我引用.
                    var context = [].shift.call(arguments);  // bind 传入上下文对象.
                                                             // arguments 不是一个数组对象（object Arguments）, 不能直接调用数组的原型方法, 只能使用 call 或 apply 或其他方式外部引入.
                    var args = [].slice.call(arguments);  // bind 传入参数数组.
                    return function () {
                        self.apply(context, [].concat.call(args, [].slice.call(arguments)));  // 在 context 上执行 self 方法并传入 args + arguments 参数.
                                                                                              // args 为 bind 时传入的参数, arguments 为调用时传入的参数.
                    }
                };
            }
        };
    }, {"../functions/func-explorer-detective/explorer-detective": 10}],
    2: [function (require, module, exports) {
        /*
         *  Avalon Filters By LancerComet at 14:09, 2015/12/29.
         *  # Carry Your World #
         *  ---
         *  Avalon 自定义过滤器.
         */

        var friendlyFormat = require('../functions/func-friendly-format/friendly-format');

        module.exports = function () {

            // Friendly Format By LancerComet at 16:29, 2015.12.28.
            // # Carry Your World #
            (function friendlyFormatFilter() {
                avalon.filters.tenThousand = function (source, args1, args2) {
                    return friendlyFormat.tenThousand(source);
                };

                avalon.filters.hunderdThousand = function (source, args1, args2) {
                    return friendlyFormat.hunderdThousand(source);
                };

                avalon.filters.length = function (source) {
                    return source.length;
                }
            })();

        };

    }, {"../functions/func-friendly-format/friendly-format": 11}],
    3: [function (require, module, exports) {
        /*
         *  Created by LancerComet at 16:04, 2015/12/07.
         *  Original By Onion.
         */
        var liveQuickLogin = require("../../functions/func-live-quick-login/live-quick-login");
        var liveToast = require('../live-widget/live-toast/live-toast');

        module.exports = function feedbackModule() {
            var $submitBtn = $(".feedback-submit-btn");
            // Action: 文档加载完毕后设置提交按钮点击监听事件
            $(function () {
                //关闭问题反馈页面
                $('.feedback-close-btn').on('click', function () {
                    $('.feedback').fadeOut();
                });
                //点击补充问题文本域当前文本隐藏
                $("#remark").on("click", function () {
                    $(this).val("").css('color', '#fefefe');
                });
                //反馈问题提交
                $submitBtn.on("click", feedbackSubmit);
            });

            /* Definition go below. */

            function feedbackSubmit() {
                var configuration = {
                    type: $('#type input:radio:checked').val(),
                    num: $('#num input:radio:checked').val(),
                    city: $('#city').val(),
                    operator: $('#operator').val(),
                    ip: $('#ip').val(),
                    remark: $('#remark').val()
                };
                if (configuration.type == "" || configuration.num == "" || configuration.city == "" || configuration.operator == "") {
                    liveToast($submitBtn[0], "请完成必填项~~");
                } else {
                    $.ajax({
                        url: "/feedback/submit",
                        type: "POST",
                        data: configuration,
                        success: successCallback,
                        dataType: "JSON",
                        error: errorCallback
                    });
                }

                function successCallback(result) {
                    if (result.code != 0) {
                        liveToast($submitBtn[0], result.msg);
                        return;
                    }
                    liveToast($submitBtn[0], "感谢您的反馈，我们会努力哒(∩_∩)", "success");
                    $(function () {
                        $("#city,#operator,#ip,#remark").attr("value", "");
                        $(".feedback").fadeOut();
                    });
                }

                function errorCallback(result) {
                    liveToast($submitBtn[0], "提交没有成功，要不然再重试一下？真的很对不起 > <");
                }

            }

            // window Function Attachment.
            window.feedBackShow = function () {
                liveQuickLogin();
                $(".feedback").fadeIn();
            };
        };
    }, {"../../functions/func-live-quick-login/live-quick-login": 14, "../live-widget/live-toast/live-toast": 8}],
    4: [function (require, module, exports) {
        /*
         *  Bilibili Live Top Navigator Intro File By LancerComet at 14:40, 2015.11.23.
         *  # Carry Your World #
         *  ---
         *
         *  描述：
         *  ---
         *  本文件为直播页面顶栏的 JS 入口文件.
         *  本文件不编写任何逻辑, 仅做引用.
         *
         *  使用：
         *  ---
         *  require("module-a")();
         *  require("module-b")();
         *  ...
         *
         */

        module.exports = topNavSetup;

        function topNavSetup() {
            require("./javascripts/top-user-panel")();  // 顶栏 JavaScript 逻辑文件.
            require("./javascripts/top-navigator")();  // 左侧导航 JavaScript 逻辑文件.
        }
    }, {"./javascripts/top-navigator": 5, "./javascripts/top-user-panel": 6}],
    5: [function (require, module, exports) {
        /*
         *  Bilibili Live Top Navigator Script By LancerComet at 22:03, 2015.11.30.
         *  # Carry Your World #
         *  ---
         *
         *  描述：
         *  ---
         *  顶栏左侧区域导航逻辑文件.
         *
         *  Log:
         *  ---
         *  V0.1.0 - 22:03, 2015.11.30.
         *   - 初版.
         *
         */
        var explorerDetective = require("../../../functions/func-explorer-detective/explorer-detective");

        module.exports = function () {

            var $navLink = $(".nav-link-item.area-navigator");
            var $navPanel = $navLink.find(".live-top-nav-panel");

            var mouseOutTimeout = null;
            var allowCtrl = true;

            $navLink.mouseenter(mouseEnter).mouseleave(mouseLeave);

            function mouseEnter() {
                allowCtrl = false;
                clearTimeout(mouseOutTimeout);
                $navPanel.show().addClass("panel-in");
                var explorer = explorerDetective();

                // 无 CSS3 的浏览器禁止动画.
                if (explorer === "IE 7" || explorer === "IE 8" || explorer === "IE 9") {
                    $(".live-top-nav-panel .nav-item").addClass("move-in");
                    allowCtrl = true;
                } else {
                    (function itemAnimation() {
                        var $navItems = $(".live-top-nav-panel .nav-item");
                        var timeout = 100;
                        $navItems.each(function (index) {
                            var $this = $(this);
                            setTimeout(function () {
                                $this.removeClass("move-in").addClass("move-in");
                                allowCtrl = index === $navItems.length;
                                //index === $navItems.length ? allowCtrl = true : void(0);
                            }, timeout);
                            timeout += 60;
                        });
                    })();
                }
            }

            function mouseLeave() {
                allowCtrl = false;
                mouseOutTimeout = setTimeout(function () {
                    $navPanel.stop().fadeOut(300, function () {
                        $(".live-top-nav-panel .nav-item").removeClass("move-in");
                        $navPanel.removeClass("panel-in");
                        allowCtrl = true;
                    });
                }, 250);
            }


            //var liveTopNavLeftCtrl = avalon.define({
            //    $id: "liveTopNavLeftCtrl",
            //    allowCtrl: true,  // 用户鼠标操作控制标识.
            //    timeoutTiming: 200,
            //    navPanelCtrl: {
            //        enter: navPanelMouseEnter,  // 鼠标进入事件.
            //        leave: navPanelMouseLeave  // 鼠标移出事件.
            //    },
            //    navPanelShow: false,  // 分区导航面板显示控制标识, 默认隐藏分区导航面板.
            //    navPanelOut: false,  // 分区导航面板动画控制标识.
            //    navPanelOutTimeout: null,  // 面板隐藏计时器.
            //    navPanelFinishTimeout: null  // 面板完成隐藏回调计时器.
            //});
            //
            //function navPanelMouseEnter () {
            //    if (!liveTopNavLeftCtrl.allowCtrl) {
            //        return;
            //    }
            //    clearTimeout(liveTopNavLeftCtrl.navPanelOutTimeout);
            //    clearTimeout(liveTopNavLeftCtrl.navPanelFinishTimeout);
            //    liveTopNavLeftCtrl.allowCtrl = false;
            //    liveTopNavLeftCtrl.navPanelOut = false;
            //    liveTopNavLeftCtrl.navPanelShow = true;
            //    (function itemAnimation () {
            //        var $navItems = $(".live-top-nav-panel .nav-item");
            //        var timeout = 0;
            //        $navItems.each(function () {
            //            var $this = $(this);
            //            $this.removeClass("move-in");
            //            setTimeout(function () {
            //                $this.addClass("move-in");
            //            }, timeout);
            //            timeout += 100;
            //        });
            //    })();
            //    liveTopNavLeftCtrl.navPanelOutTimeout = setTimeout(function () {
            //        liveTopNavLeftCtrl.allowCtrl = true;
            //    }, liveTopNavLeftCtrl.timeoutTiming);
            //}
            //
            //function navPanelMouseLeave () {
            //    clearTimeout(liveTopNavLeftCtrl.navPanelOutTimeout);
            //    clearTimeout(liveTopNavLeftCtrl.navPanelFinishTimeout);
            //    liveTopNavLeftCtrl.navPanelOutTimeout = setTimeout(function () {
            //        liveTopNavLeftCtrl.allowCtrl = false;
            //        liveTopNavLeftCtrl.navPanelOut = true;  // 执行动画.
            //        liveTopNavLeftCtrl.navPanelFinishTimeout = setTimeout(function () {
            //            liveTopNavLeftCtrl.navPanelOut = false;
            //            liveTopNavLeftCtrl.navPanelShow = false;
            //            liveTopNavLeftCtrl.allowCtrl = true;
            //        }, liveTopNavLeftCtrl.timeoutTiming);
            //    }, 200);
            //}


        };
    }, {"../../../functions/func-explorer-detective/explorer-detective": 10}],
    6: [function (require, module, exports) {
        /*
         *  Bilibili Live Top User Panel Script By LancerComet at 14:42, 2015.11.23.
         *  # Carry Your World #
         *  ---
         *
         *  描述：
         *  ---
         *  本文件为直播页面顶栏右侧用户面板的 JS 逻辑文件.
         *
         *  Log:
         *  ---
         *  V0.1.2 - 22:02, 2015.11.30.
         *   + 使用 Avalon 重写.
         *   + 完善动画逻辑.
         *   + 增加数据请求事件.
         *
         *  V0.1.1 - 10:20, 2015.11.26.
         *   - 移植至新版首页的 browserify 模块中.
         *
         *  V0.1.0 - 17:52, 2015.09.18.
         *   - 初版.
         *
         */

        var appConfig = require("../../../app-config/app-config");
        var quickLogin = require("../../../functions/func-live-quick-login/live-quick-login");
        require("../../../functions/func-jquery-cookie/jquery-cookie")();  // jQuery Cookie 插件, 直接执行.

        module.exports = liveTopNav;


        /*
         *  Definition: 用户信息面板事件.
         *  用户在鼠标移动到头像上之后进行数据请求, 并只请求一次.
         *  ---
         *
         *  Log:
         *  ---
         *  V0.3.1 - 10:18, 2015.12.01.
         *   + 使用 jQuery 替代 Avalon 的 ms-mouseenter 和 ms-mouseleave.
         *
         *  V0.3.0 - 21:51, 2015.11.29.
         *   - 使用 Avalon 重写.
         *
         *  V0.1.1 - 10:20, 2015.11.26.
         *   - 移植至新版首页的 browserify 模块中.
         *
         *  V0.1.0 - 17:52, 2015.09.18.
         *   - 初版.
         *
         */

        function liveTopNav() {
            "use strict";

            // Definition: 本模块设置.
            var moduleSettings = {
                animationTiming: 499,  // 用户面板 CSS3 动画时间 - 1 ms.
                xhrTimeout: 1000 * 30,  // XHR 请求超时设定.
                msgCheckInterval: 1000 * 60 * 5  // 消息读取间隔, 因为没了私信所以及时性就大大降低了, 暂时设置为 5 分钟.
            };

            // Definition: 顶栏右侧用户面板设置.
            var userPanelSettings = {
                allowCtrl: true,
                visibility: false,  // 面板默认隐藏.
                dataRequestURL: "/User/getUserInfo",  // 用户信息查询地址.
                mouseEnter: panelMouseEnter,
                mouseLeave: panelMouseLeave,
                mouseLeaveTimeout: null,  // 面板移出计时器.
                panelOut: false,  // 面板移出动画 ms-class 控制标识.
                unreadMsg: false,  // 未读消息控制标识.
                unreadMsgCount: 0,  // 未读消息计数.
                showProgress: true,  // 进度条显示控制标识, 默认显示.
                msgClick: msgClick,  // 消息按钮点击事件, 在点击之后对 window 进行 onFocus 监视.
                vipIconClick: vipIconClick  // 老爷图标点击事件, 在点击之后对 window 进行 onFocus 监视.
            };

            // 方法定义部分.
            // 方法定义至此处以增强代码可读性.
            function panelMouseEnter() {
                if (!userPanelSettings.allowCtrl) {
                    return;
                }
                liveTopNavCtrl.$fire("topNavUserPanelDataRequest", {
                    callback: function () {
                        liveTopNavCtrl.$fire("topNavUserPanelIn", true);
                    }
                });
            }

            function panelMouseLeave() {
                liveTopNavCtrl.$fire("topNavUserPanelOut", true);
            }

            function msgClick() {
                $(window).on("focus", function () {
                    liveTopNavCtrl.$fire("topNavMessageRefresh");
                    $(window).off("focus");
                });
            }

            function vipIconClick() {
                $(window).on("focus", function () {
                    liveTopNavCtrl.$fire("topNavUserPanelDataRequest");
                    $(window).off("focus");
                });
            }

            // Definition: 顶栏控制器定义.
            var liveTopNavCtrl = avalon.define({
                $id: "liveTopNavCtrl",
                userPanel: userPanelSettings,  // 用户面板设置对象.
                panelData: {  // 用户面板数据对象.
                    username: "神秘用户 (=・ω・=)",
                    avatar: "",
                    isVip: 0,
                    vipIconLink: "/i",
                    userLevel: {
                        current: "UL.--",
                        next: "UL.--",
                        progress: "0%",
                        progressData: 0
                    },
                    ranking: "--",
                    restExperience: "--",
                    seeds: {
                        gold: "--",
                        silver: "--"
                    }
                },
                clearAvatar: function () {  // 头像 Cookie 清理方法, 在用户退出时清理 Cookie.
                    $.removeCookie("user_face", {path: "/", domain: ".bilibili.com"});
                },
                topNavOpacity: {
                    enable: function () {
                        liveTopNavCtrl.$fire("topNavOpacity", true);
                    },
                    disable: function () {
                        liveTopNavCtrl.$fire("topNavOpacity", false);
                    },
                    status: true  // 禁用顶部透明度控制标识.
                },
                levelPanel: {
                    onhover: false,
                    allowCtrl: true,
                    mouseLeaveTimeout: null,
                    restoreTimeout: null,
                    mouseEnter: function () {
                        if (!liveTopNavCtrl.levelPanel.allowCtrl) {
                            return;
                        }
                        liveTopNavCtrl.levelPanel.allowCtrl = false;
                        clearTimeout(liveTopNavCtrl.levelPanel.mouseLeaveTimeout);
                        clearTimeout(liveTopNavCtrl.levelPanel.restoreTimeout);
                        liveTopNavCtrl.levelPanel.onhover = true;
                        liveTopNavCtrl.levelPanel.restoreTimeout = setTimeout(function () {
                            liveTopNavCtrl.levelPanel.allowCtrl = true;
                        }, 500);
                    },
                    mouseLeave: function () {
                        if (!liveTopNavCtrl.levelPanel.allowCtrl) {
                            return;
                        }
                        clearTimeout(liveTopNavCtrl.levelPanel.mouseLeaveTimeout);
                        clearTimeout(liveTopNavCtrl.levelPanel.restoreTimeout);
                        liveTopNavCtrl.levelPanel.mouseLeaveTimeout = setTimeout(function () {
                            liveTopNavCtrl.levelPanel.allowCtrl = false;
                            liveTopNavCtrl.levelPanel.onhover = false;
                            liveTopNavCtrl.levelPanel.restoreTimeout = setTimeout(function () {
                                liveTopNavCtrl.levelPanel.allowCtrl = true;
                            }, 500);
                        }, 300);
                    }
                },
                liveLogin: function () {
                    quickLogin();
                },
                iframeObj: {
                    $blackLayer: $('<div class="black-layer" style="z-index: 99"></div>'),
                    $newlive: $('<div class="new-live-layer" style="z-index: 100"><iframe name="contentFrame" id="g_iframe" width="100%" height="100%" scrolling="no" frameborder="0" allowtransparency="true" style="background-color:transparent;position: absolute;top:0;border:solid 1px #aaaaaa;border-radius: 10px" src="/room/apply"></iframe></div>'),
                    iframeExist: false
                },
                enterMyRoom: function () {
                    quickLogin();
                    $.ajax({
                        url: "/liveact/myroom",
                        type: "POST",
                        dataType: "JSON",
                        success: function (result) {
                            if (result.code == 0) {
                                if (result.data) {
                                    location.href = "/" + result.data;
                                    return;
                                }
                                if (!liveTopNavCtrl.iframeObj.iframeExist) {
                                    $("body").append(liveTopNavCtrl.iframeObj.$blackLayer);
                                    $("body").append(liveTopNavCtrl.iframeObj.$newlive);
                                    liveTopNavCtrl.iframeObj.iframeExist = true;
                                } else {
                                    return false;
                                }
                            }
                        },
                        error: function (result) {
                            console.log(appConfig.consoleText.error + "与服务器通信产生错误.")
                        }
                    })
                },
                loadFinished: false,
                logined: false  // 用户登陆状态控制标识.
            });

            // 判断用户是否登陆, 登陆显示面板, 未登陆显示未登录节点.
            $.cookie("DedeUserID") ? liveTopNavCtrl.logined = true : void(0);

            avalon.ready(function () {
                liveTopNavCtrl.loadFinished = true;
            });

            // Definition: 未开通直播间 iframe.
            // 需要挂载全局变量 offLayer.
            // iframe 内置的关闭方法.
            window.offLayer = function () {
                liveTopNavCtrl.iframeObj.$blackLayer.remove();
                liveTopNavCtrl.iframeObj.$newlive.remove();
                liveTopNavCtrl.iframeObj.iframeExist = false;
            };
            $(document).on('click', '.new-live-layer .off-button', window.offLayer);

            // Definition: 用户面板显示服务.
            // 请手动传入 true 表示验证, 否则不予执行.
            liveTopNavCtrl.$watch("topNavUserPanelIn", function (value) {
                if (arguments.length < 1 || value !== true) {
                    avalon.error(appConfig.consoleText.error + '在触发 "topNavUserPanel" 时请手动传入 true 表示验证, 否则不予执行.');
                }
                userPanelSettings.allowCtrl = false;
                liveTopNavCtrl.levelPanel.allowCtrl = true;
                liveTopNavCtrl.levelPanel.onhover = false;
                clearTimeout(userPanelSettings.mouseLeaveTimeout);

                // Action: 子节点进入动画.
                (function itemIntroAnimation() {
                    var timeout = 100;
                    var $sectionBlocks = $("#top-nav-user-panel").find(".section-block");
                    $sectionBlocks.each(function (index) {
                        var $this = $(this);
                        setTimeout(function () {
                            $this.addClass("active");
                        }, timeout);
                        timeout += 80;
                    });
                })();

                liveTopNavCtrl.userPanel.visibility = true;  // 显示面板.
                liveTopNavCtrl.topNavOpacity.disable();  // 禁用透明度.
            });

            // Definition: 用户面板隐藏服务.
            // 请手动传入 true 表示验证, 否则不予执行.
            liveTopNavCtrl.$watch("topNavUserPanelOut", function (value) {
                if (arguments.length < 1 || value !== true) {
                    avalon.error(appConfig.consoleText.error + '在触发 "topNavUserPanelOut" 时请手动传入 true 表示验证, 否则不予执行.');
                }
                if (userPanelSettings.allowCtrl) {
                    return;
                }
                liveTopNavCtrl.levelPanel.allowCtrl = true;
                liveTopNavCtrl.levelPanel.onhover = false;
                var $topNavUserPanel = $("#top-nav-user-panel");
                $topNavUserPanel.addClass("panel-out");  // 移除动画使用 jQuery 代替 Avalon 的坑爹 ms-class, ms-class 在配合 ms-visible 与 ms-mouseleave 时效果不佳.
                $topNavUserPanel.find(".section-block").removeClass("active");
                setTimeout(function () {
                    liveTopNavCtrl.userPanel.visibility = false;  // 隐藏面板.
                    $("#top-nav-user-panel").removeClass("panel-out");
                    userPanelSettings.allowCtrl = true;
                    liveTopNavCtrl.topNavOpacity.enable();  // 启用透明度.
                }, 300);
            });

            // Definition: 数据请求服务.
            // 面板默认仅请求一次数据, 当用户请求过一次之后不再进行请求.
            // 当传入的值 "configuration.mode" 为 "force" 时, 无视以上规则, 暴力刷新数据.
            // 如果传入 "configuration.callback", 则数据完成时执行该回调.
            var requestAvailable = true;  // 据请求控制标识, 当 false 时, 用户鼠标移至头像处也不再请求数据（默认）, 直到下次刷新页面.
            liveTopNavCtrl.$watch("topNavUserPanelDataRequest", function (configuration) {
                /*
                 *  @ configuration: {
                 *    mode: null || "force",
                 *    callback: Function
                 *  }
                 */

                // Definition: Cookie 信息.
                var uidInCookie = $.cookie("DedeUserID");  // DedeUserID.

                // 未登陆 ? GTFO!
                if (!uidInCookie) {
                    return;
                }

                // Action: 设置强制刷新标识.
                configuration ? configuration.mode === "force" ? requestAvailable = true : void(0) : void(0);

                // Action: 默认设置下第一次之后不再请求.
                if (!requestAvailable) {
                    configuration ? configuration.callback ? configuration.callback() : void(0) : void(0);
                    return;
                }

                // 获取数据.
                (function dataRequest() {
                    $.ajax({
                        url: userPanelSettings.dataRequestURL,
                        type: "GET",
                        dataType: "JSON",
                        timeout: moduleSettings.xhrTimeout,  // 30s 超时时间.
                        data: {
                            timestamp: Date.now()
                        },
                        success: function (result) {
                            /*
                             *  @ result: {
                             *      code: String,
                             *      msg: String,
                             *      data: {
                             *          uname: String,
                             *          face: URL[String],
                             *          gold: Number,
                             *          silver: Number,
                             *          user_intimacy: Number,
                             *          user_level: Number,
                             *          user_level_rank: Number,
                             *          user_next_intimacy: Number,
                             *          user_next_level: Number,
                             *          vip: [1: true, 0: false]
                             *      }
                             *  }
                             *
                             */
                            if (result.code != "REPONSE_OK") {
                                console.log(appConfig.consoleText.error + "顶栏用户信息面板数据获取失败:");
                                console.log(appConfig.consoleText.error + result.msg);
                                console.log(appConfig.consoleText.error + "因此顶栏数据获取失败.");
                            } else {
                                dataBinding(result.data);  // 数据填充.
                                liveTopNavCtrl.userPanel.showProgress = false;  // 移除进度条.
                                configuration.callback ? configuration.callback() : void(0);  // 执行回调.
                                requestAvailable = false;  // 请求完成, 默认不再请求数据.
                                return true;  // 执行结束.
                            }
                        },
                        error: function (result) {
                            console.log(appConfig.consoleText.error + "顶栏用户信息面板数据获取失败: 无有效通信建立.");
                            liveTopNavCtrl.userPanel.showProgress = false;  // 移除进度条.
                            configuration.callback ? configuration.callback() : void(0);  // 执行回调.
                        }
                    });
                })();

                // Definition: 用户面板数据绑定函数.
                function dataBinding(userData) {
                    if (!userData || Object.prototype.toString.call(userData) !== "[object Object]") {
                        avalon.error(appConfig.consoleText.error + '在调用顶栏的 "dataBinding" 时必须提供有效的数据对象.');
                    }
                    userData.user_intimacy ? userData.user_intimacy = parseInt(userData.user_intimacy, 10) : console.log(appConfig.consoleText.caution + userPanelSettings.dataRequestURL + ' 的 "user_intimacy" 属性丢失.');
                    userData.user_next_intimacy ? userData.user_next_intimacy = parseInt(userData.user_next_intimacy, 10) : console.log(appConfig.consoleText.caution + userPanelSettings.dataRequestURL + '"user_next_intimacy" 属性丢失.');

                    if (isNaN(userData.user_intimacy) || isNaN(userData.user_next_intimacy)) {
                        console.log(appConfig.consoleText.error + '顶部面板回传用户经验信息为非数字类型, 需要为数字类型.');
                    } else {
                        liveTopNavCtrl.panelData.restExperience = userData.user_next_intimacy - userData.user_intimacy; // 用户升级还需经验.
                        liveTopNavCtrl.panelData.userLevel.progressData = userData.user_intimacy / userData.user_next_intimacy * 100;  // 用户等级进度百分比真实数据.
                        liveTopNavCtrl.panelData.userLevel.progress = userData.user_intimacy / userData.user_next_intimacy * 100 + "%";  // 用户等级进度百分比字符串.
                    }

                    liveTopNavCtrl.panelData.username = userData.uname;  // 用户名.
                    liveTopNavCtrl.panelData.avatar = "url(" + userData.face + ")";  // 头像.
                    liveTopNavCtrl.panelData.seeds.gold = userData.gold;  // 银瓜子.
                    liveTopNavCtrl.panelData.seeds.silver = userData.silver;  // 金瓜子.
                    liveTopNavCtrl.panelData.userLevel.current = "UL." + userData.user_level;  // 当前用户等级.
                    liveTopNavCtrl.panelData.userLevel.next = "UL." + userData.user_next_level;  // 用户下一个等级.
                    liveTopNavCtrl.panelData.ranking = userData.user_level_rank;  // 用户排名.
                    liveTopNavCtrl.panelData.isVip = parseInt(userData.vip, 10);  // 用户是否为 VIP.
                    parseInt(userData.vip, 10) > 0 ? liveTopNavCtrl.panelData.vipIconLink = "/i" : liveTopNavCtrl.panelData.vipIconLink = "/i#to-vip";
                }

            });

            // Definition: 头像图片请求服务.
            // Cookie 会保存头像数据, 若有该 Cookie, 则使用本地地址, 不再进行请求.
            (function avatarFuncRegister() {
                $(avatarHandler);  // 在 DomReady 后执行.
                liveTopNavCtrl.$watch("topNavUserPanelAvatar", function (value) {
                    avatarHandler();
                });  // 同时注册到 Avalon 中.

                /* Definition Goes Below. */

                function avatarHandler() {

                    // Definition: Cookie 信息.
                    var uidInCookie = $.cookie("DedeUserID");  // DedeUserID.

                    // 未登陆 ? GTFO!
                    if (!uidInCookie) {
                        return;
                    }

                    var avatarInCookie = $.cookie("user_face");  // 在操作前获取最新的 Cookie 中头像地址.

                    if (!avatarInCookie) {
                        $.ajax({
                            url: userPanelSettings.dataRequestURL,
                            timeout: moduleSettings.xhrTimeout,  // 30s 超时时间.
                            data: {
                                timestamp: Date.now()
                            },
                            dataType: "JSON",
                            success: function (result) {
                                if (result.code != "REPONSE_OK") {
                                    console.log(appConfig.consoleText.error + "顶栏用户头像数据获取失败:");
                                    console.log(appConfig.consoleText.error + result.msg);
                                    console.log(appConfig.consoleText.error + "因此用户头像地址获取失败.");
                                    return;
                                }
                                liveTopNavCtrl.panelData.avatar = "url(" + result.data.face + ")";
                            },
                            error: function (result) {
                                console.log(appConfig.consoleText.error + "顶栏用户信息面板数据获取失败: 无有效通信建立.");
                            }
                        });
                    } else {
                        liveTopNavCtrl.panelData.avatar = "url(" + avatarInCookie + ")";  // 使用本地地址.
                    }
                }

            })();

            // Definition: 消息模块服务.
            // 将发送 JSON with Padding 信息到 message.bilibili.com 请求数据, 每五分钟请求一次.
            (function messageFuncRegister() {

                // Definition: 消息模块方法定义.
                var messageHandler = {

                    // Definition: 轮训计时器对象.
                    checkInterval: null,

                    // Definition: 请求方法.
                    xhr: function (mode) {
                        mode = mode || "normal";

                        // GTFO when not logged in.
                        if (!$.cookie("DedeUserID")) {
                            return;
                        }

                        // 向 message.bilibili.com 请求消息.
                        $.ajax({
                            url: "http://message.bilibili.com/api/notify/query.notify.count.do",
                            type: "GET",
                            data: {
                                type: "jsonp",
                                captcha: window.captcha_key,
                                callback: "callback",
                                ts: Date.now()
                            },
                            dataType: "JSONP",
                            jsonp: "callback",
                            timeout: moduleSettings.xhrTimeout,  // 超时设定.
                            success: function (result) {
                                // Error Handler.
                                if (result.code != 0) {
                                    console.log(appConfig.consoleText.error + "消息信息获取失败，等待 30 秒后重试... (/= _ =)/~┴┴");
                                    return;
                                }

                                var replyMe = parseInt(result.data.reply_me, 10),
                                    chatMe = parseInt(result.data.chat_me, 10),
                                    praiseMe = parseInt(result.data.praise_me, 10),
                                    notifyMe = parseInt(result.data.notify_me, 10),
                                    atMe = parseInt(result.data.at_me, 10);

                                // Action: 判断是否有新消息.
                                if (replyMe > 0 || praiseMe > 0 || notifyMe > 0 || atMe > 0 || chatMe > 0) {
                                    var msgCount = replyMe + praiseMe + notifyMe + atMe + chatMe;
                                    messageHandler.weHaveUnreadMsg(msgCount);
                                } else {
                                    messageHandler.clearUnread();
                                }

                            },
                            error: function (result) {
                                console.log(appConfig.consoleText.error + "消息信息获取失败，等待 30 秒后重试... (/= _ =)/~┴┴")
                            }
                        });

                    },

                    // Definition: 轮训初始化方法.
                    check: function () {
                        messageHandler.checkInterval = setInterval(messageHandler.xhr, moduleSettings.msgCheckInterval)
                    },

                    // Definition: 新消息来啦！
                    weHaveUnreadMsg: function (msgCount) {
                        msgCount = parseInt(msgCount, 10);
                        msgCount > 99 ? msgCount = "99+" : void(0);
                        liveTopNavCtrl.userPanel.unreadMsg = true;
                        liveTopNavCtrl.userPanel.unreadMsgCount = msgCount;
                    },

                    // Definition: 我已经读了所有未读消息！
                    clearUnread: function () {
                        liveTopNavCtrl.userPanel.unreadMsg = false;
                        liveTopNavCtrl.userPanel.unreadMsgCount = 0;
                    }
                };

                // Definition: 消息系统初始化方法.
                function messageInit() {
                    messageHandler.xhr();
                    messageHandler.check();
                    //liveTopNavCtrl.userPanel.msgXHR = messageHandler.xhr;
                }

                $(window).on("load", messageInit);  // Window.onload 之后执行.

                // 同时注入到 Avalon 中. 内部方法, 不会暴露.
                liveTopNavCtrl.$watch("topNavMessageRefresh", function (mode) {
                    if (mode === "dev") {
                        messageHandler.xhr("dev");
                        console.log("哟~~小伙子手动触发了消息查询内部方法啊，有没有性♂趣来 B 站当前端啊？");
                        console.log("扔个简历到 zhaopin@bilibili.com 吧！");
                    } else {
                        messageHandler.xhr();
                    }
                });

            })();


            // Definition: 顶部条透明度切换服务.
            // true: 启用透明度, false: 禁用透明度.
            liveTopNavCtrl.$watch("topNavOpacity", function (value) {
                if (value !== true && value !== false) {
                    avalon.error(appConfig.consoleText.error + '在 $fire 服务 "topNavOpacity" 时必须传入 true（启用透明度） 或 false（禁用透明度）.')
                }
                value ? liveTopNavCtrl.topNavOpacity.status = true : liveTopNavCtrl.topNavOpacity.status = false;
            });

            // Definition: 瓜子数量更新事件.
            liveTopNavCtrl.$watch("fillCurrency", function (value) {
                if (value.gold !== null && value.gold !== undefined) {
                    liveTopNavCtrl.panelData.seeds.gold = value.gold;
                }
                if (value.silver !== null && value.silver !== undefined) {
                    liveTopNavCtrl.panelData.seeds.silver = value.silver;
                }
            });


        }
    }, {
        "../../../app-config/app-config": 1,
        "../../../functions/func-jquery-cookie/jquery-cookie": 13,
        "../../../functions/func-live-quick-login/live-quick-login": 14
    }],
    7: [function (require, module, exports) {
        /*
         *  Live Popup By LancerComet at 18:45, 2015/12/15.
         *  # Carry Your World #
         *  ---
         *  直播站通用弹窗组件.
         *  弹窗组件拥有两种模式, 一种是单按钮, 一种是双按钮.
         *
         *  使用方法:
         *  ---
         *  var livePopup = require("live-popup");
         *
         *  var newLivePopup = livePopup(param) || new livePopup(param);  // 创建弹窗, 并返回这个弹窗的原生节点对象.
         *                                                                // Param 的参数结构见下方.
         *  newLivePopup.open();  // 开启弹窗.
         *  newLivePopup.close();  // 关闭弹窗.
         *  newLivePopup.confirm();  // 点击弹窗确认按钮.
         *  newLivePopup.remove();  // 销毁弹窗.
         *
         *  示例:
         *  ---
         *  var newPopup = LivePopup({
         *      title: "购买成功",
         *      content: "按确定或回车关闭窗口~",
         *      type: "alert",
         *      initFunc: function () {
         *          console.log("面板创建成功.");
         *      },
         *      onConfirm: function () {
         *          var self = this;
         *          $.ajax({
         *              url: "...",
         *              type: "...",
         *              data: "...",
         *              success: function () {
         *                  // ...
         *                  self.done();  // onConfirm 执行完毕.
         *              }
         *          })
         *      }
         *  });
         *
         *  var newPopup2 = new LivePopup({
         *      title: "出错了~",
         *      html: '<p>要不要重试一次?</p>',
         *      button: {
         *          confirm: "再试一次！",
         *          cancel: "不试惹~"
         *      },
         *      type: "action",
         *      initFunc: function () {
         *          // ...
         *      },
         *      onConfirm: function () {
         *          $.ajax(...);
         *      }
         *  });
         *
         *
         */

        var appConfig = require('../../../app-config/app-config');
        var randomEmoji = require("../../../functions/func-random-emoji/random-emoji");
//var explorerDetective = require("../../../functions/func-explorer-detective");

// Definition: 弹窗创建构造函数.
        var LivePopup = function (param) {
            /*
             *  @ param: {
             *      title: String,  // 面板标题.
             *      content: "String" || null,  // 面板内容.
             *      html: String || null,  // 面板自定义节点. 当此属性传入时, 弹窗为自定义结构, 则 content 属性无效.
             *      type: "action"（默认） || "alert" || "info",  // 弹窗类型, Action 为两个按钮, Alert 和 Info 仅有一个按钮, Alert 为红色警示样式.
             *      button: {
             *          confirm: String,  // 确认按钮文字. 当不传入的时候默认为 "确认".
             *          cancel: String  // 取消按钮文字. 当不传入的时候默认为 "取消".
             *      } || false,  // 当 button 为 false 时不创建 button.
             *      width: String || null,  // 窗口宽度.
             *      silent: true,  // 当设定为 true 时创建弹窗不显示.
             *      initFunc: Function || null  // 创建弹窗完成时执行的方法.
             *      onConfirm: Function || null  // 当点击确认时执行的方法, 可不传入.
             *                                   // 外部在定义此方法时, 执行完毕后可指定执行 newPopup.done(), 这是一个伪 Promise, 然后会关闭面板.
             *      onCancel: Function || null  // 点击取消时执行的回调.
             *                                  // 请注意不要在此函数中调用原型方法 close, 否则会造成死循环!
             *    }
             */

            // 强制返回一个 LivePopup 的 "实例".
            if (!(this instanceof LivePopup)) {
                return new LivePopup(param);
            }

            var self = this;

            if (!param) {
                throw new Error(appConfig.consoleText.error + '在使用 Live Popup 时必须指定参数.');
            }

            // Definition: 创建文档碎片.
            var fragment = document.createDocumentFragment();

            // Definition: 创建弹窗容器节点.
            var newPopup = document.createElement("div");
            newPopup.className = "live-popup-panel";  // Add Class.

            // Definition: 创建 Body Merge.
            var bodyMerge = document.createElement("div");
            bodyMerge.className = "body-merge";
            newPopup.appendChild(bodyMerge);

            // Definition: 创建 Panel Content Container.
            var panelContent = document.createElement("div");
            panelContent.className = "panel-content";
            newPopup.appendChild(panelContent);

            // Definition: 处理标题节点.
            // 需要一步 Param Handler.
            (function popupTitleHandler() {
                param.title = param.title.toString() ? param.title.toString() : randomEmoji.helpless();  // 设置弹窗默认标题.

                // 设置标题节点.
                var titleCtnr = document.createElement("div");
                titleCtnr.className = "popup-title-container";
                titleCtnr.innerHTML = '<h2 class="popup-title">' + param.title + '</h2>';

                panelContent.appendChild(titleCtnr);
            })();

            // Definition: 处理内容节点.
            (function popupContentHandler() {
                var contentCtnr = document.createElement("div");
                contentCtnr.className = "popup-content-container";

                // 如果是自定义节点.
                if (param.html) {
                    contentCtnr.innerHTML = param.html;
                } else {
                    param.content = param.content || "某个程序员没有给这个弹窗写内容~ " + randomEmoji.helpless();
                    contentCtnr.innerHTML = '<p>' + param.content + '</p>';
                }

                panelContent.appendChild(contentCtnr);
            })();

            // Definition: 按钮节点处理.
            (function popupButtonsHandler() {
                if (param.button !== false) {
                    // Type Handler.
                    param.type = (param.type || "action").toLowerCase();
                    if (param.type !== "alert" && param.type !== "action" && param.type !== "info") {
                        throw new Error(appConfig.consoleText.error + "Live Popup 的类型仅为 Action 与 Alert 与 Info.");
                    }

                    var btnsCtnr = document.createElement("div");
                    btnsCtnr.className = "popup-button-container";

                    param.button = param.button ? param.button : {confirm: "确认", cancel: "取消"};

                    // 创建确认按钮. 当点击确认按钮时, 会执行 param.onConfirm.
                    var confirmBtn = document.createElement("button");
                    confirmBtn.className = "popup-button confirm";
                    confirmBtn.innerHTML = param.button.confirm || "确认";
                    confirmBtn.setAttribute("aria-label", "点击确认");

                    // 挂载 onConfirm 方法: 如果传入合法的 onConfirm, 则挂载.
                    if (param.onConfirm && $.isFunction(param.onConfirm)) {
                        self.onConfirm = param.onConfirm;
                    } else {
                        // 否则 onConfirm 方法仅仅是关闭面板.
                        self.onConfirm = self.close;
                    }

                    // 挂载 onCancel 方法: 如果传入合法的 onCancel, 则挂载.
                    if (param.onCancel && $.isFunction(param.onCancel)) {
                        self.onCancel = param.onCancel;
                    }

                    $(confirmBtn).on("click", function () {
                        self.confirm();
                    });
                    btnsCtnr.appendChild(confirmBtn);
                    self.confirmBtn = confirmBtn;

                    // 如果是 Action 类型面板, 再加入一个 Cancel 按钮.
                    if (param.type === "action") {
                        var cancelBtn = document.createElement("button");
                        cancelBtn.innerHTML = param.button.cancel || "取消";
                        cancelBtn.className = "popup-button cancel close-btn";
                        cancelBtn.setAttribute("aria-label", "点击取消");
                        $(cancelBtn).on("click", function () {
                            self.close();
                        });
                        btnsCtnr.appendChild(cancelBtn);
                        self.cancelBtn = cancelBtn;
                    }

                    // 如果是 Alert 则添加 ".alert".
                    if (param.type === "alert") {
                        newPopup.className = "live-popup-panel alert";
                    }

                    panelContent.appendChild(btnsCtnr);

                }

                // Action: 创建右上角关闭按钮.
                var closeBtn = document.createElement("div");
                closeBtn.className = "close-btn right-top";
                closeBtn.setAttribute("role", "button");
                closeBtn.setAttribute("aria-label", "点击关闭面板.");
                closeBtn.setAttribute("title", "关闭面板 " + randomEmoji.helpless());
                $(closeBtn).on("click", function () {
                    self.close();
                });  // Let jQuery Handle the Event Binding.
                panelContent.appendChild(closeBtn);
            })();

            // Action: 窗口宽度处理.
            param.width && $(panelContent).css({"width": param.width});

            fragment.appendChild(newPopup);
            document.body.appendChild(fragment);

            //$(".body-container").addClass("blur");

            // 执行一次 Open 方法以绑定 KeyEvent.
            this.open();

            //
            param.silent && $(newPopup).hide();

            // 将面板导出为枚举属性 popup.
            this.popup = newPopup;

            // Action: 执行传入的 initFunc. initFunc 是面板初始化完成时执行的回调.
            (function execInitFunc() {
                if (param.initFunc && !$.isFunction(param.initFunc)) {
                    throw new Error(appConfig.consoleText.error + "在使用 Live Popup 时, 传入的 initFunc 必须为 Function.");
                }
                param.initFunc && param.initFunc();
            })();
        };

// Definition: 弹窗显示方法.
        LivePopup.prototype.open = function () {
            var self = this;

            // Action: 绑定按键事件.
            $(window).on("keyup", function keyEvent(event) {
                self.keyupEvent = keyEvent;
                event.keyCode === 27 && self.allowEnterKey && self.close();
                event.keyCode === 13 && self.allowEnterKey && self.confirm();
            });

            // Action: 显示面板.
            $(this.popup).show().removeClass("hide").attr("aria-hidden", false);
            setTimeout(function () {
                self.allowEnterKey = true;
            }, 300);
        };

// Definition: 弹窗关闭方法.
        LivePopup.prototype.close = function (callback) {
            var self = this;

            // Exec onCancel when exist.
            if ($.isFunction(this.onCancel)) {
                console.log("Popup onCancel exec.");
                setTimeout(self.onCancel, 0);
            }

            // 隐藏面板.
            popupHide(self, callback);

            // Action: 绑定按键事件.
            $(window).off("keyup", this.keyupEvent);
            this.allowEnterKey = false;
            $(".body-container").removeClass("blur");
        };

// Definition: 弹窗确认方法.
        LivePopup.prototype.confirm = function () {
            if (this.onConfirm && $.isFunction(this.onConfirm)) {
                this.onConfirm();
            }
        };

// Definition: 弹窗销毁方法.
// 弹窗对象需要手动在其位置调用 "弹窗变量 = null" 来手动释放内存.
        LivePopup.prototype.remove = function () {
            var popup = this.popup;
            popupHide(this, function () {
                $(popup).remove();
                popup = null;
            });
        };

// Definition: 弹窗 onConfirm 函数执行完毕的伪 Promise.
// 在外部定义 param.onConfirm 方法后, 当执行完毕后, 请手动调用 newPopup.done().
        LivePopup.prototype.done = function () {
            this.close();
        };

// Definition: Popup 关闭通用函数.
// 将在 close 与 remove 中调用.
        function popupHide(self, callback) {
            var popup = self.popup;
            $(popup).addClass("hide").attr("aria-hidden", true);
            setTimeout(function () {
                $(popup).hide();
                callback && callback();
            }, 380);
        }


        module.exports = LivePopup;
    }, {"../../../app-config/app-config": 1, "../../../functions/func-random-emoji/random-emoji": 16}],
    8: [function (require, module, exports) {
        /*
         *  Live Toast JavaScripts By LancerComet at 17:35, 2015.12.16.
         *  # Carry Your World #
         *  ---
         *  直播站 Toast 组件 JavaScript 文件.
         */

        var appConfig = require('../../../app-config/app-config');
        var typeAdjust = require("../../../functions/func-type-adjust/type-adjust");
        var randomEmoji = require("../../../functions/func-random-emoji/random-emoji");

        var LiveToast = function (element, content, type, fixed) {

            /*
             *  @ element: Object || jQuery Object, 定位节点原生对象或 jQuery 对象.
             *  @ content: String, 提示内容.
             *  @ type: String, success || caution || error || info.
             *  @ fixed: Boolean, 提示位置的独享是否为 fixed 定位.
             */

            // 如果默认情况下传入 fixed, 进行参数交换.
            if (typeof type === "boolean") {
                fixed = type;
                type = null;
            }

            // Action: 创建 Toast 节点.
            var fragment = document.createDocumentFragment();
            var newToast = document.createElement("div");

            // Action: 设置 Toast 类型.
            type = type || "info";
            if (type !== "success" && type !== "caution" && type !== "error" && type !== "info") {
                throw new Error(appConfig.consoleText.error + "在使用 Live Toast 时必须指定正确的类型: success || caution || error || info");
            }
            newToast.innerHTML = "<i class='toast-icon " + type + "'></i><span class='toast-text'>" + content + "</span>" || "<i class='toast-icon info'></i><span class='toast-text'>某个程序员没有写入内容~ </span>" + randomEmoji();
            newToast.className = "live-toast " + type;

            // Action: 判断传入的 element 的类型, 然后统一转为 jQuery 对象.
            var targetElement = null;
            switch (typeAdjust(element)) {
                case "HTML Element":
                    targetElement = element;
                    break;
                case "jQuery Object":
                    targetElement = element[0];
                    break;
                default:
                    throw new Error(appConfig.consoleText.error + "在使用 Live Toast 时请传入正确的原生 Dom 对象或节点的 jQuery 对象.");
            }

            // 设置 Toast 位置.
            var size = {
                width: $(targetElement).width(),
                height: $(targetElement).height()
            };

            var targetElementLeft = getLeft(targetElement);
            var targetElementTop = getTop(targetElement);

            // 如果 Toast 超过屏幕宽度.
            if (targetElementLeft > $(window).width() - 300) {
                $(newToast).css({"left": targetElementLeft - size.width});
            } else {
                $(newToast).css({"left": targetElementLeft + size.width});
            }

            // 如果是 fixed 定位.
            var scrollTop = 0;
            if (fixed) {
                scrollTop = document.body.scrollTop;
            }
            $(newToast).css({"top": targetElementTop + size.height + scrollTop});

            // Toast 销毁计时器.
            setTimeout(function () {
                $(newToast).addClass("out");
                setTimeout(function () {
                    $(newToast).remove();
                    // Manual GC.
                    fragment = newToast = targetElement = size = targetElementLeft = targetElementTop = scrollTop = null;
                }, 400);
            }, 2000);

            // Appending.
            // 如果没有 liveToast 容器, 进行添加.
            //if (!$("#live-toast-ctnr")[0]) {
            //    var liveToastCtnr = document.createElement("div");
            //    liveToastCtnr.id = "live-toast-ctnr";
            //    liveToastCtnr.className = "w-100 p-absolute p-zero";
            //    $(liveToastCtnr).css({"height": $("body").height()});
            //    document.body.appendChild(liveToastCtnr);
            //}

            fragment.appendChild(newToast);
            document.body.appendChild(fragment);

        };

// Definition: 获取元素在页面中的 X 轴绝对定位.
        function getLeft(element) {
            var offset = element.offsetLeft;
            element.offsetParent !== null ? offset += getLeft(element.offsetParent) : void(0);
            return offset;
        }

// Definition: 获取元素的在页面中的 Y 轴绝对定位.
        function getTop(element) {
            var offset = element.offsetTop;
            element.offsetParent !== null ? offset += getTop(element.offsetParent) : void(0);
            return offset;
        }

        module.exports = LiveToast;
    }, {
        "../../../app-config/app-config": 1,
        "../../../functions/func-random-emoji/random-emoji": 16,
        "../../../functions/func-type-adjust/type-adjust": 20
    }],
    9: [function (require, module, exports) {
        /*
         *  Live Room Avalon Controllers Lazy Init By LancerComet at 11:47, 2015/12/21.
         *  # Carry Your World #
         *  ---
         *  房间页控制器 Lazy-Init 模块.
         */

        var lazyInitTime = 1;
//var lazyInitArray = [];
        module.exports = function (node, vmodel, callback) {

            setTimeout(function () {
                if (node === null && vmodel === null) {
                    avalon.scan();
                } else {
                    avalon.scan(node, vmodel);
                }
                callback && callback();
            }, lazyInitTime);

            lazyInitTime += 100;

            //for (var i = 0, length = lazyInitArray.length; i < length; i++) {
            //    lazyInitArray[i]();
            //    lazyInitArray[i](i, 1);
            //}

        };

    }, {}],
    10: [function (require, module, exports) {
        /*
         *   Explorer Detective By LancerComet at 11:30, 2015/11/25.
         *   # Carry Your World #
         *   ---
         *
         *   信息:
         *   ---
         *   浏览器检测模块.
         *
         *   用法:
         *   ---
         *   var browserIs = require("func-explorer-detective")();  // browserIs 的值即为当前浏览器.
         *
         *   License：
         *   ---
         *   © 2015 LancerComet @ MIT License.
         *
         */

        module.exports = explorerDetective;

        function explorerDetective() {
            var userAgent = window.navigator.userAgent;
            var browser = {
                myBrowser: "unknown",
                database: [
                    {type: "IE Legacy", regExp: "MSIE [1-6].*"},  // IE 1-6
                    {type: "IE 7", regExp: "MSIE [7].*"},  // IE 7
                    {type: "IE 8", regExp: "MSIE [8].*"},  // IE 8, 不支持 CSS3 与 HTML5.
                    {type: "IE 9", regExp: "MSIE [9].*"},  // IE 9, 支持部分 CSS3 与 HTML5.
                    {type: "IE Modern", regExp: "Trident/[6-9].*"},  // gt IE 10, 支持 CSS3 与 HTML5.
                    //{ type: "IE No CSS3", regExp: "MSIE [1-9].*" },  // lt IE 10, 不支持 CSS3.
                    {type: "Firefox", regExp: "Firefox/[0-9].*"},
                    {type: "Safari", regExp: "AppleWebKit/[0-9].*.Safari/[0-9]"},
                    {type: "Chrome", regExp: "AppleWebKit/[0-9].*.Chrome/[0-9].*.Safari/[0-9]"},
                    {type: "Opera Presto", regExp: "Opera.[0-9].*.Presto/[0-9]"},
                    {type: "Opera Modern", regExp: "OPR/[0-9][0-9]"},
                    {type: "Edge", regExp: "Edge/[0-9].*"},
                    {type: "Maxthon 4", regExp: "Maxthon/[4]"}
                ]
            };

            (function matchExplorer() {
                for (var i = 0, length = browser.database.length; i < length; i++) {
                    var newRegExp = new RegExp(browser.database[i].regExp);
                    if (userAgent.match(newRegExp)) {
                        browser.myBrowser = browser.database[i].type;
                    }
                }
            })();

            return browser.myBrowser;
        }

    }, {}],
    11: [function (require, module, exports) {
        /*
         *  Friendly Format By LancerComet at 16:00, 2015.11.20.
         *  # Carry Your Wolrd #
         *  ---
         *
         *  Description:
         *  ---
         *  数字单位格式化函数.
         *  包含两个函数, 一个从 10000 开始格式化, 一个从 100000 开始格式化.
         *
         */

        module.exports = {
            tenThousand: tenThousandFriendlyFormat,
            hunderdThousand: oneHundredThousandFormat
        };

// Definition: 一万数据格式化.
        function tenThousandFriendlyFormat(num) {
            if (parseInt(num, 10) < 10000) {
                return num;
            }
            return friendlyFormat(num);
        }

// Definition: 十万数据格式化.
        function oneHundredThousandFormat(num) {
            if (parseInt(num, 10) < 100000) {
                return num;
            }
            return friendlyFormat(num);
        }

// Definition: 数据格式化方法.
        function friendlyFormat(num) {

            // 如果传入 0  或非法数据则直接返回.
            if (!num) {
                return num;
            }

            // 如果不是有效数字, 直接返回.
            if (isNaN(parseInt(num, 10))) {
                console.log("Bilibili Live Caution: 传入的数值非有效数字, 无法进行格式化.");
                return num;
            }

            // 格式化为字符串.
            num = num.toString();

            // 如果传入的是 "XX万" 的形式.
            if (num.indexOf("\u4e07") > -1) {
                var pureNum = parseFloat(num.substr(0, num.indexOf("\u4e07")));
                if (pureNum < 10) return num;
                var returnNum = pureNum.toFixed(1);
                return returnNum + "\u4e07";
            }

            if (!(0 <= num.indexOf("\u4e07") || 0 <= num.indexOf(",") )) {
                return (num = parseInt(num)) ? 10000 <= num && (num = (num / 10000).toFixed(1) + "\u4e07") : num = "--", num
            }

            /*
             *  "110000" => "10.1万"
             *  110000 => "10.1万"
             *  "10.1万" => "10.1万"
             *  "10万" => "10.0万"
             */
        }
    }, {}],
    12: [function (require, module, exports) {
        /*
         *  Get Absolute Position of Targeted Dom By LancerComet at 17:13, 2015/12/24.
         *  # Carry Your World #
         *  ---
         *  获得指定节点的绝对定位坐标值.
         *
         */

        var typeAdjust = require('../func-type-adjust/type-adjust');

        module.exports = function (element) {
            element = typeAdjust(element) === "jQuery Object" ? element[0] : element;
            return {
                left: getLeft(element),
                top: getTop(element)
            }
        };

// Definition: 获取元素在页面中的 X 轴绝对定位.
        function getLeft(element) {
            var offset = element.offsetLeft;
            element.offsetParent !== null ? offset += getLeft(element.offsetParent) : void(0);
            return offset;
        }

// Definition: 获取元素的在页面中的 Y 轴绝对定位.
        function getTop(element) {
            var offset = element.offsetTop;
            element.offsetParent !== null ? offset += getTop(element.offsetParent) : void(0);
            return offset;
        }
    }, {"../func-type-adjust/type-adjust": 20}],
    13: [function (require, module, exports) {
        /*!
         *  Cookie window.jQuery Plugin Packaged By LancerComet at 10:25, 2015.11.26.
         *  jQuery Cookie 获取插件.
         *
         *  用法:
         *  ---
         *  require("func-jquery-cookie")();
         *
         *  注意:
         *  ---
         *  此模块在页面中仅需要运行一次.
         *
         *  ---------
         *
         *  window.jQuery Cookie Plugin v1.4.1
         *  https://github.com/carhartl/window.jQuery-cookie
         *
         *  Copyright 2013 Klaus Hartl
         *  Released under the MIT license
         *
         */

        var appConfig = require('../../app-config/app-config');
        module.exports = getCookie;

        function getCookie() {

            if (window.jQuery.cookie && window.jQuery.removeCookie) {
                console.log(appConfig.consoleText.info + "jQuery cookie was already loaded, and now return.");
                return;
            }

            var pluses = /\+/g;

            function encode(s) {
                return config.raw ? s : encodeURIComponent(s);
            }

            function decode(s) {
                return config.raw ? s : decodeURIComponent(s);
            }

            function stringifyCookieValue(value) {
                return encode(config.json ? JSON.stringify(value) : String(value));
            }

            function parseCookieValue(s) {
                if (s.indexOf('"') === 0) {
                    // This is a quoted cookie as according to RFC2068, unescape...
                    s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
                }

                try {
                    // Replace server-side written pluses with spaces.
                    // If we can't decode the cookie, ignore it, it's unusable.
                    // If we can't parse the cookie, ignore it, it's unusable.
                    s = decodeURIComponent(s.replace(pluses, ' '));
                    return config.json ? JSON.parse(s) : s;
                } catch (e) {
                }
            }

            function read(s, converter) {
                var value = config.raw ? s : parseCookieValue(s);
                return window.jQuery.isFunction(converter) ? converter(value) : value;
            }

            var config = window.jQuery.cookie = function (key, value, options) {

                // Write

                if (value !== undefined && !window.jQuery.isFunction(value)) {
                    options = window.jQuery.extend({}, config.defaults, options);

                    if (typeof options.expires === 'number') {
                        var days = options.expires, t = options.expires = new Date();
                        t.setTime(+t + days * 864e+5);
                    }

                    return (document.cookie = [
                        encode(key), '=', stringifyCookieValue(value),
                        options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                        options.path ? '; path=' + options.path : '',
                        options.domain ? '; domain=' + options.domain : '',
                        options.secure ? '; secure' : ''
                    ].join(''));
                }

                // Read

                var result = key ? "" : {};

                // To prevent the for loop in the first place assign an empty array
                // in case there are no cookies at all. Also prevents odd result when
                // calling window.jQuery.cookie().
                var cookies = document.cookie ? document.cookie.split('; ') : [];

                for (var i = 0, l = cookies.length; i < l; i++) {
                    var parts = cookies[i].split('=');
                    var name = decode(parts.shift());
                    var cookie = parts.join('=');

                    if (key && key === name) {
                        // If second argument (value) is a function it's a converter...
                        result = read(cookie, value);
                        break;
                    }

                    // Prevent storing a cookie that we couldn't decode.
                    if (!key && (cookie = read(cookie)) !== undefined) {
                        result[name] = cookie;
                    }
                }

                return result;
            };

            config.defaults = {};

            window.jQuery.removeCookie = function (key, options) {
                if (window.jQuery.cookie(key) === undefined) {
                    return false;
                }

                // Must not alter options, thus extending a fresh object...
                window.jQuery.cookie(key, '', window.jQuery.extend({}, options, {expires: -1}));
                return !window.jQuery.cookie(key);
            };

        }
    }, {"../../app-config/app-config": 1}],
    14: [function (require, module, exports) {
        /*
         *  Live Quick Login Packaged By LancerComet at 17:19, 2015/11/20.
         *  # Carry Your World #
         *  ---
         *  快速登录模块.
         *  当执行之后会检测是否登录, 若没登录则弹出快速登录且使用 throw new Error 阻塞 JS 执行.
         *  请在需要的模块中引入本模块.
         *
         */

        module.exports = liveQuickLogin;

        function liveQuickLogin() {
            "use strict";

            if (!$.cookie("DedeUserID")) {
                try {
                    if (window.biliQuickLogin) {
                        window.biliQuickLogin(function () {
                            window.location.reload();
                        });
                        throw "Bilibili Live: 您没登陆，想干撒子？~~ -_-";
                    } else {
                        throw "Bilibili Live: 快速登录脚本尚未载入.";
                    }
                } catch (tryErr) {
                    throw new Error(tryErr);
                }
            }

        }
    }, {}],
    15: [function (require, module, exports) {
        /*
         *  Number to Fixed Function By LancerComet at 14:15, 2015/12/18.
         *  # Carry Your World #
         *  ---
         *  保留小数方法.
         *  本模块将在 Number 下建立原型方法.
         */

        module.exports = function () {

            Number.prototype.toFixed1 = function () {
                return parseFloat(this.toString().replace(/(\.\d{1})\d+$/, "$1"));
            }

        };

    }, {}],
    16: [function (require, module, exports) {
        /*
         *  Random Emoji By LancerComet at 10:39, 2015/12/16.
         *  # Carry Your World #
         *  ---
         *  随机返回一个颜文字.
         */

        var emojiPool = {
            happy: ["(｀･ω･´)", "≖‿≖✧", "●ω●", "(/ ▽ \\)", "(=・ω・=)", "(●'◡'●)ﾉ♥", "<(▰˘◡˘▰)>", "(⁄ ⁄•⁄ω⁄•⁄ ⁄)", "(ง,,• ᴗ •,,)ง ✧"],
            shock: [",,Ծ‸Ծ,,", "(｀･д･´)", "Σ( ° △ °|||)︴", "┌( ಠ_ಠ)┘", "(ﾟДﾟ≡ﾟдﾟ)!?"],
            sad: ["∑(っ °Д °;)っ", "＞︿＜", "＞△＜", "●︿●", "(´；ω；`)"],
            helpless: ["◐▽◑", "ʅ（´◔౪◔）ʃ", "_(:3 」∠)_", "_(┐「ε:)_", "(/・ω・＼)", "(°∀°)ﾉ"]
        };


        module.exports = {
            happy: function () {
                return emojiPool.happy[Math.floor(Math.random() * emojiPool.happy.length)];
            },
            sad: function () {
                return emojiPool.sad[Math.floor(Math.random() * emojiPool.sad.length)];
            },
            shock: function () {
                return emojiPool.shock[Math.floor(Math.random() * emojiPool.shock.length)];
            },
            helpless: function () {
                return emojiPool.helpless[Math.floor(Math.random() * emojiPool.helpless.length)];
            }
        };

    }, {}],
    17: [function (require, module, exports) {
        /*
         *  Avalon Set Number with Animation By LancerComet at 17:13, 2015.12.23.
         *  # Carry Your Wolrd #
         *  ---
         *
         *  Description:
         *  ---
         *  动画效果设置数字模块.
         *  仅限 Avalon 框架使用.
         *
         *  Usage:
         *  ---
         *  avalonSetNum(新的数字, 旧的数字, Avalon 视图对象属性[字符串])
         *
         *  例:
         *  avalonSetNum(10000, testCtrl.num, "testCtrl.num");
         *
         */

        module.exports = avalonSetNum;

        function avalonSetNum(newNumber, oldNumber, avalonProp) {
            "use strict";

            var numTimer = null;

            // Error Handler.
            if (Object.prototype.toString.call(newNumber) !== "[object String]" && Object.prototype.toString.call(newNumber) !== "[object Number]") {
                throw new Error('Function "avalonSetNum" Error: 在使用 avalonSetNum() 时请使用数字作为参数.');
            }

            var currentNum = parseInt(oldNumber, 10);  // Definition: 当前的数字.
            var newNum = parseInt(newNumber, 10);  // Definition: 新的数字.

            // 当 currentNum 或 newNum 非数字时静默退出.
            if (isNaN(currentNum) || isNaN(newNum)) {
                console.log('Function "avalonSetNum" Error: 当前节点中的内容或传入数字无法格式化为有效数字, 方法退出.');
                return;
            }

            // 当 currentNum 或 newNum 过大时静默退出.
            if (!isFinite(currentNum) || !isFinite(newNum)) {
                console.log('Function "avalonSetNum" Error: 当前节点中的内容或传入数字过于庞大, 方法退出.');
                return;
            }

            var deltaNum = newNum - currentNum;  // Definition: 新数字与旧数字的差值.

            // Action: 如果 deltaNum 太小，直接返回新的数字，跳过动画效果.
            if (Math.abs(deltaNum) <= 10) {
                eval("avalon.vmodels." + avalonProp + " = " + newNumber);
                return;
            }

            var execTime = Math.abs(Math.floor(deltaNum / 10000));  // Definition: 期望的动画执行的最大次数.
            if (execTime > 100) {
                execTime = 100;
            }  // execTime 最大为 100.

            var deltaPerTime = deltaNum / execTime,  // 每次执行增加动画的增加数额.
                addCount = 0;  // 增加动画执行次数计数.

            // 设置新的计时器: element.timer.
            numTimer = setInterval(function () {
                if (addCount++ >= execTime) {
                    numTimer && _clearNumTimer();  // 清除计时器.
                    eval("avalon.vmodels." + avalonProp + " = " + newNum);  // 设置最终值.
                    return;
                }
                eval("avalon.vmodels." + avalonProp + " = " + parseInt(currentNum + deltaPerTime * addCount, 10));
            }, 10);

            /* Internal Function goes below. */

            // Definition: 清除动画计时器.
            function _clearNumTimer() {
                clearInterval(numTimer);
                numTimer = null;
            }

        }
    }, {}],
    18: [function (require, module, exports) {
        /*
         *  Set Number with Animation Rewrite By LancerComet at 14:14, 2015.11.11.
         *  # Carry Your Wolrd #
         *  ---
         *
         *  Description:
         *  ---
         *  动画效果设置数字模块.
         *
         *  Info:
         *  ---
         *  模块将在对应节点下加入属性 "data-real-number" 来存储真实的数据, 可以从本属性即时取值.
         *
         *  Usage:
         *  ---
         *  setNum(新的数字, 原生节点 || jQuery 节点)
         *  注意：节点中必须为纯数字且存在数字, 否则直接报错退出.
         *
         */

        module.exports = setNum;

        function setNum(newNumber, element) {
            "use strict";

            // Error Handler.
            if (Object.prototype.toString.call(newNumber) !== "[object String]" && Object.prototype.toString.call(newNumber) !== "[object Number]") {
                throw new Error('Function "setNum" Error: 在使用 setNum() 时请使用数字作为参数.');
            }

            var currentNum = parseInt(_getHTML(element), 10);  // Definition: 当前的数字.
            var newNum = parseInt(newNumber, 10);  // Definition: 新的数字.

            // 当 currentNum 或 newNum 非数字时静默退出.
            if (isNaN(currentNum) || isNaN(newNum)) {
                (function () {
                    var consoleText = 'Function "setNum" Error: 当前节点中的内容或传入数字无法格式化为有效数字, 方法退出.';
                    console.error ? console.error(consoleText) : console.log(consoleText);
                    consoleText = null;
                })();
                return;
            }

            // 当 currentNum 或 newNum 过大时静默退出.
            if (!isFinite(currentNum) || !isFinite(newNum)) {
                (function () {
                    var consoleText = 'Function "setNum" Error: 当前节点中的内容或传入数字过于庞大, 方法退出.';
                    console.error ? console.error(consoleText) : console.log(consoleText);
                    consoleText = null;
                })();
                return;
            }

            (function setRealNumber() {
                if (Object.prototype.toString.call(element).indexOf("Element") > -1) {
                    // 当为原生对象时.
                    element.setAttribute("data-real-number", newNum);
                } else if (Object.prototype.toString.call(element) === "[object Object]") {
                    // 当为 jQuery 对象时.
                    // 但是在 IE 8 下原生对象会被判断到此处.
                    if (window.navigator.userAgent.indexOf("MSIE 8.0") > -1 && window.navigator.userAgent.indexOf("Trident/4.0") > -1) {
                        element.setAttribute("data-real-number", newNum);
                    } else {
                        element.attr("data-real-number", newNum);
                    }
                } else {
                    // 非法 dom.
                    throw new Error('Function "setRealNumber" in "setNum" Error: 请指定一个正确的节点.');
                }
            })();

            var _deltaNum = (newNum - currentNum);  // Definition: 新数字与旧数字的差值.

            // Action: 如果 deltaNum 太小，直接设置新的数字，跳过动画效果.
            if (Math.abs(_deltaNum) <= 10) {
                _setHTML(element, newNum);
                return;
            }

            var _execTimes = Math.abs(Math.floor(_deltaNum / 5));  // Definition: 期望的动画执行的最大次数.（绝对值）
            if (_execTimes > 100) {
                _execTimes = 100;
            }  // _execTimes 最大为 100.

            var _deltaPerTime = _deltaNum / _execTimes,  // 每次执行增加动画的增加数额.
                _addCount = 0;  // 增加动画执行次数计数.

            // 当已经存在动画计时器时, 清理旧的计时器.
            // 计时器挂载到 element.timer 属性下.
            element.numTimer && _clearNumTimer();

            // 设置新的计时器: element.timer.
            element.numTimer = setInterval(function () {
                if (_addCount++ >= _execTimes) {
                    _setHTML(element, newNum);  // 当达到执行次数时, 直接设置最终值.
                    element.numTimer ? _clearNumTimer() : void(0);  // 清除计时器.
                    return newNum;  // 返回数字以便其他用途. (如果有)
                }
                _setHTML(element, parseInt(currentNum + _deltaPerTime * _addCount, 10));
            }, 10);

            /* Internal Function goes below. */

            // Definition: 设置 innerHTML 方法, 兼容 jQuery 对象与原生对象.
            function _setHTML(dom, content) {
                if (Object.prototype.toString.call(dom).indexOf("Element") > -1) {
                    // 当为原生对象时.
                    dom.innerHTML = content;
                } else if (Object.prototype.toString.call(dom) === "[object Object]") {
                    // 当为 jQuery 对象时.
                    // 但是在 IE 8 下原生对象会被判断到此处.
                    if (window.navigator.userAgent.indexOf("MSIE 8.0") > -1 && window.navigator.userAgent.indexOf("Trident/4.0") > -1) {
                        dom.innerHTML = content;
                    } else {
                        dom.html(content);
                    }
                } else {
                    // 非法 dom.
                    throw new Error('Function "_setHTML" in "setNum" Error: 请指定一个正确的节点.');
                }
            }

            // Definition: 获取 innterHTML 方法.
            function _getHTML(dom) {
                if (Object.prototype.toString.call(dom).indexOf("Element") > -1) {
                    // 当为原生对象时.
                    return dom.innerHTML;
                } else if (Object.prototype.toString.call(dom) === "[object Object]") {
                    // 当为 jQuery 对象时.
                    // 但是在 IE 8 下原生对象会被判断到此处.
                    if (window.navigator.userAgent.indexOf("MSIE 8.0") > -1 && window.navigator.userAgent.indexOf("Trident/4.0") > -1) {
                        return dom.innerHTML;
                    } else {
                        return dom.html();
                    }
                } else {
                    // 非法 dom.
                    throw new Error('Function "_getHTML" in "setNum" Error: 请指定一个正确的节点.');
                }
            }

            // Definition: 清除动画计时器.
            function _clearNumTimer() {
                clearInterval(element.numTimer);
                element.numTimer = null;
            }

        }
    }, {}],
    19: [function (require, module, exports) {
        /*
         *  Timestamp Shorter By LancerComet at 12:17, 2016/1/7.
         *  # Carry Your World #
         *  ---
         *  Bilibili 特有的时间戳去掉后三位的方法.
         */

        module.exports = timestampShorter;

        function timestampShorter(timestamp) {
            var newTimeStamp = null;
            newTimeStamp = timestamp.toString();
            newTimeStamp = newTimeStamp.slice(0, newTimeStamp.length - 3);
            newTimeStamp = parseInt(newTimeStamp, 10);
            return newTimeStamp;
        };

    }, {}],
    20: [function (require, module, exports) {
        /*
         *  Variable Type Adjustment By LancerComet at 13:22, 2015/11/30.
         *  # Carry Your World #
         *  ---
         *  变量类型判断模块.
         *
         */

        module.exports = function (variable) {

            var type = Object.prototype.toString.call(variable);
            var htmlReg = /HTML.*.Element/;

            if (type === "[object Object]" && variable.jquery) {
                return "jQuery Object";
            } else if (type === "[object Object]") {
                return "Object";
            } else if (type === "[object Number]") {
                return "Number";
            } else if (type === "[object String]") {
                return "String";
            } else if (type === "[object Array]") {
                return "Array";
            } else if (type === "[object Boolean]") {
                return "Boolean";
            } else if (type === "[object Function]") {
                return "Function";
            } else if (type === "[object Null]") {
                return "null";
            } else if (type === "[object Undefined]") {
                return "undefined";
            } else if (type.match(htmlReg)) {
                return "HTML Element";
            } else if (type === "[object HTMLCollection]") {
                return "HTML Elements Collection";
            } else {
                return null;
            }

        };

    }, {}],
    21: [function (require, module, exports) {
        /*
         *  Live Public Service By LancerComet at 16:03, 2015/12/18.
         *  # Carry Your World #
         *  ---
         *  公共服务控制器模块.
         */

        module.exports = liveService;

        function liveService() {

            // Definition: 公共服务控制器.
            var liveService = avalon.define({
                $id: "liveService"
            });


            // Definition: 公共服务控制器事件引用定义.
            // 每个公共事件将定义在单独的模块中并在此引用.
            require("./live-service-update-currency")(liveService);
            require("./live-service-get-bp")(liveService);

        }
    }, {"./live-service-get-bp": 22, "./live-service-update-currency": 23}],
    22: [function (require, module, exports) {
        /*
         *  Get BP By LancerComet at 17:52, 2016/1/7.
         *  # Carry Your World #
         *  ---
         *  获取 BP 事件.
         *
         *  注意:
         *  ---
         *  这是一个同步请求, 如果请求不到则会引起短暂停滞.
         *  传入的参数 variable 为需要赋值的变量, 因为 $watch 无法进行数据返回.
         */

        module.exports = function (liveService, undefined) {
            "use strict";


        };
    }, {}],
    23: [function (require, module, exports) {
        /*
         *  Live Currency Updating Event By LancerComet at 16:06, 2015/12/18.
         *  # Carry Your World #
         *  ---
         *  瓜子更新服务模块.
         */
        var appConfig = require('../app-config/app-config');
        var randomEmoji = require("../functions/func-random-emoji/random-emoji");

        module.exports = function (liveService, undefined) {
            "use strict";

            // Definition: 瓜子更新服务定义.
            liveService.$watch("updateCurrency", function (value) {

                // 当传入 value 时, 直接只用 value 的值进行广播.
                if (value) {

                    if (value.gold !== null && value.gold !== undefined && !isNaN(value.gold)) {
                        value.gold = parseInt(value.gold, 10);
                    }
                    if (value.silver !== null && value.silver !== undefined && !isNaN(value.silver)) {
                        value.silver = parseInt(value.silver, 10);
                    }
                    if ((value.gold !== null && value.gold !== undefined && isNaN(value.gold)) || (value.silver !== null && value.silver !== undefined && isNaN(value.silver))) {
                        throw new Error(appConfig.consoleText.error + "updateCurrency 的值必须为有效数字.");
                    }
                    liveService.$fire("all!fillCurrency", value);
                    return;
                }


                // 当没有传值时, 发送 XHR 获取最新瓜子数量.
                $.ajax({
                    url: "/user/getuserinfo",
                    type: "GET",
                    data: {
                        ts: Date.now()
                    },
                    dataType: "JSON",
                    success: function (result) {
                        if (result.code != "REPONSE_OK") {
                            console.log(appConfig.consoleText.error + "获取用户信息失败: " + result.msg.toString());
                            console.log("因此瓜子信息更新失败, 真令人尴尬 " + randomEmoji.sad());
                            return;
                        }

                        result.data.silver = parseInt(result.data.silver, 10);
                        result.data.gold = parseInt(result.data.gold, 10);

                        if (isNaN(result.data.silver) || isNaN(result.data.gold)) {
                            console.log(appConfig.consoleText.caution + "服务器返回瓜子数据非有效数字类型!");
                            return;
                        }

                        liveService.$fire("all!fillCurrency", {
                            silver: result.data.silver,
                            gold: result.data.gold,
                            biliCoin: result.data.billCoin
                        });
                    },
                    error: function (result) {
                        throw new Error(appConfig.consoleText.error + "瓜子信息更新失败: 请求发送失败.")
                    }
                });

            });


        };


    }, {"../app-config/app-config": 1, "../functions/func-random-emoji/random-emoji": 16}],
    24: [function (require, module, exports) {
        /*
         *  Live On Stream on Hint Panel By LancerComet at 10:54, 2016/1/13.
         *  # Carry Your World #
         *  ---
         *  开启直播直播码弹出提示.
         */

        var livePopup = require('../../../../common/components/live-widget/live-popup/live-popup');
        var randomEmoji = require('../../../../common/functions/func-random-emoji/random-emoji');

        module.exports = function (adminFuncsCtrl) {
            "use strict";

            // Definition: 弹窗 HTML 结构.
            var popupHTML = "";

            // Definition: 开启直播显示推流码面板.
            adminFuncsCtrl.$watch("showStreamCode", function () {
                if (parseInt(ISANCHOR, 10) !== 1) {
                    return;
                }
                adminFuncsCtrl.$fire("all!showLiveManageDialog");
            });

        };
    }, {
        "../../../../common/components/live-widget/live-popup/live-popup": 7,
        "../../../../common/functions/func-random-emoji/random-emoji": 16
    }],
    25: [function (require, module, exports) {
        /*
         *  Live Admin Functions By LancerComet at 10:55, 2016.01.13.
         *  # Carry Your World #
         *  ---
         *  房管相关功能模块.
         *  此模块非房间管理面板模块, 为各个分离的房管功能模块.
         */

        module.exports = function () {

            var adminFuncsCtrl = avalon.define({
                $id: "adminFuncsCtrl"
            });

            require("./functions/live-on-rtmp")(adminFuncsCtrl);  // 开启直播 RTMP 码弹窗模块.

        };
    }, {"./functions/live-on-rtmp": 24}],
    26: [function (require, module, exports) {
        /**
         * Created by fanfan on 2016/1/11.
         */

        var view = avalon.define({
            $id: "adminManage",
            urls: {
                list: "/liveact/ajaxGetAdminList",
                manage: "/liveact/admin"
            },
            roomid: window.ROOMID,
            iptName: "",                // 管理员名称
            iptFlag: false,
            listData: [],               // 管理员列表
            tipMsg: "",
            doms: {},
            csses: {
                iptName: ".ipt-name"
            },
            init: function () {
                this.$el = $("[data-content='adminManage']");
                this.getList();
            },
            setDoms: function () {
                var $el = this.$el,
                    csses = this.csses;

                this.doms = {
                    $iptName: $(csses.iptName, $el)
                };
            },
            clickAddAdmin: function (e) {
                if (view.clickAddAdmin.ing) {
                    return;
                }
                view.clickAddAdmin.ing = true;

                if (!view.iptName) {
                    view.tipMsg = "请填写房管名称！";
                    view.iptFlag = false;
                    view.clickAddAdmin.ing = false;
                } else {
                    view.iptFlag = true;
                    view.tipMsg = "";

                    view.add(function () {
                        view.clickAddAdmin.ing = false;
                    });
                }
            },
            clickDel: function (e) {
                if (view.clickDel.ing) {
                    return;
                }
                view.clickDel.ing = true;

                var $e = $(e.target),
                    index = $e.parents("tr").index();

                view.del(index, function () {
                    view.clickDel.ing = false;
                });
            },
            getList: function (cb) {
                var self = this,
                    url = this.urls.list,
                    param = {
                        roomid: view.roomid
                    };

                $.ajax({
                    type: "post",
                    url: url,
                    data: param,
                    dataType: "json",
                    success: function (data) {
                        view.listData = data.data;

                        cb && cb();
                    }
                })
            },
            manage: function (uname, type, successCb, failCb) {
                var self = this,
                    url = this.urls.manage,
                    param = {
                        uname: uname,
                        roomid: self.roomid,
                        type: type
                    };

                $.ajax({
                    type: "post",
                    url: url,
                    data: param,
                    dataType: "json",
                    success: function (data) {

                        if (data.code === 0) {
                            successCb && successCb(data.data);
                        } else {
                            failCb && failCb(data);
                        }
                    },
                    error: function (data) {
                        failCb && failCb(data);
                    }
                });
            },
            add: function (cb) {
                var uname = view.iptName;

                this.manage(uname, "add", function (data) {
                    view.listData.unshift(data);
                    view.iptName = "";
                    view.tipMst = "";
                    liveToast(view.$el.find(".btn-add")[0], "任命成功！", "success", true);
                    cb && cb();
                }, function (data) {
                    view.tipMsg = data.msg || "";
                    cb && cb();
                })
            },
            del: function (index, cb) {
                var uname = view.listData[index].userinfo.uname;

                this.manage(uname, "del", function () {
                    liveToast(view.$el.find(".item").eq(index)[0], "撤销成功", "success", true);
                    view.listData.splice(index, 1);
                    cb && cb();
                }, function (data) {
                    view.tipMsg = data.msg;
                    db && cb();
                });
            }
        });

        view.init();

        module.exports = view;
    }, {}],
    27: [function (require, module, exports) {
        /**
         * Created by fanfan on 2016/1/11.
         */

        require('perfect-scrollbar/jquery')($);
        var view = avalon.define({
            $id: "blackManage",
            $el: [],
            urls: {
                list: "/liveact/ajaxGetBlockList",
                add: "/liveact/room_block_user",
                del: "/liveact/del_room_block_user"
            },
            roomid: window.ROOMID,
            iptName: "",                // 黑名单名称
            iptTime: "",                // 封禁时间
            listData: [],               // 黑名单列表
            tipName: "",
            tipTime: "",
            nowPage: 0,
            iptNameFlag: true,
            iptTimeFlag: true,
            getListIng: false,
            doms: {},
            init: function (opt) {
                this.$el = opt.$el;
                //this.getList();
                avalon.scan(this.$el[0], view);
                this.bindScrollPage();

            },
            setDoms: function () {
                var $el = this.$el,
                    csses = this.csses;

                this.doms = {
                    $iptName: $(csses.iptName, $el)
                };
            },
            refresh: function () {
                this.nowPage = 0;
                this.listData = [];
                this.bindScrollPage();
                this.getList();

            },
            clickAdd: function () {
                if (view.clickAdd.ing) {
                    return;
                }

                view.clickAdd.ing = true;

                var uname = view.iptName,
                    time = view.iptTime,
                    flag = true;

                if (!uname) {
                    view.tipName = "请填写用户名！";
                    flag = false;
                    view.iptNameFlag = false;
                } else {
                    view.tipName = "";
                    view.iptNameFlag = true;
                }

                if (!time) {
                    view.tipTime = "请填写封禁时间！";
                    flag = false;
                    view.iptTimeFlag = false;
                } else {
                    if (/[^0-9]/.test(time) || time > 72 || time < 1) {
                        view.tipTime = "请直接输入数字(1-72)"
                        flag = false;
                        view.iptTimeFlag = false;
                    } else {
                        view.tipTime = ""
                        view.iptTimeFlag = true;
                    }
                }

                if (flag) {
                    view.add(function () {
                        view.clickAdd.ing = false;
                    });
                } else {
                    view.clickAdd.ing = false;
                }


            },
            clickDel: function (e) {
                if (view.clickDel.ing) {
                    return;
                }
                view.clickDel.ing = true;

                var index = $(e.target).parents("tr").index();

                view.del(index, function () {
                    view.clickDel.ing = false;
                });
            },
            getList: function (successCb, failCb) {
                if (this.getListIng) {
                    return;
                }

                this.getListIng = true;

                var self = this,
                    url = this.urls.list,
                    param = {
                        roomid: view.roomid,
                        page: view.nowPage + 1
                    };

                $.ajax({
                    type: "post",
                    url: url,
                    data: param,
                    dataType: "json",
                    success: function (data) {
                        self.getListIng = false;
                        if (data.code === 0) {
                            if (data.data.length > 0) {
                                view.nowPage = view.nowPage + 1;
                                view.listData = view.listData.concat(data.data);
                            }
                            successCb && successCb(data.data);
                        } else {
                            failCb && failCb();
                        }


                    },
                    error: function () {
                        self.getListIng = false;
                        failCb && failCb();
                    }
                })
            },
            add: function (cb) {
                var url = view.urls.add,
                    param = {
                        roomid: view.roomid,
                        uname: view.iptName,
                        type: 1,
                        hour: view.iptTime
                    };

                $.ajax({
                    type: "post",
                    url: url,
                    data: param,
                    dataType: "json",
                    success: function (data) {
                        if (data.code === 0) {
                            view.listData.unshift(data.data);
                            view.tipName = "";
                            view.iptName = "";
                            view.iptTime = "";

                            liveToast(view.$el.find(".btn-add")[0], "添加成功", "success", true);
                        } else {
                            view.tipName = data.msg;
                        }

                        cb && cb();
                    },
                    error: function () {
                        cb && cb();
                    }
                });
            },
            clickHide: function () {
                view.$el.parents("[panel-type='roomManage']").removeClass("open")
            },
            del: function (index, cb) {
                var id = this.listData[index].id,
                    url = view.urls.del,
                    param = {
                        roomid: view.roomid,
                        id: id
                    };

                $.ajax({
                    type: "post",
                    url: url,
                    data: param,
                    dataType: "json",
                    success: function (data) {
                        if (data.code === 0) {
                            liveToast(view.$el.find(".item").eq(index)[0], "撤销成功", "success", true);
                            view.listData.splice(index, 1);
                        } else {
                            view.tipName = data.msg;
                        }
                        cb && cb();
                    },
                    error: function () {
                        cb && cb();
                    }
                });
            },
            bindScrollPage: function () {
                this.unbindScrollPage();

                var tid = 0,
                    $list = view.$el.find(".manage-list");


                $list.bind("scroll", function () {
                    if (tid) {
                        clearTimeout(tid)
                    }

                    tid = setTimeout(function () {
                        if ($list[0].scrollHeight - $list[0].scrollTop - $list[0].clientHeight <= 0) {

                            if (view.getListIng) {
                                return;
                            }

                            view.getList(function (data) {
                                if (data.length === 0) {
                                    view.unbindScrollPage();
                                }
                            });
                        }

                    }, 50);
                });

            },
            unbindScrollPage: function () {
                view.$el.find(".manage-list").unbind("scroll");
            }
        });


        $(function () {
            $(".black-manage .manage-list").perfectScrollbar()
        });


        module.exports = function (opt) {
            $(function () {
                view.init(opt);
            });
            return view;
        }
    }, {"perfect-scrollbar/jquery": 77}],
    28: [function (require, module, exports) {
        (function (global) {
            /**
             * Created by fanfan on 2016/1/11.
             */

            var liveManageView = require("./live-manage.js");
            var blackManageView = require("./black-manage.js")({$el: $("[data-content='blackManage']", $("#live-info-manage"))});
            var adminManageView = require("./admin-manage.js");

            var manageView = avalon.define({
                $id: "liveInfoManage",
                curTarget: "liveManage",
                isAdmin: false,
                isOpen: false,
                $el: "#live-info-manage",
                $dialog: ".live-info-manage-dialog",
                coverNum: 0,
                coverListData: [],
                allowUploadCoverTime: 0,
                init: function () {
                    var self = this;
                    this.$el = $(this.$el);
                    this.$dialog = this.$el.find(this.$dialog);
                    this.bindEvt();
                    avalon.scan(this.$el[0], manageView);
                    this.setWatch();

                },

                /**
                 * 设置监听事件
                 * */
                setWatch: function () {
                    var self = this;

                    this.$watch("showLiveManageDialog", function (opt) {
                        opt = opt || {};
                        if (opt.blackName) {
                            blackManageView.iptName = opt.blackName;
                        }
                        self.curTarget = opt.curTarget || "liveManage";
                        self.show();
                    });
                },
                clickTab: function (e) {
                    var $tab = $(e.target),
                        target = $tab.data("target");

                    if (target !== manageView.curTarget) {
                        manageView.curTarget = target;

                        if (target === "blackManage") {
                            blackManageView.refresh();
                        }
                    }
                },
                show: function () {
                    var self = this;
                    // 打开窗口初始化数据
                    self.getCoverList(function (result) {
                        if (result.code == 0) {
                            self.$el.addClass("open");
                            self.setPosition();
                        }
                    });
                },
                hide: function (e) {
                    this.$el.removeClass("open")
                },
                clickHide: function () {
                    manageView.hide();
                },
                setPosition: function () {
                    var allWidth = document.documentElement.clientWidth,
                        allHeight = document.documentElement.clientHeight,
                        dialogWidth = this.$dialog.width(),
                        dialogHeight = this.$dialog.height(),
                        top,
                        left,
                        cssData;


                    top = allHeight / 2 - dialogHeight / 2;
                    left = allWidth / 2 - dialogWidth / 2;

                    if (top < 0) {
                        top = top * 2

                    }

                    cssData = {
                        position: "fixed",
                        zIndex: 99,
                        left: left,
                        top: top
                    }

                    this.$dialog.css(cssData)
                },
                bindEvt: function () {
                    var resizeTid = 0,
                        self = this;

                    $(window).resize(function () {
                        if (resizeTid) {
                            clearTimeout(resizeTid);
                        }

                        resizeTid = setTimeout(function () {
                            if (self.$el.hasClass("open")) {
                                self.setPosition();
                            }
                        }, 50);
                    });
                },

                /**
                 * 直播封面相关
                 */

                // 获取房间直播封面信息
                getCoverList: function (callback) {
                    this.$el = $(this.$el);
                    $.ajax({
                        type: "GET",
                        data: {
                            roomid: global.ROOMID
                        },
                        url: "/live/getMasterInfo",
                        dataType: "JSON",
                        cache: false,
                        success: function (result) {
                            if (result.code == 0) {
                                manageView.coverNum = result.data.coverNum;
                                manageView.allowUploadCoverTime = result.data.allowUploadCoverTime;
                                manageView.coverListData = result.data.coverList;  // 刷新直播封面列表数据
                                avalon.scan(manageView.$el.find(".cover-list")[0], manageView);  // Scan 视图节点
                            }
                            callback && callback(result);
                        }
                    });
                },

                // 设置直播封面
                setCover: function (event, picId, callback) {
                    $.ajax({
                        type: "POST",
                        data: {
                            roomid: global.ROOMID,
                            type: "cover",
                            pic_id: picId
                        },
                        url: "/liveact/changePic",
                        dataType: "JSON",
                        success: function (result) {
                            if (result.code == 0) {
                                liveToast($(event.target), "封面切换成功", "success", true);
                                manageView.getCoverList();
                            } else {
                                liveToast($(event.target), result.msg, "info", true);
                            }
                        }
                    });
                },

                // 删除直播封面
                delCover: function (event, picId, callback) {
                    livePopup({
                        title: "确定吗~",
                        html: '<p>确定要删除图片吗？</p>',
                        type: "action",
                        width: "350",
                        button: {
                            confirm: "确定",
                            cancel: "取消"
                        },
                        onConfirm: function () {
                            var self = this;
                            $.ajax({
                                type: "POST",
                                data: {
                                    roomid: global.ROOMID,
                                    type: "cover",
                                    pic_id: picId
                                },
                                url: "/liveact/deletePic",
                                dataType: "JSON",
                                success: function (result) {
                                    if (result.code == 0) {
                                        manageView.getCoverList();
                                        self.done();
                                    } else {
                                        liveToast($(event.target), result.msg, "info", true);
                                    }
                                }
                            });
                        }
                    });

                },

                // 选择上传直播封面
                uploadClick: function (event, coverNum) {
                    if (manageView.allowUploadCoverTime != 0) {
                        liveToast($(event.target), "╮(￣⊿￣)╭，下次可上传时间为：" + manageView.allowUploadCoverTime, "info", true);
                        return;
                    } else if (coverNum <= 0) {
                        liveToast($(event.target), "当前您的等级不够，请加油升级哦", "info", true);
                    } else {
                        $("#cover-img-input").click();
                    }
                },

                // 上传直播封面
                uploadCoverImg: function () {
                    var $bgImgInput = $("#cover-img-input");
                    if ($bgImgInput[0].files[0].size > 409600) {
                        liveToast($("#cover-upload-icon"), "文件大小不能超过50K", "info", true);
                        return;
                    }
                    $("#coverFormFile").submit();
                },

                /**
                 * 获取房间基本信息
                 */

                getMasterInfo: function (callback) {
                    $.ajax({
                        type: "GET",
                        data: {
                            roomid: global.ROOMID
                        },
                        url: "/live/getMasterInfo",
                        dataType: "JSON",
                        cache: false,
                        success: function (result) {
                            if (result.code == 0) {
                                manageView.coverNum = result.data.coverNum;
                                manageView.allowUploadCoverTime = result.data.allowUploadCoverTime;
                                manageView.coverListData = result.data.coverList;  // 刷新直播封面列表数据
                                avalon.scan(manageView.$el.find(".cover-list")[0], manageView);  // Scan 视图节点
                            }
                            callback && callback(result);
                        }
                    });
                }

            });

            $(function () {
                manageView.init();

                // Upload Success
                window.roomCoverUploadSuccess = function (data) {
                    var data = JSON.parse(data);
                    if (data.code == 0) { // Success
                        manageView.getCoverList();
                    } else { // Error
                        liveToast($("#cover-upload-icon"), data.msg, "info", true);
                    }
                };

            });


            module.exports = function () {
                return manageView
            }
        }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {"./admin-manage.js": 26, "./black-manage.js": 27, "./live-manage.js": 29}],
    29: [function (require, module, exports) {
        /**
         * Created by fanfan on 2016/1/11.
         */

        var randomEmoji = require('../../../../common/functions/func-random-emoji/random-emoji');
        var view = avalon.define({
            $id: "liveManage",
            urls: {
                liveInfo: "/liveact/getrtmp"
            },
            $el: [],
            rtmpUrl: "",
            liveCode: "",
            init: function () {
                view.$el = $("[data-content='liveManage']");
                this.$watch("showLiveManageDialog", function () {
                    if (!view.rtmpUrl) {
                        view.getData(function (data) {
                            view.successCallback(data);
                        });
                    }
                });

                this.bindEvt();
            },
            successCallback: function (data) {
                view.rtmpUrl = data.data.addr;
                view.liveCode = data.data.code;
            },


            getData: function (cb) {
                var url = this.urls.liveInfo;

                $.ajax({
                    type: "post",
                    url: url,
                    data: {roomid: window.ROOMID},
                    dataType: "json",
                    success: function (data) {
                        cb && cb(data)
                    }
                });
            },
            bindEvt: function () {
                if (typeof ZeroClipboard === "undefined") {
                    $.getScript("http://static.hdslb.com/live-static/libs/zero-clipboard/ZeroClipboard.min.js", function () {
                        $(".btn-copy", view.$el).each(function () {
                            var btnDom = $(this)[0],
                                zero = new ZeroClipboard(btnDom);

                            zero.on("ready", function (readyEvent) {
                                zero.on("aftercopy", function (event) {
                                    liveToast(btnDom, "复制成功！" + randomEmoji.happy(), "success", false);
                                });
                            });


                        });
                    });
                }

            }
        });


        $(function () {
            view.init();
        });

        module.exports = view;
    }, {"../../../../common/functions/func-random-emoji/random-emoji": 16}],
    30: [function (require, module, exports) {
        /**
         * Created by fanfan on 2016/1/13.
         */



        var view = avalon.define({
            $id: "roomAdmin",
            isAdmin: true,
            $el: [],
            init: function () {
                var self = this;

                this.$el = $("#room-adminer");
                this.$dialog = this.$el.find(".live-info-manage-dialog");

                this.bindEvt();

                avalon.scan(this.$el[0]);
                this.$watch("showBlackDialog", function (opt) {
                    opt = opt || {};
                    if (opt.blackName) {
                        blackManageView.iptName = opt.blackName
                    }
                    self.show();
                })
            },
            show: function () {
                this.$el.addClass("open");
                this.setPosition();
            },
            clickHide: function () {
                view.$el.removeClass("open")
            },
            hide: function (e) {
                this.$el.removeClass("open")
            },
            setPosition: function () {
                var allWidth = document.documentElement.clientWidth,
                    allHeight = document.documentElement.clientHeight,
                    dialogWidth = this.$dialog.width(),
                    dialogHeight = this.$dialog.height(),
                    top,
                    left,
                    cssData;


                top = allHeight / 2 - dialogHeight / 2;
                left = allWidth / 2 - dialogWidth / 2;

                if (top < 0) {
                    top = top * 2

                }

                cssData = {
                    position: "fixed",
                    zIndex: 1100,
                    left: left,
                    top: top
                }

                this.$dialog.css(cssData)
            },
            bindEvt: function () {
                var resizeTid = 0,
                    self = this;

                $(window).resize(function () {
                    if (resizeTid) {
                        clearTimeout(resizeTid);
                    }

                    resizeTid = setTimeout(function () {
                        if (self.$el.hasClass("open")) {
                            self.setPosition();
                        }
                    }, 50);
                });
            }

        });


        view.init();

        var blackManageView = require("./black-manage.js")({
            $el: $("[data-content='blackManage']", $("#room-adminer"))
        });

        module.exports = function () {
            return view;
        }
    }, {"./black-manage.js": 27}],
    31: [function (require, module, exports) {
        /**
         * Created by fanfan on 2016/1/11.
         */


        var view = avalon.define({
            $id: "roomInfoEdit",
            $el: "#room-info-edit",
            $dialog: ".room-info-edit-dialog",
            $mask: [],
            defData: {},                // 默认数据
            nowData: {},
            curBgTarget: "default",     // 背景 Tab: default custom
            bgListData: [],             // 房间背景图数据
            bgNum: 0,                   // 还可以上传的背景数
            allowUploadBgTime: 0,       // 下一次允许上传背景图片的时间
            allowUpdateAreaTime: 0,     // 下一次允许更改分区的时间
            maxNameCount: 20,
            nameCount: 0,
            tipMsg: "",                  // 提示信息
            nowArea: "",                // 当前分区名称
            nowAreaID: "",              // 当前分区id
            maxTag: 6,                  // 最大标签数量
            tag: [],                    // 当前标签
            recTag: [],                 // 当前分区推荐的标签
            addTagName: "",             // 新增标签名称
            area: "",
            des: "",
            roomName: "",               // 房间名称
            defTagAddTip: "",
            partListShow: false,        // 选区是否打开
            init: function () {
                var self = this;

                this.$el = $(this.$el);
                this.$dialog = this.$el.find(this.$dialog);

                this.defData = this.getDefData();

                this.roomName = this.defData.roomName;
                this.des = this.defData.des;
                this.nowArea = this.defData.nowArea;
                this.nowAreaID = this.defData.nowAreaID;
                this.tag = this.defData.tag;
                this.recTag = this.defData.recTag;
                this.nameCount = this.getNameCount(this.roomName);

                avalon.scan(view.$el[0], view);

                this.bindEvt();
                this.setWatch();

            },
            setWatch: function () {
                var self = this;

                this.$watch("showRoomEditDialog", function (e) {
                    self.show();
                });
            },
            getDefData: function () {
                var defData,
                    tags = $(".tag-box").attr("tags"),
                    recTag = $("[recommendTags]").attr("recommendTags");


                defData = {
                    roomName: $(".ipt-room-name").val(),
                    des: $("#dis-redactor-contenet").val(),
                    nowArea: $(".part-name").text(),
                    nowAreaID: $(".part-name").data("value"),
                    tag: tags ? tags.split(",") : [],
                    recTag: recTag ? recTag.split(",") : []
                };

                return defData;
            },
            setText: function () {
                $('#dis-redactor-contenet').redactor({
                    lang: 'zh_cn',
                    minHeight: 125,
                    autoresize: false,
                    buttons: ['html', 'formatting', 'bold', 'italic', 'deleted',
                        'unorderedlist', 'orderedlist', 'outdent', 'indent',
                        'file', 'table', 'link', 'fontcolor', 'backcolor', 'alignment', 'horizontalrule'
                    ]
                });
            },
            keyupRoomName: function (e) {
                var $text = $(e.target),
                    len = view.getNameCount($text.val()),
                    newText = "";


                if (len > view.maxNameCount) {
                    len = 20;
                    view.roomName = newText = view.subStringC(view.roomName, view.maxNameCount * 2);
                    $text.val(newText);
                    e.preventDefault();
                }

                view.nameCount = len;
            },
            getNameCount: function (text) {
                var len = Math.ceil(text.replace(/[^\x00-\xff]/g, '__').length / 2);

                return len;
            },
            subStringC: function (text, subLen) {
                var subIrr = 0,
                    subIndex,
                    i = 0;

                for (i; i < text.length; i++) {
                    if (/[^\x00-\xff]/.test(text[i])) {
                        subIrr = subIrr + 2
                    } else {
                        subIrr = subIrr + 1
                    }

                    if (subIrr > subLen) {
                        subIndex = i - 1;
                        break;
                    } else if (subIrr === subLen) {
                        subIndex = i;
                    }
                }

                return text.substring(0, subIndex + 1);
            },
            show: function () {
                var self = this;
                // 打开窗口初始化数据
                self.getMasterInfo(function (result) {
                    if (result.code == 0) {
                        self.$el.addClass("open");
                        self.setPosition();
                    }
                });
            },
            checkTag: function (tagName) {
                if (view.tag.length >= view.maxTag) {
                    view.tipMsg = "您当前等级最多能填写 " + view.maxTag + " 个标签"
                    return false;
                }

                if ($.inArray(tagName, view.tag) > -1) {
                    view.tipMsg = "不能填写重复标签哦"
                    return false;
                }

                if (!tagName) {
                    view.tipMsg = "请输入标签"
                    return false;
                }

                return true;
            },
            keyupInput: function (e) {
                var tag;

                if (e.keyCode === 13) {
                    tag = $.trim(view.addTagName);

                    if (view.checkTag(tag)) {
                        view.tag.push(view.addTagName);
                        view.addTagName = "";
                    }

                }
            },


            /**
             * 点击添加推荐标签
             * */
            clickRecTag: function (e) {
                var $tag = $(e.target),
                    tagName = $.trim($tag.text()),
                    index = $tag.index();

                if (view.checkTag(tagName)) {
                    view.tag.push(tagName);
                    view.recTag.splice(index, 1)
                }
            },
            clickDelTag: function (e) {
                var $tag = $(e.target),
                    index = $tag.index();

                view.tag.splice(index, 1);
                view.tipMsg = ""

            },
            clickHide: function () {
                view.hide();
            },
            clickCancel: function () {
                view.hide();
            },
            hide: function () {
                var self = this;

                this.$el.removeClass("open");
            },
            setPosition: function () {
                var allWidth = document.documentElement.clientWidth,
                    allHeight = document.documentElement.clientHeight,
                    dialogWidth = this.$dialog.width(),
                    dialogHeight = this.$dialog.height(),
                    top,
                    left,
                    cssData;


                top = allHeight / 2 - dialogHeight / 2;
                left = allWidth / 2 - dialogWidth / 2;

                if (top < 0) {
                    top = top * 2

                }

                cssData = {
                    position: "fixed",
                    zIndex: 99,
                    left: left,
                    top: top
                }

                this.$dialog.css(cssData)
            },
            bindEvt: function () {
                var resizeTid = 0,
                    self = this;

                $(window).resize(function () {
                    if (resizeTid) {
                        clearTimeout(resizeTid);
                    }

                    resizeTid = setTimeout(function () {
                        if (self.$el.hasClass("open")) {
                            self.setPosition();
                        }
                    }, 50);
                });
            },
            clickPartHandle: function (e) {
                if (view.allowUpdateAreaTime != 0) {
                    liveToast($(e.target), "此功能被禁，" + view.allowUpdateAreaTime + " 解封", "info", true);
                } else {
                    view.partListShow = !view.partListShow;
                }
            },

            /**
             * 根据分区获取相关tag
             * */
            getRecTag: function (areaID) {
                var url = "/liveact/ajaxGetAreaTags";

                $.ajax({
                    type: "get",
                    data: {
                        area: areaID
                    },
                    url: url,
                    dataType: "json",
                    success: function (data) {
                        view.recTag = data.data;
                    }
                });
            },
            clickPartItem: function (e) {
                var $e = $(e.target),
                    id = $e.data("value"),
                    text = $e.text();

                view.nowArea = text;
                view.nowAreaID = id;

                view.getRecTag(id);

                view.partListShow = false;
            },
            setData: function (param) {
                $.ajax({
                    type: "post",
                    url: "/liveact/edit_room",
                    data: param,
                    dataType: "json",
                    success: function (data) {

                        if (data.code === 0) {
                            liveToast(view.$el.find(".btn-ok")[0], "信息修改成功", "success", true);

                            location.reload();
                        } else {
                            view.tipMsg = data.msg;
                        }
                    }

                });
            },

            /**
             * 房间背景相关
             */

            // 获取房间背景信息
            getBgList: function (callback) {
                this.$el = $(this.$el);
                $.ajax({
                    type: "GET",
                    data: {
                        roomid: window.ROOMID
                    },
                    url: "/live/getMasterInfo",
                    dataType: "JSON",
                    cache: false,
                    success: function (result) {
                        if (result.code == 0) {
                            view.bgNum = result.data.bgNum;
                            view.allowUploadBgTime = result.data.allowUploadBgTime;
                            view.bgListData = result.data.bgList;  // 刷新背景图片列表数据
                            avalon.scan(view.$el.find(".cover-list")[0], view);  // Scan 视图节点
                        }
                        callback && callback(result);
                    }
                });
            },

            // 设置背景
            setBg: function (event, picId, callback) {
                $.ajax({
                    type: "POST",
                    data: {
                        roomid: window.ROOMID,
                        type: "bg",
                        pic_id: picId
                    },
                    url: "/liveact/changePic",
                    dataType: "JSON",
                    success: function (result) {
                        if (result.code == 0) {
                            liveToast($(event.target), "背景切换成功", "success", true);
                            view.getBgList();
                        } else {
                            liveToast($(event.target), result.msg, "info", true);
                        }
                    }
                });
            },

            // 设置默认背景
            setDefBg: function (event, bkId, callback) {
                $.ajax({
                    type: "POST",
                    data: {
                        roomid: window.ROOMID,
                        bg_id: bkId
                    },
                    url: "/liveact/change_bg",
                    dataType: "JSON",
                    success: function (result) {
                        if (result.code == 0) {
                            liveToast($(event.target), "背景切换成功", "success", true);
                            $(".default-cover-list .cover-item").removeClass("current").addClass("operable");
                            $(".default-cover-list .id-" + bkId).removeClass("operable").addClass("current");
                        } else {
                            liveToast($(event.target), result.msg, "info", true);
                        }
                    }
                });
            },

            // 删除背景图片
            delBg: function (event, picId, callback) {
                livePopup({
                    title: "确定吗~",
                    html: '<p>确定要删除图片吗？</p>',
                    type: "action",
                    width: "350",
                    button: {
                        confirm: "确定",
                        cancel: "取消"
                    },
                    onConfirm: function () {
                        var self = this;
                        $.ajax({
                            type: "POST",
                            data: {
                                roomid: window.ROOMID,
                                type: "bg",
                                pic_id: picId
                            },
                            url: "/liveact/deletePic",
                            dataType: "JSON",
                            success: function (result) {
                                if (result.code == 0) {
                                    view.getBgList();
                                    self.done();
                                } else {
                                    liveToast($(event.target), result.msg, "info", true);
                                }
                            }
                        });
                    }
                });

            },

            // 选择上传背景图片
            uploadClick: function (event, bgNum) {
                if (view.allowUploadBgTime != 0) {
                    liveToast($(event.target), "╮(￣⊿￣)╭，下次可上传时间为：" + view.allowUploadBgTime, "info", true);
                    return;
                } else if (bgNum <= 0) {
                    liveToast($(event.target), "当前您的等级不够，请加油升级哦", "info", true);
                } else {
                    $("#bg-img-input").click();
                }
            },

            // 上传背景图片
            uploadBgImg: function () {
                var $bgImgInput = $("#bg-img-input");
                if ($bgImgInput[0].files[0].size > 4096000) {
                    liveToast($("#bg-upload-icon"), "文件大小不能超过500K", "info", true);
                    return;
                }
                $("#bgFormFile").submit();
            },

            // 背景 Tab 切换　
            clickTab: function (e) {
                var $tab = $(e.target),
                    target = $tab.data("target");

                // 切换到自定义背景 Tab 时请求数据　
                if (target == "custom") {
                    view.getMasterInfo();
                }

                if (target !== view.curBgTarget) {
                    view.curBgTarget = target;
                }
            },

            /**
             * 获取房间基本信息
             */

            getMasterInfo: function (callback) {
                $.ajax({
                    type: "GET",
                    data: {
                        roomid: window.ROOMID
                    },
                    url: "/live/getMasterInfo",
                    dataType: "JSON",
                    cache: false,
                    success: function (result) {
                        if (result.code == 0) {
                            view.bgNum = result.data.bgNum;
                            view.allowUpdateAreaTime = result.data.allowUpdateAreaTime;
                            view.allowUploadBgTime = result.data.allowUploadBgTime;
                            view.maxTag = result.data.tagsNum;
                            view.bgListData = result.data.bgList;  // 刷新背景图片列表数据
                            avalon.scan(view.$el.find(".cover-list")[0], view);  // Scan 视图节点
                        }
                        callback && callback(result);
                    }
                });
            },

            /**
             * 提交数据
             */
            clickSubmit: function () {
                if (view.getNameCount(view.roomName) > view.maxNameCount) {

                }

                if (!view.roomName) {
                    view.tipMsg = "请填写房间名称！";
                    return;
                }

                if (view.nowAreaID == -1) {
                    view.tipMsg = "请选择分区！";
                    return;
                }
                var param = view.getAllData();

                view.setData(param);
            },
            getAllData: function () {
                var self = this,
                    tagStr;

                tagStr = this.tag.join(",");


                return {
                    tags: tagStr,
                    title: self.roomName,
                    description: self.des,
                    roomid: window.ROOMID,
                    area: self.nowAreaID
                }
            }
        });

// 加载富文本插件
        (function () {
            var staticUrl = "http://static.hdslb.com/live-static";

            $.getScript(staticUrl + "/libs/redactor/redactor-8.2.4.js", function () {
                $.getScript(staticUrl + "/libs/redactor/redactor-8.2.4.zh_cn.js", function () {
                    view.setText();
                });
            });

            $("body").append('<link rel="stylesheet" href="http://static.hdslb.com/css/redactor-8.2.4.css">');

            // Upload Success
            window.roomBgUploadSuccess = function (data) {
                var data = JSON.parse(data);
                if (data.code == 0) { // Success
                    view.getBgList();
                } else { // Error
                    liveToast($("#bg-upload-icon"), data.msg, "info", true);
                }
            };
        })();


        $(function () {
            view.init();
        });

        module.exports = function () {
            return view;
        };
    }, {}],
    32: [function (require, module, exports) {
        /**
         * 调用房间管理/信息修改/黑名单设置模块
         * @author fanfan
         *
         * */

        module.exports = function (userInfo) {

            if (userInfo.ISANCHOR) {
                require("./javascripts/live-info-manage.js");       // 房间管理
                require("./javascripts/room-info-edit.js");         // 信息修改
            }

            if (userInfo.ISADMIN == 1 && userInfo.ISANCHOR != 1) {
                require("./javascripts/room-admin.js");             // 房管的黑名单设置
            }

        };
    }, {
        "./javascripts/live-info-manage.js": 28,
        "./javascripts/room-admin.js": 30,
        "./javascripts/room-info-edit.js": 31
    }],
    33: [function (require, module, exports) {
        /*
         *  Background Changer by LancerComet at 14:36, 2016/01/18.
         *  # Carry Your World #
         *  ---
         *
         *  描述:
         *  ---
         *  房间背景切换节点.
         *  本模块不使用 Avalon.
         *
         */

        var liveToast = require('../../../../../common/components/live-widget/live-toast/live-toast');
        var randomEmoji = require('../../../../../common/functions/func-random-emoji/random-emoji');

        module.exports = function (window) {

            if (!window.ISANCHOR) {
                $("#bk-changers").remove();
                return;
            }

            $(function () {
                // Action: 添加事件绑定.
                $("#bk-changers").show().on("click", ".changer", function (event) {
                    var $this = $(this);
                    var bkId = $this.attr("data-bk-id");

                    // 向服务器发送请求更滑背景.
                    $.ajax({
                        url: "/liveact/change_bg",
                        type: "POST",
                        data: {
                            roomid: window.ROOMID,
                            bg_id: bkId
                        },
                        dataType: "JSON",
                        success: function (result) {
                            if (result.code != 0) {
                                liveToast($this, result.msg + randomEmoji.sad(), "caution");
                                return;
                            }
                            liveToast($this, "背景更换成功！" + randomEmoji.happy(), "success");
                            $this.addClass("active").siblings(".changer").removeClass("active");
                            $this = bkId = null;
                        },
                        error: function (xhrObj) {
                            liveToast($this, "背景更换失败, 稍后再试试吧 " + randomEmoji.sad(), "caution");
                        }
                    });

                });
            });


        };
    }, {
        "../../../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../../../common/functions/func-random-emoji/random-emoji": 16
    }],
    34: [function (require, module, exports) {
        /*
         *  Chat Controller Panel By LancerComet at 11:11, 2015/12/25.
         *  # Carry Your World #
         *  ---
         *  聊天控制区域模块.
         */

        var lazyInit = require('../../../../../common/functions/func-avalon-lazy-init/lazy-init');
        var liveQuickLogin = require('../../../../../common/functions/func-live-quick-login/live-quick-login');
        var liveToast = require('../../../../../common/components/live-widget/live-toast/live-toast');
        var randomEmoji = require('../../../../../common/functions/func-random-emoji/random-emoji');

        module.exports = function () {
            "use strict";

            // Definition: 弹幕颜色对象定义. 此变量数据供 Flash 使用.
            var danmuColor = 0xffffff;

            avalon.ready(function () {

                // Definition: 聊天区域控制面板控制器.
                var chatCtrlPanelCtrl = avalon.define({
                    $id: "chatCtrlPanelCtrl",

                    // 弹幕滚动锁定标识.
                    chatScrollLocked: false,

                    // 弹幕发送部分.
                    danmuSend: {
                        placeholder: "请输入弹幕DA☆ZE～",
                        data: "",
                        maxLength: 20,
                        inputEvent: function (event) {
                            event.preventDefault();
                            var element = event.target || event.srcElement;
                            var inputContent = $(element).text();
                            if (inputContent.length > chatCtrlPanelCtrl.danmuSend.maxLength) {
                                $(element).text(chatCtrlPanelCtrl.danmuSend.data);
                                return;
                            }
                            chatCtrlPanelCtrl.danmuSend.data = inputContent;// 数据同步.
                            event.keyCode === 13 && chatCtrlPanelCtrl.danmuSend.send(event);  // 回车发送弹幕.
                        },
                        emptyInput: function () {
                            var $danmuTextbox = $("#danmu-textbox");
                            if ($danmuTextbox.text() === chatCtrlPanelCtrl.danmuSend.placeholder) {
                                chatCtrlPanelCtrl.danmuSend.data = "";
                                $danmuTextbox.empty();
                            }
                        },
                        restoreInput: function () {
                            chatCtrlPanelCtrl.danmuSend.data.length < 1 && $("#danmu-textbox").text(chatCtrlPanelCtrl.danmuSend.placeholder);
                        },
                        send: function (event) {
                            chatCtrlPanelCtrl.$fire("sendDanmu", event.target || event.srcElement);
                        }
                    },

                    // 节点控制标识对象.
                    doms: {
                        emojiPanel: false,
                        danmuColor: false
                    },

                    // 聊天控制按钮.
                    danmuCtrl: {
                        emoji: function () {
                            chatCtrlPanelCtrl.doms.emojiPanel = true;
                            setTimeout(function () {
                                $(window).on("click", closeEmojiPanel);
                            }, 1)
                        },

                        hotWords: function () {

                        },

                        color: function () {
                            chatCtrlPanelCtrl.doms.danmuColor = !chatCtrlPanelCtrl.doms.danmuColor;
                            setTimeout(function () {
                                $(window).on("click", closeDanmuColorPanel);
                            }, 1);
                        },

                        empty: function (event) {
                            liveToast(event.target || event.srcElement, "清屏成功 " + randomEmoji.helpless(), "success");
                            chatCtrlPanelCtrl.$fire("all!chatListEmpty", event);
                        },

                        lock: function () {
                            chatCtrlPanelCtrl.chatScrollLocked = !chatCtrlPanelCtrl.chatScrollLocked;
                            chatCtrlPanelCtrl.$fire("all!lockChatList", chatCtrlPanelCtrl.chatScrollLocked);
                        }
                    }

                });

                // Definition: 发送弹幕事件.
                chatCtrlPanelCtrl.$watch("sendDanmu", function (element) {

                    // 快速登录.
                    liveQuickLogin();

                    // Error Handler.
                    if (!chatCtrlPanelCtrl.danmuSend.data) {
                        liveToast(element, "请输入弹幕后再发送~ " + randomEmoji.helpless());
                        return;
                    }

                    // 向 Flash 发送弹幕.
                    $("#player_object")[0].sendMsg(chatCtrlPanelCtrl.danmuSend.data, danmuColor);

                    // 还原弹幕框.
                    chatCtrlPanelCtrl.danmuSend.data = "";
                    $("#danmu-textbox").empty();

                });

                // Definition: 填充弹幕框事件.
                chatCtrlPanelCtrl.$watch("fillDanmu", function (value) {
                    syncDanmuData(value);
                });

                // Action: 初始化控制器.
                lazyInit(document.getElementById("chat-ctrl-panel"), chatCtrlPanelCtrl, function () {

                    // Action: 颜文字面板委托事件.
                    $(".emoji-panel").on("click", "a", function () {
                        var danmuData = chatCtrlPanelCtrl.danmuSend.data + $(this).text();
                        danmuData = danmuData.substr(0, chatCtrlPanelCtrl.danmuSend.maxLength);
                        syncDanmuData(danmuData);
                        closeEmojiPanel();
                    });

                    // 如果是 VIP 则赋值默认颜色.
                    if (parseInt(VIP, 10) === 1) {
                        var $vipDefault = $(".danmu-color-block[data-default=true]");
                        danmuColor = $vipDefault.attr("data-color");
                        setTimeout(function () {
                            $vipDefault.click();
                        }, 1);
                    }

                    // Action: 弹幕颜色选择委托事件.
                    $(".danmu-color-panel .danmu-color-block").on("click", function (event) {
                        liveQuickLogin();

                        // 判断弹幕颜色与账号 VIP 是否匹配.
                        if ($(this).attr("data-vip").toString() === "true" && parseInt(VIP, 10) !== 1) {
                            liveToast($(this)[0], "彩色弹幕仅限老爷使用哦~ " + randomEmoji.helpless());
                            return;
                        }

                        $(this).addClass("active").siblings(".danmu-color-block").removeClass("active");
                        danmuColor = $(this).attr("data-color");
                        closeDanmuColorPanel(event);
                    });

                });


                /* Definition goes below. */

                // Definition: 关闭颜文字面板方法.
                function closeEmojiPanel(event) {
                    var target = event && (event.target || event.srcElement);
                    if (target && target.className.indexOf("emoji-panel") > -1) {
                        return;
                    }
                    $(".emoji-panel").fadeOut(200, function () {
                        chatCtrlPanelCtrl.doms.emojiPanel = false;
                        $(window).off("click", closeEmojiPanel);
                    });
                }

                // Definition: 关闭弹幕颜色面板方法.
                function closeDanmuColorPanel(event) {
                    if (event) {
                        var target = event.target || event.srcElement;
                        if (target.className.indexOf("danmu-color-panel") > -1 || target.className.indexOf(".danmu-color-block") > -1) {
                            return;
                        }
                    }
                    $(".danmu-color-panel").fadeOut(200, function () {
                        chatCtrlPanelCtrl.doms.danmuColor = false;
                        $(window).off("click", closeDanmuColorPanel);
                    });
                }

                // Definitio: 同步弹幕框数据.
                function syncDanmuData(data) {
                    chatCtrlPanelCtrl.danmuSend.data = data;
                    $("#danmu-textbox").text(data);
                }

                // Definition: Flash 全屏模式获取弹幕颜色 By LancerComet at 13:59, 2015.11.16.
                // 此方法供 Flash 主动调用，无需前端手动触发.
                window.getDanmuColor = function () {
                    return danmuColor;
                };

            });

        };
    }, {
        "../../../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../../../common/functions/func-avalon-lazy-init/lazy-init": 9,
        "../../../../../common/functions/func-live-quick-login/live-quick-login": 14,
        "../../../../../common/functions/func-random-emoji/random-emoji": 16
    }],
    35: [function (require, module, exports) {
        /*
         *  房间聊天区账号操作区域 at 18:22, 2015/12/24.
         *  ---
         *
         *  描述:
         *  ---
         *  包括: 老爷 粉丝勋章 头衔
         *
         */

        module.exports = function () {
            require('./javascripts/profile-ctrl.js')();  // 帐号操作控制器定义.
        };
    }, {"./javascripts/profile-ctrl.js": 37}],
    36: [function (require, module, exports) {
        /*
         *  Fans Medal at 14:39, 2015/12/28.
         *  ---
         *  粉丝勋章相关逻辑
         */
        var liveQuickLogin = require('../../../../../../../common/functions/func-live-quick-login/live-quick-login')

        module.exports = function (profileCtrlVM) {
            "use strict";

            var fansMedal = {
                // 请求锁: 如果为 true 则不能发佩戴请求
                locked: false,
                // 获取当前佩戴的粉丝勋章信息
                ajaxGetMyWearMedal: function () {
                    $.ajax({
                        url: "/i/ajaxGetMyWearMedal",
                        type: "get",
                        dataType: "json",
                        cache: false,
                        success: function (result) {
                            if (result.code == 0) { // 成功获取当前佩戴的粉丝勋章信息
                                profileCtrlVM.fansMedal.isWear = result.data.isWear;
                                profileCtrlVM.fansMedal.myWearMedal = result.data;
                                var width = (result.data.intimacy / result.data.next_intimacy * 100) + "%";
                                $(".medal-intimacy-progress .medal-progerss-bar").width(width);
                                profileCtrlVM.fansMedal.dataReady = true;
                            }
                        }
                    });
                },

                // 获取拥有的粉丝勋章 list
                ajaxGetMyMedalList: function (callback) {
                    $.ajax({
                        url: "/i/ajaxGetMyMedalList",
                        type: "get",
                        dataType: "json",
                        cache: false,
                        success: function (result) {
                            if (result.code == 0) { // 成功获取拥有的粉丝勋章 list
                                profileCtrlVM.fansMedal.myMedalList = result.data;
                            }
                            callback && callback();
                        }
                    });
                },

                // 佩戴粉丝勋章
                wearFansMedal: function (medalId, callback) {
                    // 防止连续点击的多次请求
                    if (fansMedal.locked) {
                        return;
                    }
                    fansMedal.locked = true;
                    $.ajax({
                        url: "/i/ajaxWearFansMedal",
                        type: "post",
                        data: {
                            medal_id: medalId
                        },
                        dataType: "json",
                        success: function (result) {
                            fansMedal.locked = false;
                            if (result.code == 0) {
                                profileCtrlVM.fansMedal.isWear = 1;
                                // 佩戴勋章成功 刷新变量
                                MEDAL.level = result.data.level;
                                MEDAL.medal_name = result.data.medal_name;
                                MEDAL.anchorName = result.data.anchorName;
                                MEDAL.roomid = result.data.roomid;
                            }
                            callback && callback();
                        }
                    });
                },

                // 取消佩戴粉丝勋章
                cancelFansMedal: function () {
                    $.ajax({
                        url: "/i/ajaxCancelWear",
                        type: "get",
                        dataType: "json",
                        success: function (result) {
                            if (result.code == 0) {
                                profileCtrlVM.fansMedal.isWear = 0;
                            }
                        }
                    });
                }


            };

            // 佩戴粉丝勋章
            profileCtrlVM.fansMedal.wearFansMedal = function (medalId) {
                fansMedal.wearFansMedal(medalId, function () {
                    fansMedal.ajaxGetMyWearMedal();
                });
            };

            // 取消粉丝勋章
            profileCtrlVM.fansMedal.cancelFansMedal = function () {
                fansMedal.cancelFansMedal();
                profileCtrlVM.fansMedal.myWearMedal.medal_id = -1;
            };

            // 切换粉丝勋章 Tip box 面板
            profileCtrlVM.fansMedal.toggleTipbox = function () {
                liveQuickLogin();
                profileCtrlVM.fansMedal.visible = !profileCtrlVM.fansMedal.visible;
                if (profileCtrlVM.fansMedal.visible) {
                    fansMedal.ajaxGetMyWearMedal();
                    setTimeout(function () {
                        $(document).on("click", closeMedalPanel);
                    }, 1);
                }
            };

            // 切换勋章选择面板
            profileCtrlVM.fansMedal.choosePanelToggle = function () {
                if (!profileCtrlVM.fansMedal.choosePanelVisible) {
                    fansMedal.ajaxGetMyMedalList(function () {
                        profileCtrlVM.fansMedal.choosePanelVisible = true;
                    });
                } else {
                    profileCtrlVM.fansMedal.choosePanelVisible = false;
                }
            };

            // 监听获得新粉丝勋章
            profileCtrlVM.$watch("newFansMedalNotice", function (medalData) {

                /*
                 *  @ medalData: {
                 *    medalId: Number,
                 *    medalName: String,
                 *    medalLevel: String
                 *  }
                 */

                profileCtrlVM.fansMedal.newFansMedal.medalId = medalData.medalId;
                profileCtrlVM.fansMedal.newFansMedal.medalName = medalData.medalName;
                profileCtrlVM.fansMedal.newFansMedal.medalLevel = medalData.medalLevel;
                profileCtrlVM.fansMedal.newFansMedal.show = true;

            });

            profileCtrlVM.fansMedal.closeNewFansMedalNotice = function () {
                profileCtrlVM.fansMedal.newFansMedal.show = false;
            };

            profileCtrlVM.fansMedal.newFansMedalWearNow = function (medalId) {
                fansMedal.wearFansMedal(medalId, function () {
                    profileCtrlVM.fansMedal.newFansMedal.show = false;
                });
            };

            // 关闭粉丝勋章面板
            function closeMedalPanel() {
                $(".fans-medal-tips-box").fadeOut(200, function () {
                    profileCtrlVM.fansMedal.visible = false;
                    profileCtrlVM.fansMedal.choosePanelVisible = false;
                    $(document).off("click", closeMedalPanel);
                });
            }

        };
    }, {"../../../../../../../common/functions/func-live-quick-login/live-quick-login": 14}],
    37: [function (require, module, exports) {
        /*
         *  Profile Ctrl at 14:26, 2015/12/28.
         *  ---
         *  聊天 Profile 控制区域模块.
         */

        var lazyInit = require("../../../../../../../common/functions/func-avalon-lazy-init/lazy-init");
        var liveQuickLogin = require('../../../../../../../common/functions/func-live-quick-login/live-quick-login');
        module.exports = function () {
            "use strict";

            avalon.ready(function () {
                var profileCtrlVM = avalon.define({
                    $id: "profileCtrl",
                    fansMedal: {
                        visible: false,
                        choosePanelVisible: false,
                        dataReady: false,
                        isWear: 0,
                        myWearMedal: {
                            progressWidth: "0%"
                        },
                        newFansMedal: {
                            show: false,
                            medalId: 0,
                            medalName: "",
                            medalLevel: ""
                        },
                        myMedalList: []
                    },
                    title: {
                        visible: false,
                        choosePanelVisible: false,
                        dataReady: false,
                        isWear: 0,
                        myWearTitle: {
                            titleName: ""
                        },
                        newTitle: {
                            show: false,
                            titleName: ""
                        },
                        myTitleList: []
                    },
                    vip: {
                        toVip: function () {
                            liveQuickLogin();
                            window.open('http://live.bilibili.com/i#to-vip', '_blank');
                        }
                    },
                    stopPropagation: function (event) {
                        event.stopPropagation();
                    }
                });


                lazyInit(document.getElementById("profile-ctrl"), profileCtrlVM, function () {
                    // 粉丝勋章
                    require("./fans-medal")(profileCtrlVM);

                    // 头衔
                    require("./title")(profileCtrlVM);
                });

            });

        };
    }, {
        "../../../../../../../common/functions/func-avalon-lazy-init/lazy-init": 9,
        "../../../../../../../common/functions/func-live-quick-login/live-quick-login": 14,
        "./fans-medal": 36,
        "./title": 38
    }],
    38: [function (require, module, exports) {
        /*
         *  Title at 17:10, 2016/01/12.
         *  ---
         *  头衔相关逻辑
         */
        var liveQuickLogin = require('../../../../../../../common/functions/func-live-quick-login/live-quick-login');

        module.exports = function (profileCtrlVM) {
            "use strict";

            var title = {
                // 请求锁: 如果为 true 则不能发佩戴请求
                locked: false,

                // 获取当前佩戴的头衔信息
                ajaxGetMyWearTitle: function () {
                    $.ajax({
                        url: "/i/ajaxGetMyWearTitle",
                        type: "get",
                        dataType: "json",
                        success: function (result) {
                            if (result.code == 0) { // 成功获取当前佩戴的头衔信息
                                if (result.data.title) {  // 有佩戴头衔
                                    profileCtrlVM.title.isWear = 1;
                                } else {  // 没有佩戴头衔
                                    profileCtrlVM.title.isWear = 0;
                                }
                                profileCtrlVM.title.myWearTitle = result.data;
                                profileCtrlVM.title.dataReady = true;
                            }
                        }
                    });
                },

                // 获取头衔 List
                ajaxGetMyTitleList: function (callback) {
                    $.ajax({
                        url: "/i/ajaxGetMyTitleList",
                        type: "get",
                        dataType: "json",
                        success: function (result) {
                            if (result.code == 0) { // 成功获取头衔 list
                                profileCtrlVM.title.myTitleList = result.data;
                            }
                            callback && callback();
                        }
                    });
                },

                // 佩戴头衔
                ajaxWearTitle: function (titleName, callback) {
                    // 防止连续点击的多次请求
                    if (title.locked) {
                        return;
                    }
                    title.locked = true;
                    $.ajax({
                        url: "/i/ajaxWearTitle",
                        type: "post",
                        data: {
                            title: titleName
                        },
                        dataType: "json",
                        success: function (result) {
                            title.locked = false;
                            if (result.code == 0) {
                                profileCtrlVM.title.isWear = 1;
                                // 佩戴头衔成功 刷新变量
                                TITLE.title = titleName;
                            }
                            callback && callback();
                        }
                    });
                },

                // 取消佩戴头衔
                ajaxCancelWearTitle: function (callback) {
                    $.ajax({
                        url: "/i/ajaxCancelWearTitle",
                        type: "post",
                        dataType: "json",
                        success: function (result) {
                            if (result.code == 0) {
                                profileCtrlVM.title.isWear = 0;
                            }
                            callback && callback(result);
                        }
                    });
                }
            };

            // 佩戴头衔
            profileCtrlVM.title.wearTitle = function (titleName) {
                title.ajaxWearTitle(titleName, function () {
                    title.ajaxGetMyWearTitle();
                });
            };

            // 取消佩戴头衔
            profileCtrlVM.title.cancelTitle = function () {
                title.ajaxCancelWearTitle();
            };

            // 切换头衔 Tip box 面板
            profileCtrlVM.title.toggleTipbox = function () {
                liveQuickLogin();
                profileCtrlVM.title.visible = !profileCtrlVM.title.visible;
                if (profileCtrlVM.title.visible) {
                    title.ajaxGetMyWearTitle();
                    setTimeout(function () {
                        $(document).on("click", closeTitlePanel);
                    }, 1);
                }
            };

            // 切换头衔选择面板
            profileCtrlVM.title.choosePanelToggle = function () {
                if (!profileCtrlVM.title.choosePanelVisible) {
                    title.ajaxGetMyTitleList(function () {
                        profileCtrlVM.title.choosePanelVisible = true;
                    });
                } else {
                    profileCtrlVM.title.choosePanelVisible = false;
                }
            };

            // 监听获得新头衔
            profileCtrlVM.$watch("newTitleNotice", function (titleName) {
                console.log(titleName);
                profileCtrlVM.title.newTitle.titleName = titleName;
                profileCtrlVM.title.newTitle.show = true;
            });

            profileCtrlVM.title.closeNewTitleNotice = function () {
                profileCtrlVM.title.newTitle.show = false;
            };

            profileCtrlVM.title.newTitleWearNow = function (titleName) {
                title.ajaxWearTitle(titleName, function () {
                    profileCtrlVM.title.newTitle.show = false;
                });
            };

            // 关闭头衔面板
            function closeTitlePanel() {
                $(".title-tips-box").fadeOut(200, function () {
                    profileCtrlVM.title.visible = false;
                    profileCtrlVM.title.choosePanelVisible = false;
                    $(document).off("click", closeTitlePanel);
                });
            }

        };
    }, {"../../../../../../../common/functions/func-live-quick-login/live-quick-login": 14}],
    39: [function (require, module, exports) {
        /*
         *  Chat Controller Panel By LancerComet at 17:40, 2016/01/01.
         *  # Carry Your World #
         *  ---
         *  聊天弹幕控制器.
         */
        var getAbsPosition = require('../../../../../common/functions/func-get-abs-position/get-abs-position');
        var liveQuickLogin = require('../../../../../common/functions/func-live-quick-login/live-quick-login');
        var liveToast = require('../../../../../common/components/live-widget/live-toast/live-toast');
        var lazyInit = require('../../../../../common/functions/func-avalon-lazy-init/lazy-init');
        var randomEmoji = require('../../../../../common/functions/func-random-emoji/random-emoji');

        module.exports = function () {
            "use strict";

            avalon.ready(function () {

                // Definition: 聊天区域控制器定义。
                var chatListCtrl = avalon.define({
                    $id: "chatListCtrl",

                    // 聊天区域数据存储对象.
                    data: {
                        chatList: [],  // 聊天记录数据数组.
                        clickedDanmu: {
                            uid: null,
                            msg: null,
                            reason: null
                        }
                    },

                    // 聊天区域事件定义.
                    events: {

                        // 聊天记录列表.
                        chatList: {
                            // 锁定聊天区域.
                            lockToggle: function (value) {
                                chatListCtrl.doms.chatArea.locked = value;
                                chatListCtrl.doms.chatArea.noAppending = chatListCtrl.doms.chatArea.locked;
                            }
                        },

                        // 点击弹幕事件.
                        showDanmuPopup: showDanmuPopup,

                        // 关闭弹幕点击面板.
                        hideDanmuPopup: hideDanmuPopup,

                        // 弹幕屏蔽事件.
                        forbidDanmu: forbidDanmu,

                        // 弹幕举报事件.
                        reportDanmu: {
                            setup: reportDanmu,
                            confirm: reportDanmuConfirm,
                            cancel: reportDanmuCancel
                        },

                        // 黑名单添加事件.
                        blockUser: function () {
                            if (ISADMIN != 1) {
                                return;
                            }

                            ISANCHOR == 1 ? chatListCtrl.$fire("all!showLiveManageDialog", {
                                curTarget: "blackManage",
                                blackName: chatListCtrl.doms.danmuPopup.uname
                            }) : chatListCtrl.$fire("all!showBlackDialog", {
                                blackName: chatListCtrl.doms.danmuPopup.uname
                            });

                            chatListCtrl.events.hideDanmuPopup();
                        }
                    },

                    // 聊天区域节点定义.
                    doms: {

                        // 聊天记录列表.
                        chatArea: {
                            locked: false,
                            noAppending: false
                        },

                        // 弹幕弹出面板控制.
                        danmuPopup: {
                            show: false,
                            left: 0,
                            top: 0,
                            targetUID: null,
                            uname: ""
                        },

                        // 弹幕举报面板.
                        danmuReportPanel: {
                            show: false,
                            out: false,
                            focus: false
                        }
                    }
                });

                // Definition: 控制器事件定义.
                (function eventsDefinition() {

                    // Definition: 聊天历史记录容器节点.
                    var $chatList = $("#chat-msg-list");

                    // Definition: 弹幕添加事件. 弹幕添加不使用 Avalon 是考虑到性能问题, ms-repeat 造成的性能开销太大.
                    chatListCtrl.$watch("addDanmu", function (json) {

                        console.log("Event: addDanmu");
                        console.log(json);

                        // 如果锁定了弹幕框则退出.
                        if (chatListCtrl.doms.chatArea.locked && json.info[2][0] != UID) {
                            return;
                        }

                        // 如果是自己刚发送的弹幕则退出.
                        if (json.info[2][0] == UID && json.info[0][5] == DANMU_RND) {
                            return;
                        }

                        // Action: 聊天记录大于 100 后移除第一条.
                        $chatList.children().length > 100 && $chatList.children().eq(0).remove();

                        // Definition: 聊天记录节点结构.
                        var msgHTML = '<div class="chat-msg" data-uname="' + json.info[2][1] + '" data-uid="' + json.info[2][0] + '" data-msg="' + json.info[1] + '">';

                        // Action: 添加 VIP 标识.
                        if (json.info[2][3] == 1 || (json.info[2][0] == UID && VIP == 1)) {
                            msgHTML += '<a href="/i#to-vip" target="_blank"><span class="vip-icon"><i class="live-icon vip-color v-middle"></i></span></a>';
                        }

                        // Action: 添加播主标识.
                        if ((json.info[2][2] == 1 && json.info[2][0] == MASTERID) || (json.info[2][0] == UID && ISADMIN == 1 && UID == MASTERID)) {
                            msgHTML += '<span class="square-icon master">播主</span>'
                        }

                        // Action: 添加管理员标识.
                        if ((json.info[2][2] == 1 || (json.info[2][0] == UID && ISADMIN == 1)) && json.info[2][0] != MASTERID) {
                            msgHTML += '<span class="square-icon admin">房管</span>';
                        }

                        // Action: 添加粉丝勋章.
                        if ((json.info[2][0] == UID && !$.isEmptyObject(MEDAL)) || (json.info[3] && json.info[3].length)) {
                            (json.info[3] && json.info[3].length) ? medalHTML({
                                level: json.info[3][0],
                                name: json.info[3][1],
                                roomid: json.info[3][3],
                                anchor: json.info[3][2]
                            }) : medalHTML({
                                level: MEDAL.level,
                                name: MEDAL.medal_name,
                                roomid: MEDAL.roomid,
                                anchor: MEDAL.anchorName
                            });
                        }

                        function medalHTML(data) {
                            msgHTML += '<span class="medal-icon medal-icon-lv' + data.level + '" data-medal="' + data.name + '" data-level="' + data.level + '"><div class="medal-info"><span class="content"><a href="/' + data.roomid + '" target="_blank">勋章主播：' + data.anchor + '</a></span></div></span>';
                        }

                        // Action: 设置账号头衔.（设置自己的头衔, 直接取 TITLE 中的第一个. 当用户没有选择头衔时, TITLE 中将为空数组.）
                        if (json.info[2][0] == UID && !$.isEmptyObject(TITLE)) {
                            msgHTML += '<span class="live-title-icon ' + TITLE.title + '"></span>';
                        }

                        // Action: 设置他人头衔.
                        if (msgHTML.indexOf("live-title-icon") < 0 && json.info[5] && json.info[5].length) {
                            msgHTML += '<span class="live-title-icon ' + json.info[5][0] + '"></span>';
                        }


                        // Switch: 仅个人可见消息记录.
                        if (json.info[2][0] == UID) {

                            // 添加用户等级.
                            if (!$.isEmptyObject(USER_LEVEL) && USER_LEVEL.level > 0) {
                                msgHTML += '<span class="user-level-icon lv-' + USER_LEVEL.level + '"><div class="user-level-info"><div class="content"><p>用户等级：' + USER_LEVEL.level + '</p><p>排名：' + USER_LEVEL.rank + '</p></div></div></span>'
                            }

                            // 设置账户名称.
                            msgHTML += '<span class="user-name">[自己] : </span>';

                            // 自己的消息添加类名.
                            msgHTML = msgHTML.replace('<div class="chat-msg"', '<div class="chat-msg mine"');

                        } else {
                            // Switch: 其他人聊天信息设置.

                            // 设置用户等级.
                            if ($.isArray(json.info[4]) && json.info[4].length > 0 && json.info[4][0] > 0) {
                                msgHTML += '<span class="user-level-icon lv-' + json.info[4][0] + '"><div class="user-level-info"><div class="content"><p>用户等级：' + json.info[4][0] + '</p><p>排名：' + json.info[4][1] + '</p></div></div></span>'
                            }

                            // 设置账户名称.
                            msgHTML += '<span class="user-name color">' + json.info[2][1] + ' : </span>';
                        }

                        // 添加聊天消息.
                        msgHTML += '<span class="msg-content">' + json.info[1] + '</span></div>';
                        $chatList.append(msgHTML);

                        // 滚动至底部.
                        $chatList.scrollTop($chatList[0].scrollHeight);
                    });

                    // Definition: 礼物添加事件.
                    chatListCtrl.$watch("addGift", function (json) {

                        console.log("Event: addGift");
                        console.log(json);

                        // 如果锁定了弹幕框则退出.
                        if (chatListCtrl.doms.chatArea.locked && json.data.uid != UID) {
                            json.data["super"] > 0 && chatListCtrl.$fire("superGift", json.data);
                            return;
                        }

                        // 更新房间收礼总数.
                        chatListCtrl.$fire("all!giftReceived", json.data.rcost);

                        // 更新投喂榜数据.
                        $.isArray(json.data.top_list) && json.data.top_list.length > 0 && chatListCtrl.$fire("all!updateGiftTop", json.data.top_list);

                        // 更新闪耀之星票数.
                        json.data.starRank && chatListCtrl.$fire("all!shiningStarCount", json.data.starRank);

                        // 判断礼物是否为本人送出, 如果为本人送出则退出.
                        if (window.giftTsHistory.indexOf(parseInt(json.data.timestamp, 10)) > -1 && json.data.uid == window.UID) {
                            return;
                        }

                        // 连击礼物事件.
                        json.data["super"] > 0 && chatListCtrl.$fire("superGift", json.data);

                        // 添加送礼历史.
                        chatListCtrl.$fire("addGiftHistory", json);

                    });

                    // Definition: 送礼记录 HTML 添加事件.
                    // 上方的为送礼广播事件，此事件为 HTML 的添加动作.
                    chatListCtrl.$watch("addGiftHistory", function (json) {
                        console.log("addGiftHistory");
                        console.log(json);
                        var giftHTML = '<div class="gift-msg" role="listitem">'
                            + '<span class="user-name">' + json.data.uname + '</span>'
                            + '<span class="action">' + json.data.action + json.data.giftName + '</span>'
                            + '<div class="gift-img gift-' + json.data.giftId + '" role="img"></div>'
                            + '<span class="gift-count">X ' + json.data.num + '</span>'
                            + '</div>';
                        $("#chat-msg-list").append(giftHTML);

                        // 滚动至底部.
                        $chatList.scrollTop($chatList[0].scrollHeight);

                        // Manual GC.
                        giftHTML = null;
                    });

                    // Definition: 聊天记录容器锁定事件.
                    chatListCtrl.$watch("lockChatList", function (value) {
                        chatListCtrl.events.chatList.lockToggle(value);
                    });

                    // Definition: 聊天记录清空事件.
                    chatListCtrl.$watch("chatListEmpty", function () {
                        $("#chat-msg-list").empty();
                    });

                    // Definition: 连击礼物事件.
                    // 接收的 data 为广播下发的 json.data 或送礼返回的 result.data.data 数据.
                    chatListCtrl.$watch("superGift", function (data) {
                        require("../super-gift/super-gift").exec(data);
                    });

                    // Definition: Welcome 消息事件.
                    chatListCtrl.$watch("addWelcomeMsg", function (json) {
                        if (json.data.uid == UID) {
                            return;
                        }
                        var msgHTML = '<div class="system-msg">';

                        msgHTML += '<a target="_blank" href="/i#to-vip"><i class="live-icon vip-color v-middle"></i></a>';

                        if (json.data.isadmin == 1) {
                            if (json.data.uid == window.MASTERID) {
                                msgHTML += '<span class="square-icon master">播主</span>';
                            } else {
                                msgHTML += '<span class="square-icon admin">房管</span>';
                            }
                        }

                        msgHTML += '<span class="welcome v-middle" style="color: #f25d8e">' + json.data.uname + ' 老爷</span><span class="v-middle">进入直播间</span></div>';

                        $chatList.append(msgHTML);

                        // 滚动至底部.
                        $chatList.scrollTop($chatList[0].scrollHeight);
                    });

                    // Definition: Welcome 消息事件（自己可见）.
                    chatListCtrl.$watch("addSelfWelcomeMsg", function () {
                        var msgHTML = '<div class="system-msg"><i class="live-icon vip-color v-middle"></i><span class="welcome v-middle" style="color: #f25d8e">' + UNAME + ' 老爷</span><span class="v-middle">进入直播间</span><span id="close-vip-tip-link" class="bili-link v-middle" style="color: #4fc1e9; cursor: pointer;">关闭提示</span></div>';
                        $chatList.append(msgHTML);

                        // 设置老爷关闭事件.
                        $("#close-vip-tip-link").on("click", function () {
                            var popup = livePopup({
                                title: "关闭老爷提示",
                                content: "点击确认，可以关闭自己进入直播间的提示，关闭后可在直播个人中心重新开启提示功能哦 (●′ω`●)~",
                                width: 300,
                                onConfirm: function () {
                                    $.ajax({
                                        url: "/i/ajaxSetVipViewStatus",
                                        type: "POST",
                                        data: {
                                            status: 0
                                        },
                                        timeout: 5000,
                                        dataType: "JSON",
                                        success: function (result) {
                                        },
                                        error: function (result) {
                                        }
                                    });
                                    popup.remove();
                                    popup = null;
                                },
                                onCancel: function () {
                                    popup.remove();
                                    popup = null;
                                }
                            });
                        });
                    });

                    // Definition: 系统消息事件.
                    chatListCtrl.$watch("addSysMsg", function (json) {
                        console.log("Event: addSysMsg");

                        // Definition: 聊天区域系统公告 By LancerComet at XX:XX, 2015.11.19 and continued at 15:02, 2015.11.20.
                        var contentNode = null;
                        var title = json.msg.substr(0, json.msg.indexOf("：") + 1);
                        var content = json.msg.substr(json.msg.indexOf("：") + 1, json.msg.length);

                        if (json.url.length < 1) {
                            contentNode = content;
                        } else {
                            contentNode = '<a href="' + json.url + '" target="_blank">' + content + '</a>'
                        }

                        var systemMsg = '<div class="announcement-container">' +
                            '<i class="live-icon announcement"></i>' +
                            '<div class="announcement-content">' +
                            '<p><span>' + title + "</span>" + contentNode + '</p>' +
                            '</div>' +
                            '</div>';
                        $chatList.append(systemMsg);
                        $chatList.scrollTop($chatList[0].scrollHeight);
                        contentNode = content = title = systemMsg = null;

                    });

                    // Definition: 添加踢出消息.
                    chatListCtrl.$watch("addKickoutMsg", function (json) {
                        $chatList.append('<div class="system-msg">用户 <span style="color: #aaa">' + json.uname + '</span> 已被管理员踢出房间</div>');
                    });


                })();

                // Action: Lazy Init.
                lazyInit(document.getElementById("chat-list-ctnr"), chatListCtrl, function () {
                    lazyInit($("#chat-panels")[0], chatListCtrl);
                    //fanMedalHover();
                    //userLevelHover();
                });

                // Definition: 弹幕点击面板逻辑函数.
                function showDanmuPopup(event) {
                    var target = event.target || event.srcElement;

                    // Return when cilicking other elements.
                    if (!$(target).hasClass("msg-content") && !$(target).hasClass("user-name")) {
                        chatListCtrl.doms.danmuPopup.show = false;
                        return;
                    }

                    var $parent = $(target).parent();

                    // 显示面板.
                    chatListCtrl.doms.danmuPopup.show = true;

                    // 设置面板位置.
                    var absPosition = getAbsPosition($parent[0]);
                    chatListCtrl.doms.danmuPopup.left = absPosition.left + 150;
                    chatListCtrl.doms.danmuPopup.top = $($parent[0]).position().top + 170;

                    // 设置相关数据.
                    chatListCtrl.doms.danmuPopup.targetUID = chatListCtrl.data.clickedDanmu.uid = $parent.attr("data-uid");
                    chatListCtrl.doms.danmuPopup.uname = $parent.attr("data-uname");
                    chatListCtrl.data.clickedDanmu.msg = $parent.attr("data-msg");
                    $parent = null;
                }

                // Definition: 弹幕点击面板关闭方法.
                function hideDanmuPopup() {
                    $(".chat-msg-ctrl-panel").fadeOut(200, function () {
                        chatListCtrl.doms.danmuPopup.show = false;
                    });
                }

                // Definition: 弹幕屏蔽事件.
                function forbidDanmu(event) {
                    liveQuickLogin();
                    var target = event.target || event.srcElement;
                    $.ajax({
                        url: "http://live.bilibili.com/liveact/shield_user",
                        type: 'POST',
                        data: {
                            roomid: ROOMID,
                            uid: chatListCtrl.data.clickedDanmu.uid,
                            type: 1
                        },
                        dataType: "json",
                        success: function (result) {
                            if (result.code != 0) {
                                liveToast(target, result.msg, "caution");
                                return;
                            }
                            liveToast(target, "屏蔽成功，再也见不到 TA 了~ " + randomEmoji.helpless(), "success");
                            $("#player_object")[0].addShieldUser(result.data.uid, result.data.uname);
                        },
                        error: function () {
                            liveToast(target, "网络不好，请稍后再试~ " + randomEmoji.sad(), "error");
                        }
                    });
                }

                // Definition: 弹幕举报事件.
                function reportDanmu() {
                    liveQuickLogin();
                    chatListCtrl.doms.danmuReportPanel.show = true;
                }

                // Definition: 弹幕举报请求函数定义.
                function reportDanmuConfirm(event) {
                    var target = event.target || event.srcElement;
                    if (!chatListCtrl.data.clickedDanmu.reason) {
                        liveToast(target, "请输入正确的举报原因~", true);
                        target = null;
                        return;
                    }
                    $.ajax({
                        url: "/liveact/dmreport",
                        type: "POST",
                        data: {
                            roomid: window.ROOMID,
                            uid: chatListCtrl.data.clickedDanmu.uid,
                            msg: chatListCtrl.data.clickedDanmu.msg,
                            reason: chatListCtrl.data.clickedDanmu.reason
                        },
                        dataType: "JSON",
                        success: function (result) {
                            if (result.code != 0) {
                                liveToast(target, result.msg, "caution");
                                return;
                            }
                            liveToast(target, "已成功举报，请安心等待处理！" + randomEmoji.happy(), "success");
                            reportDanmuCancel();
                        },
                        error: function (result) {
                            liveToast(target, "举报失败，网络可能不稳定，请稍后再试，非常对不起 " + randomEmoji.sad(), "error");
                        }
                    });
                }

                // Definition: 取消举报弹幕.
                function reportDanmuCancel() {
                    chatListCtrl.doms.danmuReportPanel.out = true;
                    setTimeout(function () {
                        chatListCtrl.doms.danmuReportPanel.show = false;
                        chatListCtrl.doms.danmuReportPanel.out = false;
                        chatListCtrl.doms.danmuReportPanel.focus = false;
                        chatListCtrl.data.clickedDanmu.reason = "";
                    }, 380);
                }

                // 消息列表勋章hover提示
                function fanMedalHover() {
                    $("#chat-list-ctnr").on("mouseenter", ".medal-icon", function (event) {
                        event.preventDefault();
                        var parentOffset = $(this).offset();
                        var roomMainCtnrOffset = $(".room-main-ctnr").offset();
                        var scrollLeft = $(document).scrollLeft();
                        var $nowMedalInfo = $(this).find(".medal-info");
                        $nowMedalInfo.css({
                            top: parentOffset.top - 30,
                            left: parentOffset.left - scrollLeft - roomMainCtnrOffset.left
                        });
                    });
                }

                // 消息列表用户等级hover提示
                function userLevelHover() {
                    $("#chat-list-ctnr").on("mouseenter", ".user-level-icon", function (event) {
                        event.preventDefault();
                        var parentOffset = $(this).offset();
                        var roomMainCtnrOffset = $(".room-main-ctnr").offset();
                        var scrollLeft = $(document).scrollLeft();
                        var $nowUserLevelInfo = $(this).find(".user-level-info");
                        console.log(roomMainCtnrOffset.top);
                        $nowUserLevelInfo.css({
                            top: parentOffset.top - 45,
                            left: parentOffset.left - scrollLeft - roomMainCtnrOffset.left
                        });
                    });
                }

            });

        };


    }, {
        "../../../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../../../common/functions/func-avalon-lazy-init/lazy-init": 9,
        "../../../../../common/functions/func-get-abs-position/get-abs-position": 12,
        "../../../../../common/functions/func-live-quick-login/live-quick-login": 14,
        "../../../../../common/functions/func-random-emoji/random-emoji": 16,
        "../super-gift/super-gift": 41
    }],
    40: [function (require, module, exports) {
        /*
         *  Chat Area Controller By LancerComet at 16:27, 2015/12/24.
         *  # Carry Your World #
         *  ---
         *  排行榜区域 Avalon 视图控制器定义.
         */

        var appConfig = require('../../../../../../common/app-config/app-config');
        var lazyInit = require('../../../../../../common/functions/func-avalon-lazy-init/lazy-init');

// Definition: 是否允许请求控制标识.
        var checkAllow = {
            giftTop: true,
            fansRank: true,
            admin: true,
            shiningStar: true,
            riceCake: true
        };

        module.exports = function (result, window) {
            "use strict";

            avalon.ready(function () {

                // Definition: Rank List 控制器定义.
                var rankListCtrl = avalon.define({
                    $id: "rankListCtrl",
                    chatSilent: false,  // 禁言状态.

                    // 排行榜节点对象相关数据.
                    ranklist: {
                        showRanklist: "sevenRank",  // 当前显示排行榜.
                        height: 100,
                        switchList: function (event) {
                            var target = event.target || event.srcElement;
                            rankListCtrl.ranklist.showRanklist = target.attributes["data-target"].value;
                        },
                        allowCheck: function (panel) {
                            rankListCtrl.ranklist.height = 100;  // 还原排行榜高度.
                            //checkAllow[panel] = true;
                        }
                    },

                    // 七日投喂榜.
                    giftTop: {
                        // 排行列表数据.
                        dataList: result.data.GIFT_TOP || [],

                        // 检查最新送礼排行.
                        check: function () {
                            if (!checkAllow.giftTop) {
                                expandList("giftTop");
                                return;
                            }
                            checkAllow.giftTop = false;
                            rankListCtrl.giftTop.request();
                            expandList("giftTop");
                        },

                        // 还原控制标识.
                        restore: function () {
                            rankListCtrl.ranklist.allowCheck("giftTop");
                        },

                        // 数据请求方法.
                        request: function (callback) {
                            $.ajax({
                                url: "/gift/getTop?roomid=" + window.ROOMID,
                                type: "GET",
                                dataType: "JSON",
                                success: function (result) {
                                    if (result.code != 0) {
                                        return;
                                    }
                                    rankListCtrl.giftTop.dataList = result.data;
                                    callback && typeof callback === "function" && callback();
                                },
                                error: function (result) {
                                    typeof callback === "function" && callback();
                                }
                            })
                        }
                    },

                    // 粉丝排行榜.
                    fansRank: {
                        dataList: [],

                        check: function () {
                            if (!checkAllow.fansRank) {
                                expandList("fansRank");
                                return;
                            }
                            checkAllow.fansRank = false;
                            rankListCtrl.fansRank.request();
                            expandList("fansRank");
                        },

                        restore: function () {
                            rankListCtrl.ranklist.allowCheck("fansRank");
                        },

                        request: function (callback) {
                            $.ajax({
                                url: "/liveact/ajaxGetMedalRankList",
                                type: "POST",
                                dataType: "JSON",
                                data: {
                                    roomid: window.ROOMID
                                },
                                success: function (result) {
                                    if (result.code != 0) {
                                        return;
                                    }
                                    if (result.msg != 0 && result.msg !== "") {
                                        // 播主已开通粉丝勋章.
                                        $(".rank-list.fans-rank").attr("data-hinter", "投喂一个 B 坷垃，勋章就能戴回家！ ε=ε=ε=ε=(ノ≧∇≦)ノ");
                                    }
                                    rankListCtrl.fansRank.dataList = result.data;
                                    callback && typeof callback === "function" && callback();
                                },
                                error: function (result) {
                                    typeof callback === "function" && callback();
                                }
                            })
                        }
                    },

                    // 闪耀之星排行榜.
                    shiningStar: {
                        dataList: [],

                        check: function () {
                            if (!checkAllow.shiningStar) {
                                expandList("shiningStar");
                                return;
                            }
                            checkAllow.shiningStar = false;
                            rankListCtrl.shiningStar.request();
                            expandList("shiningStar");
                        },

                        restore: function () {
                            rankListCtrl.ranklist.allowCheck("shiningStar");
                        },

                        request: function (callback) {
                            $.ajax({
                                url: "/gift/star",
                                type: "GET",
                                data: {
                                    uid: window.MASTERID,
                                    ts: Date.now()
                                },
                                dataType: "JSON",
                                success: function (result) {
                                    if (result.code == 0) {
                                        rankListCtrl.shiningStar.dataList = result.data;
                                        callback && typeof callback === "function" && callback();
                                    }

                                },
                                error: function (result) {

                                }
                            })
                        }

                    },

                    //春节年糕排行榜
                    riceCake: {
                        dataList: [],

                        request: function () {
                            $.ajax({
                                url: "/gift/cake",
                                type: "GET",
                                data: {
                                    uid: window.MASTERID,
                                    ts: Date.now()
                                },
                                dataType: "JSON",
                                success: function (result) {
                                    if (result.code == 0) {
                                        rankListCtrl.riceCake.dataList = result.data;
                                    }
                                },
                                error: function (result) {
                                    // ...
                                }
                            })
                        },

                        check: function () {
                            rankListCtrl.ranklist.height = rankListCtrl.riceCake.dataList.length * 33;  // 设置排行榜高度.
                        },

                        restore: function () {
                            rankListCtrl.ranklist.allowCheck("riceCake");
                        }
                    },

                    // 房管列表.
                    admin: {
                        dataList: [],

                        check: function () {
                            rankListCtrl.ranklist.height = rankListCtrl.admin.dataList.length * 33;  // 设置排行榜高度.
                        },

                        request: function () {
                            $.ajax({
                                url: "/liveact/ajaxGetAdminList",
                                type: "POST",
                                data: {
                                    roomid: ROOMID
                                },
                                dataType: "JSON",
                                success: function (result) {
                                    if (result.code == 0) {
                                        rankListCtrl.admin.dataList = result.data;
                                    }
                                },
                                error: function (result) {
                                    // ...
                                }
                            })
                        },

                        restore: function () {
                            rankListCtrl.ranklist.allowCheck("admin");
                        }
                    }

                });

                // Definition: 更新投喂榜数据事件.
                rankListCtrl.$watch("updateGiftTop", function (data) {
                    console.log("Event: updateGiftTop");
                    if (Object.prototype.toString.call(data) !== "[object Array]") {
                        consoleText.log(appConfig.consoleText.error + "排行榜数据不合法.");
                        return;
                    }
                    data.length > 0 ? rankListCtrl.giftTop.dataList = data : void(0);
                    data.length <= 3 ? checkAllow.giftTop = true : void(0);
                });

                // Definition: 更新闪耀之星排行榜.
                rankListCtrl.$watch("updateShiningStar", function (data) {
                    console.log("Event: updateShiningSTAR");
                    if (Object.prototype.toString.call(data) !== "[object Array]") {
                        consoleText.log(appConfig.consoleText.error + "排行榜数据不合法.");
                        return;
                    }
                    data.length > 0 ? rankListCtrl.shiningStar.dataList = [] : void(0);
                });

                //Definition: 更新春节年糕排行榜
                //rankListCtrl.$watch("updateRiceCake", function (data) {
                //    console.log("Event: updateRiceCake");
                //    if (Object.prototype.toString.call(data) !== "[object Array]") {
                //        consoleText.log(appConfig.consoleText.error + "排行榜数据不合法.");
                //        return;
                //    }
                //    data.length > 0 ? rankListCtrl.riceCake.dataList = data : void(0);
                //    data.length <= 3 ? checkAllow.riceCake = true : void(0);
                //});

                lazyInit(document.getElementById("rank-list-ctnr"), rankListCtrl);

                // Definition: 扩展列表通用方法.
                function expandList(listName) {
                    rankListCtrl.ranklist.height = rankListCtrl[listName].dataList.length * 32;
                }

            });
        };
    }, {
        "../../../../../../common/app-config/app-config": 1,
        "../../../../../../common/functions/func-avalon-lazy-init/lazy-init": 9
    }],
    41: [function (require, module, exports) {
        /*
         *  Super Gift By LancerComet at 11:52, 2016/1/11.
         *  # Carry Your World #
         *  ---
         *  连击礼物模块逻辑.
         *  移植自旧代码, 没有任何改动.
         *  此代码在 chat-list-ctnr 中被用作为 Avalon 事件.
         */


// Definition: 连击礼物相关事件对象定义.
        var superGift = {};

// Definition: 连击礼物节点的父容器节点.
        var $appendTarget = $(".super-gift-ctnr");

// Definition: 模块设置.
        superGift.settings = {
            showTime: 10000  // 连击礼物显示时间.
        };

// Definition: 连击礼物节点构造函数.
        superGift.newGift = function (superGiftInfo, hitNum) {
            var giftDom = document.createElement("div");
            giftDom.className = 'supergift supergift-' + superGiftInfo.giftId + ' gift-step-2 animated';
            giftDom.setAttribute("data-gift-id", superGiftInfo.id);
            giftDom.innerHTML = '<img class="supergift-img gift-step-1 animated" src="http://static.hdslb.com/live-static/images/gifts/gift-' + superGiftInfo.giftId + '.gif">' +
                '<div class="supergift-text">' +
                '<p class="supergift-text-sec gift-step-3 animated"><span class="supergift-uname">' + superGiftInfo.uname + '</span><span class="supergift-action">赠送' + superGiftInfo.giftName + '</span><span class="supergift-num">' + superGiftInfo.num + '个</span></p></div>' +
                '<img class="supergift-cross gift-step-4 animated" src="http://static.hdslb.com/live-static/images/supergift/cross.png"><p class="supergift-hitnum gift-step-6 animated">' + hitNum + '</p><p class="combo-text gift-step-5 animated">combo</p>';

            // 构造计时器.
            setTimeout(function () {
                $(giftDom).addClass('fadeOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(giftDom).remove();
                });
            }, superGift.settings.showTime);

            this.create = giftDom;
        };

// Definition: FFF 团连击礼物.
        superGift.fffGift = function (superGiftInfo, hitNum) {
            var giftDom = document.createElement("div");
            giftDom.className = 'supergift supergift-' + superGiftInfo.giftId + ' gift-step-2 animated';
            giftDom.setAttribute("data-gift-id", superGiftInfo.id);
            giftDom.innerHTML = '<div style="background-color: #9B5131" class="supergift-img gift-step-1 animated">' +
                '<img src="http://static.hdslb.com/live-static/images/gifts/gift-13-fireball.png" style="position: absolute; top: -20px; left: -10px;">' +
                '</div>' +
                '<div class="supergift-text">' +
                '<p class="supergift-text-sec gift-step-3 animated" style="color: #fff; margin-left: 10px; top: -3px;"><span class="supergift-uname" style="vertical-align: top; color: rgb(255, 232, 0);">' + superGiftInfo.uname + '</span>使用了大火球术！</p></div>' +
                '<img class="supergift-cross gift-step-4 animated" src="http://static.hdslb.com/live-static/images/supergift/cross.png"><p class="supergift-hitnum gift-step-6 animated">' + hitNum + '</p><p class="combo-text gift-step-5 animated">combo</p>';

            // 构造计时器.
            setTimeout(function () {
                $(giftDom).addClass('fadeOutLeft').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    giftDom.parentNode.removeChild(giftDom);
                });
            }, superGift.settings.showTime);

            this.create = giftDom;
        };

// 执行方法, 此方法在 SEND_GIFT 和送礼 AJAX 中执行.
        superGift.exec = function (data) {

            // Action: 当礼物连击数为 0 的时候不属于连击礼物, 终止执行.
            if (data["super"] == 0) {
                return false;
            }

            // Definition: 连击礼物唯一标识符与礼物信息.
            var id = data.uid + "_" + data.giftId + "_" + data.num + "_" + data["super"],
                superGiftInfo = {  // 礼物的信息.
                    id: id,
                    uname: data.uname,
                    num: data.num,
                    giftName: data.giftName,
                    giftId: data.giftId
                };

            // 如果列表中超过三个礼物.
            if ($appendTarget.children().length >= 3) {
                $('.supergift:first-child', $appendTarget).remove();
                $('.supergift', $appendTarget).addClass('moveUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass("moveUp");
                });
            }

            // Action: 新建礼物.
            // 判断是否为 FFF 团大火球, 如果是大火球, 建立大火球礼物.
            var newGift = null;
            if (data.giftName === "FFF") {
                newGift = new superGift.fffGift(superGiftInfo, data.super).create;
            } else {
                newGift = new superGift.newGift(superGiftInfo, data.super).create;
            }
            $('.supergift', $appendTarget).removeClass('gift-step-2 animated');
            $appendTarget.append(newGift);

        };

        module.exports = superGift;
    }, {}],
    42: [function (require, module, exports) {
        /*
         *  Chat Area Intro File by LancerComet at 11:22, 2015/12/17.
         *  # Carry Your World #
         *  ---
         *
         *  描述:
         *  ---
         *  这是房间页聊天区主入口文件. (Browserify)
         *  请在此处引用编写好的模块文件, **切勿**在此文件中直接编写业务逻辑.
         *  使用 Browserify 对此文件进行打包将生成首页完整的 JavaScript 文件.
         *  Browserify 遵循 Common.JS 编写规范.
         *
         */

        module.exports = function (roomInfo) {

            // 说明: 参数 roomInfo 为房间初始化后获得的数据.

            // 模块引用.
            // ===================
            require('./components/rank-list/javascripts/rank-list')(roomInfo, window);  // 排行榜模块引用.
            require('./components/chat-msg-list/chat-list-ctnr')();  // 聊天区域（弹幕列表）模块引用.
            require("./components/chat-ctrl-panel/chat-ctrl-panel")();  // 聊天区域控制面板控制器.
            require('./components/chat-ctrl-panel/profile-ctrl/intro-javascripts')();  // 账号操作区域模块引用.（与上方控制器独立）
            require("./components/bk-changer/bk-changer")(window);  // 房间背景切换模块.

        };
    }, {
        "./components/bk-changer/bk-changer": 33,
        "./components/chat-ctrl-panel/chat-ctrl-panel": 34,
        "./components/chat-ctrl-panel/profile-ctrl/intro-javascripts": 35,
        "./components/chat-msg-list/chat-list-ctnr": 39,
        "./components/rank-list/javascripts/rank-list": 40
    }],
    43: [function (require, module, exports) {
        /*
         *  Live Room Gift Section Script Entry By LancerComet at 14:09, 2016.01.05.
         *  # Carry Your World #
         *  ---
         *  房间送礼节点逻辑入口文件.
         */

        module.exports = function () {
            require("./javascripts/gift-section-ctrl")(window);
            require("./javascripts/gift-package-ctrl")();
        };
    }, {"./javascripts/gift-package-ctrl": 44, "./javascripts/gift-section-ctrl": 45}],
    44: [function (require, module, exports) {
        /*
         *  Gift Package at 18:08, 2016.01.06.
         *  ---
         *  道具包裹相关逻辑
         */

//var lazyInit = require("lazyInit");
        var lazyInit = require('../../../../common/functions/func-avalon-lazy-init/lazy-init');
//var liveToast = require("liveToast");
        var liveToast = require("../../../../common/components/live-widget/live-toast/live-toast");
//var randomEmoji = require("randomEmoji");
        var randomEmoji = require("../../../../common/functions/func-random-emoji/random-emoji");

        var liveQuickLogin = require('../../../../common/functions/func-live-quick-login/live-quick-login');

        module.exports = function () {
            "use strict";
            avalon.ready(function () {
                var giftPackagelVM = avalon.define({
                    $id: "giftPackageCtrl",
                    giftPackageStatus: 0,  // 0: 没有道具 1: 包裹中有赠送的新道具 2:包裹里非新增道具
                    panelStatus: false,
                    giftPackageData: [],

                    // Toggle 道具包裹
                    toggleGiftPackage: function (event) {
                        event.stopPropagation();
                        liveQuickLogin();
                        if (!giftPackagelVM.panelStatus) {
                            if (giftPackagelVM.giftPackageStatus == 1) {  // 有新道具，先打开新送道具面板
                                openGiftPackageNewPanel();
                            } else {
                                openGiftPackagePanel();  // 否则直接打开包裹
                            }
                        } else {
                            closeGiftPackagePanel();
                        }
                    },

                    // 送礼面板（道具包裹）
                    giftSendPanel: {
                        giftData: {
                            giftId: "",
                            giftName: "",
                            giftNum: 0,
                            type: "silver",
                            count: 1,
                            bagId: 0
                        },
                        show: false,
                        out: false,
                        outTimeout: null,
                        open: openGiftSendPanel,
                        close: closeGiftSendPanel,
                        sendGift: sendGift
                    },

                    // 新收到的礼物面板
                    giftPackageNewPanel: {
                        data: [],
                        show: false,
                        out: false,
                        outTimeout: null,
                        open: openGiftPackageNewPanel,
                        close: closeGiftPackageNewPanel
                    },

                    // 阻止冒泡
                    stopPropagation: function (event) {
                        event.stopPropagation();
                    }
                });

                // 加入 avalon 初始化队列
                lazyInit($("#gift-package-send-panel")[0], giftPackagelVM, function () {
                    // 初始化道具包裹状态
                    getGiftPackageStatus(function (result) {
                        giftPackagelVM.giftPackageStatus = result.data.result;
                    });
                });

                lazyInit($("#gift-package-new-panel")[0], giftPackagelVM);

                // 关闭包裹面板
                function closeGiftPackagePanel() {
                    $(".gifts-package-panel").fadeOut(200, function () {
                        giftPackagelVM.panelStatus = false;
                        $(document).off("click", closeGiftPackagePanel);
                    });
                }

                // 打开包裹面板
                function openGiftPackagePanel() {
                    getGiftPackage(function (result) {
                        giftPackagelVM.giftPackageData = result.data;
                        giftPackagelVM.panelStatus = true;
                    });
                    setTimeout(function () {
                        $(document).on("click", closeGiftPackagePanel);
                    }, 1);
                }

                // 打开送礼面板
                function openGiftSendPanel(giftId, giftName, giftNum, bigId) {
                    var sendPanel = giftPackagelVM.giftSendPanel;

                    sendPanel.giftData.giftId = giftId;
                    sendPanel.giftData.giftName = giftName;
                    sendPanel.giftData.giftNum = giftNum;
                    sendPanel.giftData.count = 1;
                    sendPanel.giftData.bagId = bigId;

                    giftPackagelVM.panelStatus = false;
                    sendPanel.show = true;
                }

                // 关闭送礼面板
                function closeGiftSendPanel() {
                    var sendPanel = giftPackagelVM.giftSendPanel;
                    sendPanel.out = true;
                    sendPanel.outTimeout = setTimeout(function () {
                        sendPanel.out = false;
                        sendPanel.show = false;
                        sendPanel = null;
                    }, 380);
                }

                // 打开新送道具面板
                function openGiftPackageNewPanel() {
                    var giftPackageNewPanel = giftPackagelVM.giftPackageNewPanel;
                    // 获取赠送的新道具数据
                    getSendGift(function (result) {
                        if (result.code == 0) {
                            giftPackageNewPanel.data = result.data;
                            giftPackageNewPanel.show = true;
                        }
                    });
                }

                // 关闭新送道具面板
                function closeGiftPackageNewPanel() {
                    var giftPackageNewPanel = giftPackagelVM.giftPackageNewPanel;
                    giftPackageNewPanel.out = true;
                    giftPackageNewPanel.outTimeout = setTimeout(function () {
                        giftPackageNewPanel.out = false;
                        giftPackageNewPanel.show = false;
                        giftPackageNewPanel = null;
                        giftPackagelVM.giftPackageStatus = 2;
                        openGiftPackagePanel();  // 打开包裹
                    }, 380);
                }

                // 送礼事件
                function sendGift(event) {
                    if (event.type === "keyup" && event.keyCode !== 13) {
                        return;
                    }

                    var element = event.target || event.srcElement;
                    var giftData = giftPackagelVM.giftSendPanel.giftData;
                    var num = parseInt(giftData.count, 10);

                    // 检测礼物数量是否为合法数字.
                    if (isNaN(num)) {
                        giftData.count = "";
                        liveToast(element, "请填写正确的送礼数量 " + randomEmoji.helpless(), true);
                        return;
                    }

                    giftPackagelVM.$fire("all!sendGift", {
                        element: element,
                        type: "package",
                        data: {
                            giftId: giftData.giftId,
                            num: num,
                            coinType: giftData.type,
                            bagId: giftData.bagId
                        },
                        callback: function (result) {
                            if (result.code == 0) {
                                giftData.giftNum = result.data.remain;
                                // 当 remain 为 0 时检查包裹状态并更新
                                if (result.data.remain == 0) {
                                    getGiftPackageStatus(function (result) {
                                        giftPackagelVM.giftPackageStatus = result.data.result;
                                    });
                                }
                            }
                        }
                    });
                }
            });

            /*
             * 道具包裹接口
             */

            // 获取是否有赠送的新道具的状态
            function getGiftPackageStatus(callback) {
                $.ajax({
                    url: "/giftBag/sendDaily",
                    type: 'GET',
                    dataType: "json",
                    success: function (result) {
                        // 回调函数
                        callback && callback(result);
                    }
                });
            };

            // 获取赠送的新道具数据
            function getSendGift(callback) {
                $.ajax({
                    url: "/giftBag/getSendGift",
                    type: 'GET',
                    dataType: "json",
                    success: function (result) {
                        // 回调函数
                        callback && callback(result);
                    }
                });
            };

            // 获取道具包裹的数据
            function getGiftPackage(callback) {
                $.ajax({
                    url: "/gift/playerBag",
                    type: 'GET',
                    dataType: "json",
                    success: function (result) {
                        // 回调函数
                        callback && callback(result);
                    }
                });
            };

        };


    }, {
        "../../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../../common/functions/func-avalon-lazy-init/lazy-init": 9,
        "../../../../common/functions/func-live-quick-login/live-quick-login": 14,
        "../../../../common/functions/func-random-emoji/random-emoji": 16
    }],
    45: [function (require, module, exports) {
        /*
         *  Gift Section Controller By LancerComet at 14:08, 2016.01.05.
         *  # Carry Your World #
         *  ---
         *  送礼节点控制器逻辑.
         */

        var lazyInit = require('../../../../common/functions/func-avalon-lazy-init/lazy-init');
        var avalonSetNum = require('../../../../common/functions/func-setnum-avalon/avalon-set-num');
        var timestampShorter = require('../../../../common/functions/func-timestamp-shorter/timestamp-shorter');
        var randomEmoji = require('../../../../common/functions/func-random-emoji/random-emoji');
        var liveToast = require('../../../../common/components/live-widget/live-toast/live-toast');
        var livePopup = require('../../../../common/components/live-widget/live-popup/live-popup');
        var liveQuickLogin = require('../../../../common/functions/func-live-quick-login/live-quick-login');

        module.exports = function (window) {
            "use strict";

            avalon.ready(function () {

                // Definition: 送礼节点控制器定义.
                var giftCtrl = avalon.define({
                    $id: "giftCtrl",

                    // 账户金钱信息.
                    currency: {
                        silver: 0,
                        gold: 0
                    },

                    // 礼物信息面板.
                    giftInfoPanel: {
                        show: false,
                        out: false,
                        outTimeout: null,
                        mouseTimeout: null,

                        left: 0,
                        top: 0,
                        type: "",  // 当前鼠标悬停的礼物类型.

                        info: {
                            giftId: "",
                            title: "",
                            content: "",
                            effects: "",
                            cost: ""
                        },

                        events: {
                            in: function () {
                                clearTimeout(giftCtrl.giftInfoPanel.outTimeout);
                                clearTimeout(giftCtrl.giftInfoPanel.mouseTimeout);
                            },
                            out: hideGiftPanel
                        }
                    },

                    // 送礼面板.
                    giftSendPanel: {
                        show: false,
                        out: false,
                        outTimeout: null,
                        cost: "",
                        allowGold: false,
                        allowSilver: false,
                        disableInput: false,
                        close: closeGiftSendPanel
                    },

                    // 选择事件定义.
                    chooseGift: {
                        normal: normalGiftChoice,
                        flash: flashGiftChoice,
                        activity: activityGiftChoice
                    },

                    // 送礼事件相关数据定义.
                    sendGift: {
                        countSet: [10, 99, 188, 450, 520, 1314],

                        data: {
                            giftId: "",
                            giftName: "",
                            type: "silver",
                            count: 1
                        },

                        events: {
                            setCount: setGiftCount,
                            send: sendGift
                        }
                    },

                    // 显示兑换或充值面板.
                    exchange: function (panel) {
                        liveQuickLogin();  // 未登录用户提示登录
                        giftCtrl.$fire("all!showExchange", panel);
                    }

                });

                // Definition: 货币更新事件.
                giftCtrl.$watch("fillCurrency", function (seeds) {
                    (seeds.gold !== null && seeds.gold !== undefined) && avalonSetNum(seeds.gold, giftCtrl.currency.gold, "giftCtrl.currency.gold");
                    (seeds.silver !== null && seeds.silver !== undefined) && avalonSetNum(seeds.silver, giftCtrl.currency.silver, "giftCtrl.currency.silver");
                });

                // Definition: 送礼请求事件.
                giftCtrl.$watch("sendGift", function (param) {

                    /*
                     *  @ param: {
                     *    element: Object,  // 送礼事件触发的节点, 将在 liveToast 中使用.
                     *    type: "normal" || "package",  // 普通礼物 || 道具包裹礼物
                     *    data: {
                     *        giftId: Number || String,
                     *        num: Number,  // 送礼数量.
                     *        coinType: "silver" || "gold",
                     *        bagId: Number,
                     *        callback: Function
                     *    }
                     *  }
                     */

                    // Definition: 设置送礼时间戳.
                    var timestamp = timestampShorter(Date.now());
                    window.giftTsHistory.length > 200 && window.giftTsHistory.splice(0, 1);  // 如果礼物时间戳记录数组长度大于 200 则裁剪.
                    window.giftTsHistory.indexOf(parseInt(timestamp, 10) < 0) && window.giftTsHistory.push(parseInt(timestamp, 10));  // 将最后送礼的时间戳推入记录数组.

                    // 判断普通礼物 & 道具包裹 送礼接口
                    var sendGiftUrl = "";
                    if (param.type == "normal") {
                        sendGiftUrl = "/gift/send";
                    } else if (param.type == "package") {
                        sendGiftUrl = "/giftBag/send";
                    }

                    // 送礼请求.
                    $.ajax({
                        url: sendGiftUrl,
                        type: "POST",
                        data: {
                            giftId: param.data.giftId,
                            roomid: ROOMID,
                            ruid: MASTERID,
                            num: param.data.num,
                            coinType: param.data.coinType,
                            Bag_id: param.data.bagId,
                            timestamp: timestamp,
                            rnd: DANMU_RND,
                            token: $.cookie("LIVE_LOGIN_DATA") || ""
                        },
                        dataType: "JSON",
                        success: function (result) {

                            if (result.code == 0) {

                                console.log("Send gifts successfully.");

                                // 更新瓜子数.
                                giftCtrl.$fire("all!updateCurrency", {
                                    gold: result.data.gold,
                                    silver: result.data.silver
                                });

                                // 如果是弹幕道具通知 Flash.
                                result.data.data.giftType == 1 && $("#player_object")[0].sendGift(result.data.data.giftId, result.data.data.num);

                                // 如果获得勋章.
                                if (result.data.data.newMedal == 1) {
                                    giftCtrl.$fire("all!newFansMedalNotice", {
                                        medalId: result.data.data.medal.medalId,
                                        medalName: result.data.data.medal.medalName,
                                        medalLevel: result.data.data.medal.level
                                    });
                                }

                                console.log(result);
                                // 获得新头衔
                                if (result.data.data.newTitle == 1) {
                                    giftCtrl.$fire("all!newTitleNotice", result.data.data.title);
                                }

                                // 本地添加送礼记录.
                                giftCtrl.$fire("all!addGiftHistory", result.data);

                                // 连击礼物.
                                giftCtrl.$fire("all!superGift", result.data.data);

                                // 更新投喂榜.
                                giftCtrl.$fire("all!updateGiftTop", result.data.data.top_list);

                            }

                            // 余额不足自动弹出相应弹窗.
                            else if (result.code == -400 && result.msg == "余额不足") {
                                giftCtrl.$fire("all!noSeed");
                                closeGiftSendPanel();
                            }

                            // Error Handler.
                            else {
                                liveToast(param.element, result.msg + " " + randomEmoji.sad(), "caution", true);
                            }

                            // Callback
                            param.callback && param.callback(result);
                        },
                        error: function (result) {
                            liveToast(param.element, randomEmoji.sad() + " 送礼失败：" + result.statusText + " " + randomEmoji.sad(), "error");
                        }
                    });

                });

                // Aciton: 初始化控制器.
                lazyInit($("#gift-panel")[0], giftCtrl, function () {

                    var giftPanel = giftCtrl.giftInfoPanel;

                    // Definition: 礼物显示信息面板 Hover 事件.
                    $("#gift-panel").find(".gifts-ctnr")
                        .on("mouseenter", ".gift-item", function (event) {
                            event.stopPropagation();
                            clearTimeout(giftPanel.outTimeout);
                            clearTimeout(giftPanel.mouseTimeout);

                            var element = event.target || event.srcElement;

                            // 防止 Hover 到角标节点导致面板位置与数据错误.
                            if (!$(element).hasClass("gift-item")) {
                                return;
                            }

                            var giftId = $(element).attr("data-gift-id"),
                                title = $(element).attr("data-title"),
                                content = $(element).attr("data-desc"),
                                effects = $(element).attr("data-effect"),
                                type = $(element).parent().attr("data-type"),
                                position = $(element).position();

                            giftPanel.show = true;
                            giftPanel.left = position.left;
                            giftPanel.top = position.top;
                            giftPanel.type = type;

                            giftPanel.info.giftId = giftId;
                            giftPanel.info.title = title;
                            giftPanel.info.content = content;
                            giftPanel.info.effects = effects;

                            var costs = {
                                gold: parseInt($(element).attr("data-gold"), 10),
                                silver: parseInt($(element).attr("data-silver"), 10)
                            };

                            var costHTML = "";
                            if (costs.gold > 0) {
                                costHTML += '<span class="cost-hint"><i class="live-icon gold-seed vertical-top"></i><span class="vertical-top">' + costs.gold + '</span></span>'
                            }
                            if (costs.silver > 0) {
                                costHTML += '<span class="cost-hint"><i class="live-icon silver-seed vertical-top"></i><span class="vertical-top">' + costs.silver + '</span></span>'
                            }
                            giftPanel.info.cost = costHTML;

                        })
                        .on("mouseleave", ".gift-item", hideGiftPanel);

                    lazyInit($("#gift-send-panel")[0], giftCtrl);

                });

                // Definition: 关闭礼物面板方法.
                function hideGiftPanel(event) {
                    event.stopPropagation();
                    var giftPanel = giftCtrl.giftInfoPanel;
                    giftPanel.mouseTimeout = setTimeout(function () {
                        giftPanel.out = true;
                        giftPanel.outTimeout = setTimeout(function () {
                            giftPanel.out = false;
                            giftPanel.show = false;
                            giftPanel = null;
                        }, 380);
                    }, 1);  // 鼠标移动延时, 为产品留的坑.（哪天说不定就礼物详情面板上要求鼠标 Hover.）
                }

                // Definition: 普通礼物选择事件.
                function normalGiftChoice(event) {
                    chooseGiftCommonExec(event);
                }

                // Definition: 弹幕礼物选择事件.
                function flashGiftChoice(event) {
                    chooseGiftCommonExec(event);
                }

                // Definition: 活动礼物选择事件.
                function activityGiftChoice(event) {
                    // 春节年糕活动
                    if (event.target.className.indexOf("gift-18") > 0) {
                        chooseGiftCommonExec(event);
                    }
                }

                // Definition: 选择礼物公用逻辑.
                function chooseGiftCommonExec(event) {
                    var target = event.target || event.srcElement;

                    if (!$(target).hasClass("gift-item")) {
                        target = null;
                        return;
                    }

                    var giftData = giftCtrl.sendGift.data;

                    // 复位数据.
                    giftData.count = 1;
                    giftData.type = "silver";
                    giftCtrl.giftSendPanel.allowGold = false;
                    giftCtrl.giftSendPanel.allowSilver = false;
                    giftCtrl.giftSendPanel.disableInput = false;

                    // 打开送礼面板.
                    giftCtrl.giftSendPanel.show = true;

                    // 设置送礼数据.
                    giftData.giftId = $(target).attr("data-gift-id");
                    giftData.giftName = $(target).attr("data-title");

                    // 如果要求禁用输入数量则禁用.
                    if ($(target).attr("data-custom_input") == "0") {
                        giftCtrl.giftSendPanel.disableInput = true;
                    }

                    // 设置瓜子花费.
                    var costs = {
                        gold: parseInt($(target).attr("data-gold"), 10),
                        silver: parseInt($(target).attr("data-silver"), 10)
                    };
                    var costHTML = "";
                    if (costs.gold > 0) {
                        giftCtrl.giftSendPanel.allowGold = true;
                        costHTML += '<span class="cost-hint"><i class="live-icon gold-seed vertical-top"></i><span class="vertical-top">' + costs.gold + '</span></span>'
                    }
                    if (costs.silver > 0) {
                        giftCtrl.giftSendPanel.allowSilver = true;
                        costHTML += '<span class="cost-hint"><i class="live-icon silver-seed vertical-top"></i><span class="vertical-top">' + costs.silver + '</span></span>'
                    }

                    // 如果是金瓜子礼物则设置送礼类型为金瓜子.
                    giftData.type = giftCtrl.giftSendPanel.allowGold && !giftCtrl.giftSendPanel.allowSilver ? "gold" : "silver";

                    giftCtrl.giftSendPanel.cost = costHTML;

                    // 设置预设送礼数量.
                    giftCtrl.sendGift.countSet = $(target).attr("data-count_set").split(",");
                }

                // Definition: 设置礼物数量.
                function setGiftCount(event) {
                    var target = event.target || event.srcElement;
                    giftCtrl.sendGift.data.count = $(target).attr("data-count");
                }

                // Definition: 关闭送礼面板.
                function closeGiftSendPanel() {
                    var sendPanel = giftCtrl.giftSendPanel;
                    sendPanel.out = true;
                    sendPanel.outTimeout = setTimeout(function () {
                        sendPanel.out = false;
                        sendPanel.show = false;
                        sendPanel = null;
                    }, 380);
                }

                // Definition: 送礼事件.
                function sendGift(event) {
                    liveQuickLogin();
                    if (event.type === "keyup" && event.keyCode !== 13) {
                        return;
                    }

                    var element = event.target || event.srcElement;
                    var giftData = giftCtrl.sendGift.data;
                    var num = parseInt(giftData.count, 10);

                    // 检测礼物数量是否为合法数字.
                    if (isNaN(num)) {
                        giftData.count = "";
                        liveToast(element, "请填写正确的送礼数量 " + randomEmoji.helpless(), true);
                        return;
                    }

                    giftCtrl.$fire("sendGift", {
                        element: element,
                        type: "normal",
                        data: {
                            giftId: giftData.giftId,
                            num: num,
                            coinType: giftData.type,
                            bagId: 0
                        }
                    });

                }

            });

        };

    }, {
        "../../../../common/components/live-widget/live-popup/live-popup": 7,
        "../../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../../common/functions/func-avalon-lazy-init/lazy-init": 9,
        "../../../../common/functions/func-live-quick-login/live-quick-login": 14,
        "../../../../common/functions/func-random-emoji/random-emoji": 16,
        "../../../../common/functions/func-setnum-avalon/avalon-set-num": 17,
        "../../../../common/functions/func-timestamp-shorter/timestamp-shorter": 19
    }],
    46: [function (require, module, exports) {
        /*
         *  Header Section By LancerComet at 17:31, 2015/12/21.
         *  # Carry Your World #
         *  ---
         *  房间头部信息节点.
         */

        var appConfig = require('../../../common/app-config/app-config');
        var lazyInit = require("../../../common/functions/func-avalon-lazy-init/lazy-init");
        var livePopup = require('../../../common/components/live-widget/live-popup/live-popup');
        var liveToast = require('../../../common/components/live-widget/live-toast/live-toast');
        var liveQuickLogin = require('../../../common/functions/func-live-quick-login/live-quick-login');
        var avalonSetNum = require('../../../common/functions/func-setnum-avalon/avalon-set-num');
        var randomEmoji = require('../../../common/functions/func-random-emoji/random-emoji');

        module.exports = function (result, window) {

            var headInfoCtrl = null;

            // Definition: 头部信息节点控制器定义.
            avalon.ready(function () {

                window.ISATTENTION = parseInt(window.ISATTENTION, 10);

                headInfoCtrl = avalon.define({
                    $id: "headInfoCtrl",

                    // 播主信息.
                    anchorInfo: {
                        UID: result.data.MASTERID,
                        nickname: result.data.ANCHOR_NICK_NAME,
                        level: result.data.USER_LEVEL.level,
                        rank: result.data.USER_LEVEL.rank,
                        nextScore: 0,
                        levelProgress: "0%"
                    },

                    // 房间信息.
                    roomInfo: {
                        title: result.data.ROOMTITLE,
                        area: result.data.AREAID,
                        liveStatus: result.data._status,
                        viewerCount: 0,
                        favourite: 0,
                        giftReceived: 0,
                        starRank: 0
                    },

                    // 播主信息悬浮面板.
                    anchorInfoPanel: {
                        allowRequest: true,
                        show: false,
                        out: false,
                        outTimeout: null,
                        outTimeout2: null,
                        loaded: false,
                        showFunc: function (event) {
                            event.stopPropagation();
                            var panel = headInfoCtrl.anchorInfoPanel;
                            var element = event.target || event.srcElement;

                            clearTimeout(panel.outTimeout);
                            clearTimeout(panel.outTimeout2);
                            panel.out = false;
                            panel.show = true;

                            if (panel.allowRequest) {
                                $.ajax({
                                    url: "/user/getMasterInfo",
                                    type: "POST",
                                    data: {
                                        uid: window.MASTERID
                                    },
                                    dataType: "JSON",
                                    success: function (result) {
                                        panel.loaded = true;  // 隐藏进度条.

                                        if (result.code != "REPONSE_OK") {
                                            liveToast(element, "播主信息获取失败：" + result.msg, "caution");
                                            return;
                                        }

                                        headInfoCtrl.anchorInfo.level = result.data.master_level;
                                        headInfoCtrl.anchorInfo.rank = result.data.sort;
                                        headInfoCtrl.anchorInfo.nextScore = parseInt(result.data.upgrade_score, 10);

                                        var upLevelScore = parseInt(result.data.next_score, 10);

                                        panel.allowRequest = false;
                                        setTimeout(function () {
                                            headInfoCtrl.anchorInfo.levelProgress = Math.floor((upLevelScore - headInfoCtrl.anchorInfo.nextScore) / upLevelScore * 100) + "%";
                                            upLevelScore = null;
                                        }, 350);
                                    },
                                    error: function (result) {
                                        liveToast(element, "播主信息获取失败：" + result.statusText, "error");
                                        panel.loaded = true;  // 隐藏进度条.
                                    }
                                });
                            } else {
                                panel.loaded = true;
                            }

                        },
                        hideFunc: function () {
                            var panel = headInfoCtrl.anchorInfoPanel;
                            panel.outTimeout = setTimeout(function () {
                                panel.out = true;
                                panel.outTimeout2 = setTimeout(function () {
                                    panel.show = false;
                                    panel.out = false;
                                    panel.loaded = false;
                                    panel = null;
                                }, 250);
                            }, 300);
                        }
                    },

                    // 举报房间.
                    report: {
                        show: false,
                        out: false,
                        outTimeout: null,
                        reason: null,
                        imageLink: null,
                        permission: true,
                        statusText: "您还没有选择图片.",
                        submitBtn: $("#report-upload-image-btn")[0],

                        // 打开举报面板.
                        openPanel: function () {
                            liveQuickLogin();
                            if (!headInfoCtrl.report.permission) {
                                return;
                            }
                            headInfoCtrl.report.show = true;
                            headInfoCtrl.report.permission = false;
                        },

                        // 确认举报.
                        confirm: function (event) {
                            if (event.type === "keyup" && event.keyCode !== 13) {
                                return;
                            }
                            if (!headInfoCtrl.report.imageLink || !headInfoCtrl.report.reason) {
                                liveToast(headInfoCtrl.report.submitBtn, "请提供举报理由与举报截图后再上传哦! " + randomEmoji.happy());
                                return;
                            }

                            $.ajax({
                                url: "/liveact/report_room",
                                type: "POST",
                                data: {
                                    room_id: window.ROOMID,
                                    picUrl: headInfoCtrl.report.imageLink,
                                    reason: headInfoCtrl.report.reason
                                },
                                dataType: "JSON",
                                success: function (result) {
                                    if (result.code != 0) {
                                        resultToast(result.msg);
                                        return;
                                    }
                                    liveToast(headInfoCtrl.report.submitBtn, "您已成功举报, 感谢您的支持！" + randomEmoji.happy(), "success");
                                    headInfoCtrl.report.cancel();
                                },
                                error: function (result) {
                                    resultToast(result.statusText);
                                }
                            });

                            function resultToast(msg) {
                                liveToast(headInfoCtrl.report.submitBtn, "举报信息提交失败：" + msg + "，请您稍后再试或联系客服，实在抱歉 > <", "caution");
                            }
                        },

                        // 取消举报.
                        cancel: function () {
                            headInfoCtrl.report.out = true;
                            setTimeout(function () {
                                headInfoCtrl.report.reason = null;
                                headInfoCtrl.report.imageLink = null;
                                headInfoCtrl.report.statusText = "您还没有选择图片.";
                                headInfoCtrl.report.permission = true;
                                headInfoCtrl.report.out = false;
                                headInfoCtrl.report.show = false;
                            }, 380);
                        },

                        // 选择举报图片.
                        selectImage: function () {
                            $("#report-image").click();
                        },

                        // 先行上传举报图片.
                        uploadImage: function () {
                            var fileObject = $("#report-image")[0].files[0];
                            if (!fileObject) {
                                return;
                            }
                            if (fileObject.type !== "image/jpeg" && fileObject.type !== "image/jpg" && fileObject.type !== "image/png") {
                                liveToast(headInfoCtrl.report.submitBtn, "请上传 PNG 或 JPG 的图片~ " + randomEmoji.helpless());
                                return;
                            }
                            if (fileObject && fileObject.size > 1048576) {
                                liveToast(headInfoCtrl.report.submitBtn, "图片请不要超过 1MB 哦! " + randomEmoji.sad());
                                return;
                            }
                            headInfoCtrl.report.statusText = "图片上传中, 请稍后...";
                            var formData = new FormData();
                            formData.append("fileUp", fileObject);
                            $.ajax({
                                xhr: function () {
                                    var xhr = new window.XMLHttpRequest();
                                    xhr.upload.addEventListener("progress", function (event) {
                                        headInfoCtrl.report.statusText = event.lengthComputable && "上传中：" + (event.loaded / event.total * 100) + "%";
                                        headInfoCtrl.report.statusText = event.lengthComputable && event.loaded / event.total === 1 && "举报图片上传完毕, 您可以提交了! " + randomEmoji.happy();
                                    }, false);
                                    return xhr;
                                },
                                url: "/pic/upload",
                                type: "POST",
                                data: formData,
                                processData: false,
                                contentType: false,
                                success: function (result) {
                                    // result: <script>window.parent.uploadSuccess('http://x-img.hdslb.net/group1/M00/2A/11/oYYBAFaDPnaAIGzsAAFpWFacBJs468.jpg|http://x-img.hdslb.net/group1/M00/2A/11/oYYBAFaDPnaAIGzsAAFpWFacBJs468.jpg');</script>
                                    var imgLink = result.toString().match(/http:\/\/.*\|/);
                                    if (imgLink) {
                                        headInfoCtrl.report.imageLink = imgLink[0].slice(0, imgLink[0].length - 1);
                                    } else {
                                        var str = "请确保网络通畅与图片类型为 PNG 或 JPG后重试.";
                                        liveToast($("#report-upload-image-btn"), str, "caution");
                                        headInfoCtrl.report.statusText = str;
                                        headInfoCtrl.report.imageLink = null;
                                    }
                                },
                                error: function (result) {
                                    consoleText.log(appConfig.consoleText.error + "举报图片上传失败:");
                                    consoleText.log(result.statusText);
                                    liveToast(headInfoCtrl.report.submitBtn, "图片上传失败, 请稍后重试: " + result.statusText, "caution");
                                    headInfoCtrl.report.imageLink = null;
                                }
                            });
                        }
                    },

                    // 分享面板.
                    share: showSharePanel,

                    // 房间直播状态切换.（点击直播开关）
                    liveStatusSwitch: function () {
                        if (parseInt(ISANCHOR, 10) !== 1) {
                            return;
                        }

                        // 当房间是开启直播时.
                        if (window._status === "on") {
                            headInfoCtrl.liveOffPanel.text = "您确定关闭直播？";
                            headInfoCtrl.liveOffPanel.show = true;
                        } else {
                            // 房间没有开启直播时.
                            headInfoCtrl.$fire("liveStatus", "on");
                        }
                    },

                    // 关闭直播面板.
                    liveOffPanel: {
                        show: false,
                        out: false,
                        outTimeout: null,
                        text: "您确定关闭直播？",
                        hide: function () {
                            headInfoCtrl.liveOffPanel.out = true;
                            clearTimeout(headInfoCtrl.liveOffPanel.outTimeout);
                            headInfoCtrl.liveOffPanel.outTimeout = setTimeout(function () {
                                headInfoCtrl.liveOffPanel.out = false;
                                headInfoCtrl.liveOffPanel.show = false;
                            }, 380);
                        }
                    },

                    // 关闭直播请求.
                    offLive: function () {
                        if (quizSystem.betStatus) {
                            var popup = livePopup({
                                title: "当前竞猜尚未结束",
                                html: '<div class="popup-content-container" style="margin: 30px; padding: 15px; border-radius: 10px; border: 1px dashed #F54178; color: #F54178; text-align: center; background-color: #FFE2E2;"><h3 style="margin-bottom: 10px; font-weight: 400;">当前竞猜尚未结束，您确定要关闭直播么？</h3><p>当您关闭直播后，请尽快在直播间或个人中心结算未结束的竞猜。若您在 5 分钟之内未进行结算，系统将强制流局并扣除您的信用值。</p></div>',
                                button: {
                                    confirm: "确认关闭",
                                    cancel: "取消"
                                },
                                onConfirm: function () {
                                    headInfoCtrl.$fire("liveStatus", "off");
                                    popup.remove();
                                    popup = null;
                                }
                            })
                        } else {
                            headInfoCtrl.$fire("liveStatus", "off");
                        }
                    },

                    // 关注功能.
                    attention: {
                        isAttend: window.ISATTENTION,  // 关注状态控制标识.
                        statusText: (window.ISATTENTION === 1 ? "已关注" : "关注"),
                        fansCount: result.data.FANS_COUNT || 0,
                        attend: function (event) {
                            event.stopPropagation();
                            liveQuickLogin();

                            var element = event.target || event.srcElement;
                            var type = window.ISATTENTION === 1 ? 0 : 1;

                            $.ajax({
                                url: "/liveact/attention",
                                type: "POST",
                                data: {
                                    uid: result.data.MASTERID,
                                    type: type
                                },
                                dataType: "JSON",
                                success: function (result) {
                                    if (result.code != 0) {
                                        liveToast(element, result.msg + " " + randomEmoji.helpless());
                                        return;
                                    }
                                    window.ISATTENTION = type;
                                    headInfoCtrl.attention.isAttend = type;

                                    // 通知 Flash 房间关注结果.
                                    try {
                                        $("#player_object")[0].attendStatus(type);
                                    } catch (tryErr) {
                                        // ...
                                    }

                                    changeStatusText();
                                    toast();
                                },
                                error: function (result) {
                                    liveToast(element, "关注失败, 请稍后再试 " + randomEmoji.sad(), "caution");
                                },
                                timeout: appConfig.appConfig.xhrTimeout
                            });

                            function changeStatusText() {
                                if (parseInt(window.ISATTENTION, 10) === 1) {
                                    headInfoCtrl.attention.fansCount += 1;
                                    headInfoCtrl.attention.statusText = "已关注";
                                } else {
                                    headInfoCtrl.attention.fansCount > 0 && headInfoCtrl.attention.fansCount--;
                                    headInfoCtrl.attention.statusText = "关注";
                                }
                            }

                            function toast() {
                                parseInt(window.ISATTENTION, 10) === 1 ? liveToast(element, "感谢关注！ " + randomEmoji.happy(), "success") : liveToast(element, "已悄悄地取消~ " + randomEmoji.helpless(), "info");
                            }
                        },
                        mouseover: false,
                        mouseenter: function () {
                            headInfoCtrl.attention.mouseover = true;
                        },
                        mouseleave: function () {
                            headInfoCtrl.attention.mouseover = false;
                        }
                    },
                    roomEdit: function () {
                        headInfoCtrl.$fire("all!showRoomEditDialog");
                    },
                    liveManage: function () {
                        headInfoCtrl.$fire("all!showLiveManageDialog", {curTarget: "liveManage"});
                    },
                    blackManage: function () {
                        headInfoCtrl.$fire("all!showBlackDialog");
                    }
                });

                // Definition: 房间直播状态更改事件.
                // Usage: $fire("liveStatus", "on" || "off")
                headInfoCtrl.$watch("liveStatus", function (status) {
                    // 开启直播间.
                    if (status === "on" || status === true) {
                        changeStatus(1, function () {
                            headInfoCtrl.roomInfo.liveStatus = "on";
                            headInfoCtrl.$fire("all!showStreamCode");  // 当开启直播时显示直播码.
                        });
                        console.log("liveStatus: on");
                    } else {
                        // 关闭直播.
                        changeStatus(0, function () {
                            headInfoCtrl.roomInfo.liveStatus = "off";
                            headInfoCtrl.liveOffPanel.hide();
                        });
                        console.log("liveStatus: off");
                    }
                });

                // Definition: 房间直播状态按钮更变事件.
                headInfoCtrl.$watch("liveStatusButton", function (status) {
                    if (status === "on" || status === true) {
                        headInfoCtrl.roomInfo.liveStatus = "on";
                        console.log("liveStatus: on");
                    } else {
                        headInfoCtrl.roomInfo.liveStatus = "off";
                    }
                });

                // Definition: 后台强行关闭直播间.
                headInfoCtrl.$watch("liveCutOff", function () {
                    if (UID != MASTERID) {
                        return;
                    }
                    changeStatus(0)
                });

                // Definition: 房间观看人数更改事件.
                headInfoCtrl.$watch("setViewerCount", function (value) {
                    if (isNaN(parseInt(value, 10))) {
                        throw new Error(appConfig.consoleText.error + "房间人数变量数值类型错误, 必须为可转为数字的有效变量.");
                    }
                    avalonSetNum(value, headInfoCtrl.roomInfo.viewerCount, "headInfoCtrl.roomInfo.viewerCount");
                });

                // Definition: 房间送礼数更新事件.
                headInfoCtrl.$watch("giftReceived", function (value) {
                    if (isNaN(parseInt(value, 10))) {
                        throw new Error(appConfig.consoleText.error + "房间送礼数值类型错误, 必须为可转为数字的有效变量.");
                    }
                    avalonSetNum(value, headInfoCtrl.roomInfo.giftReceived, "headInfoCtrl.roomInfo.giftReceived");
                });

                // Definition: 闪耀之星数据更新事件.
                headInfoCtrl.$watch("shiningStarCount", function (value) {
                    avalonSetNum(value, headInfoCtrl.roomInfo.starRank, "headInfoCtrl.roomInfo.starRank");
                });

                lazyInit(document.getElementById("head-info-panel"), headInfoCtrl, function () {
                    lazyInit(document.getElementById("report-panel"), headInfoCtrl);

                    // 设置送礼数量.
                    headInfoCtrl.$fire("giftReceived", result.data.RCOST);
                });

            });

            /* Definition goes below. */

            // Definition: 直播状态更变函数.
            function changeStatus(type, callback) {
                if (window.ISANCHOR !== 1) {
                    callback && callback();
                } else {
                    // type: 0: 关闭 || 1: 开启
                    if (type === 0) {
                        headInfoCtrl.liveOffPanel.text = "女儿祈祷中……";
                    }
                    request();
                }

                function request() {
                    $.ajax({
                        url: "/liveact/live_status_mng",
                        type: "POST",
                        data: {
                            status: type,
                            roomid: ROOMID
                        },
                        dataType: "JSON",
                        timeout: appConfig.appConfig.xhrTimeout,
                        success: function (result) {
                            if (result.code != 0) {
                                livePopup({
                                    title: "开启直播失败",
                                    html: "<p>直播开启失败，请稍后再试，如还有问题，请联系客服，真的很抱歉 > <</p><p>Detail: " + result.msg + "</p>",
                                    type: "info"
                                });
                                return;
                            }
                            window._status = type === 1 ? "on" : "off";  // 更新房间直播状态.
                            callback && callback();
                        },
                        error: function (result) {
                            livePopup({
                                title: "开启直播失败",
                                html: "<p>竞猜开启失败，请稍后再试，如还有问题，请联系客服，真的很抱歉 > <</p><p>Detail: " + result.statusText + "</p>",
                                type: "info"
                            });
                        }
                    });
                }

            }

            // Definition: 分享面板.
            var sharePanel = null;
            var qrCode = null;

            function showSharePanel() {
                var URL = "http://static.hdslb.com/live-static/libs/";

                if (!window.QRCode || !window.ZeroClipboard) {
                    $.when(
                        !window.QRCode && $.getScript(URL + "qr-code/qrcode.min.js"),
                        !window.ZeroClipboard && $.getScript(URL + "zero-clipboard/ZeroClipboard.min.js")
                    ).done(shareExec);
                } else {
                    shareExec();
                }

                function shareExec() {

                    if (sharePanel) {
                        sharePanel.open();
                    } else {

                        // Definition: Copy Data.
                        var roomCopyData = 'http://live.bilibili.com/' + window.ROOMURL;
                        var flashCopyData = 'http://static.hdslb.com/live-static/swf/LivePlayerEx_1.swf?room_id=' + window.ROOMID + '&cid=' + window.ROOMID + '&state=LIVE';

                        // Definition: 分享面板结构.
                        var panelHTML = '<div class="share-panel clear-float" style="padding-top: 10px; height: 80px">' +
                            '<div class="left-part float-left">' +
                            '<div class="room-link">' +
                            '<span class="dp-inline-block" style="width: 75px">直播间地址：</span><input type="text" id="share-room-link" class="live-input" readonly aria-readonly="true" value="' + roomCopyData + '"><button id="share-room-copy" class="live-btn default" data-clipboard-text="' + roomCopyData + '">复制</button>' +
                            '</div>' +
                            '<div class="flash-link" style="margin-top: 16px">' +
                            '<span class="dp-inline-block" style="width: 75px">Flash 地址：</span><input type="text" id="share-flash-link" class="live-input" readonly aria-readonly="true" value="' + flashCopyData + '"><button id="share-flash-copy" class="live-btn default" data-clipboard-text="' + flashCopyData + '">复制</button>' +
                            '</div>' +
                            '</div>' +
                            '<div class="right-part p-relative float-right" style="top: -25px;">' +
                            '<p class="text-center" style="margin: 5px">扫码分享</p>' +
                            '<div id="share-qr-code" style="width: 70px; height: 70px; padding: 3px; border: 1px solid #4fc1e9; border-radius: 5px"></div>' +
                            '</div>' +
                            '<div class="external-link">' +
                            '<div id="share-qzone" class="link share-btn qzone"></div>' +
                            '<div id="share-weibo" class="link share-btn weibo"></div>' +
                            '</div>' +
                            '</div>';

                        sharePanel = livePopup({
                            title: "喊小伙伴一起来看",
                            html: panelHTML,
                            type: "info",
                            button: false,
                            width: 450,
                            initFunc: function () {

                                // Action: 生成 QR 码.
                                !qrCode ? qrCode = new QRCode($("#share-qr-code")[0], {
                                    text: roomCopyData,
                                    width: 70,
                                    height: 70
                                }) : void(0);


                                var roomCopy = new ZeroClipboard($("#share-room-copy")[0]);
                                roomCopy.on("ready", function (readyEvent) {
                                    //alert( "ZeroClipboard SWF is ready!" );
                                    roomCopy.on("aftercopy", function (event) {
                                        liveToast($("#share-room-copy")[0], "复制成功，快去分享吧！" + randomEmoji.happy(), "success", true);
                                    });
                                });

                                var flashCopy = new ZeroClipboard($("#share-flash-copy")[0]);
                                flashCopy.on("ready", function (readyEvent) {
                                    //alert( "ZeroClipboard SWF is ready!" );
                                    flashCopy.on("aftercopy", function (event) {
                                        liveToast($("#share-flash-copy")[0], "复制成功，快去分享吧！" + randomEmoji.happy(), "success", true);
                                    });
                                });

                            }
                        });

                        // Action: 绑定外部分享事件.
                        var shareData = {
                            url: window.location.href,
                            title: ROOMTITLE + '的直播间',
                            pic: '',
                            nickname: ANCHOR_NICK_NAME,
                            desc: ROOMTITLE + '的直播间',
                            summary: ' ',
                            shortTitle: document.title,
                            searchPic: false
                        };

                        // QZone 分享.
                        $("#share-qzone").off("click").on("click", function () {
                            openShareWindow('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?', {
                                url: shareData.url || "",
                                showcount: 1,
                                desc: shareData.desc || "",
                                summary: shareData.summary || "",
                                title: '#哔哩哔哩生放送#　' + (shareData.weiboTag || "") + (shareData.title || "") + '　播主：' + (shareData.nickname || "") + '，正在哔哩哔哩进行直播，还不快来一起嗨！！',
                                site: '哔哩哔哩',
                                pics: shareData.pic || "",
                                style: '203',
                                width: 98,
                                height: 22
                            });
                        });

                        // 微博分享.
                        $("#share-weibo").off("click").on("click", function () {
                            openShareWindow('http://service.weibo.com/share/share.php?', {
                                url: shareData.url,
                                type: '3',
                                count: '1',
                                /**是否显示分享数，1显示(可选)*/
                                appkey: shareData.appkey && shareData.appkey.weibo ? shareData.appkey.weibo : '2841902482',
                                /**您申请的应用appkey,显示分享来源(可选)*/
                                title: '#哔哩哔哩生放送#　' + (shareData.weiboTag || "") + (shareData.title || "") + '　播主：' + (shareData.nickname || "") + '，正在哔哩哔哩进行直播，还不快来一起嗨！！',
                                /**分享的文字内容(可选，默认为所在页面的title)*/
                                pic: shareData.pic || "",
                                /**分享图片的路径(可选)*/
                                searchPic: shareData.searchPic === false ? false : true,
                                ralateUid: '',
                                /**关联用户的UID，分享微博会@该用户(可选)*/
                                language: 'zh_cn',
                                /**设置语言，zh_cn|zh_tw(可选)*/
                                rnd: new Date().valueOf()
                            });
                        });

                    }
                }
            }

            // Definition: 分享公共函数.
            function openShareWindow(base, param) {
                var temp = [];
                for (var p in param) {
                    temp.push(p + '=' + encodeURIComponent(param[p] || ''));
                }
                var _u = base + temp.join('&');
                window.open(_u, '', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
                return false;
            }

        };

    }, {
        "../../../common/app-config/app-config": 1,
        "../../../common/components/live-widget/live-popup/live-popup": 7,
        "../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../common/functions/func-avalon-lazy-init/lazy-init": 9,
        "../../../common/functions/func-live-quick-login/live-quick-login": 14,
        "../../../common/functions/func-random-emoji/random-emoji": 16,
        "../../../common/functions/func-setnum-avalon/avalon-set-num": 17
    }],
    47: [function (require, module, exports) {
        /*
         *  Bilibili Room Sidebar Left Intro at 12:18, 2015.12.21.
         *  ---
         *
         *  描述：
         *  ---
         *  本文件为直播房间页面 Sidebar Left JS 入口文件.
         *  本文件不编写任何逻辑, 仅做引用.
         *
         *  使用：
         *  ---
         *  房间左边栏打开／关闭
         *  VM.$fire("all!toggleRoomSidebarLeft");
         *
         *  房间左边栏打开
         *  VM.$fire("all!toggleRoomSidebarLeft", true);
         *
         *  房间左边栏关闭
         *  VM.$fire("all!toggleRoomSidebarLeft", false);
         *
         */

        module.exports = function () {
            var roomSidebarLeftVM = require("./javascripts/sidebar-ctrl")();
        };
    }, {"./javascripts/sidebar-ctrl": 48}],
    48: [function (require, module, exports) {
        /*
         *  Sidebar Avalon Controller transferred By LancerComet at LancerComet at 10:48, 2015/12/22.
         *  Originally By Felix.
         *  # Carry Your World #
         *  ---
         *  左侧边栏控制器定义.
         */

        var wish = require("../../wish/intro.js")();
        require('perfect-scrollbar/jquery')(window.jQuery);


// Definition: 视图控制器对象. 提到外面以使得函数引用.
        var roomSidebarLeftVM = null;

        module.exports = function () {
            "use strict";

            // Definition: 左侧侧栏控制器定义.
            roomSidebarLeftVM = avalon.define({
                $id: "roomSidebarLeftCtrl",
                newTask: false,  // 新任务状态控制标识, 当为 true 时, 我的任务按钮添加 .splashing 并开始呼吸闪烁.
                roomSidebarLeftStatus: true,  // 左侧侧栏展开状态控制标识.

                // 打开关闭 Sidebar Left
                toggleSidebarLeft: function () {
                    // 切换面板开关状态
                    roomSidebarLeftVM.roomSidebarLeftStatus = !roomSidebarLeftVM.roomSidebarLeftStatus;
                },

                // 打开绘马祈愿面板.
                clickWish: function () {
                    wish.show();
                }

            });

            // 监视房间左边栏展开状态属性
            roomSidebarLeftVM.$watch("roomSidebarLeftStatus", function (status) {
                status ? sideBarOpen() : sideBarClose();
            });

            // 监视 toggleRoomSidebarLeft，通过 fire 来控制房间左边栏状态.（左侧侧栏切换事件.）
            roomSidebarLeftVM.$watch("toggleRoomSidebarLeft", function (status) {
                // 如果传的 status 参数是布尔值, 则直接操作房间侧边栏状态, 否则切换面板开关状态
                roomSidebarLeftVM.roomSidebarLeftStatus = typeof status === "boolean" ? status : !roomSidebarLeftVM.roomSidebarLeftStatus;
            });


            return roomSidebarLeftVM;
        };

        $(function () {
            $(".room-left-sidebar").find(".main-ctnr").perfectScrollbar();  // 初始化自定义滚动条
            setTimeout(leftSidebarStatus, 500);
        });


        /* Definition goes below. */

// Definition: 左侧侧栏状态监测函数.
// 在进入页面时会在 localStorage 中存放一个时间戳、是否为今日第一次登录、侧栏状态三个控制标识.
        function leftSidebarStatus() {

            // Error Handler.
            if (!localStorage) {
                return;
            }

            // Definition: 当前页面访问时间.
            var visitTime = Date.now();

            // Definition: 上次访问记录的时间.
            var lastVisitTime = localStorage.getItem("lastVisitTime");

            // 如果没有上次访问记录时间（第一次访问）, 设置上次访问时间为当前时间并强制打开侧栏.
            // 如果本次访问距离上次访问时间超过 24 小时, 更新上次访问时间并打开侧栏.
            if (!lastVisitTime || visitTime - lastVisitTime >= 86400000) {
                setVisitTime(visitTime);
                sideBarOpen();
                return;
            }

            // 判断用户最后的侧栏状态并做出动作.
            var sidebarStatus = localStorage.getItem("sidebarStatus");
            if (sidebarStatus === "open") {
                sideBarOpen()
            } else {
                sideBarClose()
            }

            visitTime = null;
            sidebarStatus = null;

        }

// Definition: 设置最后访问时间.
        function setVisitTime(visitTime) {
            localStorage.setItem("lastVisitTime", visitTime);
        }

// Definition: 左侧侧栏开启函数.
        function sideBarOpen() {
            $(".body-container").addClass("sidebar-left-open");
            localStorage.setItem("sidebarStatus", "open");
            roomSidebarLeftVM.roomSidebarLeftStatus = true;
        }

// Definition: 左侧侧栏关闭函数.
        function sideBarClose() {
            $(".body-container").removeClass("sidebar-left-open");
            localStorage.setItem("sidebarStatus", "closed");
            roomSidebarLeftVM.roomSidebarLeftStatus = false;
        }

    }, {"../../wish/intro.js": 65, "perfect-scrollbar/jquery": 77}],
    49: [function (require, module, exports) {
        /*
         *  Bilibili Live Room My Attention at 12:04, 2015.12.23.
         *  ---
         *
         *  描述：
         *  ---
         *  本文件为直播房间页面我的关注模块 JS 入口文件.
         *  本文件不编写任何逻辑, 仅做引用.
         */

        module.exports = function () {
            require("./javascripts/my-attention.js")();  // 我的关注
        };
    }, {"./javascripts/my-attention.js": 50}],
    50: [function (require, module, exports) {
        /*
         *  Bilibili Live Room My Attention at 12:11, 2015.12.23.
         *  ---
         *
         *  描述：
         *  ---
         *  我的关注面板相关逻辑
         *
         */

        require('perfect-scrollbar/jquery')($);
        var liveQuickLogin = require('../../../../common/functions/func-live-quick-login/live-quick-login');

// 房间页我的关注模块
        module.exports = function () {
            var heartBeatTimer = null,
                FEED_HEARTBEAT = 0,
                FEED_LIST_PAGER = 1;

            // 我的关注面板 VM
            var attentionVM = avalon.define({
                $id: "myAttentionCtrl",
                open: false,
                list: [],
                hasMore: false,
                feedMode: 1,
                count: 0,

                // 设置是否提醒
                setFeedMode: function () {
                    attentionVM.feedMode = (attentionVM.feedMode == 1) ? 0 : 1;
                    $.ajax({
                        url: "/feed/on/",
                        data: {
                            open: attentionVM.feedMode
                        },
                        type: "POST",
                        dataType: "JSON",
                        success: function (result) {
                            attentionVM.feedMode = result.data.open;
                        }
                    });
                },

                // 关注列表项渲染完成
                listItemsReady: function () {
                    var $panel = $(this).parent(".my-attention-body");
                    // 更新自定义滚动条状态
                    $panel.perfectScrollbar("update");
                },

                // 跳转至所有关注
                readMore: function () {
                    liveQuickLogin();
                    window.open('/i/following', '_blank');
                }
            });

            // 设置 Cookie
            var setAttentionCookie = function (data) {
                var now = new Date(),
                    expiresDate = new Date(now.getTime() + 60 * 1000),
                    dataString = JSON.stringify(data);

                $.cookie("attentionData", dataString, {
                    expires: expiresDate
                });

            };

            // 更新数据
            var changeData = function (result) {

                FEED_HEARTBEAT = result.data.hb;
                attentionVM.feedMode = result.data.open;

                if (result.code == 0) {
                    attentionVM.count = result.data.count;
                    if (result.data.open && result.data.has_new) {  // 提醒开关开启 && 有新开播
                        FEED_LIST_PAGER = 1;
                        attentionVM.open = true;
                        attentionVM.$fire("all!toggleRoomSidebarLeft", true);
                        getFeedList();
                    }
                } else {
                    clearInterval(heartBeatTimer);
                }
            };

            // 心跳相关逻辑
            var heartBeat = function () {
                $.ajax({
                    url: "/feed/heartBeat/heartBeat",
                    data: {
                        hb: FEED_HEARTBEAT
                    },
                    type: "POST",
                    dataType: "JSON",
                    cache: false,
                    success: function (result) {
                        changeData(result);
                        setAttentionCookie(result);
                    }
                });

            };

            // 发送心跳 & 每 60 秒发送一次心跳
            heartBeat();
            // 判断浏览器是否支持 WebSocket，支持则接收服务器通知，否则计时器发送心跳 window.WebSocket
            if (false) {
                var client = new MyClient({
                    notify: function () {
                        heartBeat();
                    }
                });
            } else {
                // 每60秒，发一次心跳
                heartBeatTimer = setInterval(function () {
                    var attentionData = $.cookie("attentionData"),
                        attentionDataJSON;

                    if (attentionData) {
                        attentionDataJSON = $.parseJSON(attentionData);
                        changeData(attentionDataJSON);
                    } else {
                        heartBeat();
                    }
                }, 1000 * 60);
            }

            // 加载开播房间列表
            var getFeedList = function () {
                $.ajax({
                    url: "/feed/getList/" + FEED_LIST_PAGER,
                    type: "POST",
                    dataType: "JSON",
                    cache: false,
                    success: function (result) {
                        var $panel = $("#room-my-attention .my-attention-body");
                        // 加载第一页数据时重置 list 数组中的数据，否则将数据向 list 中追加
                        if (FEED_LIST_PAGER == 1) {
                            $panel.scrollTop(0);
                            attentionVM.list = result.data.list;
                        } else {
                            attentionVM.list = attentionVM.list.concat(result.data.list);
                        }

                        // 如果本次加载条目总数小于 10, 则把 hasMore 设置为 false
                        if (result.data.list.length < 10) {
                            attentionVM.hasMore = false;
                        } else {
                            attentionVM.hasMore = true;
                        }
                    }
                });
            };

            getFeedList();

            $(function () {
                // 初始化自定义滚动条
                var $panel = $("#room-my-attention .my-attention-body");
                $panel.perfectScrollbar();

                // Feed列表滚动到底加载新项目
                $panel.on('ps-y-reach-end', function () {
                    if (attentionVM.hasMore) {
                        FEED_LIST_PAGER++;
                        getFeedList();
                    }
                });
            });
        }


    }, {"../../../../common/functions/func-live-quick-login/live-quick-login": 14, "perfect-scrollbar/jquery": 77}],
    51: [function (require, module, exports) {
        /*
         *  Quiz System Intro File By LancerComet at 10:40, 2015/12/17.
         *  # Carry Your World #
         *  ---
         *  竞猜系统入口文件.
         *
         */

        module.exports = function () {
            require("./javascripts/quiz-protocol")(window);  // 竞猜广播方法扩充.
            require("./javascripts/quiz-avalon-ctrl")(window, window.avalon);  // 竞猜节点控制器.
        };

    }, {"./javascripts/quiz-avalon-ctrl": 52, "./javascripts/quiz-protocol": 57}],
    52: [function (require, module, exports) {
        /*
         *  Quiz Avalon Controller By LancerComet at 14:06, 2015/12/18.
         *  # Carry Your World #
         *  ---
         *  竞猜系统 Avalon 控制器.
         *
         */

        var appConfig = require('../../../../common/app-config/app-config');
        var avalonSetNum = require('../../../../common/functions/func-setnum-avalon/avalon-set-num');
        var lazyInit = require("../../../../common/functions/func-avalon-lazy-init/lazy-init");
        var liveToast = require('../../../../common/components/live-widget/live-toast/live-toast');
        var randomEmoji = require("../../../../common/functions/func-random-emoji/random-emoji");
        var livePopup = require('../../../../common/components/live-widget/live-popup/live-popup');

// Definition: 本模块用到的计时器对象.
        var timeouts = {
            residentCountChk: null
        };

        module.exports = function (window, avalon, undefined) {
            "use strict";

            // Definition: 竞猜全局变量设置.
            // 用于外部通信.
            window.quizSystem = {
                betStatus: false  // 竞猜状态, 默认设置为 false.
            };

            // 在 Avalon 准备完毕后定义控制器.
            avalon.ready(quizCtrlInit);

            // Definition: 竞猜控制器初始化函数.
            function quizCtrlInit() {

                // Definition: 竞猜控制器定义.
                var quizCtrl = avalon.define({
                    $id: "quizCtrl",

                    // 竞猜信息定义.
                    quiz: {
                        betId: -1,  // 竞猜 ID.
                        betStatus: false,  // 当前是否开启了竞猜.
                        disabled: false,  // 竞猜禁止操作.

                        // 竞猜题目信息.
                        info: {
                            id: null,  // 竞猜 ID, 同上.
                            uid: null,  // 竞猜播主的 UID.
                            question: "--",  // 竞猜题目.
                            a: "--",  // 竞猜答案 A.
                            b: "--",  // 竞猜答案 B.
                            answer: null,  // 竞猜最终选择答案.
                            status: null,  // 竞猜状态.
                            update_time: null  // 竞猜状态最后更新时间.
                        },

                        // 竞猜答案信息.
                        answerInfo: {
                            gold: {a: {}, b: {}},
                            silver: {a: {}, b: {}}
                        },

                        // 坐庄数据信息.（供坐庄发送请求用.）
                        beResidentData: {
                            answer: "",  // "a" || "b"
                            currencyType: "silver",  // 货币类型, 不可更改.
                            odds: "",  // 坐庄倍率.
                            oddsChk: function (event) {
                                var target = event.target || event.srcElement;
                                var odds = parseFloat(quizCtrl.quiz.beResidentData.odds);
                                if (isNaN(odds)) {
                                    liveToast(target, "手滑了吧~ 只能是数字喔~ " + randomEmoji.helpless());
                                    quizCtrl.quiz.beResidentData.odds = "";
                                    return;
                                }
                                clearTimeout(quizCtrl.quiz.beResidentData.oddsChkTimeout);
                                quizCtrl.quiz.beResidentData.oddsChkTimeout = setTimeout(function () {
                                    if (odds < 0.1 || odds > 9.9) {
                                        liveToast(target, "倍率要在 0.1 到 9.9 之间喔~ " + randomEmoji.helpless());
                                        quizCtrl.quiz.beResidentData.odds = "";
                                    }
                                }, 10);
                            },
                            oddsChkTimeout: null,
                            residentCount: ""  // 坐庄底金.
                        },

                        // 竞猜下注购买信息.
                        betBuyData: {
                            bankerId: "",
                            buyCount: "",
                            maxBuyCount: 0,  // 可购买最大注数, 每次弹出面板后更新.
                            buyIncome: 0  // 购买当前注数后获得利润, 由上方计算而出.
                        },

                        // 竞猜结算信息.
                        quizCheckoutData: {
                            choicedAnswer: ""
                        },

                        permission: false,  // 当前房间是否拥有竞猜开启权限.
                        allowNewQuiz: false,  // 当前房间是否允许开启新竞猜.
                        quizJoined: false,  // 当前登陆账号是否已参加竞猜. 将用在获奖结果请求进行判断, 没有参与竞猜的账号在结算时不发送请求.
                        initFinished: false  // 初始化状态标识符.
                    },

                    // 账号信息定义.
                    account: {
                        currency: {gold: "--", silver: "--"},  // 当前账号瓜子数.
                        type: false  // 当前账号类型, "anchor" || "guest" || false, 根据不同账号类型控制节点显示.
                    },

                    // 竞猜节点控制标识.
                    doms: {

                        // 购买与下注按钮的 Title.
                        displayTitle: "",

                        // 竞猜设置面板.
                        quizSetupPanel: {
                            show: false,
                            out: false,
                            outTimeout: null
                        },

                        // 竞猜购买面板.
                        betBuyPanel: {
                            show: false,
                            out: false,
                            outTimeout: null
                        },

                        // 坐庄面板.
                        beResidentPanel: {
                            show: false,
                            out: false,
                            outTimeout: null
                        },

                        // 认购表.
                        subscriptionList: {
                            show: false,
                            out: false,
                            outTimeout: null
                        },

                        // 竞猜封盘面板.
                        adjournPanel: {
                            show: false,
                            out: false,
                            outTimeout: null
                        },

                        // 竞猜结算面板.
                        quizCheckoutPanel: {
                            show: false,
                            out: false,
                            outTimeout: null
                        }

                    },

                    // 竞猜事件定义, 主要为 Dom 中的点击事件.
                    events: {

                        // 设置新竞猜.
                        quizSetup: function () {
                            quizCtrl.quiz.allowNewQuiz && !quizCtrl.quiz.betStatus && quizCtrl.account.type === "anchor" && quizCtrl.$fire("QuizSetup");
                        },

                        // 取消新竞猜设置.
                        quizCancelSetup: function () {
                            quizCtrl.$fire("QuizCancelSetup");
                        },

                        // 开始新竞猜.
                        quizStart: function (event) {
                            if (event.keyCode === 13 || !event.keyCode) {
                                var target = event.target || event.srcElement;
                                if (quizCtrl.quiz.info.question.length < 1 || quizCtrl.quiz.info.a.length < 1 || quizCtrl.quiz.info.b.length < 1) {
                                    liveToast(target, "请输入完整的竞猜内容喔~ " + randomEmoji.helpless());
                                    return;
                                }
                                quizCtrl.$fire("QuizStart", {
                                    toastElement: target
                                });
                            }
                        },

                        // 竞猜封盘.
                        quizAdjourn: function () {
                            quizCtrl.$fire("QuizAdjourning");
                        },

                        // 确认封盘.
                        quizAdjournConfirm: function (event) {
                            quizCtrl.$fire("QuizAdjournConfirm", {
                                targetElement: event.target || event.srcElement
                            })
                        },

                        // 取消封盘.
                        quizAdjournCancel: function () {
                            quizCtrl.$fire("QuizAdjournCancel");
                        },

                        // 准备结算竞猜.
                        quizOnClose: function () {
                            quizCtrl.$fire("QuizOnClose");
                        },

                        // 确认结算竞猜（结算竞猜）.
                        quizCheckout: function (event) {
                            quizCtrl.$fire("QuizCheckout", {
                                targetElement: event.target || event.srcElement
                            });
                        },

                        // 取消结算竞猜.
                        quizCancelCheckout: function () {
                            quizCtrl.$fire("QuizCancelCheckout")
                        },

                        // 购买下注.
                        betBuy: function (event) {
                            var target = event.target || event.srcElement;

                            quizCtrl.$fire("BetBuy", function () {
                                var answerInfo = quizCtrl.quiz.answerInfo[target.attributes["data-type"].value][target.attributes["data-target"].value];
                                // 放在内部确保获取的数据为最新数据, 而不可放在回调函数外部.
                                // quizCtrl.quiz.answerInfo.silver.a || quizCtrl.quiz.answerInfo.silver.b

                                // 设置 bankerId.
                                quizCtrl.quiz.betBuyData.bankerId = answerInfo.id;

                                // 设置可购买数量.
                                quizCtrl.quiz.betBuyData.maxBuyCount = answerInfo.amount ? answerInfo.amount : 0;

                                // 设置当前坐庄的倍率.
                                quizCtrl.quiz.betBuyData.odds = answerInfo.times ? answerInfo.times : 0.1;

                                // 复位购买利润显示.
                                quizCtrl.quiz.betBuyData.buyIncome = 0;
                            });
                        },

                        // 购买全部下注.
                        buyMax: function () {
                            quizCtrl.quiz.betBuyData.buyCount = quizCtrl.quiz.betBuyData.maxBuyCount;
                            quizCtrl.quiz.betBuyData.buyIncome = Math.floor(quizCtrl.quiz.betBuyData.buyCount * (1 + quizCtrl.quiz.betBuyData.odds) * 0.95);
                        },

                        // 更新收益数据.
                        updateBetBuyIncome: function (event) {
                            // 从 betBuyData 中的数据计算而出.

                            quizCtrl.quiz.betBuyData.buyCount = parseInt(quizCtrl.quiz.betBuyData.buyCount, 10);

                            // Error Handler.
                            if (isNaN(quizCtrl.quiz.betBuyData.buyCount)) {
                                quizCtrl.quiz.betBuyData.buyCount = null;
                                liveToast(event.target || event.srcElement, "只能输入数字哦 " + randomEmoji.helpless());
                            }

                            if (parseInt(quizCtrl.quiz.betBuyData.buyCount, 10) > parseInt(quizCtrl.quiz.betBuyData.maxBuyCount, 10)) {
                                quizCtrl.quiz.betBuyData.buyCount = quizCtrl.quiz.betBuyData.maxBuyCount;
                                liveToast(event.target || event.srcElement, "不能超过最大额度哦 " + randomEmoji.helpless());
                            }

                            quizCtrl.quiz.betBuyData.buyIncome = Math.floor(quizCtrl.quiz.betBuyData.buyCount * (1 + quizCtrl.quiz.betBuyData.odds) * 0.95);

                            event.keyCode === 13 && quizCtrl.events.betBuyConfirm(event);
                        },

                        // 确认购买下注（发送请求）.
                        betBuyConfirm: function (event) {
                            if (event.type === "keyup" && event.keyCode !== 13) {
                                return;
                            }
                            quizCtrl.$fire("BetBuyConfirm", event);
                        },

                        // 取消购买下注.
                        betBuyCancel: function () {
                            quizCtrl.$fire("BetBuyCancel");
                        },

                        // 显示坐庄面板.
                        betBeResident: function (event) {
                            quizCtrl.$fire("BetBeResident");
                        },

                        // 确认坐庄.
                        betBeResidentConfirm: function (event) {
                            var target = event.target || event.srcElement;
                            var residentCount = parseInt(quizCtrl.quiz.beResidentData.residentCount, 10);

                            // Error Handler.
                            if (isNaN(quizCtrl.quiz.beResidentData.residentCount)) {
                                liveToast(target, "手滑了吧~ 只能是数字喔~ " + randomEmoji.helpless());
                                quizCtrl.quiz.beResidentData.residentCount = "";
                                return;
                            }

                            clearTimeout(timeouts.residentCountChk);
                            timeouts.residentCountChk = setTimeout(function () {
                                residentCount < 10000 && liveToast(target, "底金不得少于 10000 哦~ " + randomEmoji.helpless());
                            }, 300);

                            if (event.keyCode && event.keyCode !== 13) {
                                return;
                            }

                            if (residentCount < 10000) {
                                clearTimeout(timeouts.residentCountChk);
                                liveToast(target, "底金不得少于 10000 哦~ " + randomEmoji.helpless());
                                return;
                            }

                            quizCtrl.$fire("BetBeResidentConfirm", {
                                element: target
                            });

                        },

                        // 取消坐庄.
                        beResidentCancel: function () {
                            quizCtrl.$fire("BetBeResidentCancel");
                        },

                        // 显示认购表.
                        showSubscription: function (event) {
                            quizCtrl.$fire("BetShowSubscriptionList", event);
                        },

                        // 关闭认购表.
                        closeSubScription: function () {
                            quizCtrl.doms.subscriptionList.out = true;
                            setTimeout(function () {
                                quizCtrl.doms.subscriptionList.show = false;
                                quizCtrl.doms.subscriptionList.out = false;
                            }, 380);
                        }

                    },

                    // 竞猜部分数据定义.
                    data: {
                        subscriptionList: []  // 认购表数据.
                    }

                });


                // Definition: 竞猜相关事件定义.
                (function quizEventsDefinition() {

                    // 竞猜初始阶段事件定义.
                    // ==========================================
                    require("./quiz-ctrl-quiz-setup")(quizCtrl);


                    // 竞猜控制方法事件定义.
                    // ==========================================
                    require("./quiz-ctrl-methods")(quizCtrl);


                    // 竞猜用户事件定义.
                    // ==========================================
                    require("./quiz-ctrl-user-events")(quizCtrl);


                    // 竞猜信息控制事件.
                    // ==========================================
                    require("./quiz-ctrl-status-ctrl")(quizCtrl);


                    // 公共服务事件定义.
                    // ==========================================
                    (function publicService() {
                        // Definition: 瓜子更新事件.
                        quizCtrl.$watch("fillCurrency", function (value) {
                            if (value.gold !== undefined && value.gold !== null) {
                                quizCtrl.account.currency.gold = value.gold;
                            }
                            if (value.silver !== undefined && value.silver !== null) {
                                quizCtrl.account.currency.silver = value.silver;
                            }
                        });
                    })();

                })();

                // Action: 判断账号类型.
                if ($.cookie("DedeUserID") && parseInt(window.ISANCHOR, 10) === 1) {
                    quizCtrl.account.type = "anchor";
                }

                if ($.cookie("DedeUserID") && parseInt(window.ISANCHOR, 10) === 0) {
                    quizCtrl.account.type = "guest";
                }

                if (!$.cookie("DedeUserID")) {
                    quizCtrl.account.type = false;  // 未登录.
                }

                // 预先定义前端模板.
                avalon.templateCache["quiz-panel.html"] = "";
                avalon.templateCache["quiz-panel-anchor.html"] = "";

                // 初始化控制器.
                lazyInit(document.getElementById("quiz-control-panel"), quizCtrl, secInit);

                // 设置弹窗初始化. 如果没有竞猜权限, 则不加载前端模板.
                function secInit() {
                    quizCtrl.$fire("QuizCheckStatus");
                    lazyInit(document.getElementById("quiz-setting-container"), quizCtrl);
                    lazyInit($("#room-left-sidebar").find(".small-btn.quiz")[0], quizCtrl);
                }
            }

        };
    }, {
        "../../../../common/app-config/app-config": 1,
        "../../../../common/components/live-widget/live-popup/live-popup": 7,
        "../../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../../common/functions/func-avalon-lazy-init/lazy-init": 9,
        "../../../../common/functions/func-random-emoji/random-emoji": 16,
        "../../../../common/functions/func-setnum-avalon/avalon-set-num": 17,
        "./quiz-ctrl-methods": 53,
        "./quiz-ctrl-quiz-setup": 54,
        "./quiz-ctrl-status-ctrl": 55,
        "./quiz-ctrl-user-events": 56
    }],
    53: [function (require, module, exports) {
        (function (global) {
            /*
             *  Live Quiz Control Methods By LancerComet at 10:15, 2015/12/23.
             *  # Carry Your World #
             *  ---
             *  竞猜控制方法定义.
             */
            var appConfig = require('../../../../common/app-config/app-config');
            var liveToast = require('../../../../common/components/live-widget/live-toast/live-toast');
            var livePopup = require('../../../../common/components/live-widget/live-popup/live-popup');
            var randomEmoji = require("../../../../common/functions/func-random-emoji/random-emoji");

// 竞猜控制方法事件定义.
// ==========================================
            module.exports = function (quizCtrl) {

                // Definition: 开始竞猜.
                quizCtrl.$watch("QuizStart", function (param) {
                    /*
                     *   @ param: {
                     *     targetElement: HTMLElement  // 用于定位弹窗.
                     *   }
                     */
                    $.ajax({
                        url: "/bet/addBet",
                        type: "POST",
                        dataType: "JSON",
                        data: {
                            question: quizCtrl.quiz.info.question,
                            a: quizCtrl.quiz.info.a,
                            b: quizCtrl.quiz.info.b,
                            token: $.cookie("LIVE_LOGIN_DATA") || ""
                        },
                        success: function (result) {
                            if (result.code != 0) {
                                consoleText.log(appConfig.consoleText.error + "竞猜开启失败, 必炸必炸动画 (╯‵□′)╯︵┻━┻");
                                consoleText.log("Detail: " + result.msg.toString());
                                liveToast(param.toastElement, "竞猜开启失败：" + result.msg.toString(), "error");
                                return;
                            }

                            quizCtrl.quiz.betId = result.data.betId;  // 设置 betID.
                            quizCtrl.quiz.allowNewQuiz = false;  // 不允许新的竞猜.
                            quizCtrl.quiz.quizJoined = true;  // 已加入竞猜.
                            quizCtrl.events.quizCancelSetup();  // 关闭设置面板, 借助取消设置事件关闭面板.

                            // 然后所有人会接到竞猜开始的广播 BET_START, 竞猜信息将在广播 BET_START 中填写.
                        },
                        error: function (result) {
                            consoleText.log(appConfig.consoleText.error + "竞猜开启失败, 网络通信失败");
                            liveToast(param.toastElement, "竞猜开启失败, 还请您稍后重试… " + randomEmoji.sad(), "error");
                        }
                    });
                });

                // Definition: 竞猜封盘事件.
                quizCtrl.$watch("QuizAdjourning", function () {
                    if (quizCtrl.account.type !== "anchor" || quizCtrl.quiz.allowNewQuiz) {
                        return;
                    }
                    quizCtrl.doms.adjournPanel.show = true;
                    quizCtrl.quiz.allowNewQuiz = false;
                });

                // Definition: 竞猜已经封盘.
                quizCtrl.$watch("QuizAdjourned", function () {
                    quizCtrl.quiz.disabled = true;
                    quizCtrl.doms.displayTitle = "竞猜已封盘，停手啦 " + randomEmoji.helpless();
                    quizCtrl.quiz.allowNewQuiz = false;
                    setTimeout(function () {
                        ISANCHOR != 1 && liveToast($(".be-resident-btn"), "竞猜封盘啦，不能挖坑啦~ " + randomEmoji.helpless());
                    }, 1);
                });

                // Definition: 竞猜取消事件.
                quizCtrl.$watch("QuizAdjournCancel", function () {
                    quizCtrl.doms.adjournPanel.out = true;
                    setTimeout(function () {
                        quizCtrl.doms.adjournPanel.show = false;
                        quizCtrl.doms.adjournPanel.out = false;
                    }, 380);
                });

                // Definition: 竞猜封盘请求.
                quizCtrl.$watch("QuizAdjournConfirm", function (param) {
                    /*
                     *   @ param: {
                     *     targetElement: HTMLElement  // 用于定位弹窗.
                     *   }
                     */
                    if (quizCtrl.account.type !== "anchor" || quizCtrl.quiz.allowNewQuiz) {
                        return;
                    }

                    // 发送封盘请求.
                    $.ajax({
                        url: "/bet/seal",
                        type: "POST",
                        data: {
                            betId: quizCtrl.quiz.betId,
                            token: $.cookie("LIVE_LOGIN_DATA") || ""
                        },
                        dataType: "JSON",
                        success: function (result) {
                            if (result.code != 0) {
                                var msg = result.msg ? result.msg : "服务器响应为封盘失败";
                                liveToast(param.targetElement, "封盘失败：" + msg + "，请稍后再试试 " + randomEmoji.sad(), "error");
                                return;
                            }
                            liveToast(param.targetElement, "封盘成功！" + randomEmoji.happy(), "success");
                            quizCtrl.$fire("QuizAdjournCancel");
                        },
                        error: function (result) {
                            var msg = result.msg ? result.msg : "服务器响应为封盘失败";
                            liveToast(param.targetElement, "封盘失败：" + msg + "，请稍后再试试 " + randomEmoji.sad(), "error");
                        }
                    });
                });

                // Definition: 竞猜关闭事件.（仅仅显示结算面板, 非确认关闭事件）
                quizCtrl.$watch("QuizOnClose", function () {
                    if (quizCtrl.account.type !== "anchor" || quizCtrl.quiz.allowNewQuiz) {
                        return;
                    }
                    quizCtrl.doms.quizCheckoutPanel.show = true;
                });

                // Definition: 竞猜结算事件.
                quizCtrl.$watch("QuizCheckout", function (param) {
                    if (quizCtrl.account.type !== "anchor" || quizCtrl.quiz.allowNewQuiz) {
                        return;
                    }
                    if (quizCtrl.quiz.betId === null || quizCtrl.quiz.betId === undefined) {
                        livePopup({
                            title: "竞猜出现错误",
                            html: "<p>由于没有正确获取到竞猜 ID, 您的本次竞猜出现了问题, 请刷新浏览器, 如果多次刷新后竞猜存在且无法正常爆破, 请您联系客服进行处理, 真的很抱歉！> <<br/><br/>Detail: 未获取到正确的 betId.</p>",
                            type: "alert"
                        });
                        return;
                    }

                    if (!quizCtrl.quiz.quizCheckoutData.choicedAnswer) {
                        liveToast(param.targetElement, "请选择您的答案哦~ " + randomEmoji.helpless());
                        return;
                    }

                    $.ajax({
                        url: "/bet/endBet",
                        type: "POST",
                        dataType: "JSON",
                        data: {
                            betId: quizCtrl.quiz.betId,
                            answer: quizCtrl.quiz.quizCheckoutData.choicedAnswer,
                            token: $.cookie("LIVE_LOGIN_DATA") || ""
                        },
                        success: function (result) {
                            if (result.code != 0) {
                                liveToast(param.targetElement, "竞猜爆破失败：" + result.msg, "error");
                                return;
                            }
                            liveToast(param.targetElement, "爆破成功！您可以到竞猜中心查看记录~ " + randomEmoji.happy() || result.msg, "success");
                            quizCtrl.$fire("QuizCancelCheckout");
                        },
                        error: function (result) {
                            livePopup({
                                title: "竞猜爆破失败 " + randomEmoji.sad(),
                                html: "<p>由于网络错误或服务器出现问题, 竞猜爆破失败, 请您稍后再试或联系客服处理, 真的很抱歉！" + randomEmoji.sad() + "<br/><br/>Detail: " + result.statusText + "</p>"
                            });
                        }
                    });

                });

                // Definition: 取消结算竞猜.
                quizCtrl.$watch("QuizCancelCheckout", function () {
                    quizCtrl.doms.quizCheckoutPanel.out = true;
                    quizCtrl.quiz.quizCheckoutData.choicedAnswer = null;
                    setTimeout(function () {
                        quizCtrl.doms.quizCheckoutPanel.show = false;
                        quizCtrl.doms.quizCheckoutPanel.out = false;
                    }, 380);
                });

                // Definition: 竞猜结算中状态事件.
                quizCtrl.$watch("QuizOnEnding", function () {
                    console.log("avalon: QuizOnEnding");
                    quizCtrl.quiz.disabled = true;
                    quizCtrl.doms.displayTitle = "竞猜正在爆破中 " + randomEmoji.helpless();
                    quizCtrl.quiz.info.question += "（爆破中）";
                    setTimeout(function () {
                        ISANCHOR != 1 && liveToast($(".be-resident-btn"), "竞猜爆破中，等下一波吧~ " + randomEmoji.happy(), "success");
                    }, 1);
                });

                // Definition: 获取竞猜结果.
                quizCtrl.$watch("QuizGetResult", function (callback) {
                    console.log("Event: QuizGetResult");
                    console.log("QuizJoined: " + quizCtrl.quiz.quizJoined);


                    if (!quizCtrl.quiz.quizJoined) {
                        quizCtrl.$fire("QuizRestorePanel");
                        return;
                    }

                    $.ajax({
                        url: "/bet/getUserProfit",
                        type: "POST",
                        data: {
                            betId: quizCtrl.quiz.betId
                        },
                        dataType: "JSON",
                        success: function (result) {
                            if (result.code != 0) {
                                consoleText.log(appConfig.consoleText.error + "竞猜结果获取失败.");
                                consoleText.log("Detail: " + result.msg);
                                return;
                            }

                            // Definition: 结算金币结果.
                            var summary = {
                                gold: parseInt(result.data.profit.gold, 10),
                                silver: parseInt(result.data.profit.silver, 10)
                            };

                            // 弹出结算面板.
                            var summaryPanel = null;
                            var resultText = {
                                gold: "",
                                silver: ""
                            };

                            // Action: 判断当前账号类型.
                            // 播主弹出播主的结算面板, 用户弹出用户的结算面板.
                            parseInt(global.ISANCHOR, 10) === 1 ? anchorResult() : guestResult();

                            function anchorResult() {
                                //summary.gold >= 0 ? resultText.gold = '<p style="color: #4fc1e9; margin:10px 0"><i class="live-icon gold-seed"></i> 赢得 ' + summary.gold + ' 金瓜子</p>' : resultText.gold = '<p style="color: #E16C97; margin:10px 0"><i class="live-icon gold-seed"></i> 损失 ' + (-summary.gold) + ' 金瓜子</p>';
                                summary.silver >= 0 ? resultText.silver = '<p style="color: #4fc1e9"><i class="live-icon silver-seed v-middle"></i><span class="v-middle" style="margin-left: 5px"> 赢得 ' + summary.silver + ' 银瓜子</span></p>' : resultText.silver = '<p style="color: #E16C97"><i class="live-icon silver-seed"></i> 损失 ' + (-summary.silver) + ' 银瓜子</p>';

                                summaryPanel = livePopup({
                                    title: "爆破成功",
                                    html: '<p>本轮竞猜您一共：</p>' +
                                    '<p class="text-center">' + resultText.gold + resultText.silver + '</p>' +
                                    '<p style="text-align:center; margin: 10px 0;"><a href="/i/bet" target="_blank" style="color: #4fc1e9;">点击查看详情...</a></p>',
                                    type: "info",
                                    width: 300,
                                    onConfirm: function () {
                                        summaryPanel.remove();
                                        summaryPanel = null;
                                    }
                                });
                            }


                            function guestResult() {

                                //summary.gold >= 0 ? resultText.gold = '<p style="color: #4fc1e9; margin:10px 0"><i class="live-icon gold-seed"></i> 赢得 ' + summary.gold + ' 金瓜子</p>' : resultText.gold = '<p style="color: #E16C97; margin:10px 0"><i class="live-icon gold-seed"></i> 损失 ' + (-summary.gold) + ' 金瓜子</p>';
                                summary.silver >= 0 ? resultText.silver = '<p style="color: #4fc1e9"><i class="live-icon silver-seed v-middle"></i><span class="v-middle" style="margin-left: 5px"> 赢得 ' + summary.silver + ' 银瓜子</span></p>' : resultText.silver = '<p style="color: #E16C97"><i class="live-icon silver-seed"></i> 损失 ' + (-summary.silver) + ' 银瓜子</p>';

                                summaryPanel = livePopup({
                                    title: "竞猜结束",
                                    html: '<p>本轮竞猜答案为：<span style="color: pink" class="quiz-summary-guest-answer">' + result.data.bet.answer + '</span></p>' +
                                    resultText.silver +
                                    '<p style="text-align:center; margin: 10px 0;"><a href="/i/bet" target="_blank" style="color: #4fc1e9;">点击查看详情...</a></p>',
                                    type: "info",
                                    width: 300,
                                    onConfirm: function () {
                                        summaryPanel.remove();
                                        summaryPanel = null;
                                    }
                                });
                            }

                            quizCtrl.$fire("all!updateCurrency", {
                                gold: result.data.user.gold,
                                silver: result.data.user.silver
                            });

                            quizCtrl.quiz.info = {
                                id: null,  // 竞猜 ID, 同上.
                                uid: null,  // 竞猜播主的 UID.
                                question: "--",  // 竞猜题目.
                                a: "--",  // 竞猜答案 A.
                                b: "--",  // 竞猜答案 B.
                                answer: null,  // 竞猜最终选择答案.
                                status: null,  // 竞猜状态.
                                update_time: null  // 竞猜状态最后更新时间.
                            };

                            quizCtrl.quiz.answerInfo = {
                                gold: {a: {}, b: {}},
                                silver: {a: {times: null, progress: 0, c: 0}, b: {times: null, progress: 0, c: 0}}
                            };

                            callback && callback();
                        },
                        error: function (result) {

                        }
                    });
                });

                // Definition: 还原竞猜面板.
                quizCtrl.$watch("QuizRestorePanel", function (json) {
                    console.log("Event: QuizRestorePanel");

                    quizCtrl.quiz.disabled = false;

                    quizCtrl.quiz.permission = true;
                    quizCtrl.quiz.allowNewQuiz = true;
                    quizCtrl.quiz.betStatus = false;
                    quizSystem.betStatus = false;
                    quizCtrl.quiz.quizJoined = false;

                    quizCtrl.quiz.betId = -1;
                    quizCtrl.quiz.disabled = false;

                });

            };
        }).call(this, typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    }, {
        "../../../../common/app-config/app-config": 1,
        "../../../../common/components/live-widget/live-popup/live-popup": 7,
        "../../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../../common/functions/func-random-emoji/random-emoji": 16
    }],
    54: [function (require, module, exports) {
        /*
         *  Live Quiz Control Methods By LancerComet at 11:32, 2015/12/23.
         *  # Carry Your World #
         *  ---
         *  竞猜初始设置方法.
         */

// 竞猜初始阶段事件定义.
// ==========================================
        module.exports = function (quizCtrl) {
            "use strict";

            // Definition: 设置新的竞猜.
            quizCtrl.$watch("QuizSetup", function () {
                quizCtrl.doms.quizSetupPanel.show = true;
                quizCtrl.doms.quizSetupPanel.out = false;
                quizCtrl.quiz.info.question = "";
                quizCtrl.quiz.info.a = "";
                quizCtrl.quiz.info.b = "";
            });

            // Definition: 取消竞猜设置.
            quizCtrl.$watch("QuizCancelSetup", function () {
                quizCtrl.doms.quizSetupPanel.out = true;
                clearTimeout(quizCtrl.doms.quizSetupPanel.outTimeout);
                quizCtrl.doms.quizSetupPanel.outTimeout = setTimeout(function () {
                    quizCtrl.doms.quizSetupPanel.show = false;
                    quizCtrl.doms.quizSetupPanel.out = false;
                }, 380);
            });

        };
    }, {}],
    55: [function (require, module, exports) {
        /*
         *  Live Quiz Status Control By LancerComet at 11:36, 2015/12/23.
         *  # Carry Your World #
         *  ---
         *  竞猜信息控制事件.
         */

        var appConfig = require('../../../../common/app-config/app-config');

        var tplLoaded = {
            common: false,
            anchor: false
        };

// 竞猜信息控制事件.
// ==========================================
        module.exports = function (quizCtrl) {
            "use strict";

            // Definition: 竞猜状态检查事件.
            quizCtrl.$watch("QuizCheckStatus", function (param) {
                /*
                 *  @ param: {
                 *    type: "normal" || "protocol",
                 *    json: null || {},
                 *    callback: null || Function,
                 *  }
                 */

                param = param || {type: "normal"};

                if (param.type !== "normal" && param.type !== "protocol") {
                    throw new Error(appConfig.consoleText.error + "非法调用, 骚年你撸多了.");
                }

                // 如果是广播调用, 则跳过请求.
                if (param.type === "protocol" && param.json) {
                    successCallback(param.json);
                    return;
                }

                // 默认状态下发送请求.
                $.ajax({
                    url: "/bet/getRoomBet",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        roomid: ROOMID
                    },
                    success: successCallback,
                    error: errorCallback
                });

                function successCallback(result) {
                    // Error Handler.
                    if (parseInt(result.code, 10) !== 0) {
                        consoleText.log(appConfig.consoleText.error + "竞猜信息获取错误, 必炸必炸动画  (╯‵□′)╯︵┻━┻");
                        consoleText.log("Detail: " + result.msg);
                        quizCtrl.quiz.allowNewQuiz = false;  // 竞猜系统异常, 不允许开启新竞猜.
                        return;
                    }

                    // 判断竞猜权限, 如果没有竞猜权限, 终止执行.
                    if (!result.data.isBet) {
                        console.log(appConfig.consoleText.info + "播主没有竞猜权限, 终止运行.");
                        quizCtrl.quiz.permission = false;
                        quizCtrl.quiz.allowNewQuiz = false;
                        return false;
                    }


                    // 设置全局竞猜状态, 供外部调用（关闭直播时状态判断）.
                    quizSystem.betStatus = result.data.betStatus;

                    // 初始化时根据返回值设置是否参与竞猜.
                    // 其实这里不管是不是初始化都根据服务器数据来设定看起来是没问题的, 但这里采取了无视后端的策略, 防止数据错误.

                    // 以上说法不对, 如果用户刷新页面将导致状态丢失, 需要根据服务器返回状态设置.
                    !quizCtrl.quiz.initFinished ? quizCtrl.quiz.quizJoined = result.data.isInBet : void(0);

                    // 竞猜权限与状态.
                    quizCtrl.quiz.permission = result.data.isBet;
                    quizCtrl.quiz.betStatus = result.data.betStatus;


                    // 数据单向同步.
                    if (result.data.bet !== [] && !$.isEmptyObject(result.data.bet)) {
                        quizCtrl.quiz.betStatus = result.data.betStatus;
                        quizCtrl.quiz.allowNewQuiz = !result.data.isInBet;
                        result.data.bet.id ? quizCtrl.quiz.betId = result.data.bet.id : void(0);
                        quizCtrl.quiz.info = result.data.bet;
                        try {

                            // 补全数据, 否则 Avalon 不会同步.
                            if (!result.data.silver.a.amount) {
                                result.data.silver.a.amount = 0;
                            }
                            if (!result.data.silver.b.amount) {
                                result.data.silver.b.amount = 0;
                            }
                            if (!result.data.silver.a.times) {
                                result.data.silver.a.times = null;
                            }
                            if (!result.data.silver.b.times) {
                                result.data.silver.b.times = null;
                            }

                            quizCtrl.quiz.answerInfo.gold = result.data.gold;
                            quizCtrl.quiz.answerInfo.silver = result.data.silver;

                        } catch (tryErr) {
                            // ...
                            console.log("QuizCheckStatus 单向数据绑定错误: " + tryErr);
                        }
                        quizCtrl.doms.displayTitle = "";
                    }

                    // 初始化完毕.
                    !quizCtrl.quiz.initFinished ? quizCtrl.quiz.initFinished = true : void(0);

                    // 判断当前竞猜状态, 如果为 true 说明已开启竞猜.
                    if (result.data.betStatus == true) {
                        console.log("房间已开启竞猜.");
                        quizCtrl.quiz.allowNewQuiz = false;

                    } else {
                        console.log("房间未开启竞猜.");
                        quizCtrl.quiz.allowNewQuiz = true;  // 允许新竞猜.
                    }

                    // Execute callback if there it is.
                    if (param.callback) {
                        setTimeout(param.callback, 1);
                    }

                    // 加载前端模板.
                    if (result.data.isBet) {

                        // 加载公共部分.
                        if (!tplLoaded.common) {
                            $.getScript("http://static.hdslb.com/live-static/live-room/tpls/tpl-quiz.js", function (result) {
                                avalon.templateCache["quiz-panel.html"] = window.liveTpls["room-template/quiz-guest.html"];
                                tplLoaded.common = true;
                            });
                        }

                        // 加载播主部分.
                        if (ISANCHOR == 1 && !tplLoaded.anchor) {
                            $.getScript("http://static.hdslb.com/live-static/live-room/tpls/tpl-quiz-anchor.js", function (result) {
                                avalon.templateCache["quiz-panel-anchor.html"] = window.liveTpls["room-template/quiz-anchor.html"];
                                tplLoaded.anchor = true;
                            });
                        }
                    }

                    // 检测是否已封盘, 封盘则封盘.
                    if (parseInt(result.data.bet.status, 10) === -2) {
                        console.log("进入页面, 发现当前竞猜已在封盘");
                        quizCtrl.$fire("QuizAdjourned");
                        return;
                    }

                    // 检测是否在结算中, 如果在结算则进入结算状态.
                    if (parseInt(result.data.bet.status, 10) === -3) {
                        console.log("进入页面, 发现当前竞猜已在结算");
                        quizCtrl.$fire("QuizOnEnding");
                    }
                }

                function errorCallback(result) {
                    consoleText.log(appConfig.consoleText.error + "竞猜信息获取失败:");
                    consoleText.log(result.statusText);

                }

            });

            // Definition: 竞猜信息更新事件.
            quizCtrl.$watch("QuizUpdateInfo", function () {

            });

        };

    }, {"../../../../common/app-config/app-config": 1}],
    56: [function (require, module, exports) {
        /*
         *  Live Quiz User Events By LancerComet at 11:32, 2015/12/23.
         *  # Carry Your World #
         *  ---
         *  竞猜用户事件定义.
         */
        var appConfig = require('../../../../common/app-config/app-config');
        var randomEmoji = require('../../../../common/functions/func-random-emoji/random-emoji');
        var livePopup = require('../../../../common/components/live-widget/live-popup/live-popup');
        var liveToast = require('../../../../common/components/live-widget/live-toast/live-toast');

// 竞猜用户事件定义.
// ==========================================
        module.exports = function (quizCtrl, undefined) {

            // 竞猜坐庄.
            // ===========================================

            // Definition: 开启坐庄面板事件.
            quizCtrl.$watch("BetBeResident", function () {
                if (quizCtrl.quiz.allowNewQuiz) {
                    return;
                }
                if (quizCtrl.account.type === "anchor") {
                    liveToast(event.target || event.srcElement, "播主不可以挖坑喔~" + randomEmoji.helpless());
                    return;
                }
                if (quizCtrl.account.type === false) {
                    liveToast(event.target || event.srcElement, "您还没有登录哦~" + randomEmoji.helpless());
                    return;
                }
                quizCtrl.doms.beResidentPanel.show = true;
                quizCtrl.$fire("all!updateCurrency");
            });

            // Definition: 确认坐庄事件.
            quizCtrl.$watch("BetBeResidentConfirm", function (param) {
                // Error Handler.
                if (quizCtrl.quiz.allowNewQuiz) {
                    consoleText.log(appConfig.consoleText.caution + "allowNewQuiz = false, 当前不允许挖坑.");
                    return;
                }

                if (!quizCtrl.quiz.beResidentData.answer || !quizCtrl.quiz.beResidentData.odds || !quizCtrl.quiz.beResidentData.residentCount) {
                    liveToast(param.element, "请将数据填写完整~~" + randomEmoji.shock(), "caution");
                    return;
                }


                if (quizCtrl.quiz.betId === null || quizCtrl.quiz.betId === undefined || quizCtrl.quiz.betId === "") {
                    var popup = livePopup({
                        title: "出现错误 " + randomEmoji.sad(),
                        content: "> < 竞猜出现错误, 请刷新页面后重试… <br/><br/>Detail: 没有获取正确的 betId.",
                        type: "alert",
                        onConfirm: function () {
                            popup.remove();
                        }
                    });
                    return;
                }

                $.ajax({
                    url: "/bet/addBanker",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        answer: quizCtrl.quiz.beResidentData.answer,
                        times: parseFloat(quizCtrl.quiz.beResidentData.odds).toFixed1(),
                        coin: quizCtrl.quiz.beResidentData.residentCount,
                        coinType: quizCtrl.quiz.beResidentData.currencyType,
                        betId: quizCtrl.quiz.betId,
                        token: $.cookie("LIVE_LOGIN_DATA") || ""
                    },
                    timeout: appConfig.appConfig.xhrTimeout,
                    success: function (result) {
                        if (result.code != 0) {
                            consoleText.log(appConfig.consoleText.error + "坐庄失败.");
                            consoleText.log("Detail: " + result.msg);
                            //var popup = livePopup({
                            //    title: "挖坑失败… " + randomEmoji.sad(),
                            //    content: "> < 挖坑失败了…… 请您稍后再试, 真的很抱歉… <br/><br/>Detail: " + result.msg + ".",
                            //    type: "alert",
                            //    onConfirm: function () {
                            //        popup.remove();
                            //    }
                            //});
                            liveToast(param.element, "挖坑失败惹：" + result.msg + randomEmoji.happy(), "caution");
                            return;
                        }

                        liveToast(param.element, "挖坑成功!~ " + randomEmoji.happy(), "success");
                        quizCtrl.quiz.quizJoined = true;
                        console.log("quizJoined: " + quizCtrl.quiz.quizJoined);
                        quizCtrl.$fire("BetBeResidentCancel");  // 借助取消事件关闭面板.

                    },
                    error: function (result) {
                        consoleText.log(appConfig.consoleText.error + "挖坑请求失败.");
                        consoleText.log("Detail: " + result.msg);
                        var popup = livePopup({
                            title: "挖坑失败… " + randomEmoji.sad(),
                            content: "> < 挖坑失败了…… 请您稍后再试, 真的很抱歉… <br/><br/>Status: " + result.status + ".<br/>Detail: " + result.statusText + ".",
                            type: "alert",
                            onConfirm: function () {
                                popup.remove();
                            }
                        });
                    }
                });


            });

            // Definition: 取消坐庄事件.
            quizCtrl.$watch("BetBeResidentCancel", function () {
                quizCtrl.quiz.beResidentData.answer = "";
                quizCtrl.quiz.beResidentData.odds = "";
                quizCtrl.quiz.beResidentData.residentCount = "";
                quizCtrl.doms.beResidentPanel.out = true;
                clearTimeout(quizCtrl.doms.beResidentPanel.outTimeout);
                quizCtrl.doms.beResidentPanel.outTimeout = setTimeout(function () {
                    quizCtrl.doms.beResidentPanel.show = false;
                    quizCtrl.doms.beResidentPanel.out = false;
                }, 380);
            });


            // 认购表.
            // ===========================================

            // Definition: 显示认购表.
            quizCtrl.$watch("BetShowSubscriptionList", function (event) {
                var element = event && event.target || event.srcElement;
                $.ajax({
                    url: "/bet/getBankers",
                    type: "POST",
                    data: {
                        betId: quizCtrl.quiz.betId
                    },
                    dataType: "JSON",
                    success: function (result) {
                        if (result.code != 0) {
                            console.log("Bilibili Live Error: 认购表数据获取错误.");
                            element && liveToast(element, "认购表数据获取错误：" + result.msg, "caution", true);
                            return;
                        }
                        quizCtrl.doms.subscriptionList.show = true;
                        quizCtrl.data.subscriptionList = result.data;
                        element = null;
                    },
                    error: function (result) {
                        element && liveToast(element, "认购表数据获取错误：" + result.statusText, "error", true);
                    }
                });
            });

            // Definition: 关闭认购表.
            quizCtrl.$watch("BetHideSubscriptionList", function () {

            });


            // 下注.
            // ===========================================

            // Definition: 下注事件.
            quizCtrl.$watch("BetBuy", function (callback) {
                if (quizCtrl.quiz.allowNewQuiz) {
                    return;
                }
                if (quizCtrl.account.type === "anchor") {
                    liveToast(event.target || event.srcElement, "播主不可以填坑哦~" + randomEmoji.helpless());
                    return;
                }
                if (quizCtrl.account.type === false) {
                    liveToast(event.target || event.srcElement, "您还没有登录哦~" + randomEmoji.helpless());
                    return;
                }
                quizCtrl.$fire("all!updateCurrency");
                quizCtrl.$fire("QuizCheckStatus", {
                    type: "normal",
                    callback: function () {
                        callback();
                        quizCtrl.doms.betBuyPanel.show = true;
                    }
                });
            });


            // Definition: 下注请求事件.
            quizCtrl.$watch("BetBuyConfirm", function (event) {
                var element = event ? event.target || event.srcElement : document.body;

                if (!quizCtrl.quiz.betBuyData.buyCount) {
                    liveToast(element, "您好像并没有填写填坑量嘛~~ " + randomEmoji.helpless());
                    return;
                }

                // 发送购买请求.
                $.ajax({
                    url: "/bet/addBettor",
                    type: "POST",
                    dataType: "JSON",
                    data: {
                        bankerId: quizCtrl.quiz.betBuyData.bankerId,
                        amount: quizCtrl.quiz.betBuyData.buyCount,
                        token: $.cookie("LIVE_LOGIN_DATA") || ""
                    },
                    success: function (result) {
                        if (result.code != 0) {
                            consoleText.log(appConfig.consoleText.error + "填坑失败.");
                            consoleText.log("Detail: " + result.msg);
                            liveToast(element, "填坑失败惹：" + result.msg, "caution");
                            return;
                        }
                        liveToast(element, "填坑成功!~ " + randomEmoji.happy(), "success");
                        quizCtrl.quiz.quizJoined = true;
                        console.log("quizJoined: " + quizCtrl.quiz.quizJoined);
                        quizCtrl.$fire("BetBuyCancel");  // 借助取消事件关闭面板.
                    },
                    error: function (result) {
                        consoleText.log(appConfig.consoleText.error + "填坑请求失败.");
                        consoleText.log("Detail: " + result.msg);
                        var popup = livePopup({
                            title: "填坑失败了… " + randomEmoji.sad(),
                            content: "> < 填坑失败了…… 请您稍后再试, 真的很抱歉… <br/><br/>Status: " + result.status + ".<br/>Detail: " + result.statusText + ".",
                            type: "alert",
                            onConfirm: function () {
                                popup.remove();
                            }
                        });
                    }
                })

            });


            // Definition: 下注取消事件.
            quizCtrl.$watch("BetBuyCancel", function () {
                quizCtrl.quiz.betBuyData.bankerId = "";
                quizCtrl.quiz.betBuyData.buyCount = "";
                quizCtrl.quiz.betBuyData.maxBuyCount = 0;
                quizCtrl.quiz.betBuyData.buyIncome = 0;
                quizCtrl.doms.betBuyPanel.out = true;
                clearTimeout(quizCtrl.doms.betBuyPanel.outTimeout);
                quizCtrl.doms.betBuyPanel.outTimeout = setTimeout(function () {
                    quizCtrl.doms.betBuyPanel.show = false;
                    quizCtrl.doms.betBuyPanel.out = false;
                }, 380);
            });


        };
    }, {
        "../../../../common/app-config/app-config": 1,
        "../../../../common/components/live-widget/live-popup/live-popup": 7,
        "../../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../../common/functions/func-random-emoji/random-emoji": 16
    }],
    57: [function (require, module, exports) {
        /*
         *  Quiz Broadcast Listener By LancerComet at 10:41, 2015/12/17.
         *  # Carry Your World #
         *  ---
         *  竞猜系统广播监听器.
         *
         */
        var appConfig = require('../../../../common/app-config/app-config');

        module.exports = function (window, undefined) {
            "use strict";

            // Error Handler.
            if (!window.protocol) {
                //window.protocol = {};
                throw new Error(appConfig.console.error + "protocol 未加载, 竞猜模块必须在 protocol 初始化完毕后才可运行.");
            }

            // Definition: 引用 Flash 广播视图对象.
            var flashProtoCtrl = avalon.vmodels.flashProtoCtrl;

            // 竞猜开启广播, 通知房间所有用户竞猜已开启.
            window.protocol.BET_START = function (json) {
                console.log("BET_START");
                console.log(json);
                // 开启竞猜后业务流程：
                // 1. 检查竞猜状态, 并使用广播数据进行判断, 不再让 "checkQuizStatus" 发送请求.
                flashProtoCtrl.$fire("all!QuizCheckStatus", {
                    type: "protocol",
                    json: json.data
                });

            };

            // 竞猜中信息下发广播.
            window.protocol.BET_BANKER = function (json) {
                console.log("BET_BANKER");
                console.log(json);
                flashProtoCtrl.$fire("all!QuizCheckStatus", {
                    type: "protocol",
                    json: json.data
                });
            };

            // 当有人购买之后下发的广播.
            window.protocol.BET_BETTOR = function (json) {
                console.log("BET_BETTOR");
                console.log(json);
                flashProtoCtrl.$fire("all!QuizCheckStatus", {
                    type: "protocol",
                    json: json.data
                });
            };

            // 封盘广播.
            window.protocol.BET_SEAL = function (json) {
                console.log("BET_SEAL");
                console.log(json);
                flashProtoCtrl.$fire("all!QuizAdjourned");
            };

            // 结算中状态广播.
            window.protocol.BET_ENDING = function (json) {
                console.log("BET_ENDING");
                console.log(json);
                flashProtoCtrl.$fire("all!QuizCheckStatus", {
                    type: "protocol",
                    json: json.data
                });
            };

            // 竞猜结束广播, 通知房间所有用户竞猜结束.
            window.protocol.BET_END = function (json) {
                console.log("BET_END");
                console.log(json);
                flashProtoCtrl.$fire("all!QuizGetResult", function () {
                    flashProtoCtrl.$fire("all!QuizRestorePanel", json);
                });
            };

        };
    }, {"../../../../common/app-config/app-config": 1}],
    58: [function (require, module, exports) {
        /*
         *  Recommend Videos Node By LancerComet at 14:16, 2015/12/22.
         *  # Carry Your World #
         *  ---
         *  推荐视频模块.
         */

        var appConfig = require('../../../common/app-config/app-config');
        var lazyInit = require("../../../common/functions/func-avalon-lazy-init/lazy-init");

        module.exports = function (window) {
            "use strict";

            avalon.ready(function () {

                // Error Handler.
                if (!window.ROOMID || !window.ANCHOR_NICK_NAME) {
                    throw new Error(appConfig.consoleText.error + "未获取到 ROOMID, 请检查函数的执行顺序.");
                }


                var recommendVideoCtrl = avalon.define({
                    $id: "recommendVideoCtrl",
                    title: window.ANCHOR_NICK_NAME + "的视频",
                    spaceLink: "http://space.bilibili.com/" + window.MASTERID,
                    show: false,
                    videoList: [],
                    mouseEnter: function (event) {
                        var target = event.target || event.srcElement;
                        $(target).find(".video-props").addClass("hover");
                        $(target).find(".video-merge").addClass("hover");
                    },
                    mouseLeave: function (event) {
                        var target = event.target || event.srcElement;
                        $(target).find(".video-props").removeClass("hover");
                        $(target).find(".video-merge").removeClass("hover");
                    }
                });


                $.ajax({
                    url: "/live/getVideoList/" + window.ROOMID,
                    type: "GET",
                    dataType: "JSON",
                    success: function (result) {
                        if (result.code != 0) {
                            consoleText.log(appConfig.consoleText.error + "服务器返回数据错误: " + result.msg || "（服务器无消息返回）");
                            return;
                        }
                        recommendVideoCtrl.videoList = result.data;
                        recommendVideoCtrl.show = true;
                    },
                    error: function (result) {
                        consoleText.log(appConfig.consoleText.error + "推荐视频获取失败: \n" + result.statusText);
                    }
                });


                lazyInit(document.getElementById("recommend-videos"), recommendVideoCtrl);
            });


        };

    }, {"../../../common/app-config/app-config": 1, "../../../common/functions/func-avalon-lazy-init/lazy-init": 9}],
    59: [function (require, module, exports) {
        /*
         *  Charge Panel By LancerComet at 14:29, 2016/1/8.
         *  # Carry Your World #
         *  ---
         *  快速购买 BP 逻辑.
         */

        var livePopup = require('../../../common/components/live-widget/live-popup/live-popup');
        var liveToast = require('../../../common/components/live-widget/live-toast/live-toast');
        var randomEmoji = require('../../../common/functions/func-random-emoji/random-emoji');

// Definition: 按钮状态变换计时器.
        var btnTextInterval = null;

        module.exports = function (event, seedExchangeCtrl) {
            "use strict";

            var target = event.target || event.srcElement;
            var buyCount = parseInt(seedExchangeCtrl.data.charge.buyCount, 10);

            // Error Handler.
            if (buyCount <= 0 || isNaN(buyCount)) {
                liveToast(target, "请输入大于 0 的数字喔 " + randomEmoji.helpless(), true);
                return;
            }

            // 设置按钮文字.
            (function setBtnText() {
                seedExchangeCtrl.doms.charge.btnText = "正在兑换中.";
                var dots = 1;
                btnTextInterval = setInterval(function () {
                    if (dots >= 6) {
                        seedExchangeCtrl.doms.charge.btnText = "正在兑换中";
                        dots = 0;
                        return;
                    }
                    seedExchangeCtrl.doms.charge.btnText += ".";
                    dots++;
                }, 500);

            })();

            $.ajax({
                url: "/payCenter/quickPay",
                type: "GET",
                data: {
                    bpNum: buyCount
                },
                dataType: "JSON",
                success: function (result) {
                    // 还原按钮文字.
                    clearInterval(btnTextInterval);
                    seedExchangeCtrl.doms.charge.btnText = "立刻购买";

                    if (result.code == 0) {

                        // 余额不够, 弹窗进行 Bp 购买快捷支付.
                    } else if (result.code == -400) {

                        // Definition: 定义订单信息.
                        var payData = {
                            orderNo: result.data.order,
                            cashierURL: result.data.cashier_url
                        };

                        // 开始 BP 快速充值逻辑.
                        seedExchange(payData);

                        // 其他状态.
                    } else {
                        liveToast(target, result.msg);
                    }
                },
                error: function (result) {
                    clearInterval(btnTextInterval);
                    seedExchangeCtrl.doms.charge.btnText = "立刻购买";
                    liveToast(target, "与服务器通信失败，请稍后再试 > <", "error");
                }
            });


            function seedExchange(payData) {
                // Action: 创建充值提示弹窗.
                var quickPayPopup = livePopup({
                    title: "BP 不够惹",
                    content: "您的 B 币余额不足，要不要充一点？" + randomEmoji.happy(),
                    button: {
                        confirm: "葱！",
                        cancel: "先不葱了~"
                    },
                    width: "300px",

                    // 点击进入快速充值逻辑.
                    onConfirm: function () {
                        window.open(payData.cashierURL);
                        payInProcess();
                    },

                    // 关闭面板时也更新瓜子数量.
                    onCancel: function () {
                        seedExchangeCtrl.$fire("all!updateCurrency");
                        seedExchangeCtrl.$fire("getBp");
                    }
                });


                // Definition: 进入 Bp 充值中状态函数.
                function payInProcess() {

                    // Action: 移除之前的提示弹窗.
                    quickPayPopup.remove();

                    // Definition: 创建正在支付弹窗.
                    var payInProcessPanel = livePopup({
                        title: "正在支付中……",
                        content: '请在支付完毕后点击下方的 "支付完成" 按钮喔！' + randomEmoji.happy(),
                        width: "350px",
                        type: "info",
                        button: {
                            confirm: "支付完成"
                        },
                        onConfirm: function () {

                            // 查询订单状态.
                            $.ajax({
                                url: "/payCenter/orderStatus",
                                type: "GET",
                                data: {
                                    order: payData.orderNo
                                },
                                dataType: "JSON",
                                success: successCallback,
                                error: errorCallback
                            });

                        }
                    });

                    // 成功回调.
                    function successCallback(result) {
                        if (result.code == "0") {

                            // 销毁正在充值面板.
                            payInProcessPanel.remove();

                            // 进入充值成功逻辑.
                            paySucceed(result);

                        } else {
                            liveToast(payInProcessPanel.confirmBtn, result.msg, true);
                        }
                    }

                    // 失败回调.
                    function errorCallback(result) {
                        livePopup({
                            title: "订单状态查询错误",
                            html: "<p>您的订单状态查询失败，请您刷新页面并到个人中心检查您的金额，如果充值失败，请联系客服，真的非常抱歉！> <<br/><br/>失败原因: " + result.statusText + "</p>",
                            width: "350px",
                            type: "alert",
                            button: {
                                confirm: "真的很抱歉 > <"
                            }
                        });
                    }

                    // Definition: 充值成功.
                    function paySucceed(result) {
                        // 创建成功弹窗.
                        livePopup({
                            title: "购买完成惹！",
                            content: "您已经成功购买 " + result.data.orderGold + " 金瓜子，恭喜恭喜！" + randomEmoji.happy(),
                            width: "300px",
                            button: {
                                confirm: "完成完成！"
                            },
                            type: "info"
                        });

                        // 更新金瓜子.
                        seedExchangeCtrl.$fire("all!updateCurrency", {
                            gold: result.data.gold
                        });

                        // 更新 Bp 数量.
                        seedExchangeCtrl.$fire("getBp");
                    }

                }
            }


        };

    }, {
        "../../../common/components/live-widget/live-popup/live-popup": 7,
        "../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../common/functions/func-random-emoji/random-emoji": 16
    }],
    60: [function (require, module, exports) {
        /*
         *  Exchange Events By LancerComet at 18:12, 2016/1/8.
         *  # Carry Your World #
         *  ---
         *  瓜子兑换逻辑定义.
         */

        var liveToast = require('../../../common/components/live-widget/live-toast/live-toast');
        var livePopup = require('../../../common/components/live-widget/live-popup/live-popup');
        var randomEmoji = require('../../../common/functions/func-random-emoji/random-emoji');
        var liveQuickLogin = require('../../../common/functions/func-live-quick-login/live-quick-login');

        module.exports = {

            // Definition: 使用金瓜子兑换.
            exchangeViaGold: function (event, seedExchangeCtrl) {
                liveQuickLogin();

                var element = event.target || event.srcElement;
                var exchangeGold = parseInt(seedExchangeCtrl.data.exchange.count.gold, 10);

                if (isNaN(exchangeGold) || exchangeGold < 1) {
                    liveToast(element, "请输入正确的数量哦 " + randomEmoji.helpless(), true);
                    return;
                }

                $.ajax({
                    url: "/gold/goldToSilver",
                    type: "GET",
                    data: {
                        cgold: exchangeGold
                    },
                    dataType: "JSON",
                    success: function (result) {
                        if (result.code == 0) {

                            liveToast(element, "已成功兑换 " + result.data.csilver + " 银瓜子！" + randomEmoji.happy(), "success");

                            seedExchangeCtrl.$fire("all!updateCurrency", {
                                gold: result.data.gold,
                                silver: result.data.silver
                            });

                        } else if (result.code == -400) {

                            var popup = livePopup({
                                title: "金瓜子不够惹~",
                                content: "您的金瓜子不够了，要不要充一点？" + randomEmoji.helpless(),
                                button: {
                                    confirm: "葱！",
                                    cancel: "先不葱了~"
                                },
                                width: "320px",
                                onConfirm: function () {
                                    seedExchangeCtrl.$fire("showExchange", "charge");
                                    popup.remove();
                                    popup = null;
                                }
                            })

                        } else {
                            liveToast(element, result.msg || "兑换出现问题，还请稍后再试，一定会好的……" + randomEmoji.sad(), "caution", true);
                        }
                    },
                    error: function (result) {
                        var popup = livePopup({
                            title: "呜~~~……",
                            html: "<p>兑换出现问题，可能是网络不通畅，也可能是炸了 " + randomEmoji.sad() + "，还请您稍后再试… 实在很抱歉 " + randomEmoji.sad() + "<br>错误原因: " + result.statusText + "</p>",
                            type: "alert",
                            width: 300,
                            onConfirm: function () {
                                popup.remove();
                                popup = null;
                            }
                        });
                    }
                })


            },

            // Definition: 使用硬币兑换.
            exchangeViaCoin: function (event, seedExchangeCtrl) {
                liveQuickLogin();
                var element = event.target || event.srcElement;
                var exchangeCoin = parseInt(seedExchangeCtrl.data.exchange.count.coin, 10);

                if (isNaN(exchangeCoin) || exchangeCoin < 0) {
                    liveToast(element, "请输入正确的数量哦 " + randomEmoji.helpless(), true);
                    return;
                }

                $.ajax({
                    url: "/exchange/coin2silver",
                    type: "POST",
                    data: {
                        coin: exchangeCoin
                    },
                    dataType: "JSON",
                    success: function (result) {
                        if (result.code != 0) {
                            liveToast(element, result.msg, "caution", true);
                            return;
                        }
                        liveToast(element, "成功兑换 " + result.data.silver + " 银瓜子！" + randomEmoji.happy(), "success", true);

                        // 更新瓜子数.
                        seedExchangeCtrl.$fire("all!updateCurrency");
                    },
                    error: function (result) {
                        var popup = livePopup({
                            title: "呜~~~……",
                            html: "<p>兑换出现问题，可能是网络不通畅，也可能是炸了 " + randomEmoji.sad() + "，还请您稍后再试… 实在很抱歉 " + randomEmoji.sad() + "<br>错误原因: " + result.statusText + "</p>",
                            type: "alert",
                            width: 300,
                            onConfirm: function () {
                                popup.remove();
                                popup = null;
                            }
                        });
                    }
                })
            }

        };
    }, {
        "../../../common/components/live-widget/live-popup/live-popup": 7,
        "../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../common/functions/func-live-quick-login/live-quick-login": 14,
        "../../../common/functions/func-random-emoji/random-emoji": 16
    }],
    61: [function (require, module, exports) {
        /*
         *  Seed Exchange By LancerComet at 16:49, 2016/1/7.
         *  # Carry Your World #
         *  ---
         *  瓜子兑换 / 充值面板.
         */

        var lazyInit = require('../../../common/functions/func-avalon-lazy-init/lazy-init');
        var seedExchange = require('./exchange');
        var charge = require('./charge');

        module.exports = function () {
            "use strict";

            avalon.ready(function () {

                var seedExchangeCtrl = avalon.define({
                    $id: "seedExchangeCtrl",

                    // 节点信息对象.
                    doms: {

                        // Bp 兑换瓜子节点.
                        exchange: {
                            out: false,
                            show: false,
                            outTimeout: null,

                            open: function () {
                                seedExchangeCtrl.$fire("showExchange", "exchange");
                                seedExchangeCtrl.doms.noSeed.close();
                            },
                            close: function () {
                                panelClose("exchange");
                            },

                            panelNow: "gold",
                            panelSwitch: function (panel) {
                                seedExchangeCtrl.doms.exchange.panelNow = panel;
                            }

                        },

                        // 瓜子充值节点.
                        charge: {
                            out: false,
                            show: false,
                            outTimeout: null,

                            open: function () {
                                seedExchangeCtrl.$fire("showExchange", "charge");
                                seedExchangeCtrl.doms.noSeed.close();
                            },
                            close: function () {
                                panelClose("charge");
                            },

                            btnText: "立刻购买"
                        },

                        // 瓜子不足提醒面板.
                        noSeed: {
                            out: false,
                            show: false,
                            outTimeout: null,
                            close: function () {
                                panelClose("noSeed");
                            }
                        }
                    },

                    // 数据信息.
                    data: {
                        // 账户信息.
                        account: {
                            gold: 0,
                            silver: 0,
                            biliCoin: 0
                        },

                        // 兑换数据.
                        exchange: {
                            count: {
                                gold: "",
                                coin: ""
                            }
                        },

                        // 充值数据.
                        charge: {
                            myBp: 0,
                            buyCount: ""
                        }
                    },

                    // 事件定义.
                    events: {
                        exchange: {
                            viaGold: function (event) {
                                seedExchange.exchangeViaGold(event, seedExchangeCtrl);
                            },
                            viaCoin: function (event) {
                                seedExchange.exchangeViaCoin(event, seedExchangeCtrl);
                            }
                        },
                        buyGold: buyGold
                    }
                });

                // Definition: 面板显示通用事件.
                seedExchangeCtrl.$watch("showExchange", function (panel) {
                    seedExchangeCtrl.doms[panel].show = true;
                    seedExchangeCtrl.$fire("all!updateCurrency");
                    panel === "charge" && seedExchangeCtrl.$fire("getBp");
                });

                // Definition: 瓜子不足提示事件.
                seedExchangeCtrl.$watch("noSeed", function () {
                    seedExchangeCtrl.$fire("showExchange", "noSeed");
                });

                // Definition: 获取 BP 数量.
                seedExchangeCtrl.$watch("getBp", function () {
                    $.ajax({
                        url: "/payCenter/getBp",
                        type: "GET",
                        cache: false,
                        dataType: "JSON",
                        timeout: 5 * 1000,
                        success: function (result) {
                            if (result.code != 0) {
                                return;
                            }
                            seedExchangeCtrl.data.charge.myBp = result.data.bp.bp;
                        },
                        error: function (result) {

                        }
                    });
                });

                // Definition: 瓜子更新事件.
                seedExchangeCtrl.$watch("fillCurrency", function (value) {
                    seedExchangeCtrl.data.account.gold = value.gold;
                    seedExchangeCtrl.data.account.silver = value.silver;
                    seedExchangeCtrl.data.account.biliCoin = value.biliCoin;
                });

                // Lazy Init.
                lazyInit($("#seed-exchange")[0], seedExchangeCtrl);


                /* Definition goes below. */

                // Definition: 面板关闭方法.
                function panelClose(panel) {
                    seedExchangeCtrl.doms[panel].out = true;
                    setTimeout(function () {
                        seedExchangeCtrl.doms[panel].show = false;
                        seedExchangeCtrl.doms[panel].out = false;
                    }, 380);
                }

                // Definition: Bp 购买金瓜子事件.
                function buyGold(event) {
                    charge(event, seedExchangeCtrl)
                }

            });

        };

    }, {"../../../common/functions/func-avalon-lazy-init/lazy-init": 9, "./charge": 59, "./exchange": 60}],
    62: [function (require, module, exports) {
        /*
         *  Bilibili Live Room Sign Up at 15:22, 2016.01.05.
         *  ---
         *
         *  描述：
         *  ---
         *  本文件为直播房间页面签到模块 JS 入口文件.
         *  本文件不编写任何逻辑, 仅做引用.
         */

        module.exports = function () {
            require("./javascripts/sign-up.js")();  // 签到
        };
    }, {"./javascripts/sign-up.js": 63}],
    63: [function (require, module, exports) {
        /*
         *  Bilibili Live Room Sign Up at 12:11, 2015.12.23.
         *  ---
         *
         *  描述：
         *  ---
         *  签到面板相关逻辑
         *
         */

//var liveQuickLogin = require("liveQuickLogin");
        var liveQuickLogin = require("../../../../common/functions/func-live-quick-login/live-quick-login");

        module.exports = function () {
            // 房间签到 VM
            var signUpVM = avalon.define({
                $id: "signUpCtrl",
                signInShow: false,
                signInData: {
                    status: 0
                },
                loggedIn: false,
                // 签到
                doSign: function (event) {
                    event.stopPropagation();
                    liveQuickLogin();
                    if (signUpVM.signInData.status) {
                        signUpVM.signInShow = !signUpVM.signInShow;
                    } else {
                        $.ajax({
                            url: "/sign/doSign",
                            type: "get",
                            dataType: "json",
                            success: function (result) {
                                if (result.code == 0) {
                                    signUpVM.signInData = result.data;
                                    signUpVM.signInShow = true;
                                    signUpVM.signInData.status = 1;

                                    $("#room-left-sidebar .small-wrap .sign").attr("data-label", "已签到");

                                    // 签到成功后 3 秒关闭签到面板
                                    setTimeout(function () {
                                        signUpVM.signInShow = false;
                                    }, 3000)
                                }
                            }
                        });
                    }

                },

                // 我的任务
                myTask: function () {
                    liveQuickLogin();
                    window.open('/i/myTask', '_blank');
                }
            });

            // Watch 已签到天数，更新进度条
            signUpVM.$watch("signInData.hadSignDays", function (value) {
                var widthValue = (value < 20) ? (value / 20 * 100) : 100;
                $(".sign-in-panel .progress-bar-wrap .progress-data").width(widthValue + "%")
            });

            // 获取签到信息
            function getSignInfo() {
                // 用户如果未登陆，则不发送获取签到信息的请求
                if (document.cookie.indexOf("DedeUserID") < 0) {
                    return false;
                }
                signUpVM.loggedIn = true;
                $.ajax({
                    url: "/sign/GetSignInfo",
                    type: 'get',
                    dataType: "json",
                    success: function (result) {
                        if (result.code == 0) {
                            signUpVM.signInData = result.data;
                            if (result.data.status) {
                                $("#room-left-sidebar .small-wrap .sign").attr("data-label", "已签到");
                            }
                        }
                    }
                });
            }

            // 执行获取签到信息函数
            getSignInfo();

            $(function () {
                // 签过到后点击 document 可以隐藏签到面板
                $(document).on("click", function () {
                    signUpVM.signInShow = false;
                });
            });
        };


    }, {"../../../../common/functions/func-live-quick-login/live-quick-login": 14}],
    64: [function (require, module, exports) {
        /*
         *  Treasure Box Transferred by LancerComet at 19:16, 2016/1/7.
         *  # Carry Your World #
         *  ---
         *  作死宝箱.
         */

        var liveRoomFuncs = require('../../room-javascripts/live-room-funcs');
        var liveToast = require('../../../common/components/live-widget/live-toast/live-toast');
        var randomEmoji = require('../../../common/functions/func-random-emoji/random-emoji');
        var liveQuickLogin = require('../../../common/functions/func-live-quick-login/live-quick-login');

// window.treasureRestore 为恢复宝箱逻辑的方法.
// 当传入的值 restore = true 时, 进行恢复.
        module.exports = window.treasureRestore = function (window, restore) {

            // 原封不动复制进来.
            // 真鸡巴作死.

            if (restore === true) {
                $(".treasure-box-panel").remove();
            }

            // Definition: 宝箱控制器定义. 目前用于事件广播.
            var treasureCtrl = avalon.define({
                $id: "treasureCtrl"
            });

            var CountDown = liveRoomFuncs.CountDown;

            // Definition: 旧版组件定义.
            (function () {
                window.Popup = function (options) {
                    // 备份整个传入参数.
                    this.options = options;

                    // 构造面板 Dom 结构. 传入参数中若 arrow = true, 则额外加入箭头样式.
                    this.el = options.arrow ? $('<div class="treasure-box-panel live-popup-panel"><div class="tip-arrow"><div class="tip-arrow-outer"></div><div class="tip-arrow-inner"></div></div><div class="tip-content">' + options.content + '</div></div>').appendTo(".room-panels") : $('<div class="treasure-box-panel live-popup-panel"><div class="tip-content">' + options.content + '</div></div>').appendTo(".room-panels");
                    this.el.css({
                        height: options.height,
                        width: options.width
                    });
                    // 定义面板内容 Dom 引用.
                    var content = $('.tip-content, .center-tip-content', this.el);
                    content.width(options.width || 100);  // 设置面板宽度.
                    if (options.closable) {  // 关闭按钮设置.
                        var closeTip = $('<div class="close-btn right-top"></div>');
                        var self = this;
                        content.prepend(closeTip);
                        closeTip.on('click', function () {
                            self.hide();
                        });
                    }
                };
                window.Popup.prototype.show = function (el) {
                    this.el.removeClass("out");
                    var offset = el.offset();
                    var top = (this.options.arrow || this.options.direction == 'down') ? offset.top + el.height() : offset.top - this.options.height - 10;
                    var left = (this.options.arrow || this.options.direction == 'down') ? offset.left : offset.left + 50;
                    this.el.stop(false, true).css({
                        top: top,
                        left: left
                    }).fadeIn().end();
                };
                window.Popup.prototype.hide = function () {
                    //this.el.stop(false, true).fadeOut().end();
                    var popup = this.el;
                    popup.addClass("out");
                    setTimeout(function () {
                        popup.removeClass("out");
                        popup.hide();
                    }, 380);
                };


            })();


            // 宝箱
            window.coutdownBox = null;
            window.createTreasure = function () {
                var $treasure = $('.treasure');
                var $closeTreasure = $('.close-treasure-box');
                var $treasureBox = $('.treasure-box').removeClass('animate7').addClass('animate1');
                var $treasureCountdown = $('.treasure-count-down');
                var getCookie = $.cookie("F_S_T_" + window.UID);
                if (getCookie == 0) {
                    $treasure.hover(function () {
                        $closeTreasure.show();
                    }, function () {
                        $closeTreasure.hide();
                    });
                    $closeTreasure.off('click').click(function () {
                        $treasureBox.hide();
                        $treasureBox.prev().hide();
                        $closeTreasure.hide();
                        $treasure.off('mouseenter').off('mouseleave');
                        $treasureCountdown.css({
                            'cursor': 'pointer',
                            'left': 0
                        }).click(function () {
                            $treasureBox.show();
                            $treasureBox.prev().show();
                            $closeTreasure.show();
                            $treasure.hover(function () {
                                $closeTreasure.show();
                            }, function () {
                                $closeTreasure.hide();
                            });
                            $treasureCountdown.css({
                                'cursor': 'default',
                                'left': ''
                            }).off('click');
                        });
                    });
                    if (!coutdownBox) {
                        coutdownBox = new Popup({
                            'content': '<i class="treasure-img close"></i><div style="display: inline-block;width: 190px;padding-left: 10px;"><h3 class="panel-title">宝箱倒计时 ' + randomEmoji.happy() + '</h3><p>距离本次领取剩余 <span id="pop-count-down"></span> 本次宝箱收益 <span id="gz-num"></span> 银瓜子.</p><button class="acknowledge-btn live-btn default">我知道了</button></div>',
                            'width': 290,
                            'height': 120,  // Origin: 135
                            'closable': true,
                            'arrow': false
                        });
                    }
                    $treasureBox.off('click').click(function () {
                        LOGINED ? coutdownBox.show($treasureBox) : liveQuickLogin();
                    });
                    $('button', coutdownBox.el).off('click').off('click').on('click', function () {
                        coutdownBox.hide();
                    });
                } else {
                    $treasure.addClass("out");
                    setTimeout(function () {
                        $treasure.hide().removeClass("out");
                    }, 450);
                }
            };

            window.LAST_COUNT_DOWN = null;
            window.LOGINED = false;

            window.countdown = function () {
                if (LAST_COUNT_DOWN != null) {
                    LAST_COUNT_DOWN.clearCountdown();
                }
                $.ajax({
                    url: "/FreeSilver/getCurrentTask?r=" + Math.random(),
                    type: 'get',
                    dataType: "json",
                    success: function (result) {
                        if (result.code == 0) {
                            LOGINED = true;
                            var silver = result.data.silver;
                            $('#gz-num').text(silver);

                            var endTime = new Date();
                            endTime.setMinutes(endTime.getMinutes() + result.data.minute);
                            LAST_COUNT_DOWN = new CountDown({
                                endTime: endTime,
                                element: $('.treasure-count-down, #pop-count-down'),
                                callback: function () {
                                    $.ajax({
                                        url: "/freeSilver/getSurplus?r=" + Math.random(),
                                        type: 'get',
                                        dataType: "json",
                                        success: function (result) {
                                            if (result.code !== 0) {
                                                return false;
                                            }
                                            var surplus = result.data.surplus;
                                            if (surplus < 1) {
                                                playTreasureAnimate(result.data.silver);
                                            } else {
                                                resetCountDown(surplus);
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            };

            window.resetCountDown = function (surplus) {
                if (LAST_COUNT_DOWN != null) {
                    LAST_COUNT_DOWN.clearCountdown();
                }
                var endTime = new Date();
                endTime.setMinutes(endTime.getMinutes() + surplus);
                LAST_COUNT_DOWN = new CountDown({
                    endTime: endTime,
                    element: $('.treasure-count-down, #pop-count-down'),
                    callback: function () {
                        $.ajax({
                            url: "/freeSilver/getSurplus?r=" + Math.random(),
                            type: 'get',
                            dataType: "json",
                            success: function (result) {
                                if (result.code !== 0) {
                                    return false;
                                }
                                var surplus = result.data.surplus;
                                if (surplus < 1) {
                                    playTreasureAnimate(result.data.silver);
                                } else {
                                    resetCountDown(surplus);
                                }
                            }
                        });
                    }
                });
            };


            window.verifyBox = null;
            window.CLICK_FLAG = 0;

            window.playTreasureAnimate = function (silver) {
                var step = 1;
                var guazNum = silver;
                var $treasureBox = $('.treasure-box').show();
                $treasureBox.prev().show();
                $('.treasure-count-down').css({
                    'cursor': 'default',
                    'left': ''
                });
                $('.treasure').off('mouseenter').off('mouseleave');
                var interval = setInterval(_play, 100);

                function _play() {
                    var next = step + 1;
                    $treasureBox.addClass('animate' + next).removeClass('animate' + step);
                    step = next;
                    if (step === 7) {
                        clearInterval(interval);
                    }
                }

                if (!window.verifyBox) {
                    window.verifyBox = new Popup({
                        'content': '<i class="treasure-img open"></i><div style="display: inline-block;width: 180px;padding-left: 10px;"><div id="silver-notice-div"></div><input id="freeSilverCaptchaInput"type="text" length="4" class="live-input material" style="width: 65px;" placeholder="小学算数"><img id="captchaImg" src="" alt="算算术~" style="width: 60px; height: 30px;vertical-align: top"><a id="changeCaptcha" class="bili-link" href="javascript: void(0);">刷新</a><button class="live-btn default" id="getFreeSilverAward">领取</button></div>',
                        'width': 290,
                        'height': 135,
                        'closable': true,
                        'arrow': false
                    });
                }
                $('#silver-notice-div').html('请输入计算结果领取 ' + guazNum + ' 银瓜子' + randomEmoji.helpless());
                if (CLICK_FLAG == 0) {
                    CLICK_FLAG = 1;
                    $("#freeSilverCaptchaInput").off("keyup").on("keyup", function (event) {
                        event.keyCode === 13 && getFreeSilver(event);
                    });

                    $('button', verifyBox.el).on('click', getFreeSilver);
                }

                $treasureBox.off('click').click(function () {
                    verifyBox.show($treasureBox);
                    refreshCaptcha();
                });

                //$('input', verifyBox.el).on('focus',refreshCaptcha);
                $("#captchaImg, #changeCaptcha").on('click', refreshCaptcha);
            };


            // Definition: 发送请求获取瓜子.
            window.getFreeSilver = function (e) {
                $("#getFreeSilverAward").text("领取中...");
                $.ajax({
                    url: "/freeSilver/getAward?r=" + Math.random(),
                    type: 'get',
                    data: {
                        captcha: $('input', verifyBox.el).val()
                    },
                    dataType: "json",
                    success: function (result) {
                        $("#getFreeSilverAward").text("领取");
                        if (result.code == 0) {
                            liveToast($(e.currentTarget)[0], '成功领取 ' + result.data.awardSilver + ' 银瓜子！' + randomEmoji.happy(), "success");
                            var silverNumb = parseInt(result.data.silver, 10);
                            console.log(silverNumb);
                            treasureCtrl.$fire("all!updateCurrency", {silver: silverNumb});
                            createTreasure();
                            $('#freeSilverCaptchaInput').val('');
                            verifyBox.hide();
                            setTimeout(function () {
                                countdown();
                            }, 3000);
                        } else {
                            liveToast($(e.currentTarget)[0], result.msg);
                            $("#captchaImg").click();
                        }

                    },
                    error: function () {
                        liveToast($(e.currentTarget)[0], "系统错误，请稍后再试 " + randomEmoji.sad(), "error");
                        refreshCaptcha();
                        $("#getFreeSilverAward").text("领取");
                    },
                    complete: function () {
                        if (LAST_COUNT_DOWN != null) {
                            LAST_COUNT_DOWN.clearCountdown();
                            LAST_COUNT_DOWN = null;
                        }
                    }
                });
            };

            window.FREE_SILVER_HEART = 0;
            window.freeSilverHeart = function () {
                if ($.cookie('F_S_T_' + window.UID) == 1) {
                    return false;
                }

                setTimeout(function () {
                    countdown();
                }, 3000);

                FREE_SILVER_HEART = setInterval(function () {
                    $.ajax({
                        url: "/freeSilver/heart?r=" + Math.random(),
                        type: 'get',
                        dataType: "json",
                        success: function (result) {
                            //result.data.minute = 1;  // TESTING.
                            if ($.cookie('F_S_T_' + window.UID) == 1) {
                                clearInterval(FREE_SILVER_HEART);
                                return true;
                            }
                        }
                    })
                }, 60000);  // TESTING: 原版为 60000

            };

            window.refreshCaptcha = function () {
                $("#captchaImg").attr("src", "/FreeSilver/getCaptcha?t=" + Math.random());
            };

            // 闪耀之星活动脚本载入 By [彗星.LancerComet] at 14:27, 2015.10.16.
            // 活动结束后移除.
            restore !== true && (function (window, undefined) {
                console.log("Shining Star Treasurebox.");
                console.log("IS_STAR: " + window.IS_STAR);

                if (window.IS_STAR) {
                    $.getScript("http://static.hdslb.com/live-static/live-room/activity/shining-star.min.js");
                    parseInt(window.FREE_SILVER_TIMES, 10) <= 3 && replaceFunc();
                }

                // Definition: 下次等待领取的瓜子与投票数数量.
                var weAreGoingtoGet = {
                    vote: null,
                    seed: null
                };

                // Definition: 函数替换.
                // 替换 live.room 中存在的函数为活动使用的函数内容.
                function replaceFunc() {

                    // 闪耀之星宝箱创建方法.
                    createTreasure = function () {
                        // Definition: Necessary nodes requirement. | 节点引用定义.
                        var $treasureContainer = $(".treasure").addClass("shining-star-treasure"),
                            $treasureCloseBtn = $(".close-treasure-box"),
                            $treasureBox = $(".treasure-box").removeClass('animate7').addClass('animate1'),  // 初始化样式并返回 jQuery 对象.
                            $treasureBoxFooter = $(".treasure-box-footer"),
                            $treasureCountdown = $(".treasure-count-down"),
                            cookieFST = $.cookie("F_S_T_" + window.UID);

                        // Action: Treasure events go out when cookieFst exists. | 当存在 "F_S_T_" 的 Cookie 时，关闭宝箱领取.
                        cookieFST ? treasureExit() : mainLogic();

                        /* ---- Definition go below. ---- */

                        // Definition: 宝箱滚粗.
                        function treasureExit() {
                            $treasureContainer.addClass("out");
                            setTimeout(function () {
                                $treasureContainer.hide().removeClass("out");
                            }, 450);
                        }

                        // Definition: 宝箱主体逻辑.
                        function mainLogic() {

                            // Definition: Hover Event of $treasureContainer. | Hover 事件绑定 @ $treasureContainer.
                            var $treasureHover = {
                                on: function () {
                                    $treasureContainer.hover(function () {
                                        $treasureCloseBtn.show();
                                    }, function () {
                                        $treasureCloseBtn.hide();
                                    });
                                },

                                off: function () {
                                    $treasureContainer.off("mouseenter").off("mouseleave");
                                }
                            };

                            // Definition: Countdown node style changer. | 倒计时节点样式控制.
                            // 在最大 / 小化宝箱之后设置样式.
                            var $countdownStyle = {
                                toClickable: function () {
                                    $treasureCountdown.css({"cursor": "pointer", "left": "0"});
                                },
                                toUnclickable: function () {
                                    $treasureCountdown.css({"cursor": "default", "left": ""});
                                }
                            };

                            // Definition: Countdown on-click Handler. | 计时器节点点击事件处理机.
                            var $countdownOnClick = {
                                on: function () {
                                    $treasureCountdown.on("click", $treasureBoxCtrl.maximize);
                                },
                                off: function () {
                                    $treasureCountdown.off("click");
                                }
                            };

                            // Definition: Minimize & Maximize TreasureBox. | 最小 / 大化宝箱方法.
                            // @ 当用户点击宝箱上的关闭（其实是最小化）按钮后执行最小化方法.
                            // @ 还有相反的还原方法.
                            var $treasureBoxCtrl = {
                                minimize: function minimize() {
                                    $treasureBox.hide();  // 隐藏节点.
                                    $treasureBoxFooter.hide();  // 隐藏节点.
                                    $treasureCloseBtn.hide();  // 隐藏节点.
                                    $treasureHover.off();  // 解除 Hover 绑定.
                                    $countdownStyle.toClickable();  // 设置计时器节点样式: toClickable.
                                    $countdownOnClick.on();  // 开启计时器节点点击监听.
                                },
                                maximize: function maximize() {
                                    $treasureBox.show();  // 隐藏节点.
                                    $treasureBoxFooter.show();  // 隐藏节点.
                                    $treasureCloseBtn.show();  // 隐藏节点.
                                    $treasureHover.on();  // 开启 Hover 绑定.
                                    $countdownStyle.toUnclickable();  // 设置计时器节点样式: toUnclickable.
                                    $countdownOnClick.off();  // 解除计时器节点点击监听.
                                }
                            };

                            // Action: 设置宝箱节点 Hover 事件.
                            $treasureHover.on();

                            // Action: 宝箱关闭（最小化）按钮设置事件监听.
                            $treasureCloseBtn.off("click").on("click", $treasureBoxCtrl.minimize);

                            // 来自前人的代码逻辑.
                            // 各种污染简直看不下去.
                            (function dirtyCode() {

                                // 当没有 window.coutdownBox (泥马晕语写错了啊) 时创建这个全局变量.
                                if (!coutdownBox) {
                                    coutdownBox = new Popup({
                                        content: '<i class="treasure-img close"></i>' +
                                        '<div style="display: inline-block;width: 180px; padding-left: 10px;">' +
                                        '<h3 class="panel-title">宝箱倒计时 ' + randomEmoji.happy() + '</h3>' +
                                        '<p style="margin-top: .5em">距离本次领取剩余时间为 <span id="pop-count-down" style="color: #359CCB">--:--</span>，</p>' +
                                        '<p style="margin-bottom: 1em">本次宝箱可获取 <span id="gz-num" style="color: #359CCB"></span> 银瓜子和 <span id="vote-coupons" style="color: #359CCB"></span> 张投票券.</p>' +
                                        '<button class="acknowledge-btn live-btn default">我知道了' +
                                        '</div>',
                                        width: 290,
                                        height: 135,
                                        closable: true,
                                        arrow: false
                                    });
                                }

                                // Action: TreasureBox on-click Event Handler. | 宝箱设置点击监听.
                                $treasureBox.off("click").on("click", function () {
                                    window.LOGINED ? coutdownBox.show($treasureBox) : liveQuickLogin();
                                });

                                // Action: Set close event of close button in pop-up panel. | 设置宝箱弹出面板的关闭按钮事件.
                                // 为何要再构造之外设置 ...
                                $("button", coutdownBox.el).off("click").off("click").on("click", function () {
                                    coutdownBox.hide();
                                });

                            })();


                        }

                    };

                    // 闪耀之星动画变换方法.
                    // 此方法耦合度甚高, 包含了奖励领取逻辑.
                    // 架锅烧水.
                    playTreasureAnimate = function (silver) {
                        var step = 1;
                        var guazNum = silver;
                        var $treasureBox = $('.treasure-box').show();
                        $treasureBox.prev().show();
                        $('.treasure-count-down').css({
                            'cursor': 'default',
                            'left': ''
                        });
                        $('.treasure').off('mouseenter').off('mouseleave');
                        var interval = setInterval(_play, 100);

                        function _play() {
                            var next = step + 1;
                            $treasureBox.addClass('animate' + next).removeClass('animate' + step);
                            step = next;
                            if (step === 7) {
                                clearInterval(interval);
                            }
                        }

                        if (!verifyBox) {
                            window.verifyBox = new Popup({
                                'content': '<i class="treasure-img open" style="background-image: url(http://static.hdslb.com/live-static/images/shining-star/treasure-box-large.png); background-size: contain"></i>' +
                                '<div style="display:none;" id="shining-star-verify"></div>' +
                                '<div style="display: inline-block; width: 180px;padding-left: 10px;">' +
                                '<div id="silver-notice-div"></div>' +
                                '<input id="freeSilverCaptchaInput" type="text" length="4" class="live-input material" style="width: 65px;" placeholder="小学算数">' +
                                '<img id="captchaImg" src="" alt="算算术~" style="width: 60px; height: 30px;vertical-align: top">' +
                                '<a id="changeCaptcha" href="javascript: void(0);" class="bili-link">刷新</a>' +
                                '<button class="live-btn default" id="getFreeSilverAward">领取</button>' +
                                '</div>',
                                'width': 280,
                                'height': 135,
                                'closable': true,
                                'arrow': false
                            });
                        }
                        $('#silver-notice-div').html('请输入计算结果领取 <span style="color: #4fc1e9">' + weAreGoingtoGet.seed + '</span> 银瓜子和 <span style="color: #4fc1e9">' + weAreGoingtoGet.vote + "</span> 投票券.").css({
                            "padding-right": "10px",
                            "margin-bottom": "10px"
                        });
                        if (CLICK_FLAG == 0) {
                            CLICK_FLAG = 1;
                            $("#freeSilverCaptchaInput").off("keyup").on("keyup", function (event) {
                                if (event.keyCode !== 13) {
                                    return
                                }
                                getFreeSilverVote(event);
                            });
                            $('button', verifyBox.el).on('click', getFreeSilverVote);

                            function getFreeSilverVote(e) {
                                $("#getFreeSilverAward").text("领取中...");
                                $.ajax({
                                    url: "/freeSilver/getAward?r=" + Math.random() + "&roomid=" + window.ROOMID,
                                    type: 'get',
                                    data: {
                                        captcha: $('input', verifyBox.el).val()
                                    },
                                    dataType: "json",
                                    success: function (result) {
                                        $("#getFreeSilverAward").text("领取");
                                        if (result.code == 0) {
                                            liveToast($(e.currentTarget)[0], '成功领取 ' + result.data.awardSilver + ' 银瓜子和 ' + result.data.getVote + ' 投票券！' + randomEmoji.happy(), "success");
                                            var silverNumb = parseInt(result.data.silver, 10);
                                            window.starVote = {
                                                voteCount: result.data.vote,
                                                voteChance: result.data.svote
                                            };
                                            treasureCtrl.$fire("all!updateCurrency", {silver: silverNumb});
                                            createTreasure();
                                            $('#freeSilverCaptchaInput').val('');
                                            verifyBox.hide();
                                            $(".gift-item[data-gift-id=11] .num-hinter").css({"background-position": result.data.vote * (-16) + "px 0"});
                                            $(".star-vote-vote-count").text(result.data.vote);
                                            $(".star-vote-voted-num").text(18 - parseInt(result.data.svote, 10));
                                            $(".star-vote-chance").text(result.data.svote);
                                            setTimeout(function () {
                                                countdown();
                                            }, 3000);
                                            // 如果有 Cookie 隐藏宝箱并提示.
                                            if ($.cookie("F_S_T_" + window.UID)) {
                                                $(".treasure").fadeOut();

                                                var tips = livePopup({
                                                    title: "真不容易！",
                                                    html: "<p class='text-center'>今天的投票券已经领完了！<br/>请明天再接再厉哦！(●'◡'●)ﾉ♥</p>",
                                                    type: "info",
                                                    width: 300,
                                                    onConfirm: function () {
                                                        tips.remove();
                                                        tips = null;
                                                    }
                                                });
                                            }
                                        } else {
                                            liveToast($(e.currentTarget)[0], result.msg);
                                            $("#captchaImg").click();
                                            $("#getFreeSilverAward").text("领取");
                                        }

                                    },
                                    error: function () {
                                        liveToast($(e.currentTarget)[0], "系统错误，请稍后再试 " + randomEmoji.sad(), "error");
                                        $("#getFreeSilverAward").text("领取");
                                        refreshCaptcha();
                                    },
                                    complete: function () {
                                        if (LAST_COUNT_DOWN != null) {
                                            LAST_COUNT_DOWN.clearCountdown();
                                            LAST_COUNT_DOWN = null;
                                        }
                                    }
                                });
                            }
                        }

                        $treasureBox.off('click').click(function () {
                            verifyBox.show($treasureBox);
                            refreshCaptcha();
                        });

                        //$('input', verifyBox.el).on('focus',refreshCaptcha);
                        $("#captchaImg, #changeCaptcha").on('click', refreshCaptcha);
                    };

                    // 闪耀之星倒计时方法.
                    // 架锅烧水.
                    countdown = function () {
                        if (LAST_COUNT_DOWN != null) {
                            LAST_COUNT_DOWN.clearCountdown();
                        }
                        $.ajax({
                            url: "/FreeSilver/getCurrentTask?roomid=" + window.ROOMID + "&r=" + Math.random(),
                            type: 'get',
                            dataType: "json",
                            success: function (result) {
                                if (result.code == 0) {
                                    LOGINED = true;
                                    var silver = result.data.silver;
                                    $('#gz-num').text(silver);
                                    $("#vote-coupons").text(result.data.vote);
                                    weAreGoingtoGet.seed = result.data.silver;
                                    weAreGoingtoGet.vote = result.data.vote;

                                    //result.data.minute = 1;  // TESTING.

                                    //  如果大于 3 次但宝箱还未消失，启动还原方法.
                                    if (result.data.times > 3 && !$.cookie("F_S_T_" + window.UID)) {
                                        window.restoreOriginalFunc();
                                        var tips = livePopup({
                                            title: "真不容易！",
                                            html: "<p class='text-center'>今天的投票券已经领完了！<br/>请明天再接再厉哦！(●'◡'●)ﾉ♥</p>",
                                            type: "info",
                                            width: 300,
                                            onConfirm: function () {
                                                tips.remove();
                                                tips = null;
                                            }
                                        });
                                    }

                                    var endTime = new Date();
                                    endTime.setMinutes(endTime.getMinutes() + result.data.minute);
                                    LAST_COUNT_DOWN = new CountDown({
                                        endTime: endTime,
                                        element: $('.treasure-count-down, #pop-count-down'),
                                        callback: function () {
                                            $.ajax({
                                                url: "/freeSilver/getSurplus?r=" + Math.random(),
                                                type: 'get',
                                                dataType: "json",
                                                success: function (result) {
                                                    if (result.code !== 0) {
                                                        return false;
                                                    }
                                                    var surplus = result.data.surplus;
                                                    if (surplus < 1) {
                                                        playTreasureAnimate(result.data.silver);
                                                    } else {
                                                        resetCountDown(surplus);
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    };

                }

            })(window);

            // Initizalition.
            $(function () {
                freeSilverHeart();
                createTreasure();
            });

        };

    }, {
        "../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../common/functions/func-live-quick-login/live-quick-login": 14,
        "../../../common/functions/func-random-emoji/random-emoji": 16,
        "../../room-javascripts/live-room-funcs": 69
    }],
    65: [function (require, module, exports) {
        module.exports = function () {
            return require("./javascripts/wish.js")();  // 我的关注
        };
    }, {"./javascripts/wish.js": 66}],
    66: [function (require, module, exports) {
        /**
         * Created by user on 2016/1/13.
         */

        var liveQuickLogin = require("./../../../../common/functions/func-live-quick-login/live-quick-login.js");
        var liveToast = require("./../../../../common/components/live-widget/live-toast/live-toast.js");
        var setNum = require('./../../../../common/functions/func-setnum/set-num.js');
        module.exports = function () {
            /**
             * 弹出层类
             * */
            function Dialog() {
                this.$el = {};
                this.doms = {};
                this.datas = {};
                this.init();
            }

            Dialog.prototype = {
                template: function () {
                    return '' +
                        '<div class="wish-dialog" id="wis-dialog">' +
                        '<div class="dialog-main">' +
                        '<div class="wish-top">' +
                        '<div class="wish-top-icon"></div>' +
                        '<span class="wish-ok-text"><a href="/lottery/lotteryResult" target="_blank" class="ok-target">愿望达成</a></span>' +
                        '</div>' +
                        '<div class="wish-main">' +
                        '<p class="wish-des"> 在绘马上画上自己的心愿（人家才不知道什么痛绘马呢），说不定就能梦想成真。每晚21点会从许愿的用户中抽取中奖用户，购买越多则中奖概率和最终奖励也会相应增加！</p>' +
                        '<div class="wish-prize">' +
                        '<dl class="wish-prize-list">' +
                        '<dt>中奖奖励</dt>' +
                        '<dd>' +
                        '一等奖 1份 <em class="prize-content"><span class="first-prize">' + this.formatNum(this.datas.first) + '</span>银瓜子</em>' +
                        '</dd>' +
                        '<dd>' +
                        '二等奖 10份 <em class="prize-content">每份<span class="second-prize">' + this.formatNum(this.datas.second) + '</span>银瓜子</em>' +
                        '</dd>' +
                        '<dd>' +
                        '三等奖 <em class="third-prize-num">' + this.datas.third + '</em>份 <em class="prize-content">每份B坷垃1个</em>' +
                        '</dd>' +
                        '</dl>' +
                        '</div>' +
                        '<div class="wish-set">' +
                        '<div class="wish-num-box">' +
                        '<p>绘马总数：<em class="wish-num" id="total-wish-num">' + this.datas.totalnum + '</em></p>' +
                        '<p>我挂上的绘马：<em class="wish-num" id="my-wish-num">' + this.datas.num + '</em></p>' +
                        '</div>' +
                        '<div class="wish-buy">' +
                        '<div class="wish-buy-content">' +
                        '购买数量：<input type="text" class="ipt-num" value="1">' +
                        '<span class="wish-buy-type">' +
                        '<ul>' +
                        '<li class="wish-buy-item"><input checked="checked" type="radio" name="buy-type" data-type="silver" id="type-silver"><label for="type-silver">银瓜子</label></li>' +
                        '<li class="wish-buy-item"><input type="radio" name="buy-type" data-type="gold" id="type-gold"><label for="type-gold">金瓜子</label></li>' +
                        '</ul>' +
                        '</span>' +
                        '</div>' +
                        '<div class="wish-buy-tip"><span class="buy-tip-icon"></span>每个绘马需要2000银/金瓜子</div>' +
                        '</div>' +
                        '<div class="wish-set-btn">' +
                        '挂绘马' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="close"></div>' +
                        '</div>' +
                        '' +
                        ''
                },
                $dialog: "",
                $mask: "",
                csses: {
                    "iptNum": ".ipt-num",
                    "btnBuy": ".wish-set-btn",
                    "totalNum": "#total-wish-num",
                    "myNum": "#my-wish-num",
                    "firstNum": ".first-prize",
                    "secondNum": ".second-prize",
                    "thirdPrizeNum": ".third-prize-num"
                },
                init: function () {
                    this.$el = $("<div style='opacity:0'></div>").appendTo(".wish-panel");
                    this.bindEvent();
                },
                render: function () {
                    this.$el.html();
                    this.$dialog = $(this.template());
                    this.$mask = $("<div class='mask'></div>");
                    this.$el.append(this.$dialog).append(this.$mask);

                    this.setDoms();
                },
                setDoms: function () {
                    var $el = this.$el,
                        csses = this.csses;

                    this.doms = {
                        $iptNum: $(csses.iptNum, $el),
                        $btnBuy: $(csses.btnBuy, $el),
                        $totalNum: $(csses.totalNum, $el),
                        $myNum: $(csses.myNum, $el),
                        $firstNum: $(csses.firstNum, $el),
                        $secondNum: $(csses.secondNum, $el),
                        $thirdPrizeNum: $(csses.thirdPrizeNum, $el)
                    };
                },
                show: function (data) {
                    this.datas = data;
                    this.render();
                    this.setStyle();
                    this.setPosition();
                    this.$el.animate({
                        opacity: 1
                    }, 200);
                },
                hide: function () {
                    var self = this;

                    this.$el.animate({
                        opacity: 0
                    }, 200, function () {
                        self.$el.html("").css("opacity", 1);
                    });
                },
                setPosition: function () {
                    var allWidth = document.documentElement.clientWidth,
                        allHeight = document.documentElement.clientHeight,
                        dialogWidth = this.$dialog.width(),
                        dialogHeight = this.$dialog.height(),
                        top,
                        left,
                        cssData;


                    top = allHeight / 2 - dialogHeight / 2;
                    left = allWidth / 2 - dialogWidth / 2;

                    if (top < 0) {
                        top = top * 2

                    }

                    cssData = {
                        width: 750,
                        position: "fixed",
                        zIndex: 1100,
                        left: left,
                        top: top
                    }

                    this.$dialog.css(cssData)
                },

                /**
                 * 切换大小屏的版本
                 * */
                setStyle: function () {
                    var clientHeight = document.documentElement.clientHeight;

                    if (clientHeight < 750) {
                        this.$dialog.addClass("min-dialog");
                    } else {
                        this.$dialog.removeClass("min-dialog");
                    }
                },
                buy: function () {
                    var self = this,
                        $coin = $("[name=buy-type]", this.$el).filter("[checked]"),
                        coinType = $coin.data("type"),
                        $num = this.doms.$iptNum,
                        num = $num.val();

                    if (!this.checkNum()) {
                        $num.focus().addClass("error");
                        liveToast(self.doms.$btnBuy, "请输入正确的数字哦~ (●'◡'●)ﾉ♥", "error");
                    } else {
                        this.ajaxBuy({
                            coinType: coinType,
                            num: num
                        });
                    }

                },
                ajaxBuy: function (param) {
                    var self = this;

                    $.ajax({
                        type: "post",
                        url: "/lottery/buy",
                        data: {
                            coinType: param.coinType,
                            num: param.num,
                            token: $.cookie("LIVE_LOGIN_DATA") || ""
                        },
                        success: function (data) {
                            var dataJSON = $.parseJSON(data);

                            if (dataJSON.code === 0) {
                                self.buySuccess(dataJSON.data);
                            } else {
                                self.buyError(dataJSON.msg);
                            }
                        }
                    });
                },
                buySuccess: function (data) {
                    var self = this;

                    liveToast(this.doms.$btnBuy[0], "购买成功", "success", false);
                    refreshAccount(data);                           // 刷新余额

                    // 重新获取绘马数量
                    ajaxGetWishNum(function (data) {
                        var doms = self.doms;

                        doms.$totalNum.text(data.totalnum);
                        doms.$myNum.text(data.num);
                        doms.$firstNum.text(self.formatNum(data.first));
                        doms.$secondNum.text(self.formatNum(data.second));
                        doms.$thirdPrizeNum.text(data.third);
                    })
                },
                buyError: function (msg) {
                    liveToast(this.doms.$btnBuy[0], msg, "error", false);
                },
                checkNum: function () {

                    var $num = this.doms.$iptNum,
                        num = $num.val(),
                        flag = true;

                    if (!num || /[^0-9]/.test(num)) {
                        flag = false;
                    }


                    if (flag) {
                        $num.removeClass("error");
                    } else {
                        $num.addClass("error");
                    }

                    return flag;
                },
                formatNum: function (num) {
                    var str = "",
                        dotNum;

                    if (num >= 10000) {
                        dotNum = num / 10000;
                        str = dotNum.toString().replace(/(\d+)(\.)?(\d+)/, function (a, b, c, d) {
                            var dot;

                            if (c) {
                                dot = d.toString().substring(0, 1);
                                return b + (dot == 0 ? "" : ("." + dot))
                            } else {
                                return a
                            }
                        });

                        str += "万";
                    } else {
                        str = num;
                    }

                    return str;
                },
                bindEvent: function () {
                    var self = this,
                        doms = this.doms,
                        $el = this.$el,
                        resizeTid = 0;

                    $el.on("keyup", ".ipt-num", function () {
                        self.checkNum();
                    });

                    $el.on("click", ".wish-set-btn", function () {
                        self.buy();
                    });

                    $el.on("click", ".close", function () {
                        self.hide();
                    });

                    $el.on("click", ".mask", function () {
                        self.hide();
                    });

                    $(window).resize(function () {
                        if (resizeTid) {
                            clearTimeout(resizeTid);
                        }

                        resizeTid = setTimeout(function () {
                            if (self.$el.html()) {

                                self.setStyle();
                                self.setPosition();
                            }
                        }, 50);
                    });
                }
            };


            /**
             * 更新余额
             * */
            function refreshAccount(data) {
                avalon.vmodels["giftCtrl"].$fire("all!updateCurrency", {
                    gold: data.gold,
                    silver: data.silver
                });
            }


            /**
             * 获取绘马数量
             * */
            function ajaxGetWishNum(cb) {
                var cb = cb || function () {
                    };

                $.ajax({
                    url: "/lottery/index",
                    cache: false,
                    success: function (data) {
                        var dataJSON = $.parseJSON(data);

                        if (dataJSON.code === 0) {
                            cb(dataJSON.data);
                        }
                    }
                });
            }


            var dialog = new Dialog();
            return {
                show: function () {
                    liveQuickLogin();

                    if (!dialog.$el.html()) {
                        ajaxGetWishNum(function (data) {
                            dialog.show(data)
                        });
                    }
                }
            }
        };


    }, {
        "./../../../../common/components/live-widget/live-toast/live-toast.js": 8,
        "./../../../../common/functions/func-live-quick-login/live-quick-login.js": 14,
        "./../../../../common/functions/func-setnum/set-num.js": 18
    }],
    67: [function (require, module, exports) {
        /*
         *  Live Room Main Script File By LancerComet at 10:57, 2015/12/15.
         *  # Carry Your World #
         *  ---
         *
         *  描述:
         *  ---
         *  这是 Live Room 主入口文件. (Browserify)
         *  请在此处引用编写好的模块文件, **切勿**在此文件中直接编写业务逻辑.
         *  使用 Browserify 对此文件进行打包将生成首页完整的 JavaScript 文件.
         *  Browserify 遵循 Common.JS 编写规范.
         *
         *  Common.JS 的快速使用方法:
         *  ---
         *   - JS 的逻辑使用单独的 .js 文件进行编写并存放.
         *   - 在单独的模块文件中, 使用 "module.exports = ..." 将逻辑进行导出, 可以导出任何东西, 数字、字符串、对象、函数都可以.
         *     (例: "bilibili.js" 文件, 内容为 module.exports = "Bilibili")
         *   - 模块使用 "var 啥啥 = require('模块文件')" 进行引入, "啥啥" 就会成为这个模块导出的那个东西.
         *     (例: var a = require("bilibili"), 那么 a 就等于 "Bilibili")
         *
         *  所以本文件看起来应该像:
         *  ---
         *   var 一些设置 = require("./设置文件.js");        // 将 "设置文件.js" 中的内容赋值给 "一些设置".
         *   require("./全局方法.js")();                    // 直接执行了 "全局方法.js" 所导出的函数.
         *   require("./首页播放器逻辑.js")();               // 同上... (´･_･`)
         *   require("./推荐位逻辑.js")();
         *   require("./公告组件逻辑.js")();
         *   require("./签到逻辑.js")();
         *
         */

// 通用配置引用.
// =================
        require("./../common/app-config/app-config").avalonConfig();  // 配置 Avalon.
        require("./../common/app-config/avalon-filters")();  // 配置 Avalon 过滤器.
        require("./../common/app-config/app-config").globalConfig(window);  // 程序全局配置.
        require('../common/functions/func-number-tofixed/number-tofixed')();  // 设置 toFixed1 原型方法.

// 通用方法引用.
// =================
        require("../common/functions/func-number-tofixed/number-tofixed")();  // Number 原型方法扩充.
        require("./../common/live-service/live-service-ctrl")();  // 公共广播控制器引用.


// 通用模块引用.
// =================
        require("../common/components/live-top-navigator/intro-scripts")();  // 站点顶栏模块入口文件引用.


// 房间页模块引用.
// =================
        require("./room-javascripts/live-room-init")(window);  // 房间页初始化文件.
        require("./components/gift-section/intro-javascripts.js")();  // 房间送礼节点模块.
        require("./components/live-room-sidebar-left/intro.js")();  // 房间页侧边栏.
        require("./components/my-attention/intro.js")();  // 我的关注模块.
        require("./components/sign-up/intro.js")();  // 签到模块.
        require("./room-javascripts/live-room-funcs").topNavOnScroll(window);  // 顶栏滚动监视模块.
        require("./components/seed-exchange/seed-exchange")();  // 瓜子兑换 & 购买面板.
        require("./../common/components/live-feedback/live-feedback")();  // 反馈表格初始化函数.
        require("./room-javascripts/live-room-funcs").greeting();  // 欢迎信息.
    }, {
        "../common/components/live-top-navigator/intro-scripts": 4,
        "../common/functions/func-number-tofixed/number-tofixed": 15,
        "./../common/app-config/app-config": 1,
        "./../common/app-config/avalon-filters": 2,
        "./../common/components/live-feedback/live-feedback": 3,
        "./../common/live-service/live-service-ctrl": 21,
        "./components/gift-section/intro-javascripts.js": 43,
        "./components/live-room-sidebar-left/intro.js": 47,
        "./components/my-attention/intro.js": 49,
        "./components/seed-exchange/seed-exchange": 61,
        "./components/sign-up/intro.js": 62,
        "./room-javascripts/live-room-funcs": 69,
        "./room-javascripts/live-room-init": 70
    }],
    68: [function (require, module, exports) {
        /*
         *  Live Room Flash External Call Functions By LancerComet at 16:11, 2015/12/23.
         *  # Carry Your World #
         *  ---
         *  Flash 全局方法定义.
         */

        var explorerDetective = require('../../common/functions/func-explorer-detective/explorer-detective')();

        module.exports = function (window) {

            // Definition: Flash 用 Avalon 控制器.
            var ctrlByFlash = avalon.define({
                $id: "ctrlByFlash"
            });


            // Definition: Flash 全屏模式获取弹幕颜色 By LancerComet at 13:59, 2015.11.16.
            // 此方法供 Flash 主动调用，无需前端手动触发.
            window.getDanmuColor = function () {
                return window.colorfulDanMu.currentColor;
            };

            // Definition: Flash 设置房间观看人数.
            // 此方法供 Flash 主动调用，无需前端手动触发.
            window.PlayerSetOnline = function (data) {
                data = parseInt(data, 10) < 0 ? 1 : data;
                avalon.ready(function () {
                    ctrlByFlash.$fire("all!setViewerCount", data);  // Fire to headInfoCtrl.
                });
            };

            // Definition: Protocol 调用函数.
            // 此方法供 Flash 主动调用，无需前端手动触发.
            // 在支持 Worker 的非 IE 浏览器中（IE 使用 Blob 的内嵌 Worker 拥有安全策略限制且 IE 不需要做此项优化）将使用 Worker.
            // Worker 使用 String -> Blob -> DataURL 的方式进行嵌入引用来避免跨域问题.
            (function serverCallback() {
                var msgArr = null, danmuWorker = null;

                // 非 IE 的现代浏览器中使用 Worker.
                // Firefox 在处理这段 WebWorker 时会造成内存泄漏, 在修复之间暂时不使用.
                var useWorker = (typeof Worker === "function" && explorerDetective.indexOf("IE") < 0 && explorerDetective.indexOf("Firefox") < 0);
                if (useWorker) {

                    // workerJS 来自文件 live-room-danmu-worker.js.
                    var workerJS = ['var msgArr={now:[],temp:[],aveSpeed:80};setInterval(function(){msgArr.now=msgArr.now.concat(msgArr.temp.splice(0)),msgArr.aveSpeed=Math.ceil(1e3/msgArr.now.length)},500),onmessage=function(e){msgArr.temp.push(e.data)},function e(){postMessage(msgArr.now.shift()),setTimeout(e,msgArr.aveSpeed)}();'];
                    var workerJSBlob = new Blob(workerJS, {type: "text/javascript"});

                    danmuWorker = new Worker(window.URL.createObjectURL(workerJSBlob));

                    danmuWorker.onmessage = function (event) {
                        var msgData = event.data;
                        //if (msgData) {
                        //    consoleText.log("Danmu Worker onMessage:");
                        //    consoleText.log(msgData);
                        //}
                        msgData && msgData.cmd && protocol[msgData.cmd] && protocol[msgData.cmd](msgData);
                    };

                    workerJS = workerJSBlob = null;

                } else {
                    // IE 与不支持 Worker 的浏览器使用计时器.
                    msgArr = {now: [], temp: [], aveSpeed: 80};

                    setInterval(function () {
                        msgArr.now = msgArr.now.concat(msgArr.temp.splice(0));
                        msgArr.aveSpeed = Math.ceil(1000 / msgArr.now.length);
                    }, 500);

                    function showMsg() {
                        var msgData = msgArr.now.shift();
                        msgData && msgData.cmd && protocol[msgData.cmd] && protocol[msgData.cmd](msgData);
                        setTimeout(showMsg, msgArr.aveSpeed);
                    }

                    showMsg();
                }

                window.server_callback = function server_callback(json) {
                    console.log("server_callback");
                    console.log(json);
                    console.log("");
                    try {
                        json = $.parseJSON(json);

                        // 弹幕与送礼走排队, 其他直接执行.
                        if (json.cmd === "DANMU_MSG" || json.cmd === "SEND_GIFT") {
                            useWorker ? danmuWorker.postMessage(json) : msgArr.temp.push(json);
                        } else {
                            // 直接执行.
                            window.protocol[json.cmd](json);
                        }

                    } catch (tryErr) {
                        // Do nothing.
                    }
                };

                // The old fashion:
                // ==========================
                //$(window).on("blur", function () {
                //    $(window).on("focus", danmuWindowFocus);
                //});
                //
                //function danmuWindowFocus () {
                //    if (msgArr.now.length > 100) {
                //        msgArr.now = msgArr.now.splice(0, 100);
                //    }
                //    $(window).off("focus", danmuWindowFocus);
                //}
            })();


            // Definition: 添加本地聊天记录.
            // 此方法提供至全局供 Flash 调取.
            window.addMessage = function (json) {
                console.log("addMessage");
                ctrlByFlash.$fire("all!addDanmu", json);
            };


            // Definition: 弹出 B 坷垃投喂窗口.
            // 此方法提供至全局供 Flash 调取. 真 JB 蛋碎.
            window.showBkela = function () {
                $(".gift-item.gift-3").click();
            };


            // Definition: Flash 关注房间事件.
            // 此方法提供至全局供 Flash 调取.
            window.flashAttendRoom = function () {
                $(".attention-btn-ctrl").find(".btn-transition").click();
            };

            // Definition: Flash 网页全屏.
            window.player_fullwin = function (status) {
                console.log("Player Fullscreen: " + status);
                status ? $("body").addClass("player-full-win") : $("body").removeClass("player-full-win");
            };

        };

    }, {"../../common/functions/func-explorer-detective/explorer-detective": 10}],
    69: [function (require, module, exports) {
        /*
         *  Live Room Functions By LancerComet at 16:58, 2016/1/5.
         *  # Carry Your World #
         *  ---
         *  房间页独立功能定义模块.
         *
         */

        var appConfig = require('../../common/app-config/app-config');
        var typeAdjust = require('../../common/functions/func-type-adjust/type-adjust');
        var explorerDetective = require('../../common/functions/func-explorer-detective/explorer-detective');


// Definition: 房间禁言倒计时方法.
// 将设置一个计时器, 在节点中设置时间显示.
// Usage: new CountDown(...) || CountDown(...)
        /*
         *  Param: {
         *    endTime: Date (TimeStamp),  // 倒计时结束时间.
         *    element: HTML Dom || jQuery Element,  // 倒计时显示节点.
         *    callback: Function  // 完成时回调.
         *  }
         */
// ================================
        function CountDown(param) {

            // 强制返回 "实例".
            if (!(this instanceof CountDown)) {
                return new CountDown(param);
            }

            var dateNow = new Date();
            var endTime = param.endTime;

            if (!endTime || !(endTime instanceof Date) || endTime.getTime() <= dateNow.getTime()) {
                consoleText.log(appConfig.consoleText.error + "禁言时间设置错误.");
            }

            // Definition: 倒计时定义.
            var interval = setInterval(function () {
                var ms = endTime.getTime() - dateNow.getTime();  // 倒计时剩余总时间: 毫秒.
                var mm = Math.floor(ms / 60 / 1000); // 倒计时剩余总时间: 分钟.
                var s = ms - (mm * 60 * 1000); // 倒计时秒数零头毫秒数: 总毫秒时间 - 总分钟取整时间
                var ss = Math.floor(s / 1000); // 倒计时秒数零头秒数.
                mm = mm < 10 ? "0" + mm : mm;
                ss = ss < 10 ? "0" + ss : ss;

                // Action: 在 HTML 中写入时间.
                var outputTime = mm + ":" + ss;
                if (typeAdjust(param.element) === "jQuery Object") {
                    param.element.html(outputTime);
                } else {
                    param.element.innerHTML = outputTime;
                }

                // Action: 倒计时结束.
                if (mm == "00" && ss == "00") {
                    clearInterval(interval);
                    param.callback && param.callback();
                    return;
                }

                endTime.setSeconds(endTime.getSeconds() - 1);

            }, 1000);

            this.countDown = interval;
        }

        CountDown.prototype.clearCountdown = function () {
            clearInterval(this.countDown);
        };
// ================================


// Definition: 房间禁言节点处理函数.
// ================================
        var roomSilentTimer = null;  // Definition: 房间禁言计时器.
        var $silentMerge = $(".room-silent-merge");
        var roomSilent = {
            on: function (hintMsg, endTime) {
                roomSilentTimer && roomSilentTimer.clearCountdown();
                roomSilentTimer = CountDown({
                    endTime: endTime,
                    element: $silentMerge.find(".count-down"),
                    callback: function () {
                        $silentMerge.fadeOut(200);
                    }
                });
                $silentMerge.show().find(".hint-text").text(hintMsg);
            },
            off: function () {
                roomSilentTimer.clearCountdown();
                $silentMerge.fadeOut(200);
            }
        };
// ================================


// Definition: 获取历史弹幕消息.
// ================================
        var getHistoryDanmu = function (vmodel) {
            $.ajax({
                url: "/ajax/msg",
                type: "POST",
                data: {
                    roomid: window.ROOMID
                },
                dataType: "JSON",
                timeout: 5000,
                success: function (result) {
                    if (result.code == 0) {

                        // Action: 遍历房间消息.
                        for (var i = 0, j = result.data.room.length; i < j; i++) {

                            // Definition: 单条消息.
                            var item = result.data.room[i];

                            // Definition: 消息数据对象定义. 结构将转换为 Protocol 中的 JSON 结构然后发送至弹幕.
                            var json = {info: []};
                            json.info[0] = [];
                            json.info[0][5] = null;  // RND, 设置为 null.
                            json.info[1] = item.text;  // 聊天内容.
                            json.info[2] = [];
                            json.info[2][0] = item.uid;  // UID
                            json.info[2][1] = item.nickname;  // Username.
                            json.info[2][2] = item.isadmin;  // IS Admin.
                            json.info[2][3] = item.vip;  // IS VIP.
                            json.info[3] = item.medal;  // 粉丝勋章.
                            json.info[4] = item.user_level;  // 用户等级.
                            json.info[5] = item.title;  // 用户头衔.

                            vmodel.$fire("all!addDanmu", json);

                            item = json = null;
                        }

                        // 显示老爷 Greeting 消息（自己可见）.
                        (VIP == 1 && VIP_TIPS == 1) && vmodel.$fire("all!addSelfWelcomeMsg");
                    }
                },
                error: function (result) {

                }
            });
        };
// ================================


// Definition: 欢迎信息.
// ================================
        function greetingInfo() {
            if (!explorerDetective() === "IE 8") {
                return;
            }
            consoleText.log(appConfig.appInfo.name + " " + appConfig.appInfo.version + ' Lovingly By © ' + new Date().getFullYear() + ' - ' + (new Date().getFullYear() + 1) + ' Bilibili Live Department  ...(●\'◡\'●)ﾉ♥   # Renascence #\n');
            consoleText.log("Version: " + appConfig.appInfo.version + ", CodeName: " + appConfig.appInfo.codeName + ".\n\n\n");
        }

// ================================


// Definition: 更换房间背景.
// ================================
        var changeRoomBKTimeout = null;

        function changeRoomBK(link) {
            $(".bk-img").addClass("fade-out").removeClass("fade-in");
            clearTimeout(changeRoomBKTimeout);
            changeRoomBKTimeout = setTimeout(function () {
                $(".bk-img").addClass("fade-in").removeClass("fade-out").css({"background-image": "url(" + link + ")"})
            }, 380)
        }

// ================================


// Definition: 获取房间切断审核状态.
// ================================
        function loadingCutOffMsg() {
            if (window.ISANCHOR != 1) {
                return;
            }
            $.ajax({
                url: "/liveact/cutoffmsg",
                type: "POST",
                data: {roomid: window.ROOMID},
                dataType: "JSON",
                success: function (result) {
                    if (result.code != 0 || !result.msg) {
                        return;
                    }

                    var hintPopup = window.livePopup({
                        title: "友情提示 > <",
                        html: '<p>您的直播间因<span style="color: red">"' + result.msg + '"</span>，已经被管理员 <span style="color: red">切断</span>，请更改直播内容。</p><p>如有疑问请通过客服邮箱 <span style="color: #61c7eb">livehelp@bilibili.com</span> 或 <span style="color: #61c7eb">客服 QQ </span>进行反馈。</p>' +
                        '<div><input type="checkbox" id="cut-off-acknowledge"><label for="cut-off-acknowledge" class="v-top dp-inline-block" style="margin-top: 7px">我知道了</label></div>',
                        type: "info",
                        onConfirm: function () {
                            $("#cut-off-acknowledge").is(":checked") && $.post("/liveact/del_cutoff_msg", {roomid: window.ROOMID}, null, "JSON");
                            hintPopup.remove();
                            hintPopup = null;
                        }
                    });
                }
            });
        }

// ================================


// Definition: 顶栏滚动监听事件.
        function topNavOnScroll(window) {
            $(function () {
                var scrollBefore = null;
                $(window).scroll(function (event) {
                    var scrollY = event.currentTarget.scrollY || event.currentTarget.pageYOffset;
                    var delta = scrollY - scrollBefore > 0 ? "scrollDown" : "scrollUp";
                    var $topNav = $(".live-top-nav-ctnr");

                    switch (delta) {
                        case "scrollDown":
                            $topNav.addClass("fixed-hide");
                            scrollBefore = scrollY - 1;  // 这么做是为了傻叉 IE, IE 在滚动到顶部或底部时最后两次 pageYOffset 会一致, 需要制造差异.
                            break;
                        case "scrollUp":
                            $topNav.removeClass("fixed-hide");
                            scrollBefore = scrollY + 1;
                            break;
                    }
                });
            });
        }


        module.exports = {

            // Definition: 更变房间背景.
            changeRoomBK: changeRoomBK,

            // Definition: 房间禁言倒计时方法.
            // Usage: new CountDown(...) || CountDown(...)
            CountDown: CountDown,

            // Definition: 房间禁言节点处理函数. 当房间开启了禁言, 执行此函数.
            roomSilent: roomSilent,

            // Definition: 获取历史弹幕.
            getHistoryDanmu: getHistoryDanmu,

            // Definition: 欢迎信息.
            greeting: greetingInfo,

            // Definition: 获取房间切断审核状态.
            loadingCutOffMsg: loadingCutOffMsg,

            // Definition: 顶栏滚动监听事件.
            topNavOnScroll: topNavOnScroll

        };
    }, {
        "../../common/app-config/app-config": 1,
        "../../common/functions/func-explorer-detective/explorer-detective": 10,
        "../../common/functions/func-type-adjust/type-adjust": 20
    }],
    70: [function (require, module, exports) {
        /*
         *  Live Room Initialization By LancerComet at 14:08, 2015/12/15.
         *  # Carry Your World #
         *  ---
         *  直播房间页初始化 JavaScript.
         *
         */

        var appConfig = require('../../common/app-config/app-config');

        module.exports = function (window, undefined) {
            "use strict";

            // Action: 设置预设全局方法.
            globalFunc(window);
            require("./live-room-flash-func")(window);

            // Action: 获取房间信息 - getInfo.
            $.ajax({
                url: "/live/getInfo",
                type: "GET",
                data: {
                    roomid: window.ROOMID
                },
                dataType: "JSON",
                success: successCallback,
                error: errorCallback
            });


        };

// Definition: 房间初始化回调函数.
        function successCallback(result) {
            // Error Handler.
            if (result.code != 0) {
                throw new Error(appConfig.consoleText.error + "getInfo 接口请求错误: " + result.msg);
            }

            // Action: 设置全局变量.
            require("./room-init-funcs/func-set-global-variables")(window, result);

            // Action: 房间广播方法定义.
            require("./live-room-protocol")(window);

            // Action: 填充房间初始化数据. 房间基础数据, 聊天部分数据（包括排行榜）, 房间关注数, 粉丝送礼数量.
            require("./room-init-funcs/func-set-data")(result);

            // Action: 直播间在线等级增长.
            require("./room-init-funcs/func-user-online-heart")();

            // Action: 宝箱模块初始化.
            require("../components/treasure-box/treasure-box")(window);

            // Action: 竞猜模块初始化.
            require("../components/quiz-system/intro-scripts")();

            // Action: 推荐视频模块初始化.
            require("../components/recommend-videos/recommend-videos")(window);

            // Action: 管理员功能模块载入.
            if (parseInt(ISANCHOR, 10) === 1) {
                require("../components/admin-functions/intro-scripts")();  // 管理员方法模块.
            }

            // Action 房间管理模块
            require('../components/admin-room-edit-panel/room-edit-panel')(result.data);


            // Action: 更新房间数据.
            // 此方法将提到最后执以确保控制器已 100% 加载完毕从而确保更新成功.
            require("./room-init-funcs/func-room-data-deferred")(result);

        }

// Definition: 请求数据失败回调.
        function errorCallback(result) {
            throw new Error(appConfig.consoleText.error + "getInfo 接口访问失败, 房间无法初始化.");
        }

// Definition: 全局方法定义.
// 将定义一些与外部交互的方法.
        function globalFunc(window) {

            // Definition: 控制台事件追踪调试函数 By LancerComet at 14:33, 2015.11.05.
            /*
             *  用法:
             *  ---
             *  var trackEvent = liveLookEvent($("#targetDom")[0]);
             *  trackEvent 即为 #targetDom 的事件列表对象, 所有事件将以属性名的形式挂载到 trackEvent 中.
             *
             *  eg: trackEvent.click[0] 即为 #targetDom 的第一个点击事件的信息对象.
             *      trackEvent.click[0].handler 即为点击事件的处理事件.
             *      此时点击控制台右边定位链接即可直接查看函数所在位置.
             *
             */
            window.liveTrackEvents = function (element) {
                return $.data ? $.data(element, "events", undefined, true) : $._data(element, "events");
            };

        }
    }, {
        "../../common/app-config/app-config": 1,
        "../components/admin-functions/intro-scripts": 25,
        "../components/admin-room-edit-panel/room-edit-panel": 32,
        "../components/quiz-system/intro-scripts": 51,
        "../components/recommend-videos/recommend-videos": 58,
        "../components/treasure-box/treasure-box": 64,
        "./live-room-flash-func": 68,
        "./live-room-protocol": 71,
        "./room-init-funcs/func-room-data-deferred": 72,
        "./room-init-funcs/func-set-data": 74,
        "./room-init-funcs/func-set-global-variables": 75,
        "./room-init-funcs/func-user-online-heart": 76
    }],
    71: [function (require, module, exports) {
        /*
         *  Live Room Protocol by LancerComet at 11:14, 2015/12/17.
         *  # Carry Your World #
         *  ---
         *  房间页 Protocol 广播方法对象定义.
         *
         *  说明:
         *  ---
         *  Protocol 对象将被 Flash 调用, 所以将被放在全局作用域下.
         *
         */
        var appConfig = require('../../common/app-config/app-config');
        var livePopup = require('../../common/components/live-widget/live-popup/live-popup');
        var randomEmoji = require('../../common/functions/func-random-emoji/random-emoji');
        var liveRoomFuncs = require('./live-room-funcs');

        module.exports = function (window, undefined) {
            "use strict";

            // Definition: 聊天记录容器.
            var $msgPool = $("#chat-msg-list");

            // Definition: Protocol 对象.
            // 本对象将被 Flash 随时调取.
            if (window.protocol) {
                throw new Error(appConfig.consoleText.error + "window.protocol 在初始化之前已被污染, 请检查代码结构.");
            }

            // Definition: Protocol.
            window.protocol = {};

            // Definition: 广播 Avalon 控制器定义.
            // 这是一个没有额外功能的控制器, 仅仅是为了控制事件而定义.
            var flashProtoCtrl = avalon.define({
                $id: "flashProtoCtrl"
            });


            /*
             *  全局类广播方法.
             *  ==============================================
             */

            // 接收弹幕.
            window.protocol.DANMU_MSG = function (json) {
                console.log("protocol: DANMU_MSG");
                console.log(json);

                // 添加弹幕事件. Fire to "addDanmu" in chatListCtrl.
                // 仅当 UID 或 DANMU_RND 不为自己时添加.
                //json.info[2][0] == UID || json.info[0][5] == DANMU_RND && flashProtoCtrl.$fire("all!addDanmu", json);
                flashProtoCtrl.$fire("all!addDanmu", json);
            };

            // 接收送礼.
            window.protocol.SEND_GIFT = function (json) {
                /*
                 *  TODO:
                 *   - 更新房间累计送礼数量.
                 *   - 更新七日投喂排行榜.
                 *   - 判断连击礼物.
                 *   - 执行其他活动函数.
                 */
                console.log("protocol: SEND_GIFT");
                console.log(json);

                // 添加礼物.
                flashProtoCtrl.$fire("all!addGift", json);
                activitySendGift(json);  // 其他活动需求.
            };

            // 更新七日投喂排行榜.
            window.protocol.SEND_TOP = function (json) {
                // TODO: loadTop10(json)
                console.log("protocol: SEND_TOP");
                flashProtoCtrl.$fire("all!updateGiftTop", json.data.top_list);
            };

            // 房间信息被修改通知.（当前仅有背景修改通知）
            window.protocol.CHANGE_ROOM_INFO = function (json) {
                console.log("protocol: CHANGE_ROOM_INFO");
                console.log(json);
                require("./live-room-funcs").changeRoomBK(json.background);
            };

            // 进入房间欢迎语.
            window.protocol.WELCOME = function (json) {
                console.log("protocol: WELCOME");
                console.log(json);

                /*
                 *  @ json: {
                 *    data: {
                 *      isadmin: 0 || 1,
                 *      uid: Number,
                 *      uname: String
                 *    }
                 *  }
                 */

                flashProtoCtrl.$fire("all!addWelcomeMsg", json);
            };

            // 抽奖活动中奖通知.
            window.protocol.WIN_ACTIVITY = function (json) {
                activityDraw.win(json);
            };

            // 系统广播事件.
            window.protocol.SYS_MSG = function (json) {
                // TODO: addMessage
                console.log("protocol: SYS_MSG");
                console.log(json)

                flashProtoCtrl.$fire("all!addSysMsg", json);

            };


            /*
             *  直播状态更变广播方法.
             *  ==============================================
             */

            // 房间开始直播通知.
            window.protocol.LIVE = function (json) {
                // TODO: liveStatusControl("on");
                console.log("protocol: LIVE");
                flashProtoCtrl.$fire("all!liveStatusButton", "on");
            };

            // 房间直播关闭.
            window.protocol.PREPARING = function (json) {
                // TODO: liveStatusControl("off");
                console.log("protocol: PREPARING");
                flashProtoCtrl.$fire("all!liveStatusButton", "off");
            };

            // 停止直播流（暂时无用）.
            window.protocol.END = function (json) {
                console.log("protocol: END");
            };

            // 关闭房间（暂时无用）.
            window.protocol.CLOSE = function (json) {
                console.log("protocol: CLOSE");
            };

            // 直播间被封禁（暂时无用）.
            window.protocol.BLOCK = function (json) {
                console.log("protocol: BLOCK");
            };


            /*
             *  房间管理类广播方法.
             *  ==============================================
             */

            // 播主设置全局禁言.
            window.protocol.ROOM_SILENT_ON = function (json) {
                console.log("ROOM_SILENT_ON");
                console.log(json);

                // json.is_newbie = 1 时表示播主仅屏蔽注册会员, 不等于 1 的时候屏蔽所有用户.
                var hintMsg = json.is_newbie == 1 ? "播主对注册用户开启了注册用户禁言" : "播主对所有用户开启了全局禁言";
                $msgPool.append('<p class="system-msg" style="color: #f25d8e">[系统]：' + hintMsg + '</p>');

                if (ISADMIN != 1 && (json.is_newbie != 1 || (json.is_newbie == 1 && IS_NEWBIE == 1 && VIP != 1))) {
                    // Definition: 设置新的倒计时.
                    var endTime = new Date();
                    endTime.setSeconds(endTime.getSeconds() + json.countdown);

                    // 开启禁言.
                    liveRoomFuncs.roomSilent.on(hintMsg, endTime);
                }
            };

            // 播主取消全局禁言.
            window.protocol.ROOM_SILENT_OFF = function (json) {
                $msgPool.append('<div class="system-msg" style="color: #4fc1e9">[系统]：播主取消了房间全局禁言</div>');
                liveRoomFuncs.roomSilent.off();
            };

            // 屏蔽房间消息.
            window.protocol.ROOM_BLOCK_MSG = function (json) {
                // json.uid, json.uname
                console.log("protocol: ROOM_BLOCK_MSG");
                console.log(json);
                $msgPool.append('<div class="system-msg">用户 <em style="color: #aaa">' + json.uname + '</em> 已被管理员禁言</div>');
            };

            // 房间锁定.
            window.protocol.ROOM_LOCK = function (json) {
                console.log("protocol: ROOM_LOCK");
                console.log(json);
                if (UID == MASTERID) {
                    livePopup({
                        title: "系统通知",
                        content: '您的房间已被<span style="color: #FF0000">锁定</span>。如有疑问请通过客服邮箱或客服 QQ 进行反馈。',
                        type: "info",
                        width: 350,
                        onConfirm: function () {
                            location.href = "/";
                        }
                    });
                } else {
                    livePopup({
                        title: "系统通知",
                        content: "当前直播间被直播管理员关闭。",
                        type: "info",
                        width: 300,
                        onConfirm: function () {
                            location.href = "/";
                        }
                    });
                }
            };

            // 踢出用户.
            window.protocol.ROOM_KICKOUT = function (json) {
                flashProtoCtrl.$fire("all!addKickoutMsg", json);
            };

            // 将用户踢出房间.
            window.protocol.ROOM_BLOCK_INTO = function (json) {
                // json.uid, json.uname
                if (parseInt(json.uid, 10) === UID) {
                    livePopup({
                        title: "你被踢出房间 " + randomEmoji.sad(),
                        content: "很不幸的是您被管理员踢出了房间…… 是不是做了什么不礼貌的事情呢？摸摸~ " + randomEmoji.helpless(),
                        type: "alert",
                        button: {
                            confirm: "呜~~~~"
                        },
                        onConfirm: function () {
                            location.href = "/";
                        }
                    });
                }

                flashProtoCtrl.$fire("all!addKickoutMsg", json);

            };

            // 房间后台审核.
            window.protocol.ROOM_AUDIT = function (json) {
                // TODO: window.UID == window.MASTERID && loadAudit();
            };

            // 强行切断直播.
            window.protocol.CUT_OFF = function (json) {

                if (UID == MASTERID) {
                    flashProtoCtrl.$fire("all!liveCutOff");
                    require("./live-room-funcs").loadingCutOffMsg();
                } else {
                    var popup = livePopup({
                        title: "系统通知",
                        content: "当前直播间被直播管理员切断直播。",
                        type: "info",
                        width: 300,
                        onConfirm: function () {
                            popup.remove();
                            popup = null;
                        }
                    });
                }

            };

            // 管理员更新（暂时无用）.
            window.protocol.ROOM_ADMINS = function (json) {

            };

            // 房间屏蔽信息更新（暂时无用）.
            window.protocol.ROOM_SHIELD = function (json) {

            };

            // 春节年糕活动广播 （高达开奖）
            window.protocol.GAODA = function (json) {
                console.log("大奖出炉:", json);

                (function () {

                    //抽奖面板
                    var gaodaPanel = $('<div class="ka-draw-box"><div class="ka-close"></div><div class="ka-title"></div><div class="ka-content"><p></p></div><div class="ka-btn">确认</div></div>');

                    var $kaDrawBox = $(".ka-draw-box");

                    if ($kaDrawBox.length >= 1) {

                        $kaDrawBox.removeAttr("style");
                        $(".ka-content").html("<p></p>");
                        $(".ka-draw-box").remove();

                    }

                    //关闭面板
                    $("body").on("click", ".ka-close, .ka-btn", function () {
                        gaodaPanel.remove();
                    });

                    var _rcode = json.data.rcode;

                    $.ajax({
                        url: "gaoda/getReward",
                        type: "GET",
                        data: {
                            room_id: json.roomid,
                            rcode: _rcode
                        },
                        dataType: "JSON",
                        success: function (result) {

                            if (result.code == 0) {
                                //参加抽奖成功 弹出面板
                                $("body").append(gaodaPanel);

                                var arr_t = {2: "B坷垃1个", 3: "辣条66个", 4: "2016银瓜子", 5: "200银瓜子", 0: "这次没有中奖，记得下次要中奖哟~"};
                                var giftText = null;
                                if (result.data.status == 1) {
                                    if (result.data.rank == 1) {

                                        //添加收货地址弹窗~
                                        $(".ka-btn").removeClass("close-popup").addClass("ka-draw-complete");

                                        if (_rcode == 75) {
                                            giftText = "高达MG模型1个";
                                            $(".data-status span").addClass("gaoda-top2")
                                        } else if (_rcode == 100) {
                                            giftText = "高达PG模型1个";
                                            result.data.rank = 7;
                                            $(".data-status span").addClass("gaoda-top1")
                                        }
                                    } else {
                                        giftText = arr_t[result.data.rank];
                                        $(".ka-btn").addClass("close-popup");

                                    }
                                } else {
                                    giftText = "这次没有中奖，记得下次要中奖哟~";
                                }

                                $(".ka-content").html("<p>本次大奖得主: <b style='font-size: 16px'>" + json.data.uname + "</b></p><p class='mar-top24'>本次抽奖你共获得：</p><div class='gao-da-gift'><span class='gift-" + result.data.rank + "'></span><span>" + giftText + "</span></div>")

                            }

                        }
                    });


                })(window);
            };

            // 春节年糕活动广播 （获奖弹窗）
            window.protocol.GAODA_START = function (json) {

                console.log("开奖啦:", json);
                var cpData = json.data.rcode + "%";
                console.log(cpData);

                (function () {
                    // 高达抽奖图提示面板
                    var picPanel = $('<div class="gao-da-tips"><div class="ka-close-pic"></div><div class="ka-tips-1"></div><div class="data-times">剩余时间：<span></span>秒</div><div class="ka-tips-2"></div></div>');

                    var initPic;

                    $("body").on("click", ".gao-da-tips .ka-close-pic", function () {
                        clearInterval(initPic);
                        picPanel.remove();
                    });

                    picTimes(json.roomid);  //初始化请求

                    function picTimes(roomid) {

                        $.ajax({
                            url: "gaoda/index",
                            type: "GET",
                            data: {
                                room_id: roomid,
                                complete: cpData,
                                timestamp: Date.now()
                            },
                            dataType: "JSON",
                            success: function (result) {

                                if (result.code == 7) {

                                    $("#chat-ctrl-panel").append(picPanel);
                                    $(".data-times span").text(result.data.deadline);

                                    initPic = setInterval(function () {
                                        var picTimes = $(".data-times span").text();

                                        if (picTimes > 0) {
                                            picTimes--;
                                            $(".data-times span").text(picTimes);
                                        } else {
                                            picPanel.remove();
                                        }
                                    }, 1000);

                                }
                            }
                        });
                    }

                })(window);
            };


        };


// Definition: 特定活动广播方法扩展.
// 某些活动需要在广播事件中处理, 请在这里编写.


// 这里放置 SEND_GIFT 的活动广播逻辑.
        function activitySendGift(json) {
            // 例: require("shining-star").updateTicket(json);
            //flashProtoCtrl.$fire("all!updateRiceCake", json.data.top_cake);
        }


// 这里放至 DANMU_MSG 的活动广播逻辑.
        function activityDanmuMsg(json) {
            // 例: require("shining-star").announcement(json);
        }
    }, {
        "../../common/app-config/app-config": 1,
        "../../common/components/live-widget/live-popup/live-popup": 7,
        "../../common/functions/func-random-emoji/random-emoji": 16,
        "./live-room-funcs": 69
    }],
    72: [function (require, module, exports) {
        /*
         *  Live Room Data Deferred Update By LancerComet at 10:12, 2015/01/20.
         *  # Carry Your World #
         *  ---
         *  房间页初始化部分: 设置房间数据.
         *  此方法将在房间初始化完毕后执行以确保 100% 更新成功.（确保所有控制器已初始化.）
         *
         */

        var lazyInit = require('../../../common/functions/func-avalon-lazy-init/lazy-init');
        var liveRoomFuncs = require('../live-room-funcs');

        module.exports = function (result) {

            // 此控制器是最后一个加载的控制器, 在此进行数据的填充.
            avalon.ready(function () {

                var emptyCtrl = avalon.define({
                    $id: "emptyNode"
                });

                lazyInit($("#empty-node")[0], emptyCtrl, function () {

                    /* Action goes below. */

                    // Action: 广播瓜子更新.
                    setTimeout(function () {
                        emptyCtrl.$fire("all!updateCurrency", {
                            gold: parseInt(result.data.GOLD, 10),
                            silver: parseInt(result.data.SILVER, 10)
                        });
                    }, 1);

                    // Action: 获取历史弹幕消息.
                    liveRoomFuncs.getHistoryDanmu(emptyCtrl);

                    // Action: 填充活动初始化数据.
                    require("./func-set-data-activity")(result, emptyCtrl);

                    // Action: 载入直播间审核状态.（是否被切断）
                    require("../live-room-funcs").loadingCutOffMsg();
                });
            });


        };
    }, {
        "../../../common/functions/func-avalon-lazy-init/lazy-init": 9,
        "../live-room-funcs": 69,
        "./func-set-data-activity": 73
    }],
    73: [function (require, module, exports) {
        /*
         *  Live Room Initialization By LancerComet at 11:11, 2015/12/21.
         *  # Carry Your World #
         *  ---
         *  直播房间页初始化部分.
         *  本文件在 func-room-data-deferred 中引用.
         *
         *  当前拥有：
         *   - 设置闪耀之星投票券数量.
         */


        module.exports = function (result, avalonCtrl) {

            // Action: 更新闪耀之星.
            // result.data.starRank
            avalonCtrl.$fire("all!shiningStarCount", result.data.starRank);

        };
    }, {}],
    74: [function (require, module, exports) {
        /*
         *  Live Room Data Setting By LancerComet at 11:55, 2015/12/21.
         *  # Carry Your World #
         *  ---
         *  房间页初始化部分: 填充房间信息数据部分.
         */

        module.exports = function (result) {

            // Action: 设置房间基础数据.
            require("../../components/header-section/header-section.js")(result, window);

            // Action: 聊天区域模块初始化.
            require("../../components/chat-area/intro-javascripts")(result);

            // Action: 房间是否处于禁言状态.
            (function setRoomSilent() {
                (ISADMIN != 1 && BLOCK_TYPE != -1) && window.protocol.ROOM_SILENT_ON({
                    countdown: result.data.BLOCK_TIME,
                    is_newbie: window.IS_NEWBIE
                });
            })();

        };

    }, {"../../components/chat-area/intro-javascripts": 42, "../../components/header-section/header-section.js": 46}],
    75: [function (require, module, exports) {
        /*
         *  Live Room Initialization By LancerComet at 15:50, 2015/12/21.
         *  # Carry Your World #
         *  ---
         *  直播房间页初始化部分: 设置全局变量.
         */

        var livePopup = require('../../../common/components/live-widget/live-popup/live-popup');
        var liveToast = require('../../../common/components/live-widget/live-toast/live-toast');
        var liveQuickLogin = require('../../../common/functions/func-live-quick-login/live-quick-login');

        module.exports = function (window, result) {
            "use strict";

            for (var i in result.data) {
                if (result.data.hasOwnProperty(i)) {
                    window[i] = result.data[i];
                }
            }

            // Definition: 送礼记录保存数组, 用于检查礼物是否为本人送出.
            window.giftTsHistory = [];

            // Definition: Common.JS 模块全局挂载, 以方便前端模板调用.
            window.livePopup = livePopup;
            window.liveToast = liveToast;
            window.liveQuickLogin = liveQuickLogin;

        };
    }, {
        "../../../common/components/live-widget/live-popup/live-popup": 7,
        "../../../common/components/live-widget/live-toast/live-toast": 8,
        "../../../common/functions/func-live-quick-login/live-quick-login": 14
    }],
    76: [function (require, module, exports) {
        /*
         *  Live Room User Online Heart at 16:19, 2016/01/21.
         *  ---
         *  直播间在线等级增长
         */

        module.exports = function () {
            // 登陆用户每五分钟，涨次经验
            if ($.cookie("DedeUserID")) {
                setInterval(function () {
                    $.ajax({
                        url: "/User/userOnlineHeart",
                        type: "post",
                        dataType: "json",
                        success: function (result) {
                            // ...
                        }
                    });
                }, 300000);
            }
        };


    }, {}],
    77: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        module.exports = require('./src/js/adaptor/jquery');

    }, {"./src/js/adaptor/jquery": 78}],
    78: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var ps = require('../main')
            , psInstances = require('../plugin/instances');

        function mountJQuery(jQuery) {
            jQuery.fn.perfectScrollbar = function (settingOrCommand) {
                return this.each(function () {
                    if (typeof settingOrCommand === 'object' ||
                        typeof settingOrCommand === 'undefined') {
                        // If it's an object or none, initialize.
                        var settings = settingOrCommand;

                        if (!psInstances.get(this)) {
                            ps.initialize(this, settings);
                        }
                    } else {
                        // Unless, it may be a command.
                        var command = settingOrCommand;

                        if (command === 'update') {
                            ps.update(this);
                        } else if (command === 'destroy') {
                            ps.destroy(this);
                        }
                    }

                    return jQuery(this);
                });
            };
        }

        if (typeof define === 'function' && define.amd) {
            // AMD. Register as an anonymous module.
            define(['jquery'], mountJQuery);
        } else {
            var jq = window.jQuery ? window.jQuery : window.$;
            if (typeof jq !== 'undefined') {
                mountJQuery(jq);
            }
        }

        module.exports = mountJQuery;

    }, {"../main": 84, "../plugin/instances": 95}],
    79: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        function oldAdd(element, className) {
            var classes = element.className.split(' ');
            if (classes.indexOf(className) < 0) {
                classes.push(className);
            }
            element.className = classes.join(' ');
        }

        function oldRemove(element, className) {
            var classes = element.className.split(' ');
            var idx = classes.indexOf(className);
            if (idx >= 0) {
                classes.splice(idx, 1);
            }
            element.className = classes.join(' ');
        }

        exports.add = function (element, className) {
            if (element.classList) {
                element.classList.add(className);
            } else {
                oldAdd(element, className);
            }
        };

        exports.remove = function (element, className) {
            if (element.classList) {
                element.classList.remove(className);
            } else {
                oldRemove(element, className);
            }
        };

        exports.list = function (element) {
            if (element.classList) {
                return Array.prototype.slice.apply(element.classList);
            } else {
                return element.className.split(' ');
            }
        };

    }, {}],
    80: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var DOM = {};

        DOM.e = function (tagName, className) {
            var element = document.createElement(tagName);
            element.className = className;
            return element;
        };

        DOM.appendTo = function (child, parent) {
            parent.appendChild(child);
            return child;
        };

        function cssGet(element, styleName) {
            return window.getComputedStyle(element)[styleName];
        }

        function cssSet(element, styleName, styleValue) {
            if (typeof styleValue === 'number') {
                styleValue = styleValue.toString() + 'px';
            }
            element.style[styleName] = styleValue;
            return element;
        }

        function cssMultiSet(element, obj) {
            for (var key in obj) {
                var val = obj[key];
                if (typeof val === 'number') {
                    val = val.toString() + 'px';
                }
                element.style[key] = val;
            }
            return element;
        }

        DOM.css = function (element, styleNameOrObject, styleValue) {
            if (typeof styleNameOrObject === 'object') {
                // multiple set with object
                return cssMultiSet(element, styleNameOrObject);
            } else {
                if (typeof styleValue === 'undefined') {
                    return cssGet(element, styleNameOrObject);
                } else {
                    return cssSet(element, styleNameOrObject, styleValue);
                }
            }
        };

        DOM.matches = function (element, query) {
            if (typeof element.matches !== 'undefined') {
                return element.matches(query);
            } else {
                if (typeof element.matchesSelector !== 'undefined') {
                    return element.matchesSelector(query);
                } else if (typeof element.webkitMatchesSelector !== 'undefined') {
                    return element.webkitMatchesSelector(query);
                } else if (typeof element.mozMatchesSelector !== 'undefined') {
                    return element.mozMatchesSelector(query);
                } else if (typeof element.msMatchesSelector !== 'undefined') {
                    return element.msMatchesSelector(query);
                }
            }
        };

        DOM.remove = function (element) {
            if (typeof element.remove !== 'undefined') {
                element.remove();
            } else {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }
        };

        DOM.queryChildren = function (element, selector) {
            return Array.prototype.filter.call(element.childNodes, function (child) {
                return DOM.matches(child, selector);
            });
        };

        module.exports = DOM;

    }, {}],
    81: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var EventElement = function (element) {
            this.element = element;
            this.events = {};
        };

        EventElement.prototype.bind = function (eventName, handler) {
            if (typeof this.events[eventName] === 'undefined') {
                this.events[eventName] = [];
            }
            this.events[eventName].push(handler);
            this.element.addEventListener(eventName, handler, false);
        };

        EventElement.prototype.unbind = function (eventName, handler) {
            var isHandlerProvided = (typeof handler !== 'undefined');
            this.events[eventName] = this.events[eventName].filter(function (hdlr) {
                if (isHandlerProvided && hdlr !== handler) {
                    return true;
                }
                this.element.removeEventListener(eventName, hdlr, false);
                return false;
            }, this);
        };

        EventElement.prototype.unbindAll = function () {
            for (var name in this.events) {
                this.unbind(name);
            }
        };

        var EventManager = function () {
            this.eventElements = [];
        };

        EventManager.prototype.eventElement = function (element) {
            var ee = this.eventElements.filter(function (eventElement) {
                return eventElement.element === element;
            })[0];
            if (typeof ee === 'undefined') {
                ee = new EventElement(element);
                this.eventElements.push(ee);
            }
            return ee;
        };

        EventManager.prototype.bind = function (element, eventName, handler) {
            this.eventElement(element).bind(eventName, handler);
        };

        EventManager.prototype.unbind = function (element, eventName, handler) {
            this.eventElement(element).unbind(eventName, handler);
        };

        EventManager.prototype.unbindAll = function () {
            for (var i = 0; i < this.eventElements.length; i++) {
                this.eventElements[i].unbindAll();
            }
        };

        EventManager.prototype.once = function (element, eventName, handler) {
            var ee = this.eventElement(element);
            var onceHandler = function (e) {
                ee.unbind(eventName, onceHandler);
                handler(e);
            };
            ee.bind(eventName, onceHandler);
        };

        module.exports = EventManager;

    }, {}],
    82: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        module.exports = (function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }

            return function () {
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            };
        })();

    }, {}],
    83: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var cls = require('./class')
            , d = require('./dom');

        exports.toInt = function (x) {
            return parseInt(x, 10) || 0;
        };

        exports.clone = function (obj) {
            if (obj === null) {
                return null;
            } else if (typeof obj === 'object') {
                var result = {};
                for (var key in obj) {
                    result[key] = this.clone(obj[key]);
                }
                return result;
            } else {
                return obj;
            }
        };

        exports.extend = function (original, source) {
            var result = this.clone(original);
            for (var key in source) {
                result[key] = this.clone(source[key]);
            }
            return result;
        };

        exports.isEditable = function (el) {
            return d.matches(el, "input,[contenteditable]") ||
                d.matches(el, "select,[contenteditable]") ||
                d.matches(el, "textarea,[contenteditable]") ||
                d.matches(el, "button,[contenteditable]");
        };

        exports.removePsClasses = function (element) {
            var clsList = cls.list(element);
            for (var i = 0; i < clsList.length; i++) {
                var className = clsList[i];
                if (className.indexOf('ps-') === 0) {
                    cls.remove(element, className);
                }
            }
        };

        exports.outerWidth = function (element) {
            return this.toInt(d.css(element, 'width')) +
                this.toInt(d.css(element, 'paddingLeft')) +
                this.toInt(d.css(element, 'paddingRight')) +
                this.toInt(d.css(element, 'borderLeftWidth')) +
                this.toInt(d.css(element, 'borderRightWidth'));
        };

        exports.startScrolling = function (element, axis) {
            cls.add(element, 'ps-in-scrolling');
            if (typeof axis !== 'undefined') {
                cls.add(element, 'ps-' + axis);
            } else {
                cls.add(element, 'ps-x');
                cls.add(element, 'ps-y');
            }
        };

        exports.stopScrolling = function (element, axis) {
            cls.remove(element, 'ps-in-scrolling');
            if (typeof axis !== 'undefined') {
                cls.remove(element, 'ps-' + axis);
            } else {
                cls.remove(element, 'ps-x');
                cls.remove(element, 'ps-y');
            }
        };

        exports.env = {
            isWebKit: 'WebkitAppearance' in document.documentElement.style,
            supportsTouch: (('ontouchstart' in window) || window.DocumentTouch && document instanceof window.DocumentTouch),
            supportsIePointer: window.navigator.msMaxTouchPoints !== null
        };

    }, {"./class": 79, "./dom": 80}],
    84: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var destroy = require('./plugin/destroy')
            , initialize = require('./plugin/initialize')
            , update = require('./plugin/update');

        module.exports = {
            initialize: initialize,
            update: update,
            destroy: destroy
        };

    }, {"./plugin/destroy": 86, "./plugin/initialize": 94, "./plugin/update": 98}],
    85: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        module.exports = {
            maxScrollbarLength: null,
            minScrollbarLength: null,
            scrollXMarginOffset: 0,
            scrollYMarginOffset: 0,
            stopPropagationOnClick: true,
            suppressScrollX: false,
            suppressScrollY: false,
            swipePropagation: true,
            useBothWheelAxes: false,
            useKeyboard: true,
            useSelectionScroll: false,
            wheelPropagation: false,
            wheelSpeed: 1
        };

    }, {}],
    86: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var d = require('../lib/dom')
            , h = require('../lib/helper')
            , instances = require('./instances');

        module.exports = function (element) {
            var i = instances.get(element);

            if (!i) {
                return;
            }

            i.event.unbindAll();
            d.remove(i.scrollbarX);
            d.remove(i.scrollbarY);
            d.remove(i.scrollbarXRail);
            d.remove(i.scrollbarYRail);
            h.removePsClasses(element);

            instances.remove(element);
        };

    }, {"../lib/dom": 80, "../lib/helper": 83, "./instances": 95}],
    87: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var h = require('../../lib/helper')
            , instances = require('../instances')
            , updateGeometry = require('../update-geometry')
            , updateScroll = require('../update-scroll');

        function bindClickRailHandler(element, i) {
            function pageOffset(el) {
                return el.getBoundingClientRect();
            }

            var stopPropagation = window.Event.prototype.stopPropagation.bind;

            if (i.settings.stopPropagationOnClick) {
                i.event.bind(i.scrollbarY, 'click', stopPropagation);
            }
            i.event.bind(i.scrollbarYRail, 'click', function (e) {
                var halfOfScrollbarLength = h.toInt(i.scrollbarYHeight / 2);
                var positionTop = i.railYRatio * (e.pageY - window.pageYOffset - pageOffset(i.scrollbarYRail).top - halfOfScrollbarLength);
                var maxPositionTop = i.railYRatio * (i.railYHeight - i.scrollbarYHeight);
                var positionRatio = positionTop / maxPositionTop;

                if (positionRatio < 0) {
                    positionRatio = 0;
                } else if (positionRatio > 1) {
                    positionRatio = 1;
                }

                updateScroll(element, 'top', (i.contentHeight - i.containerHeight) * positionRatio);
                updateGeometry(element);

                e.stopPropagation();
            });

            if (i.settings.stopPropagationOnClick) {
                i.event.bind(i.scrollbarX, 'click', stopPropagation);
            }
            i.event.bind(i.scrollbarXRail, 'click', function (e) {
                var halfOfScrollbarLength = h.toInt(i.scrollbarXWidth / 2);
                var positionLeft = i.railXRatio * (e.pageX - window.pageXOffset - pageOffset(i.scrollbarXRail).left - halfOfScrollbarLength);
                var maxPositionLeft = i.railXRatio * (i.railXWidth - i.scrollbarXWidth);
                var positionRatio = positionLeft / maxPositionLeft;

                if (positionRatio < 0) {
                    positionRatio = 0;
                } else if (positionRatio > 1) {
                    positionRatio = 1;
                }

                updateScroll(element, 'left', ((i.contentWidth - i.containerWidth) * positionRatio) - i.negativeScrollAdjustment);
                updateGeometry(element);

                e.stopPropagation();
            });
        }

        module.exports = function (element) {
            var i = instances.get(element);
            bindClickRailHandler(element, i);
        };

    }, {"../../lib/helper": 83, "../instances": 95, "../update-geometry": 96, "../update-scroll": 97}],
    88: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var d = require('../../lib/dom')
            , h = require('../../lib/helper')
            , instances = require('../instances')
            , updateGeometry = require('../update-geometry')
            , updateScroll = require('../update-scroll');

        function bindMouseScrollXHandler(element, i) {
            var currentLeft = null;
            var currentPageX = null;

            function updateScrollLeft(deltaX) {
                var newLeft = currentLeft + (deltaX * i.railXRatio);
                var maxLeft = Math.max(0, i.scrollbarXRail.getBoundingClientRect().left) + (i.railXRatio * (i.railXWidth - i.scrollbarXWidth));

                if (newLeft < 0) {
                    i.scrollbarXLeft = 0;
                } else if (newLeft > maxLeft) {
                    i.scrollbarXLeft = maxLeft;
                } else {
                    i.scrollbarXLeft = newLeft;
                }

                var scrollLeft = h.toInt(i.scrollbarXLeft * (i.contentWidth - i.containerWidth) / (i.containerWidth - (i.railXRatio * i.scrollbarXWidth))) - i.negativeScrollAdjustment;
                updateScroll(element, 'left', scrollLeft);
            }

            var mouseMoveHandler = function (e) {
                updateScrollLeft(e.pageX - currentPageX);
                updateGeometry(element);
                e.stopPropagation();
                e.preventDefault();
            };

            var mouseUpHandler = function () {
                h.stopScrolling(element, 'x');
                i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
            };

            i.event.bind(i.scrollbarX, 'mousedown', function (e) {
                currentPageX = e.pageX;
                currentLeft = h.toInt(d.css(i.scrollbarX, 'left')) * i.railXRatio;
                h.startScrolling(element, 'x');

                i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
                i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

                e.stopPropagation();
                e.preventDefault();
            });
        }

        function bindMouseScrollYHandler(element, i) {
            var currentTop = null;
            var currentPageY = null;

            function updateScrollTop(deltaY) {
                var newTop = currentTop + (deltaY * i.railYRatio);
                var maxTop = Math.max(0, i.scrollbarYRail.getBoundingClientRect().top) + (i.railYRatio * (i.railYHeight - i.scrollbarYHeight));

                if (newTop < 0) {
                    i.scrollbarYTop = 0;
                } else if (newTop > maxTop) {
                    i.scrollbarYTop = maxTop;
                } else {
                    i.scrollbarYTop = newTop;
                }

                var scrollTop = h.toInt(i.scrollbarYTop * (i.contentHeight - i.containerHeight) / (i.containerHeight - (i.railYRatio * i.scrollbarYHeight)));
                updateScroll(element, 'top', scrollTop);
            }

            var mouseMoveHandler = function (e) {
                updateScrollTop(e.pageY - currentPageY);
                updateGeometry(element);
                e.stopPropagation();
                e.preventDefault();
            };

            var mouseUpHandler = function () {
                h.stopScrolling(element, 'y');
                i.event.unbind(i.ownerDocument, 'mousemove', mouseMoveHandler);
            };

            i.event.bind(i.scrollbarY, 'mousedown', function (e) {
                currentPageY = e.pageY;
                currentTop = h.toInt(d.css(i.scrollbarY, 'top')) * i.railYRatio;
                h.startScrolling(element, 'y');

                i.event.bind(i.ownerDocument, 'mousemove', mouseMoveHandler);
                i.event.once(i.ownerDocument, 'mouseup', mouseUpHandler);

                e.stopPropagation();
                e.preventDefault();
            });
        }

        module.exports = function (element) {
            var i = instances.get(element);
            bindMouseScrollXHandler(element, i);
            bindMouseScrollYHandler(element, i);
        };

    }, {
        "../../lib/dom": 80,
        "../../lib/helper": 83,
        "../instances": 95,
        "../update-geometry": 96,
        "../update-scroll": 97
    }],
    89: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var h = require('../../lib/helper')
            , instances = require('../instances')
            , updateGeometry = require('../update-geometry')
            , updateScroll = require('../update-scroll');

        function bindKeyboardHandler(element, i) {
            var hovered = false;
            i.event.bind(element, 'mouseenter', function () {
                hovered = true;
            });
            i.event.bind(element, 'mouseleave', function () {
                hovered = false;
            });

            var shouldPrevent = false;

            function shouldPreventDefault(deltaX, deltaY) {
                var scrollTop = element.scrollTop;
                if (deltaX === 0) {
                    if (!i.scrollbarYActive) {
                        return false;
                    }
                    if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
                        return !i.settings.wheelPropagation;
                    }
                }

                var scrollLeft = element.scrollLeft;
                if (deltaY === 0) {
                    if (!i.scrollbarXActive) {
                        return false;
                    }
                    if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
                        return !i.settings.wheelPropagation;
                    }
                }
                return true;
            }

            i.event.bind(i.ownerDocument, 'keydown', function (e) {
                if (e.isDefaultPrevented && e.isDefaultPrevented()) {
                    return;
                }

                if (!hovered) {
                    return;
                }

                var activeElement = document.activeElement ? document.activeElement : i.ownerDocument.activeElement;
                if (activeElement) {
                    // go deeper if element is a webcomponent
                    while (activeElement.shadowRoot) {
                        activeElement = activeElement.shadowRoot.activeElement;
                    }
                    if (h.isEditable(activeElement)) {
                        return;
                    }
                }

                var deltaX = 0;
                var deltaY = 0;

                switch (e.which) {
                    case 37: // left
                        deltaX = -30;
                        break;
                    case 38: // up
                        deltaY = 30;
                        break;
                    case 39: // right
                        deltaX = 30;
                        break;
                    case 40: // down
                        deltaY = -30;
                        break;
                    case 33: // page up
                        deltaY = 90;
                        break;
                    case 32: // space bar
                        if (e.shiftKey) {
                            deltaY = 90;
                        } else {
                            deltaY = -90;
                        }
                        break;
                    case 34: // page down
                        deltaY = -90;
                        break;
                    case 35: // end
                        if (e.ctrlKey) {
                            deltaY = -i.contentHeight;
                        } else {
                            deltaY = -i.containerHeight;
                        }
                        break;
                    case 36: // home
                        if (e.ctrlKey) {
                            deltaY = element.scrollTop;
                        } else {
                            deltaY = i.containerHeight;
                        }
                        break;
                    default:
                        return;
                }

                updateScroll(element, 'top', element.scrollTop - deltaY);
                updateScroll(element, 'left', element.scrollLeft + deltaX);
                updateGeometry(element);

                shouldPrevent = shouldPreventDefault(deltaX, deltaY);
                if (shouldPrevent) {
                    e.preventDefault();
                }
            });
        }

        module.exports = function (element) {
            var i = instances.get(element);
            bindKeyboardHandler(element, i);
        };

    }, {"../../lib/helper": 83, "../instances": 95, "../update-geometry": 96, "../update-scroll": 97}],
    90: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var instances = require('../instances')
            , updateGeometry = require('../update-geometry')
            , updateScroll = require('../update-scroll');

        function bindMouseWheelHandler(element, i) {
            var shouldPrevent = false;

            function shouldPreventDefault(deltaX, deltaY) {
                var scrollTop = element.scrollTop;
                if (deltaX === 0) {
                    if (!i.scrollbarYActive) {
                        return false;
                    }
                    if ((scrollTop === 0 && deltaY > 0) || (scrollTop >= i.contentHeight - i.containerHeight && deltaY < 0)) {
                        return !i.settings.wheelPropagation;
                    }
                }

                var scrollLeft = element.scrollLeft;
                if (deltaY === 0) {
                    if (!i.scrollbarXActive) {
                        return false;
                    }
                    if ((scrollLeft === 0 && deltaX < 0) || (scrollLeft >= i.contentWidth - i.containerWidth && deltaX > 0)) {
                        return !i.settings.wheelPropagation;
                    }
                }
                return true;
            }

            function getDeltaFromEvent(e) {
                var deltaX = e.deltaX;
                var deltaY = -1 * e.deltaY;

                if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
                    // OS X Safari
                    deltaX = -1 * e.wheelDeltaX / 6;
                    deltaY = e.wheelDeltaY / 6;
                }

                if (e.deltaMode && e.deltaMode === 1) {
                    // Firefox in deltaMode 1: Line scrolling
                    deltaX *= 10;
                    deltaY *= 10;
                }

                if (deltaX !== deltaX && deltaY !== deltaY/* NaN checks */) {
                    // IE in some mouse drivers
                    deltaX = 0;
                    deltaY = e.wheelDelta;
                }

                return [deltaX, deltaY];
            }

            function shouldBeConsumedByTextarea(deltaX, deltaY) {
                var hoveredTextarea = element.querySelector('textarea:hover');
                if (hoveredTextarea) {
                    var maxScrollTop = hoveredTextarea.scrollHeight - hoveredTextarea.clientHeight;
                    if (maxScrollTop > 0) {
                        if (!(hoveredTextarea.scrollTop === 0 && deltaY > 0) && !(hoveredTextarea.scrollTop === maxScrollTop && deltaY < 0)) {
                            return true;
                        }
                    }
                    var maxScrollLeft = hoveredTextarea.scrollLeft - hoveredTextarea.clientWidth;
                    if (maxScrollLeft > 0) {
                        if (!(hoveredTextarea.scrollLeft === 0 && deltaX < 0) && !(hoveredTextarea.scrollLeft === maxScrollLeft && deltaX > 0)) {
                            return true;
                        }
                    }
                }
                return false;
            }

            function mousewheelHandler(e) {
                var delta = getDeltaFromEvent(e);

                var deltaX = delta[0];
                var deltaY = delta[1];

                if (shouldBeConsumedByTextarea(deltaX, deltaY)) {
                    return;
                }

                shouldPrevent = false;
                if (!i.settings.useBothWheelAxes) {
                    // deltaX will only be used for horizontal scrolling and deltaY will
                    // only be used for vertical scrolling - this is the default
                    updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
                    updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
                } else if (i.scrollbarYActive && !i.scrollbarXActive) {
                    // only vertical scrollbar is active and useBothWheelAxes option is
                    // active, so let's scroll vertical bar using both mouse wheel axes
                    if (deltaY) {
                        updateScroll(element, 'top', element.scrollTop - (deltaY * i.settings.wheelSpeed));
                    } else {
                        updateScroll(element, 'top', element.scrollTop + (deltaX * i.settings.wheelSpeed));
                    }
                    shouldPrevent = true;
                } else if (i.scrollbarXActive && !i.scrollbarYActive) {
                    // useBothWheelAxes and only horizontal bar is active, so use both
                    // wheel axes for horizontal bar
                    if (deltaX) {
                        updateScroll(element, 'left', element.scrollLeft + (deltaX * i.settings.wheelSpeed));
                    } else {
                        updateScroll(element, 'left', element.scrollLeft - (deltaY * i.settings.wheelSpeed));
                    }
                    shouldPrevent = true;
                }

                updateGeometry(element);

                shouldPrevent = (shouldPrevent || shouldPreventDefault(deltaX, deltaY));
                if (shouldPrevent) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            }

            if (typeof window.onwheel !== "undefined") {
                i.event.bind(element, 'wheel', mousewheelHandler);
            } else if (typeof window.onmousewheel !== "undefined") {
                i.event.bind(element, 'mousewheel', mousewheelHandler);
            }
        }

        module.exports = function (element) {
            var i = instances.get(element);
            bindMouseWheelHandler(element, i);
        };

    }, {"../instances": 95, "../update-geometry": 96, "../update-scroll": 97}],
    91: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var instances = require('../instances')
            , updateGeometry = require('../update-geometry');

        function bindNativeScrollHandler(element, i) {
            i.event.bind(element, 'scroll', function () {
                updateGeometry(element);
            });
        }

        module.exports = function (element) {
            var i = instances.get(element);
            bindNativeScrollHandler(element, i);
        };

    }, {"../instances": 95, "../update-geometry": 96}],
    92: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var h = require('../../lib/helper')
            , instances = require('../instances')
            , updateGeometry = require('../update-geometry')
            , updateScroll = require('../update-scroll');

        function bindSelectionHandler(element, i) {
            function getRangeNode() {
                var selection = window.getSelection ? window.getSelection() :
                    document.getSelection ? document.getSelection() : '';
                if (selection.toString().length === 0) {
                    return null;
                } else {
                    return selection.getRangeAt(0).commonAncestorContainer;
                }
            }

            var scrollingLoop = null;
            var scrollDiff = {top: 0, left: 0};

            function startScrolling() {
                if (!scrollingLoop) {
                    scrollingLoop = setInterval(function () {
                        if (!instances.get(element)) {
                            clearInterval(scrollingLoop);
                            return;
                        }

                        updateScroll(element, 'top', element.scrollTop + scrollDiff.top);
                        updateScroll(element, 'left', element.scrollLeft + scrollDiff.left);
                        updateGeometry(element);
                    }, 50); // every .1 sec
                }
            }

            function stopScrolling() {
                if (scrollingLoop) {
                    clearInterval(scrollingLoop);
                    scrollingLoop = null;
                }
                h.stopScrolling(element);
            }

            var isSelected = false;
            i.event.bind(i.ownerDocument, 'selectionchange', function () {
                if (element.contains(getRangeNode())) {
                    isSelected = true;
                } else {
                    isSelected = false;
                    stopScrolling();
                }
            });
            i.event.bind(window, 'mouseup', function () {
                if (isSelected) {
                    isSelected = false;
                    stopScrolling();
                }
            });

            i.event.bind(window, 'mousemove', function (e) {
                if (isSelected) {
                    var mousePosition = {x: e.pageX, y: e.pageY};
                    var containerGeometry = {
                        left: element.offsetLeft,
                        right: element.offsetLeft + element.offsetWidth,
                        top: element.offsetTop,
                        bottom: element.offsetTop + element.offsetHeight
                    };

                    if (mousePosition.x < containerGeometry.left + 3) {
                        scrollDiff.left = -5;
                        h.startScrolling(element, 'x');
                    } else if (mousePosition.x > containerGeometry.right - 3) {
                        scrollDiff.left = 5;
                        h.startScrolling(element, 'x');
                    } else {
                        scrollDiff.left = 0;
                    }

                    if (mousePosition.y < containerGeometry.top + 3) {
                        if (containerGeometry.top + 3 - mousePosition.y < 5) {
                            scrollDiff.top = -5;
                        } else {
                            scrollDiff.top = -20;
                        }
                        h.startScrolling(element, 'y');
                    } else if (mousePosition.y > containerGeometry.bottom - 3) {
                        if (mousePosition.y - containerGeometry.bottom + 3 < 5) {
                            scrollDiff.top = 5;
                        } else {
                            scrollDiff.top = 20;
                        }
                        h.startScrolling(element, 'y');
                    } else {
                        scrollDiff.top = 0;
                    }

                    if (scrollDiff.top === 0 && scrollDiff.left === 0) {
                        stopScrolling();
                    } else {
                        startScrolling();
                    }
                }
            });
        }

        module.exports = function (element) {
            var i = instances.get(element);
            bindSelectionHandler(element, i);
        };

    }, {"../../lib/helper": 83, "../instances": 95, "../update-geometry": 96, "../update-scroll": 97}],
    93: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var instances = require('../instances')
            , updateGeometry = require('../update-geometry')
            , updateScroll = require('../update-scroll');

        function bindTouchHandler(element, i, supportsTouch, supportsIePointer) {
            function shouldPreventDefault(deltaX, deltaY) {
                var scrollTop = element.scrollTop;
                var scrollLeft = element.scrollLeft;
                var magnitudeX = Math.abs(deltaX);
                var magnitudeY = Math.abs(deltaY);

                if (magnitudeY > magnitudeX) {
                    // user is perhaps trying to swipe up/down the page

                    if (((deltaY < 0) && (scrollTop === i.contentHeight - i.containerHeight)) ||
                        ((deltaY > 0) && (scrollTop === 0))) {
                        return !i.settings.swipePropagation;
                    }
                } else if (magnitudeX > magnitudeY) {
                    // user is perhaps trying to swipe left/right across the page

                    if (((deltaX < 0) && (scrollLeft === i.contentWidth - i.containerWidth)) ||
                        ((deltaX > 0) && (scrollLeft === 0))) {
                        return !i.settings.swipePropagation;
                    }
                }

                return true;
            }

            function applyTouchMove(differenceX, differenceY) {
                updateScroll(element, 'top', element.scrollTop - differenceY);
                updateScroll(element, 'left', element.scrollLeft - differenceX);

                updateGeometry(element);
            }

            var startOffset = {};
            var startTime = 0;
            var speed = {};
            var easingLoop = null;
            var inGlobalTouch = false;
            var inLocalTouch = false;

            function globalTouchStart() {
                inGlobalTouch = true;
            }

            function globalTouchEnd() {
                inGlobalTouch = false;
            }

            function getTouch(e) {
                if (e.targetTouches) {
                    return e.targetTouches[0];
                } else {
                    // Maybe IE pointer
                    return e;
                }
            }

            function shouldHandle(e) {
                if (e.targetTouches && e.targetTouches.length === 1) {
                    return true;
                }
                if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
                    return true;
                }
                return false;
            }

            function touchStart(e) {
                if (shouldHandle(e)) {
                    inLocalTouch = true;

                    var touch = getTouch(e);

                    startOffset.pageX = touch.pageX;
                    startOffset.pageY = touch.pageY;

                    startTime = (new Date()).getTime();

                    if (easingLoop !== null) {
                        clearInterval(easingLoop);
                    }

                    e.stopPropagation();
                }
            }

            function touchMove(e) {
                if (!inGlobalTouch && inLocalTouch && shouldHandle(e)) {
                    var touch = getTouch(e);

                    var currentOffset = {pageX: touch.pageX, pageY: touch.pageY};

                    var differenceX = currentOffset.pageX - startOffset.pageX;
                    var differenceY = currentOffset.pageY - startOffset.pageY;

                    applyTouchMove(differenceX, differenceY);
                    startOffset = currentOffset;

                    var currentTime = (new Date()).getTime();

                    var timeGap = currentTime - startTime;
                    if (timeGap > 0) {
                        speed.x = differenceX / timeGap;
                        speed.y = differenceY / timeGap;
                        startTime = currentTime;
                    }

                    if (shouldPreventDefault(differenceX, differenceY)) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            }

            function touchEnd() {
                if (!inGlobalTouch && inLocalTouch) {
                    inLocalTouch = false;

                    clearInterval(easingLoop);
                    easingLoop = setInterval(function () {
                        if (!instances.get(element)) {
                            clearInterval(easingLoop);
                            return;
                        }

                        if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
                            clearInterval(easingLoop);
                            return;
                        }

                        applyTouchMove(speed.x * 30, speed.y * 30);

                        speed.x *= 0.8;
                        speed.y *= 0.8;
                    }, 10);
                }
            }

            if (supportsTouch) {
                i.event.bind(window, 'touchstart', globalTouchStart);
                i.event.bind(window, 'touchend', globalTouchEnd);
                i.event.bind(element, 'touchstart', touchStart);
                i.event.bind(element, 'touchmove', touchMove);
                i.event.bind(element, 'touchend', touchEnd);
            }

            if (supportsIePointer) {
                if (window.PointerEvent) {
                    i.event.bind(window, 'pointerdown', globalTouchStart);
                    i.event.bind(window, 'pointerup', globalTouchEnd);
                    i.event.bind(element, 'pointerdown', touchStart);
                    i.event.bind(element, 'pointermove', touchMove);
                    i.event.bind(element, 'pointerup', touchEnd);
                } else if (window.MSPointerEvent) {
                    i.event.bind(window, 'MSPointerDown', globalTouchStart);
                    i.event.bind(window, 'MSPointerUp', globalTouchEnd);
                    i.event.bind(element, 'MSPointerDown', touchStart);
                    i.event.bind(element, 'MSPointerMove', touchMove);
                    i.event.bind(element, 'MSPointerUp', touchEnd);
                }
            }
        }

        module.exports = function (element, supportsTouch, supportsIePointer) {
            var i = instances.get(element);
            bindTouchHandler(element, i, supportsTouch, supportsIePointer);
        };

    }, {"../instances": 95, "../update-geometry": 96, "../update-scroll": 97}],
    94: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var cls = require('../lib/class')
            , h = require('../lib/helper')
            , instances = require('./instances')
            , updateGeometry = require('./update-geometry');

// Handlers
        var clickRailHandler = require('./handler/click-rail')
            , dragScrollbarHandler = require('./handler/drag-scrollbar')
            , keyboardHandler = require('./handler/keyboard')
            , mouseWheelHandler = require('./handler/mouse-wheel')
            , nativeScrollHandler = require('./handler/native-scroll')
            , selectionHandler = require('./handler/selection')
            , touchHandler = require('./handler/touch');

        module.exports = function (element, userSettings) {
            userSettings = typeof userSettings === 'object' ? userSettings : {};

            cls.add(element, 'ps-container');

            // Create a plugin instance.
            var i = instances.add(element);

            i.settings = h.extend(i.settings, userSettings);

            clickRailHandler(element);
            dragScrollbarHandler(element);
            mouseWheelHandler(element);
            nativeScrollHandler(element);

            if (i.settings.useSelectionScroll) {
                selectionHandler(element);
            }

            if (h.env.supportsTouch || h.env.supportsIePointer) {
                touchHandler(element, h.env.supportsTouch, h.env.supportsIePointer);
            }
            if (i.settings.useKeyboard) {
                keyboardHandler(element);
            }

            updateGeometry(element);
        };

    }, {
        "../lib/class": 79,
        "../lib/helper": 83,
        "./handler/click-rail": 87,
        "./handler/drag-scrollbar": 88,
        "./handler/keyboard": 89,
        "./handler/mouse-wheel": 90,
        "./handler/native-scroll": 91,
        "./handler/selection": 92,
        "./handler/touch": 93,
        "./instances": 95,
        "./update-geometry": 96
    }],
    95: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var d = require('../lib/dom')
            , defaultSettings = require('./default-setting')
            , EventManager = require('../lib/event-manager')
            , guid = require('../lib/guid')
            , h = require('../lib/helper');

        var instances = {};

        function Instance(element) {
            var i = this;

            i.settings = h.clone(defaultSettings);
            i.containerWidth = null;
            i.containerHeight = null;
            i.contentWidth = null;
            i.contentHeight = null;

            i.isRtl = d.css(element, 'direction') === "rtl";
            i.isNegativeScroll = (function () {
                var originalScrollLeft = element.scrollLeft;
                var result = null;
                element.scrollLeft = -1;
                result = element.scrollLeft < 0;
                element.scrollLeft = originalScrollLeft;
                return result;
            })();
            i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;
            i.event = new EventManager();
            i.ownerDocument = element.ownerDocument || document;

            i.scrollbarXRail = d.appendTo(d.e('div', 'ps-scrollbar-x-rail'), element);
            i.scrollbarX = d.appendTo(d.e('div', 'ps-scrollbar-x'), i.scrollbarXRail);
            i.scrollbarX.setAttribute('tabindex', 0);
            i.scrollbarXActive = null;
            i.scrollbarXWidth = null;
            i.scrollbarXLeft = null;
            i.scrollbarXBottom = h.toInt(d.css(i.scrollbarXRail, 'bottom'));
            i.isScrollbarXUsingBottom = i.scrollbarXBottom === i.scrollbarXBottom; // !isNaN
            i.scrollbarXTop = i.isScrollbarXUsingBottom ? null : h.toInt(d.css(i.scrollbarXRail, 'top'));
            i.railBorderXWidth = h.toInt(d.css(i.scrollbarXRail, 'borderLeftWidth')) + h.toInt(d.css(i.scrollbarXRail, 'borderRightWidth'));
            // Set rail to display:block to calculate margins
            d.css(i.scrollbarXRail, 'display', 'block');
            i.railXMarginWidth = h.toInt(d.css(i.scrollbarXRail, 'marginLeft')) + h.toInt(d.css(i.scrollbarXRail, 'marginRight'));
            d.css(i.scrollbarXRail, 'display', '');
            i.railXWidth = null;
            i.railXRatio = null;

            i.scrollbarYRail = d.appendTo(d.e('div', 'ps-scrollbar-y-rail'), element);
            i.scrollbarY = d.appendTo(d.e('div', 'ps-scrollbar-y'), i.scrollbarYRail);
            i.scrollbarY.setAttribute('tabindex', 0);
            i.scrollbarYActive = null;
            i.scrollbarYHeight = null;
            i.scrollbarYTop = null;
            i.scrollbarYRight = h.toInt(d.css(i.scrollbarYRail, 'right'));
            i.isScrollbarYUsingRight = i.scrollbarYRight === i.scrollbarYRight; // !isNaN
            i.scrollbarYLeft = i.isScrollbarYUsingRight ? null : h.toInt(d.css(i.scrollbarYRail, 'left'));
            i.scrollbarYOuterWidth = i.isRtl ? h.outerWidth(i.scrollbarY) : null;
            i.railBorderYWidth = h.toInt(d.css(i.scrollbarYRail, 'borderTopWidth')) + h.toInt(d.css(i.scrollbarYRail, 'borderBottomWidth'));
            d.css(i.scrollbarYRail, 'display', 'block');
            i.railYMarginHeight = h.toInt(d.css(i.scrollbarYRail, 'marginTop')) + h.toInt(d.css(i.scrollbarYRail, 'marginBottom'));
            d.css(i.scrollbarYRail, 'display', '');
            i.railYHeight = null;
            i.railYRatio = null;
        }

        function getId(element) {
            if (typeof element.dataset === 'undefined') {
                return element.getAttribute('data-ps-id');
            } else {
                return element.dataset.psId;
            }
        }

        function setId(element, id) {
            if (typeof element.dataset === 'undefined') {
                element.setAttribute('data-ps-id', id);
            } else {
                element.dataset.psId = id;
            }
        }

        function removeId(element) {
            if (typeof element.dataset === 'undefined') {
                element.removeAttribute('data-ps-id');
            } else {
                delete element.dataset.psId;
            }
        }

        exports.add = function (element) {
            var newId = guid();
            setId(element, newId);
            instances[newId] = new Instance(element);
            return instances[newId];
        };

        exports.remove = function (element) {
            delete instances[getId(element)];
            removeId(element);
        };

        exports.get = function (element) {
            return instances[getId(element)];
        };

    }, {"../lib/dom": 80, "../lib/event-manager": 81, "../lib/guid": 82, "../lib/helper": 83, "./default-setting": 85}],
    96: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var cls = require('../lib/class')
            , d = require('../lib/dom')
            , h = require('../lib/helper')
            , instances = require('./instances')
            , updateScroll = require('./update-scroll');

        function getThumbSize(i, thumbSize) {
            if (i.settings.minScrollbarLength) {
                thumbSize = Math.max(thumbSize, i.settings.minScrollbarLength);
            }
            if (i.settings.maxScrollbarLength) {
                thumbSize = Math.min(thumbSize, i.settings.maxScrollbarLength);
            }
            return thumbSize;
        }

        function updateCss(element, i) {
            var xRailOffset = {width: i.railXWidth};
            if (i.isRtl) {
                xRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth - i.contentWidth;
            } else {
                xRailOffset.left = element.scrollLeft;
            }
            if (i.isScrollbarXUsingBottom) {
                xRailOffset.bottom = i.scrollbarXBottom - element.scrollTop;
            } else {
                xRailOffset.top = i.scrollbarXTop + element.scrollTop;
            }
            d.css(i.scrollbarXRail, xRailOffset);

            var yRailOffset = {top: element.scrollTop, height: i.railYHeight};
            if (i.isScrollbarYUsingRight) {
                if (i.isRtl) {
                    yRailOffset.right = i.contentWidth - (i.negativeScrollAdjustment + element.scrollLeft) - i.scrollbarYRight - i.scrollbarYOuterWidth;
                } else {
                    yRailOffset.right = i.scrollbarYRight - element.scrollLeft;
                }
            } else {
                if (i.isRtl) {
                    yRailOffset.left = i.negativeScrollAdjustment + element.scrollLeft + i.containerWidth * 2 - i.contentWidth - i.scrollbarYLeft - i.scrollbarYOuterWidth;
                } else {
                    yRailOffset.left = i.scrollbarYLeft + element.scrollLeft;
                }
            }
            d.css(i.scrollbarYRail, yRailOffset);

            d.css(i.scrollbarX, {left: i.scrollbarXLeft, width: i.scrollbarXWidth - i.railBorderXWidth});
            d.css(i.scrollbarY, {top: i.scrollbarYTop, height: i.scrollbarYHeight - i.railBorderYWidth});
        }

        module.exports = function (element) {
            var i = instances.get(element);

            i.containerWidth = element.clientWidth;
            i.containerHeight = element.clientHeight;
            i.contentWidth = element.scrollWidth;
            i.contentHeight = element.scrollHeight;

            var existingRails;
            if (!element.contains(i.scrollbarXRail)) {
                existingRails = d.queryChildren(element, '.ps-scrollbar-x-rail');
                if (existingRails.length > 0) {
                    existingRails.forEach(function (rail) {
                        d.remove(rail);
                    });
                }
                d.appendTo(i.scrollbarXRail, element);
            }
            if (!element.contains(i.scrollbarYRail)) {
                existingRails = d.queryChildren(element, '.ps-scrollbar-y-rail');
                if (existingRails.length > 0) {
                    existingRails.forEach(function (rail) {
                        d.remove(rail);
                    });
                }
                d.appendTo(i.scrollbarYRail, element);
            }

            if (!i.settings.suppressScrollX && i.containerWidth + i.settings.scrollXMarginOffset < i.contentWidth) {
                i.scrollbarXActive = true;
                i.railXWidth = i.containerWidth - i.railXMarginWidth;
                i.railXRatio = i.containerWidth / i.railXWidth;
                i.scrollbarXWidth = getThumbSize(i, h.toInt(i.railXWidth * i.containerWidth / i.contentWidth));
                i.scrollbarXLeft = h.toInt((i.negativeScrollAdjustment + element.scrollLeft) * (i.railXWidth - i.scrollbarXWidth) / (i.contentWidth - i.containerWidth));
            } else {
                i.scrollbarXActive = false;
            }

            if (!i.settings.suppressScrollY && i.containerHeight + i.settings.scrollYMarginOffset < i.contentHeight) {
                i.scrollbarYActive = true;
                i.railYHeight = i.containerHeight - i.railYMarginHeight;
                i.railYRatio = i.containerHeight / i.railYHeight;
                i.scrollbarYHeight = getThumbSize(i, h.toInt(i.railYHeight * i.containerHeight / i.contentHeight));
                i.scrollbarYTop = h.toInt(element.scrollTop * (i.railYHeight - i.scrollbarYHeight) / (i.contentHeight - i.containerHeight));
            } else {
                i.scrollbarYActive = false;
            }

            if (i.scrollbarXLeft >= i.railXWidth - i.scrollbarXWidth) {
                i.scrollbarXLeft = i.railXWidth - i.scrollbarXWidth;
            }
            if (i.scrollbarYTop >= i.railYHeight - i.scrollbarYHeight) {
                i.scrollbarYTop = i.railYHeight - i.scrollbarYHeight;
            }

            updateCss(element, i);

            if (i.scrollbarXActive) {
                cls.add(element, 'ps-active-x');
            } else {
                cls.remove(element, 'ps-active-x');
                i.scrollbarXWidth = 0;
                i.scrollbarXLeft = 0;
                updateScroll(element, 'left', 0);
            }
            if (i.scrollbarYActive) {
                cls.add(element, 'ps-active-y');
            } else {
                cls.remove(element, 'ps-active-y');
                i.scrollbarYHeight = 0;
                i.scrollbarYTop = 0;
                updateScroll(element, 'top', 0);
            }
        };

    }, {"../lib/class": 79, "../lib/dom": 80, "../lib/helper": 83, "./instances": 95, "./update-scroll": 97}],
    97: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var instances = require('./instances');

        var upEvent = document.createEvent('Event')
            , downEvent = document.createEvent('Event')
            , leftEvent = document.createEvent('Event')
            , rightEvent = document.createEvent('Event')
            , yEvent = document.createEvent('Event')
            , xEvent = document.createEvent('Event')
            , xStartEvent = document.createEvent('Event')
            , xEndEvent = document.createEvent('Event')
            , yStartEvent = document.createEvent('Event')
            , yEndEvent = document.createEvent('Event')
            , lastTop
            , lastLeft;

        upEvent.initEvent('ps-scroll-up', true, true);
        downEvent.initEvent('ps-scroll-down', true, true);
        leftEvent.initEvent('ps-scroll-left', true, true);
        rightEvent.initEvent('ps-scroll-right', true, true);
        yEvent.initEvent('ps-scroll-y', true, true);
        xEvent.initEvent('ps-scroll-x', true, true);
        xStartEvent.initEvent('ps-x-reach-start', true, true);
        xEndEvent.initEvent('ps-x-reach-end', true, true);
        yStartEvent.initEvent('ps-y-reach-start', true, true);
        yEndEvent.initEvent('ps-y-reach-end', true, true);

        module.exports = function (element, axis, value) {
            if (typeof element === 'undefined') {
                throw 'You must provide an element to the update-scroll function';
            }

            if (typeof axis === 'undefined') {
                throw 'You must provide an axis to the update-scroll function';
            }

            if (typeof value === 'undefined') {
                throw 'You must provide a value to the update-scroll function';
            }

            if (axis === 'top' && value <= 0) {
                element.scrollTop = 0;
                element.dispatchEvent(yStartEvent);
                return; // don't allow negative scroll
            }

            if (axis === 'left' && value <= 0) {
                element.scrollLeft = 0;
                element.dispatchEvent(xStartEvent);
                return; // don't allow negative scroll
            }

            var i = instances.get(element);

            if (axis === 'top' && value >= i.contentHeight - i.containerHeight) {
                element.scrollTop = i.contentHeight - i.containerHeight;
                element.dispatchEvent(yEndEvent);
                return; // don't allow scroll past container
            }

            if (axis === 'left' && value >= i.contentWidth - i.containerWidth) {
                element.scrollLeft = i.contentWidth - i.containerWidth;
                element.dispatchEvent(xEndEvent);
                return; // don't allow scroll past container
            }

            if (!lastTop) {
                lastTop = element.scrollTop;
            }

            if (!lastLeft) {
                lastLeft = element.scrollLeft;
            }

            if (axis === 'top' && value < lastTop) {
                element.dispatchEvent(upEvent);
            }

            if (axis === 'top' && value > lastTop) {
                element.dispatchEvent(downEvent);
            }

            if (axis === 'left' && value < lastLeft) {
                element.dispatchEvent(leftEvent);
            }

            if (axis === 'left' && value > lastLeft) {
                element.dispatchEvent(rightEvent);
            }

            if (axis === 'top') {
                element.scrollTop = lastTop = value;
                element.dispatchEvent(yEvent);
            }

            if (axis === 'left') {
                element.scrollLeft = lastLeft = value;
                element.dispatchEvent(xEvent);
            }

        };

    }, {"./instances": 95}],
    98: [function (require, module, exports) {
        /* Copyright (c) 2015 Hyunje Alex Jun and other contributors
         * Licensed under the MIT License
         */
        'use strict';

        var d = require('../lib/dom')
            , h = require('../lib/helper')
            , instances = require('./instances')
            , updateGeometry = require('./update-geometry')
            , updateScroll = require('./update-scroll');

        module.exports = function (element) {
            var i = instances.get(element);

            if (!i) {
                return;
            }

            // Recalcuate negative scrollLeft adjustment
            i.negativeScrollAdjustment = i.isNegativeScroll ? element.scrollWidth - element.clientWidth : 0;

            // Recalculate rail margins
            d.css(i.scrollbarXRail, 'display', 'block');
            d.css(i.scrollbarYRail, 'display', 'block');
            i.railXMarginWidth = h.toInt(d.css(i.scrollbarXRail, 'marginLeft')) + h.toInt(d.css(i.scrollbarXRail, 'marginRight'));
            i.railYMarginHeight = h.toInt(d.css(i.scrollbarYRail, 'marginTop')) + h.toInt(d.css(i.scrollbarYRail, 'marginBottom'));

            // Hide scrollbars not to affect scrollWidth and scrollHeight
            d.css(i.scrollbarXRail, 'display', 'none');
            d.css(i.scrollbarYRail, 'display', 'none');

            updateGeometry(element);

            // Update top/left scroll to trigger events
            updateScroll(element, 'top', element.scrollTop);
            updateScroll(element, 'left', element.scrollLeft);

            d.css(i.scrollbarXRail, 'display', '');
            d.css(i.scrollbarYRail, 'display', '');
        };

    }, {"../lib/dom": 80, "../lib/helper": 83, "./instances": 95, "./update-geometry": 96, "./update-scroll": 97}]
}, {}, [67])

