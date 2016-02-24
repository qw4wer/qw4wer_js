/**
 * Created by qw5we on 2016/1/9.
 */
(function (global, undefined) {
    "use strict";
    global.liveTrackEvents = function (element) {
        return $.data ? $.data(element, "events", undefined, true) : $._data(element, "events")
    };
    global.getDanmuColor = function () {
        return global.colorfulDanMu.currentColor
    };
    global.giftTsHistory = []
})(window);
(function (global, undefined) {
    "use strict";
    var $appendTarget = $(".supergift-container");
    global.superGift = {};
    global.superGift.settings = {showTime: 1e4};
    global.superGift.newGift = function (superGiftInfo, hitNum) {
        var giftDom = document.createElement("div");
        giftDom.className = "supergift supergift-" + superGiftInfo.giftId + " gift-step-2 animated";
        giftDom.setAttribute("data-gift-id", superGiftInfo.id);
        giftDom.innerHTML = '<img class="supergift-img gift-step-1 animated" src="http://static.hdslb.com/live-static/images/gifts/gift-' + superGiftInfo.giftId + '.gif">' + '<div class="supergift-text">' + '<p class="supergift-text-sec gift-step-3 animated"><span class="supergift-uname">' + superGiftInfo.uname + '</span><span class="supergift-action">赠送' + superGiftInfo.giftName + '</span><span class="supergift-num">' + superGiftInfo.num + "个</span></p></div>" + '<img class="supergift-cross gift-step-4 animated" src="http://static.hdslb.com/live-static/images/supergift/cross.png"><p class="supergift-hitnum gift-step-6 animated">' + hitNum + '</p><p class="combo-text gift-step-5 animated">combo</p>';
        setTimeout(function () {
            $(giftDom).addClass("fadeOutLeft").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                giftDom.parentNode.removeChild(giftDom)
            })
        }, global.superGift.settings.showTime);
        this.create = giftDom
    };
    global.superGift.fffGift = function (superGiftInfo, hitNum) {
        var giftDom = document.createElement("div");
        giftDom.className = "supergift supergift-" + superGiftInfo.giftId + " gift-step-2 animated";
        giftDom.setAttribute("data-gift-id", superGiftInfo.id);
        giftDom.innerHTML = '<div style="background-color: #9B5131" class="supergift-img gift-step-1 animated">' + '<img src="http://static.hdslb.com/live-static/images/gifts/gift-13-fireball.png" style="position: absolute; top: -20px; left: -10px;">' + "</div>" + '<div class="supergift-text">' + '<p class="supergift-text-sec gift-step-3 animated" style="color: #fff; margin-left: 10px; top: -3px;"><span class="supergift-uname" style="vertical-align: top; color: rgb(255, 232, 0);">' + superGiftInfo.uname + "</span>使用了大火球术！</p></div>" + '<img class="supergift-cross gift-step-4 animated" src="http://static.hdslb.com/live-static/images/supergift/cross.png"><p class="supergift-hitnum gift-step-6 animated">' + hitNum + '</p><p class="combo-text gift-step-5 animated">combo</p>';
        setTimeout(function () {
            $(giftDom).addClass("fadeOutLeft").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                giftDom.parentNode.removeChild(giftDom)
            })
        }, global.superGift.settings.showTime);
        this.create = giftDom
    };
    global.superGift.exec = function (data) {
        if (data["super"] == 0) {
            return false
        }
        var id = data.uid + "_" + data.giftId + "_" + data.num + "_" + data["super"], superGiftInfo = {
            id: id,
            uname: data.uname,
            num: data.num,
            giftName: data.giftName,
            giftId: data.giftId
        };
        if ($appendTarget.children().length >= 3) {
            $(".supergift:first-child", $appendTarget).remove();
            $(".supergift", $appendTarget).addClass("moveUp").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
                $(this).removeClass("moveUp")
            })
        }
        var newGift = null;
        if (data.giftName === "FFF") {
            newGift = new global.superGift.fffGift(superGiftInfo, data.super).create
        } else {
            newGift = new global.superGift.newGift(superGiftInfo, data.super).create
        }
        $(".supergift", $appendTarget).removeClass("gift-step-2 animated");
        $appendTarget.append(newGift)
    }
})(window);
(function (global, $) {
    $(function () {
        var initRequest = true;
        var $levelInfoPanel = $(".anchor-level-info-panel"), $hoverNode = $(".live-head .up-face");
        var outTimeout = null;

        function onEvent() {
            $hoverNode.hover(mouseEnter, mouseLeave);
            $levelInfoPanel.hover(mouseEnter, mouseLeave)
        }

        function hoverHandler(type) {
            switch (type) {
                case"mouseEnter":
                    $levelInfoPanel.stop(true, true).fadeIn(200);
                    if (!initRequest) {
                        return
                    }
                    $.ajax({
                        url: "/user/getMasterInfo",
                        type: "post",
                        data: {uid: global.MASTERID},
                        dataType: "JSON",
                        success: function (result) {
                            $(".anchor-level-info-panel .loading-progress").fadeOut();
                            initRequest = false;
                            $(".data-anchor-level").text(result.data.master_level);
                            $(".data-anchor-rank").text(result.data.sort);
                            $(".data-anchor-upgrade-score").text(result.data.upgrade_score)
                        },
                        error: function (result) {
                        }
                    });
                    break;
                case"mouseLeave":
                    $levelInfoPanel.stop(true, true).fadeOut(200);
                    break
            }
        }

        function mouseEnter() {
            clearTimeout(outTimeout);
            hoverHandler("mouseEnter")
        }

        function mouseLeave() {
            outTimeout = setTimeout(function () {
                hoverHandler("mouseLeave")
            }, 120)
        }

        onEvent()
    })
})(window, window.jQuery);
(function (global, undefined) {
    "use strict";
    function timestampShorter(timestamp) {
        var newTimeStamp = null;
        newTimeStamp = timestamp.toString();
        newTimeStamp = newTimeStamp.slice(0, newTimeStamp.length - 3);
        newTimeStamp = parseInt(newTimeStamp, 10);
        return newTimeStamp
    }

    global.giftEvent = {
        lastGiftSendStatus: {uname: "", timestamp: 0},
        popupMsg: {
            noMoreSeeds: {silver: "银瓜子数量不足，是否使用金瓜子购买？", both: "您的瓜子不够了，要不要充一点？_(:3」∠)_"},
            invalidNum: "请输入正确的数字哦~ (●'◡'●)ﾉ♥"
        },
        createGiveBox: function () {
            $(".gift-item .gift-icon").hover(function () {
                $(this).next(".tip-box").stop(false, true).fadeIn("fast")
            }, function () {
                $(this).next(".tip-box").stop(false, true).fadeOut("fast")
            });
            (function () {
                $(".gift-item").off().on("click", giftItemClick);
                $(".gifts-package").off().on("click", ".gift-item", giftItemClick);
                function giftItemClick(event) {
                    event.preventDefault();
                    var $this = $(this);
                    var giveBtn = null, seedType = null, giftId = 1, giftNumInput = null, bagId = 0;
                    var sendGiftPopup = null;
                    var normalGiftPopup = new CenterPopup({
                        content: '<div class="send-gift-popup-wrap"><h3>赠送礼物</h3><i class="gift-icon"></i>&nbsp;&nbsp;<span class="gift-name"><p class="tip-warn"></p></span><div class="radio-box"><span class="tip">优先：</span><span class="choose-seed choose-silver-seed active"><i></i>银瓜子</span><span class="choose-seed choose-golden-seed"><i></i>金瓜子</span></div><ul class="select-box"><li>10</li><li>99</li><li>188</li><li>450</li><li>520</li><li>1314</li></ul><div style="clear: both;"><label>数量</label><input type="text" style="width:90px;" maxlength="5" value="1" class="tip-input"><button class="tip-primary" style="height: 30px;">赠送</button></div></div>',
                        width: 230,
                        closable: true
                    });
                    var subtitleGiftPopup = new CenterPopup({
                        content: '<div class="send-gift-popup-wrap"><h3>赠送礼物</h3><i class="gift-icon"></i>&nbsp;&nbsp;<span class="gift-name"><p class="tip-warn"></p></span><div class="radio-box"><span class="tip">优先：</span><span class="choose-seed choose-golden-seed active"><i></i>金瓜子</span></div><ul class="select-box"><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ul><div style="clear: both;"><label>数量</label><input type="text" style="width:90px;border:1px solid #fff;" maxlength="5" value="1" class="tip-input" disabled="disabled"><button class="tip-primary" style="height: 30px;">赠送</button></div></div>',
                        width: 230,
                        closable: true
                    });
                    var justColdenGiftPopup = new CenterPopup({
                        content: '<div class="send-gift-popup-wrap"><h3>赠送礼物</h3><i class="gift-icon"></i>&nbsp;&nbsp;<span class="gift-name"><p class="tip-warn"></p></span><div class="radio-box"><span class="tip">优先：</span><span class="choose-seed choose-golden-seed active"><i></i>金瓜子</span></div><ul class="select-box"><li>10</li><li>99</li><li>188</li><li>450</li><li>520</li><li>1314</li></ul><div style="clear: both;"><label>数量</label><input type="text" style="width:90px;" maxlength="5" value="1" class="tip-input"><button class="tip-primary" style="height: 30px;">赠送</button></div></div>',
                        width: 230,
                        closable: true
                    });
                    var giftPackage = new CenterPopup({
                        content: '<div class="send-gift-popup-wrap"><h3>赠送礼物</h3><i class="gift-icon"></i>&nbsp;&nbsp;<span class="gift-name"><p class="tip-warn"></p></span><div style="clear: both;"><label>数量</label><input type="text" style="width:90px;" maxlength="5" value="1" class="tip-input"><button class="tip-primary" style="height: 30px;">赠送</button></div></div>',
                        width: 230,
                        closable: true
                    });
                    var fffDanGiftPopup = new CenterPopup({
                        content: '<div class="send-gift-popup-wrap"><h3>赠送礼物</h3><i class="gift-icon"></i>&nbsp;&nbsp;<span class="gift-name"><p class="tip-warn"></p></span><div class="radio-box"><span class="tip">优先：</span><span class="choose-seed choose-golden-seed active"><i></i>金瓜子</span></div><ul class="select-box"><li data-num="1">1</li><li data-num="2">2</li><li data-num="3">3</li><li data-num="4">4</li><li data-num="5">5</li><li data-num="9">大火球</li></ul><div style="clear: both;"><label>数量</label><input type="text" style="width:90px; border: 0; vertical-align: top;" maxlength="1" value="1" disabled="disabled" class="tip-input"><button class="tip-primary" style="height: 30px;">赠送</button></div></div>',
                        width: 230,
                        closable: true
                    });
                    if ($this.attr("data-gifttype").toString() === "1") {
                        if ($this.attr("data-giftid").toString() === "13") {
                            sendGiftPopup = fffDanGiftPopup;
                            seedType = "gold"
                        } else {
                            sendGiftPopup = subtitleGiftPopup;
                            seedType = "gold"
                        }
                    } else if ($this.attr("data-gifttype").toString() === "3") {
                        sendGiftPopup = justColdenGiftPopup;
                        seedType = "gold"
                    } else {
                        sendGiftPopup = normalGiftPopup;
                        seedType = "silver"
                    }
                    if ($this.data("bagid")) {
                        bagId = $this.data("bagid")
                    }
                    if (bagId != 0) {
                        sendGiftPopup = giftPackage
                    }
                    giveBtn = $("button", sendGiftPopup.el);
                    giftNumInput = $("input", sendGiftPopup.el);
                    var giftName = $this.data("giftname");
                    var giftDesc = $this.data("giftdesc");
                    giftId = $this.data("giftid");
                    $(".gift-icon", sendGiftPopup.el).attr("class", "gift-icon gift-icon-" + giftId);
                    $(".gift-name", sendGiftPopup.el).html(giftName + '<p class="tip-warn">' + giftDesc + "</p>");
                    sendGiftPopup.show();
                    $("li", sendGiftPopup.el).on("click", function (e) {
                        var num = $(e.currentTarget).attr("data-num") || $(e.currentTarget).html();
                        giftNumInput.val(num)
                    });
                    var $chooseSeed = $(".choose-seed");
                    $chooseSeed.on("click", function () {
                        $chooseSeed.removeClass("active");
                        $(this).addClass("active");
                        $(this).hasClass("choose-silver-seed") ? seedType = "silver" : 0;
                        $(this).hasClass("choose-golden-seed") ? seedType = "gold" : 0
                    });
                    $("button", sendGiftPopup.el).on("click", function () {
                        global.liveQuickLogin();
                        var num = giftNumInput.val(), timestamp = Date.now();
                        if (/^\d+$/.test(num) == false) {
                            (new MessageBox).show(giveBtn, global.giftEvent.popupMsg.invalidNum);
                            return false
                        }
                        timestamp = timestampShorter(timestamp);
                        global.giftTsHistory.length > 200 && global.giftTsHistory.splice(0, 1);
                        global.giftTsHistory.indexOf(parseInt(timestamp, 10)) < 0 && global.giftTsHistory.push(parseInt(timestamp, 10));
                        var xhrGiftSuccess = function (result) {
                            addGiftHistory(result.data);
                            reloadGoldenData(result.data.gold);
                            reloadUserData(result.data.silver);
                            global.superGift.exec(result.data.data)
                        };
                        var sendGiftUrl = "/gift/send";
                        if (bagId != 0) {
                            sendGiftUrl = "/giftBag/send"
                        }
                        var sendGift = function (options) {
                            options = options || {};
                            $.ajax({
                                url: sendGiftUrl,
                                type: "POST",
                                data: {
                                    giftId: options.giftId,
                                    roomid: options.roomid,
                                    ruid: options.ruid,
                                    num: options.num,
                                    coinType: options.coinType,
                                    Bag_id: bagId,
                                    timestamp: options.timestamp,
                                    rnd: global.DANMU_RND,
                                    token: $.cookie("LIVE_LOGIN_DATA") || ""
                                },
                                dataType: "JSON",
                                success: function (result) {
                                    if (result.code == 0) {
                                        xhrGiftSuccess(result);
                                        timestamp = 0;
                                        if (result.data.data.giftType == 1) {
                                            global.player_object.sendGift(result.data.data.giftId, result.data.data.num)
                                        }
                                        if (result.data.data.newMedal == 1) {
                                            var $newMedalIcon = $(".new-medal-tip-box .medal-icon");
                                            $newMedalIcon.addClass("medal-icon-lv" + result.data.data.medal.level);
                                            $newMedalIcon.text(result.data.data.medal.medalName);
                                            $(".new-medal-tip-box").show();
                                            $(".new-medal-tip-box .close-new-medal-tip-box").on("click", function (event) {
                                                $(".new-medal-tip-box").hide()
                                            });
                                            $(".new-medal-tip-box .wear-now").on("click", function (event) {
                                                fansMedal.wearFansMedal(result.data.data.medal.medalId);
                                                $(".new-medal-tip-box").hide()
                                            })
                                        }
                                        if (result.data.data.christmas) {
                                            RMarryList(result.data.data.christmas)
                                        }
                                        if (typeof result.data.remain == "number") {
                                            $(".tip-warn", sendGiftPopup.el).text("（您的包裹中还剩" + result.data.remain + "个可用）");
                                            if (result.data.remain == 0) {
                                                checkGiftPackage()
                                            }
                                        }
                                    } else if (result.code == -400) {
                                        if (result.msg == "余额不足" && options.coinType == "silver") {
                                            var messagePopupA = new CenterPopup({
                                                content: global.giftEvent.popupMsg.noMoreSeeds.silver,
                                                width: 300,
                                                type: "message",
                                                btnMessage: "(将消耗" + options.num * result.data.price + "金瓜子)",
                                                btnValue: "用金瓜子",
                                                btnId: "lt-use-goldenseed-btn",
                                                closable: true
                                            });
                                            sendGiftPopup.hide();
                                            messagePopupA.show({radius: true});
                                            $("#lt-use-goldenseed-btn", messagePopupA.el).off().on("click", function (event) {
                                                var timestamp = Date.now();
                                                timestamp = timestampShorter(timestamp);
                                                global.giftTsHistory.length > 200 && global.giftTsHistory.splice(0, 1);
                                                global.giftTsHistory.indexOf(parseInt(timestamp, 10)) < 0 && global.giftTsHistory.push(parseInt(timestamp, 10));
                                                sendGift({
                                                    giftId: giftId,
                                                    roomid: global.ROOMID,
                                                    ruid: global.MASTERID,
                                                    num: num,
                                                    coinType: "gold",
                                                    timestamp: timestamp
                                                });
                                                messagePopupA.hide()
                                            })
                                        } else if (result.msg == "余额不足" && options.coinType == "gold") {
                                            var messagePopupB = new CenterPopup({
                                                content: global.giftEvent.popupMsg.noMoreSeeds.both,
                                                width: 300,
                                                type: "message",
                                                btnValue: "购买金瓜子",
                                                btnId: "lt-buy-goldenseed-btn",
                                                closable: true
                                            });
                                            sendGiftPopup.hide();
                                            messagePopupB.show({radius: true});
                                            $("#lt-buy-goldenseed-btn", messagePopupB.el).off().on("click", function (event) {
                                                messagePopupB.hide();
                                                Seed.GoldenSeed.buyPopup.show();
                                                Seed.GoldenSeed.getUser();
                                                Seed.GoldenSeed.getBcoin()
                                            })
                                        } else {
                                            (new MessageBox).show(giveBtn, result.msg)
                                        }
                                    } else {
                                        (new MessageBox).show(giveBtn, result.msg)
                                    }
                                }
                            })
                        };
                        sendGift({
                            giftId: giftId,
                            roomid: global.ROOMID,
                            ruid: global.MASTERID,
                            num: num,
                            coinType: seedType,
                            bagId: bagId,
                            timestamp: timestamp
                        });
                        function RMarryList(data) {
                            var $dataList = $("#marry-rank-list");
                            $dataList.empty();
                            for (var i = 0, length = data.length; i < length; i++) {
                                var li = '<li class="marry-rank-item"><span class="fan-name rank' + (i + 1) + '">' + data[i].uname + '</span><span class="marry-rank-score">' + data[i].score + "</span></span></li>";
                                $dataList.append(li)
                            }
                        }
                    });
                    var selectBoxs = $("li", sendGiftPopup.el);
                    selectBoxs.on("click", function (e) {
                        selectBoxs.removeClass("active");
                        $(e.currentTarget).addClass("active")
                    })
                }
            })()
        }
    }
})(window);
(function (global, undefined) {
    "use strict";
    var giftStatus = 0, $giftPackageBtn = $("#giftsPackage"), $giftPackagePopup = $(".gifts-package-wrap .gifts-package"), $giftPackageContent = $(".gifts-package-wrap .gifts-package-content");
    var getSendGiftPopup = new CenterPopup({
        content: '<div class="get-send-gift-popup-wrap">' + "<h3 style='color: #4fc1e9; font-size: 20px;'>您收到的礼物</h3>" + "<div>" + '<div class="gifts-package-content"></div>' + "</div>" + '<div style="text-align: center"><button class="tip-primary  send-gift-popup-btn-ok" style="padding: 5px 25px; margin: 10px 10px 0;">确认</button></div>' + "</div>",
        width: 200,
        closable: true
    });
    var getGiftPackageStatus = function (callback) {
        $.ajax({
            url: "/giftBag/sendDaily", type: "GET", dataType: "json", success: function (result) {
                callback ? callback(result) : 0
            }
        })
    };
    var getSendGift = function (callback) {
        $.ajax({
            url: "/giftBag/getSendGift", type: "GET", dataType: "json", success: function (result) {
                callback ? callback(result) : 0
            }
        })
    };
    var getGiftPackage = function (callback) {
        $.ajax({
            url: "/gift/playerBag", type: "GET", dataType: "json", success: function (result) {
                callback ? callback(result) : 0
            }
        })
    };
    var openGetSendGift = function (event) {
        getSendGift(function (result) {
            var $getGiftPackage = $('<div class="get-gift-package-wrap"></div>');
            if (result.code == 0) {
                for (var i = 0; i < result.data.length; i++) {
                    var $typeItem = $('<div class="gift-package-type-wrap"></div>');
                    if (result.data[i].type == 1) {
                        $typeItem.append('<div class="gifts-package－type-title"><span class="medal-icon medal-icon-lv' + result.data[i].level + '"><span class="medal-name">' + result.data[i].medal_name + '</span></span><span class="desc">粉丝勋章日常礼包</span></div>');
                        var giftsHtml = renderGifts(result.data[i].gift_list);
                        $typeItem.append($(giftsHtml));
                        $getGiftPackage.append($typeItem)
                    } else if (result.data[i].type == 2) {
                        $typeItem.append('<div class="gifts-package－type-title"><span class="user-level-icon user-level-icon-lv' + result.data[i].level + '"></span><span class="desc">用户等级周常礼包</span></div>');
                        var giftsHtml = renderGifts(result.data[i].gift_list);
                        $typeItem.append($(giftsHtml));
                        $getGiftPackage.append($typeItem)
                    }
                }
                $(".gifts-package-content", getSendGiftPopup.el).empty().append($getGiftPackage);
                $(".send-gift-popup-btn-ok", getSendGiftPopup.el).off().on("click", function () {
                    getSendGiftPopup.hide();
                    openGiftsPackage(event)
                });
                $(".tip-close", getSendGiftPopup.el).off().on("click", function () {
                    getSendGiftPopup.hide();
                    openGiftsPackage(event)
                });
                getSendGiftPopup.show({radius: true})
            }
        })
    };
    var renderGifts = function (data) {
        var giftsData = data;
        var giftItems = "";
        for (var i = 0; i < giftsData.length; i++) {
            (function (index) {
                var giftData = giftsData[index];
                var $giftItem = $('<li class="gift-item"></li>');
                if (giftData.expireat != "0") {
                    var $expires = $('<span class="expires">' + giftData.expireat + "</span>");
                    $giftItem.append($expires)
                }
                $giftItem.append('<div class="gift-icon gift-icon-' + giftData.gift_id + '"></div><div class="gift-count">x' + giftData.gift_num + "</div>");
                giftItems += $giftItem.prop("outerHTML")
            })(i)
        }
        return giftItems
    };
    var openGiftsPackage = function (event) {
        event.stopPropagation();
        getGiftPackage(function (result) {
            $giftPackageContent.empty();
            if (result.code == 0) {
                if (result.data.length) {
                    for (var i = 0; i < result.data.length; i++) {
                        (function (index) {
                            var data = result.data[index];
                            var $giftItem = $('<li class="gift-item"></li>');
                            $giftItem.attr("data-giftid", data.gift_id);
                            $giftItem.attr("data-gifttype", data.gift_type);
                            $giftItem.attr("data-bagid", data.id);
                            $giftItem.attr("data-giftname", data.gift_name);
                            $giftItem.attr("data-giftdesc", "（您的包裹中还剩" + data.gift_num + "个可用）");
                            if (data.expireat != "0") {
                                var $expires = $('<span class="expires">' + data.expireat + "</span>");
                                $giftItem.append($expires)
                            }
                            $giftItem.append('<div class="gift-icon gift-icon-' + data.gift_id + '"></div><div class="gift-count">x' + data.gift_num + "</div>");
                            $giftPackageContent.append($giftItem)
                        })(i)
                    }
                } else {
                    $giftPackageContent.append('<li class="no-gifts"><p>当前包裹里还没有道具哦</p><p>(๑¯ิε ¯ิ๑)</p></li>')
                }
                $giftPackagePopup.show()
            } else if (result.code == -101) {
                global.liveQuickLogin()
            }
        })
    };
    $(function () {
        $giftPackageBtn.on("click", function (event) {
            if (giftStatus == 1) {
                giftStatus = 0;
                openGetSendGift(event)
            } else {
                openGiftsPackage(event)
            }
        });
        $(document).on("click", function () {
            $giftPackagePopup.hide()
        });
        window["checkGiftPackage"] = function () {
            getGiftPackageStatus(function (result) {
                if (result.data.result == 1) {
                    giftStatus = 1;
                    $(".gifts-package-wrap").addClass("has-new")
                }
                if (result.data.result == 2) {
                    giftStatus = 2;
                    $(".gifts-package-wrap").addClass("has-new")
                }
                if (result.data.result == 0) {
                    giftStatus = 0;
                    $(".gifts-package-wrap").removeClass("has-new")
                }
            })
        };
        checkGiftPackage()
    })
})(window);
(function (global, undefined) {
    var tagInput = $(".tag-input");

    function Hinter(content) {
        var hinterDom = '<div class="tag-input-hinter" style="right: 23px; top: -20px;">' + content + "</div>";
        this.create = $(hinterDom)
    }

    var newHinter = new Hinter("请按回车键提交标签~ (●'◡'●)ﾉ♥").create;
    tagInput.parent().before(newHinter);
    var eventHandler = {
        focusEvent: function () {
            newHinter.addClass("active")
        }, blurEvent: function () {
            newHinter.removeClass("active")
        }
    };
    tagInput.on("focus", eventHandler.focusEvent);
    tagInput.on("blur", eventHandler.blurEvent)
})(window);
(function (global, undefined) {
    var videoBlock = {};
    videoBlock.settings = {
        createNumber: 6,
        $appendTarget: $(".recommend-videos-area .content-container"),
        spaceURL: "http://space.bilibili.com",
        reqURL: "http://live.bilibili.com/live/getVideoList/"
    };
    videoBlock.friendlyNumber = function (num, unit) {
        if (num === undefined || typeof num == "string" && ($.trim(num) === "" || $.trim(num) === "--"))return "--";
        var unitMap = {"万": 1e4}, defaultUnit = "万";
        unit = typeof unit == "string" ? unit : defaultUnit;
        var factor = unitMap[unit] || unitMap[defaultUnit];
        if (typeof num == "string" && num.indexOf(unit) >= 0)return;
        if (typeof num == "string" && num.indexOf(",") >= 0) {
            var nums = num.split(",");
            var total = "";
            for (var i = 0; i < nums.length; i++) {
                total += nums[i]
            }
            num = total
        }
        num = parseInt(num);
        if (num >= factor) {
            num = (num / factor).toFixed(1) + unit
        }
        return num
    };
    videoBlock.dataConverter = function (xhrResult) {
        return {
            link: xhrResult.url,
            title: xhrResult.title,
            coverAddress: xhrResult.pic,
            playbackCount: videoBlock.friendlyNumber(xhrResult.play.toString()),
            subtitleCount: videoBlock.friendlyNumber(xhrResult.comment.toString())
        }
    };
    videoBlock.constructors = function (param) {
        var videoBlockDom = document.createElement("a");
        var $videoBlockDom = $(videoBlockDom);
        $videoBlockDom.addClass("video-block").attr("href", param.data.link).attr("target", "_blank").attr("title", param.data.title);
        if (param.last) {
            $videoBlockDom.addClass("last")
        }
        var videoMerge = document.createElement("div");
        var $videoMerge = $(videoMerge);
        $videoMerge.addClass("video-merge");
        var videoPreview = document.createElement("div");
        var $videoPreview = $(videoPreview);
        $videoPreview.addClass("video-preview").css({"background-image": "url('" + param.data.coverAddress + "')"}).append($videoMerge).hover(function () {
            $videoMerge.addClass("hover")
        }, function () {
            $videoMerge.removeClass("hover")
        }).append($videoMerge);
        var videoInfo = document.createElement("div");
        var $videoInfo = $(videoInfo);
        $videoInfo.addClass("video-info");
        var videoTitle = document.createElement("h3");
        var $videoTitle = $(videoTitle);
        $videoTitle.addClass("video-title").text(param.data.title).appendTo($videoInfo);
        var videoProps = document.createElement("div");
        var $videoProps = $(videoProps);
        var videoPropsInner = '<span class="icon-span video-playback" title="播放数">' + param.data.playbackCount + "</span>" + '<span title="弹幕" class="icon-span video-subtitles">' + param.data.subtitleCount + "</span>";
        $videoProps.addClass("video-props").append(videoPropsInner).appendTo($videoInfo);
        $videoBlockDom.append($videoPreview).append($videoInfo).hover(function () {
            $videoProps.addClass("hover")
        }, function () {
            $videoProps.removeClass("hover")
        });
        videoBlock.settings.$appendTarget.append($videoBlockDom);
        this.$create = $videoBlockDom
    };
    videoBlock.init = function () {
        if (global.NEED_VIDEO == 0) {
            $(".recommend-videos-area").remove();
            return false
        }
        $.ajax({
            type: "GET",
            url: videoBlock.settings.reqURL + global.ROOMID,
            dataType: "JSON",
            success: function (result) {
                $("#recommend-video-external-link").attr("href", videoBlock.settings.spaceURL + "/" + global.MASTERID);
                $(".recommend-videos-area .content-title .title").text(global.ANCHOR_NICK_NAME + "的视频");
                if (!result.data || result.data.length === 0) {
                    $(".recommend-videos-area .content-container").text("喵 ~~ 这个播主还没有上传过视频哦 ~~ (=・ω・=)");
                    return false
                }
                var resultData = result.data;
                (function () {
                    for (var i = 0, length = resultData.length; i < length; i++) {
                        var constructorParam = {};
                        constructorParam.last = i === length - 1;
                        constructorParam.data = videoBlock.dataConverter(resultData[i]);
                        var newVideoBlock = new videoBlock.constructors(constructorParam).$create
                    }
                })();
                $(".recommend-videos-area").addClass("show")
            },
            error: function (result) {
            }
        })
    };
    videoBlock.init()
})(window);
(function (global, undefined) {
    global.fansMedal = {
        isWear: 0,
        errorMsgPopup: new CenterPopup({
            content: "",
            width: 350,
            type: "message",
            btnValue: "我知道了",
            btnId: "popup-close-btn",
            closable: true
        }),
        getInfo: function (callback) {
            $.get("/live/getInfo?roomid=" + global.ROOMID, function (data) {
                for (var i in data.data) {
                    global[i] = data.data[i]
                }
                callback ? callback() : 0
            }, "JSON")
        },
        loadFansRanking: function (roomid) {
            var roomid = roomid || ROOMID;
            $.ajax({
                url: "/liveact/ajaxGetMedalRankList",
                type: "post",
                data: {roomid: roomid},
                dataType: "json",
                success: function (result) {
                    if (result.code == 0) {
                        var $fansRankingContainer = $("#fans-ranking");
                        $fansRankingContainer.empty();
                        if (result.msg == 0) {
                            $fansRankingContainer.html('<li class="no-data"><p>主播还未开通粉丝勋章，请继续投喂帮他加油。</p></li>')
                        } else if (result.msg == 1) {
                            $fansRankingContainer.html('<li class="no-data"><p>主播已开通粉丝勋章，投喂1个B坷垃可获得。</p></li>')
                        } else if (result.msg == 2) {
                            $("#fans-ranking").empty();
                            for (var i = 0; i < result.data.length; i++) {
                                $("#fans-ranking").append('<li><span class="fan-name rank' + (i + 1) + '"><span class="medal-icon medal-icon-lv' + result.data[i].level + '"><span class="medal-name">' + result.data[i].medalName + '</span></span></span><span class="uname">' + result.data[i].uname + "</span></li>")
                            }
                        }
                    }
                }
            })
        },
        wearFansMedal: function (medalId, callback) {
            $.ajax({
                url: "/i/ajaxWearFansMedal",
                type: "post",
                data: {medal_id: medalId},
                dataType: "json",
                success: function (result) {
                    if (result.code == 0) {
                        MEDAL.level = result.data.level;
                        MEDAL.medal_name = result.data.medal_name;
                        MEDAL.anchorName = result.data.anchorName;
                        MEDAL.roomid = result.data.roomid;
                        fansMedal.loadFansRanking()
                    } else {
                        $("p", fansMedal.errorMsgPopup.el).text(result.msg);
                        fansMedal.errorMsgPopup.show({radius: true});
                        $("#popup-close-btn", fansMedal.errorMsgPopup.el).on("click", function (e) {
                            fansMedal.errorMsgPopup.hide()
                        })
                    }
                    callback ? callback() : 0
                }
            })
        },
        getMyWearMedal: function () {
            $.ajax({
                url: "/i/ajaxGetMyWearMedal", type: "get", dataType: "json", success: function (result) {
                    if (result.code == 0) {
                        var $medalDescHtml = "";
                        fansMedal.isWear = result.data.isWear;
                        if (result.data.hasMedalList == 1 && result.data.isWear == 0) {
                            $medalDescHtml = $('<div class="cur-medal has-medal"><span style="color: #999999">没有佩戴勋章</span></div>' + '<p class="no-medal-icon"><i></i></p>' + '<p class="view-my-medal"><a href="/i/medal" target="_blank">查看我的勋章</a></p>')
                        } else if (result.data.hasMedalList == 0) {
                            $medalDescHtml = $('<div class="cur-medal has-no-medal"><span style="color: #999999">还未获得勋章</span></div>' + '<p class="no-medal-icon"><i></i></p>' + '<p style="color: #999999">给已开通粉丝勋章的主播投喂1个B坷垃即可获得该主播的勋章</p>' + '<p class="view-my-medal"><a href="/i/medal" target="_blank">查看我的勋章</a></p>')
                        } else if (result.data.hasMedalList == 1 && result.data.isWear == 1) {
                            $medalDescHtml = $('<div class="cur-medal has-medal"><span class="medal-icon medal-icon-lv' + result.data.level + '">' + result.data.medalInfo.medal_name + '</span><span class="anchor-name">' + result.data.anchorName + "</span></div>" + "<p>亲密值：" + result.data.intimacy + "/" + result.data.next_intimacy + "</p>" + "<p>排名：" + result.data.rank + "</p>" + '<p class="view-my-medal"><a href="/i/medal" target="_blank">查看我的勋章</a></p>')
                        }
                        $(".medal-desc").empty();
                        $(".medal-desc").append($medalDescHtml);
                        $(".cur-medal.has-medal", $medalDescHtml.el).on("click", function (event) {
                            var currentMedalTipHeight = $(".current-medal-tip-box").outerHeight();
                            $(".medal-btn .choose-medal").css("min-height", currentMedalTipHeight - 22);
                            $(".medal-btn .choose-medal").show();
                            fansMedal.getMyMedalList()
                        })
                    }
                }
            })
        },
        getMyMedalList: function () {
            $.ajax({
                url: "/i/ajaxGetMyMedalList", type: "get", dataType: "json", success: function (result) {
                    if (result.code == 0) {
                        $(".current-medal-tip-box .choose-medal ul").empty();
                        $.each(result.data, function (index, element) {
                            var $listItem = $('<li data-medalid="' + element.medalId + '"><span class="medal-icon medal-icon-lv' + element.level + '">' + element.medalName + "</span>" + element.anchorName + "</li>");
                            if (element.status == 1) {
                                $listItem.addClass("active")
                            }
                            $(".current-medal-tip-box .choose-medal ul").append($listItem);
                            $(".choose-medal ul").off().on("click", "li", function (event) {
                                var currentTargetClassName = event.currentTarget.className;
                                if (currentTargetClassName == "active") {
                                    return
                                } else if (currentTargetClassName == "cancel-wear") {
                                    fansMedal.cancelFansMedal();
                                    return
                                } else {
                                    var medalId = $(this).data("medalid");
                                    fansMedal.wearFansMedal(medalId, function () {
                                        fansMedal.isWear = 1;
                                        fansMedal.getMyWearMedal();
                                        fansMedal.getMyMedalList()
                                    })
                                }
                                event.stopPropagation()
                            })
                        });
                        if (result.data.length > 10) {
                            var $medallist = $(".choose-medal ul");
                            $medallist.css({position: "relative", height: "300px"});
                            $medallist.perfectScrollbar()
                        }
                        if (fansMedal.isWear) {
                            var $cancelWear = $('<li class="cancel-wear"><span class="medal-icon medal-icon-no"></span>不佩戴任何勋章</li>');
                            $(".current-medal-tip-box .choose-medal ul").append($cancelWear)
                        }
                    }
                }
            })
        },
        cancelFansMedal: function () {
            $.ajax({
                url: "/i/ajaxCancelWear", type: "get", dataType: "json", success: function (result) {
                    if (result.code == 0) {
                        fansMedal.isWear = result.data.isWear;
                        MEDAL = {};
                        fansMedal.getMyWearMedal();
                        fansMedal.getMyMedalList()
                    }
                }
            })
        }
    }
})(window);
function openShareWindow(base, param) {
    var temp = [];
    for (var p in param) {
        temp.push(p + "=" + encodeURIComponent(param[p] || ""))
    }
    var _u = base + temp.join("&");
    window.open(_u, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
    return false
}
function liveStatusControl(status) {
    var _this = this;
    _this._setStatus = function (status) {
        if (status == "on") {
            liveStatusController.removeClass("off").addClass("on");
            text.html("直播中");
            _status = "on"
        } else {
            liveStatusController.removeClass("on").addClass("off");
            text.html("准备中");
            _status = "off"
        }
    };
    _this._changeStatus = function (ctrl) {
        if (_this.liveStatusController.hasClass(ctrl))return;
        if (ctrl == "on") {
            _setStatus("on")
        } else {
            _setStatus("off")
        }
    };
    _this.liveStatusController = $("#live_status_control");
    _this.text = _this.liveStatusController.find(".text");
    _this._status = status;
    _this._setStatus(status)
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
            if (status) {
                pObj.style.position = "fixed";
                pObj.style.padding = "0 0";
                pObj.style.margin = "0 0";
                msgPool.css("padding", 0);
                var $wid = ($bodyWidth - 300) / $bodyWidth * 100 + "%";
                var $chatRoomHeight = ($bodyHeight - 126) / $bodyHeight * 100 + "%";
                var $mesHeight = ($bodyHeight - 256) / ($bodyHeight - 126) * 100 + "%";
                $("#live_player").css({width: $wid, height: "100%", top: "0px"});
                $(".chat-room").css({position: "fixed", top: "126px", left: $wid, height: $chatRoomHeight});
                msgPool.css("height", $mesHeight);
                $(".color-msg-popup").css("top", "-33px");
                $(".message-sender").css({position: "fixed", bottom: 0, left: $wid});
                $(".room-rank-lists-container").css({position: "fixed", top: 0, left: $wid, "z-index": "999"})
            } else {
                pObj.style.cssText = ff_embed_stack_style[i].style
            }
        }
    })();
    if (!status)ff_embed_stack = null
}
var ff_status = {};
var ff_status_id = 0;
var ff_embed_stack = null;
var ff_embed_stack_style = null;
var blockTimer;
var aid = 0;
function uploadSuccess(msg) {
    if (msg.split("|").length > 1) {
        $("#img_src").val(msg.split("|")[1]);
        $("#uploadLog").html("");
        $("#fileName").html(getFileName($(".report_input").val()));
        (new MessageBox).show($(".confirm"), "上传成功")
    } else {
        $("#uploadLog").html(msg);
        (new MessageBox).show($(".confirm"), msg)
    }
}
function getFileName(path) {
    var pos1 = path.lastIndexOf("/");
    var pos2 = path.lastIndexOf("\\");
    var pos = Math.max(pos1, pos2);
    return path.substring(pos + 1)
}
function bindShare(params, target) {
    target = target || "#share_list .share-btn";
    var btnOption = {quality: "high", allowscriptaccess: "always", wmode: "transparent"};
    var copyRoomCallback = "copyRoomCallback";
    window[copyRoomCallback] = function () {
        (new MessageBox).show($("#copy-room"), "复制成功", 400, "ok")
    };
    var copyPlayerCallback = "copyPlayerCallback";
    window[copyPlayerCallback] = function () {
        (new MessageBox).show($("#copy-player"), "复制成功", 400, "ok")
    };
    swfobject.embedSWF("http://static.hdslb.com/live-static/swf/copy_btn.swf", "copy-room", "70px", "24px", "0", "", {
        text: encodeURIComponent($("#copy-room").prev().val()),
        callback: copyRoomCallback
    }, btnOption);
    swfobject.embedSWF("http://static.hdslb.com/live-static/swf/copy_btn.swf", "copy-player", "70px", "24px", "0", "", {
        text: encodeURIComponent($("#copy-player").prev().val()),
        callback: copyPlayerCallback
    }, btnOption);
    $(target).click(function (e) {
        var btn = $(this);
        var id = btn.attr("id") || btn.attr("data-id");
        switch (id) {
            case"btn_weibo":
                openShareWindow("http://service.weibo.com/share/share.php?", {
                    url: params.url || "",
                    type: "3",
                    count: "1",
                    appkey: params.appkey && params.appkey.weibo ? params.appkey.weibo : "2841902482",
                    title: "#哔哩哔哩生放送#　" + (params.weiboTag || "") + (params.title || "") + "　播主：" + (params.nickname || "") + "，正在哔哩哔哩进行直播，还不快来一起嗨！！",
                    pic: params.pic || "",
                    searchPic: params.searchPic === false ? false : true,
                    ralateUid: "",
                    language: "zh_cn",
                    rnd: (new Date).valueOf()
                });
                break;
            case"btn_qqweibo":
                openShareWindow("http://v.t.qq.com/share/share.php?", {
                    title: "#哔哩哔哩生放送#　" + (params.weiboTag || "") + (params.title || "") + "　播主：" + (params.nickname || "") + "，正在哔哩哔哩进行直播，还不快来一起嗨！！",
                    url: params.url || "",
                    appkey: params.appkey && params.appkey.qqweibo ? params.appkey.qqweibo : "84435a83a11c484881aba8548c6e7340",
                    site: "http://www.bilibili.com/",
                    assname: "bilibiliweb",
                    pic: params.pic || ""
                });
                break;
            case"btn_weixin":
                e.stopPropagation();
                var qrCodeBox = $(".share").find(".share-weixin");
                if (!qrCodeBox.length) {
                    qrCodeBox = $('<div class="share-weixin"><div class="qr-code"></div><p>用微信扫一扫</p></div>').appendTo(".share").hide();
                    var codeData = {
                        width: 100,
                        height: 100,
                        typeNumber: -1,
                        correctLevel: 0,
                        background: "#fff",
                        foreground: "#000",
                        text: location.href
                    };
                    if (typeof document.createElement("canvas").getContext != "undefined") {
                        codeData.render = "canvas"
                    } else {
                        codeData.render = "table"
                    }
                    qrCodeBox.find(".qr-code").qrcode(codeData)
                }
                if (!qrCodeBox.is(":visible")) {
                    qrCodeBox.stop(false, true).slideDown(200)
                } else {
                    qrCodeBox.stop(false, true).slideUp(200)
                }
                $("body").off("click.v-weixin-share");
                $("body").on("click.v-weixin-share", function () {
                    qrCodeBox.stop(false, true).slideUp(200);
                    $("body").off("click.v-weixin-share")
                });
                break;
            case"btn_qqzone":
                openShareWindow("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?", {
                    url: params.url || "",
                    showcount: 1,
                    desc: params.desc || "",
                    summary: params.summary || "",
                    title: "#哔哩哔哩生放送#　" + (params.weiboTag || "") + (params.title || "") + "　播主：" + (params.nickname || "") + "，正在哔哩哔哩进行直播，还不快来一起嗨！！",
                    site: "哔哩哔哩",
                    pics: params.pic || "",
                    style: "203",
                    width: 98,
                    height: 22
                });
                break;
            default:
        }
    })
}
function openShareWindow(base, param) {
    var temp = [];
    for (var p in param) {
        temp.push(p + "=" + encodeURIComponent(param[p] || ""))
    }
    var _u = base + temp.join("&");
    window.open(_u, "", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no");
    return false
}
function showWarnBox(msg) {
    showFloatBox({title: "警告", content: msg, sure: "返回"})
}
(function () {
    window.msgArr = {now: [], temp: [], aveSpeed: 80};
    function showMsg() {
        var msgData = msgArr.now.shift(), func;
        if (msgData) {
            func = protocol[msgData.cmd] || function () {
                };
            func(msgData)
        }
        setTimeout(function () {
            showMsg()
        }, msgArr.aveSpeed)
    }

    setInterval(function () {
        var msgLen = 0;
        msgArr.now = msgArr.now.concat(msgArr.temp.splice(0));
        msgLen = msgArr.now.length;
        msgArr.aveSpeed = Math.ceil(1e3 / msgLen)
    }, 1e3);
    showMsg()
})();
function server_callback(data) {
    try {
        var dataJSON = $.parseJSON(data);
        msgArr.temp.push(dataJSON)
    } catch (e) {
        console.log(e)
    }
}
function PlayerSetOnline(data) {
    if (parseInt(data, 10) < 0) {
        data = 1
    }
    setNum(data, $(".onlinenum"))
}
var protocol = {
    ROOM_ADMINS: function (json) {
    }, ROOM_SHIELD: function (json) {
    }, ROOM_KICKOUT: function (json) {
        addMessage(json)
    }, ROOM_BLOCK_INTO: function (json) {
        addMessage(json);
        if (json.uid == UID) {
            location.reload()
        }
    }, ROOM_BLOCK_MSG: function (json) {
        addMessage(json)
    }, DANMU_MSG: function (json) {
        if (json.info[2][0] == UID && json.info[0][5] == DANMU_RND) {
            return false
        } else {
            addMessage(json)
        }
    }, SEND_GIFT: function (json) {
        var numb = json.data.rcost;
        $(".giftsnum").text(window.oneHundredThousandFormat(numb));
        loadTop10(json);
        if (json.data.starRank) {
            $(".live-controls .star-rank .data-count").text(window.oneHundredThousandFormat(json.data.starRank))
        }
        if (window.giftTsHistory.indexOf(parseInt(json.data.timestamp, 10)) > -1 && json.data.uid == window.UID) {
            return
        }
        if (json.data["super"] > 0) {
            window.superGift.exec(json.data)
        }
        addGiftHistory(json)
    }, SEND_TOP: function (json) {
        loadTop10(json)
    }, CHANGE_ROOM_INFO: function (json) {
        if (UID != MASTERID) {
            background(json.background)
        }
    }, LIVE: function (json) {
        liveStatusControl("on")
    }, PREPARING: function (json) {
        liveStatusControl("off")
    }, END: function (json) {
    }, CLOSE: function (json) {
    }, BLOCK: function (json) {
    }, ROOM_SILENT_ON: function (json) {
        var msg = json.is_newbie == 1 ? "播主对注册用户开启了全局禁言" : "播主对全房间用户开启了全局禁言";
        addMessage(msg);
        if (ISADMIN != 1 && (json.is_newbie != 1 || json.is_newbie == 1 && IS_NEWBIE == 1 && VIP != 1)) {
            var endTime = new Date;
            endTime.setSeconds(endTime.getSeconds() + json.countdown);
            showBlock(msg, endTime)
        }
    }, ROOM_SILENT_OFF: function (json) {
        addMessage("播主取消了房间的全局禁言");
        if (UID != MASTERID) {
            blockTimer.clear();
            $(".message-mask").hide()
        }
    }, ROOM_LOCK: function (json) {
        if (UID == MASTERID) {
            showFloatBox({
                content: '你的房间已被<em style="color: #FF0000">锁定</em>。<br>如有疑问请通过客服邮箱或客服QQ进行反馈',
                callback: function () {
                    window.location.reload()
                }
            })
        } else {
            showFloatBox({
                content: "当前直播间被管理员关闭", callback: function () {
                    window.location.reload()
                }
            })
        }
    }, ROOM_AUDIT: function (json) {
        if (UID == MASTERID) {
            loadAudit()
        }
    }, CUT_OFF: function (json) {
        liveStatusControl("off");
        if (UID == MASTERID) {
            loadCutOffMsg()
        } else {
            showFloatBox({content: "当前直播间被管理员关闭"})
        }
    }, WELCOME: function (json) {
        if (json.data.uid == UID) {
            return
        }
        var html = '<div class="system">';
        html += '<a href="/i#to-vip" target="_blank"><span class="vip-icon">老爷</span></a>';
        if (json.data.isadmin == 1) {
            if (json.data.uid == MASTERID) {
                html += '<span class="master-icon">播主</span>'
            } else {
                html += '<span class="admin-icon">房管</span>'
            }
        }
        html += '<span class="welcome">' + json.data.uname + " 老爷</span>进入直播间</div>";
        $(".message-history").append(html)
    }, WIN_ACTIVITY: function (json) {
        activityDraw.win(json)
    }, SYS_MSG: function (json) {
        addMessage(json)
    }
};
function getFlashMovieObject(movieName) {
    if (window.document[movieName]) {
        return window.document[movieName]
    }
    if (navigator.appName.indexOf("Microsoft Internet") != -1) {
        if (document.embeds && document.embeds[movieName])return document.embeds[movieName]
    } else {
        return document.getElementById(movieName)
    }
}
var colorfulDanMu = {
    currentColor: 16777215, changeColor: function () {
        if (isNaN(parseInt(window.VIP, 10))) {
            console.log('Bilibili Live Error: Type of global variable "VIP" should be Number but now it is NaN.');
            console.log("Default danmu color will set to white.")
        }
        if (parseInt(window.VIP, 10) === 1) {
            colorfulDanMu.currentColor = 16738408;
            setTimeout(function () {
                $(".color-group .color-item[data-default]").click()
            }, 1)
        }
        $(".color-group .color-item").on("click", function (event) {
            event.preventDefault();
            $(this).addClass("active").siblings(".color-item").removeClass("active");
            if ($(this).attr("data-vip").toString() == "true" && parseInt(window.VIP, 10) != 1) {
                $(this).removeClass("active");
                (new MessageBox).show($(".color-group"), "仅限老爷使用");
                return
            }
            colorfulDanMu.currentColor = $(this).attr("data-color")
        })
    }
};
function createReceiveBox() {
    var silverseedWrap = $(".receive");
    var silverseedTip = new Popup({
        content: '<i class="guazi-x"></i><p style="display: inline-block;width: 200px;padding-left: 10px;">&nbsp;&nbsp;&nbsp;&nbsp;“你掉的是我左手这个金瓜子，还是右手这个银瓜子？”&nbsp;&nbsp;“还是银瓜子比较好！”&nbsp;&nbsp;&nbsp;&nbsp;<em class="tip-warn">※可以用银瓜子购买礼物</em></p>',
        width: 260,
        arrow: true
    });
    var silverseedBox = new Popup({
        content: '<i class="guazi-l"></i><div style="display: inline-block;width: 140px;padding-left: 10px;"><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是祖上留下的<em class="tip-warn">1000</em>银瓜子，去送给心仪的主（dui）播（xiang）吧！</p><div><button class="tip-primary">领取</button><button class="tip-secondary">取消</button></div></div>',
        width: 230,
        height: 105,
        arrow: false
    });
    silverseedWrap.hover(function (e) {
        silverseedTip.show($(e.currentTarget))
    }, function () {
        silverseedTip.hide()
    });
    $("#getFree").on("click", function (e) {
        window.liveQuickLogin();
        silverseedBox.show(silverseedWrap)
    });
    $("button", silverseedBox.el).on("click", function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass("tip-primary")) {
            $.ajax({
                url: "/FreeSilver/getRegSilver?r=" + Math.random(),
                type: "get",
                dataType: "json",
                success: function (result) {
                    if (result.code == 0) {
                        (new MessageBox).show(silverseedWrap, "成功领取1000银瓜子！");
                        var silverNumb = result.data.silver;
                        reloadUserData(silverNumb);
                        $("#getFree").remove()
                    } else {
                        (new MessageBox).show(silverseedWrap, result.msg)
                    }
                },
                error: function () {
                    (new MessageBox).show(silverseedWrap, "系统错误，请稍后再试")
                }
            })
        }
        silverseedBox.hide()
    })
}
function createReportBox() {
    var reportBtn = $(".report");
    var reportBox = new Popup({
        content: '<div>举报理由<div><input type="text" class="tip-input" style="width: 240px;margin-top:10px" maxlength="25"><div style="margin-top: 20px;margin-bottom: 10px;">上传截图</div><form id="formFile" name="formFile" method="post" action="/pic/upload" target="frameFile" enctype="multipart/form-data"><button class="tip-primary file" style="width: 76px;height: 25px;padding: 4px 10px;border-bottom: 1px;">选择文件</button><input class="input report_input" type="file" id="report_image" name="fileUp"><span id="fileName">请选择文件</span><div id="uploadLog" style="margin-top: 10px;height:16px;color: #999">文件大小不能超过1M</div><input id="img_src" type="hidden"></form><iframe id="frameFile" name="frameFile" style="display: none;"></iframe><div style="margin-top: 40px; text-align: center;"><button class="tip-primary confirm">确定</button><button class="tip-secondary">取消</button></div></div>',
        width: 270,
        height: 240,
        closable: true,
        arrow: false,
        direction: "down"
    });
    reportBtn.on("click", function (e) {
        window.liveQuickLogin();
        reportBox.show($(e.currentTarget))
    });
    var reportImage = $("#report_image");
    reportImage.change(function () {
        if (reportImage[0].files[0].size > 1048576) {
            (new MessageBox).show(reportBtn, "文件大小不能超过1M");
            return
        }
        $("#uploadLog").html("开始上传中 进度80%");
        $("#formFile").submit()
    });
    $("button", reportBox.el).on("click", function (e) {
        var target = $(e.currentTarget);
        if (target.hasClass("file")) {
            e.stopPropagation();
            e.preventDefault();
            target.next("input").click();
            return false
        } else if (target.hasClass("confirm")) {
            var reason = $("input", reportBox.el).val();
            var picsrc = $("#img_src").val();
            if (!reason) {
                (new MessageBox).show(reportBtn, "请填写理由！！！");
                return
            }
            if (!$("#img_src").val()) {
                (new MessageBox).show(reportBtn, "请上传截图！！！");
                return
            }
            $.ajax({
                url: "/liveact/report_room",
                type: "POST",
                data: {room_id: ROOMID, picUrl: picsrc, reason: reason},
                dataType: "json",
                success: function (result) {
                    if (result.code == 0) {
                        (new MessageBox).show(reportBtn, "提交成功");
                        $("input", reportBox.el).val("");
                        $("#fileName").html("请选择文件")
                    } else if (result.code == -1) {
                        window.liveQuickLogin()
                    } else {
                        (new MessageBox).show(reportBtn, "出错了," + result.msg)
                    }
                },
                error: function () {
                    (new MessageBox).show($("#cancel"), "出错了，请稍后再尝试")
                }
            })
        }
        reportBox.hide()
    })
}
var coutdownBox;
function createTreasure() {
    var treasure = $(".treasure");
    var closeTreasure = $(".close-treasure-box");
    var treasureBox = $(".treasure-box").removeClass("animate7").addClass("animate1");
    var treasureCountdown = $(".treasure-count-down");
    var getCookie = __GetCookie("F_S_T_" + UID);
    if (getCookie == 0) {
        treasure.hover(function () {
            closeTreasure.show()
        }, function () {
            closeTreasure.hide()
        });
        closeTreasure.off("click").click(function () {
            treasureBox.hide();
            treasureBox.prev().hide();
            closeTreasure.hide();
            treasure.off("mouseenter").off("mouseleave");
            treasureCountdown.css({cursor: "pointer", left: 0}).click(function () {
                treasureBox.show();
                treasureBox.prev().show();
                closeTreasure.show();
                treasure.hover(function () {
                    closeTreasure.show()
                }, function () {
                    closeTreasure.hide()
                });
                treasureCountdown.css({cursor: "default", left: ""}).off("click")
            })
        });
        if (!coutdownBox) {
            coutdownBox = new Popup({
                content: '<i class="treasure-close-l"></i><div style="display: inline-block;width: 190px;padding-left: 10px;"><h3>宝箱倒计时</h3><p>距离本次领取剩余<span id="pop-count-down"></span>本次宝箱收益<em id="gz-num"></em>银瓜子</p><button class="tip-primary" style="width: 190px;height: 30px;">我知道了</div>',
                width: 280,
                height: 135,
                closable: true,
                arrow: false
            })
        }
        treasureBox.off("click").click(function () {
            if (LOGINED) {
                coutdownBox.show(treasureBox)
            } else {
                window.liveQuickLogin()
            }
        });
        $("button", coutdownBox.el).off("click").off("click").on("click", function () {
            coutdownBox.hide()
        })
    } else {
        treasure.hide()
    }
}
(function (global, undefined) {
    if (global.IS_STAR) {
        $.getScript("http://static.hdslb.com/live-static/js/shining-star.js");
        if (parseInt(global.FREE_SILVER_TIMES, 10) <= 3) {
            replaceFunc()
        }
    }
    var weAreGoingtoGet = {vote: null, seed: null};

    function replaceFunc() {
        global.createTreasure = function () {
            var $treasureContainer = $(".treasure").addClass("shining-star-treasure"), $treasureCloseBtn = $(".close-treasure-box"), $treasureBox = $(".treasure-box").removeClass("animate7").addClass("animate1"), $treasureBoxFooter = $(".treasure-box-footer"), $treasureCountdown = $(".treasure-count-down"), cookieFST = global.__GetCookie("F_S_T_" + global.UID);
            cookieFST ? treasureExit() : mainLogic();
            function treasureExit() {
                $treasureContainer.fadeOut()
            }

            function mainLogic() {
                var $treasureHover = {
                    on: function () {
                        $treasureContainer.hover(function () {
                            $treasureCloseBtn.show()
                        }, function () {
                            $treasureCloseBtn.hide()
                        })
                    }, off: function () {
                        $treasureContainer.off("mouseenter").off("mouseleave")
                    }
                };
                var $countdownStyle = {
                    toClickable: function () {
                        $treasureCountdown.css({cursor: "pointer", left: "0"})
                    }, toUnclickable: function () {
                        $treasureCountdown.css({cursor: "default", left: ""})
                    }
                };
                var $countdownOnClick = {
                    on: function () {
                        $treasureCountdown.on("click", $treasureBoxCtrl.maximize)
                    }, off: function () {
                        $treasureCountdown.off("click")
                    }
                };
                var $treasureBoxCtrl = {
                    minimize: function minimize() {
                        $treasureBox.hide();
                        $treasureBoxFooter.hide();
                        $treasureCloseBtn.hide();
                        $treasureHover.off();
                        $countdownStyle.toClickable();
                        $countdownOnClick.on()
                    }, maximize: function maximize() {
                        $treasureBox.show();
                        $treasureBoxFooter.show();
                        $treasureCloseBtn.show();
                        $treasureHover.on();
                        $countdownStyle.toUnclickable();
                        $countdownOnClick.off()
                    }
                };
                $treasureHover.on();
                $treasureCloseBtn.off("click").on("click", $treasureBoxCtrl.minimize);
                (function dirtyCode() {
                    if (!global.coutdownBox) {
                        global.coutdownBox = new Popup({
                            content: '<i class="treasure-close-l"></i>' + '<div style="display: inline-block;width: 190px;padding-left: 10px;">' + "<h3>宝箱倒计时</h3>" + '<p style="margin-top: .5em">距离本次领取剩余时间为 <span id="pop-count-down" style="color: #359CCB">--:--</span>，</p>' + '<p style="margin-bottom: 1em">本次宝箱可获取 <em id="gz-num" style="color: #359CCB"></em> 银瓜子和 <em id="vote-coupons" style="color: #359CCB"></em> 张投票券.</p>' + '<button class="tip-primary" style="width: 190px;height: 30px;">我知道了' + "</div>",
                            width: 280,
                            height: 135,
                            closable: true,
                            arrow: false
                        })
                    }
                    $treasureBox.off("click").on("click", function () {
                        if (global.LOGINED) {
                            global.coutdownBox.show($treasureBox)
                        } else {
                            global.liveQuickLogin()
                        }
                    });
                    $("button", global.coutdownBox.el).off("click").off("click").on("click", function () {
                        global.coutdownBox.hide()
                    })
                })()
            }
        };
        global.playTreasureAnimate = function (silver) {
            var step = 1;
            var guazNum = silver;
            var treasureBox = $(".treasure-box").show();
            treasureBox.prev().show();
            $(".treasure-count-down").css({cursor: "default", left: ""});
            $(".treasure").off("mouseenter").off("mouseleave");
            var interval = setInterval(_play, 100);

            function _play() {
                var next = step + 1;
                treasureBox.addClass("animate" + next).removeClass("animate" + step);
                step = next;
                if (step === 7) {
                    clearInterval(interval)
                }
            }

            if (!verifyBox) {
                verifyBox = new Popup({
                    content: '<i class="treasure-open-l" style="background-image: url(http://static.hdslb.com/live-static/images/shining-star/treasure-box-large.png); background-size: contain"></i>' + '<div style="display:none;" id="shining-star-verify"></div>' + '<div style="display: inline-block; width: 180px;padding-left: 10px;">' + '<div id="silver-notice-div"></div>' + '<input id="freeSilverCaptchaInput" type="text" length="4" class="tip-input" style="width: 65px;">' + '<img id="captchaImg" src="" alt="算算术~" style="width: 60px; height: 30px;vertical-align: top">' + '<a id="changeCaptcha" href="javascript: void(0);">刷新</a>' + '<button class="tip-primary" style="margin-top: 10px;width: 180px;height: 30px;" id="getFreeSilverAward">领取</button>' + "</div>",
                    width: 280,
                    height: 135,
                    closable: true,
                    arrow: false
                })
            }
            $("#silver-notice-div").html('请输入计算结果领取 <span style="color: #4fc1e9">' + weAreGoingtoGet.seed + '</span> 银瓜子和 <span style="color: #4fc1e9">' + weAreGoingtoGet.vote + "</span> 投票券.").css({
                "padding-right": "10px",
                "margin-bottom": "10px"
            });
            if (CLICK_FLAG == 0) {
                CLICK_FLAG = 1;
                $("button", verifyBox.el).on("click", function (e) {
                    $.ajax({
                        url: "/freeSilver/getAward?r=" + Math.random() + "&roomid=" + global.ROOMID,
                        type: "get",
                        data: {captcha: $("input", verifyBox.el).val()},
                        dataType: "json",
                        success: function (result) {
                            if (result.code == 0) {
                                (new MessageBox).show($(e.currentTarget), "成功领取 " + result.data.awardSilver + " 银瓜子和 " + result.data.getVote + " 投票券！");
                                var silverNumb = result.data.silver;
                                global.starVote = {voteCount: result.data.vote, voteChance: result.data.svote};
                                reloadUserData(silverNumb);
                                createTreasure();
                                $("#freeSilverCaptchaInput").val("");
                                verifyBox.hide();
                                $(".gift-item[data-giftid=11] .num-hinter").css({"background-position": result.data.vote * -16 + "px 0"});
                                $(".star-vote-vote-count").text(result.data.vote);
                                $(".star-vote-voted-num").text(18 - parseInt(result.data.svote, 10));
                                $(".star-vote-chance").text(result.data.svote);
                                setTimeout(function () {
                                    countdown()
                                }, 3e3);
                                if (global.__GetCookie("F_S_T_" + global.UID)) {
                                    $(".treasure").fadeOut();
                                    var tips = new CenterPopup({
                                        content: '<div class="send-gift-popup-wrap">' + "<h3>真不容易！</h3>" + "<div>" + '<div style="width: 30px; height: 30px; margin: 7px 10px; text-align: center; line-height: 30px; border-radius: 50%; background-color: #4fc315; color:#fff; font-size: 20px; font-weight: 800; float: left;">√</div>' + "<h3 style='margin-left: 10px; float: left'>今天的投票券已经领完了！<br/>请明天再接再厉哦！(●'◡'●)ﾉ♥</h3>" + '<div class="clear-float"></div>' + "</div>" + '<div style="text-align: center"><button class="tip-primary close-panel" style="padding: 5px 10px; margin: 10px;">明天见!</button></div>' + "</div>",
                                        width: 300,
                                        closable: true
                                    });
                                    $(".close-panel", tips.el).on("click", function () {
                                        tips.hide()
                                    });
                                    tips.show()
                                }
                            } else {
                                (new MessageBox).show($(e.currentTarget), result.msg)
                            }
                        },
                        error: function () {
                            (new MessageBox).show($(e.currentTarget), "系统错误，请稍后再试");
                            refreshCaptcha()
                        },
                        complete: function () {
                            if (LAST_COUNT_DOWN != null) {
                                LAST_COUNT_DOWN.clear();
                                LAST_COUNT_DOWN = null
                            }
                        }
                    })
                })
            }
            treasureBox.off("click").click(function () {
                verifyBox.show(treasureBox);
                refreshCaptcha()
            });
            $("#captchaImg, #changeCaptcha").on("click", refreshCaptcha)
        };
        global.countdown = function () {
            if (LAST_COUNT_DOWN != null) {
                LAST_COUNT_DOWN.clear()
            }
            $.ajax({
                url: "/FreeSilver/getCurrentTask?roomid=" + global.ROOMID + "&r=" + Math.random(),
                type: "get",
                dataType: "json",
                success: function (result) {
                    if (result.code == 0) {
                        LOGINED = true;
                        var silver = result.data.silver;
                        $("#gz-num").text(silver);
                        $("#vote-coupons").text(result.data.vote);
                        weAreGoingtoGet.seed = result.data.silver;
                        weAreGoingtoGet.vote = result.data.vote;
                        if (result.data.times > 3 && !global.__GetCookie("F_S_T_" + global.UID)) {
                            global.restoreOriginalFunc();
                            var tips = new CenterPopup({
                                content: '<div class="send-gift-popup-wrap">' + "<h3>真不容易！</h3>" + "<div>" + '<div style="width: 30px; height: 30px; margin: 7px 10px; text-align: center; line-height: 30px; border-radius: 50%; background-color: #4fc315; color:#fff; font-size: 20px; font-weight: 800; float: left;">√</div>' + "<h3 style='margin-left: 10px; float: left'>今天的投票券已经领完了！<br/>请明天再接再厉哦！(●'◡'●)ﾉ♥</h3>" + '<div class="clear-float"></div>' + "</div>" + '<div style="text-align: center"><button class="tip-primary close-panel" style="padding: 5px 10px; margin: 10px;">明天见!</button></div>' + "</div>",
                                width: 300,
                                closable: true
                            });
                            $(".close-panel", tips.el).on("click", function () {
                                tips.hide()
                            });
                            tips.show()
                        }
                        var endTime = new Date;
                        endTime.setMinutes(endTime.getMinutes() + result.data.minute);
                        LAST_COUNT_DOWN = new CountDown({
                            endTime: endTime,
                            el: $(".treasure-count-down, #pop-count-down"),
                            callback: function () {
                                $.ajax({
                                    url: "/freeSilver/getSurplus?r=" + Math.random(),
                                    type: "get",
                                    dataType: "json",
                                    success: function (result) {
                                        if (result.code !== 0) {
                                            return false
                                        }
                                        var surplus = result.data.surplus;
                                        if (surplus < 1) {
                                            playTreasureAnimate(result.data.silver)
                                        } else {
                                            resetCountDown(surplus)
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            })
        }
    }
})(window);
var LAST_COUNT_DOWN = null;
var LOGINED = false;
function countdown() {
    if (LAST_COUNT_DOWN != null) {
        LAST_COUNT_DOWN.clear()
    }
    $.ajax({
        url: "/FreeSilver/getCurrentTask?r=" + Math.random(),
        type: "get",
        dataType: "json",
        success: function (result) {
            if (result.code == 0) {
                LOGINED = true;
                var silver = result.data.silver;
                $("#gz-num").text(silver);
                var endTime = new Date;
                endTime.setMinutes(endTime.getMinutes() + result.data.minute);
                LAST_COUNT_DOWN = new CountDown({
                    endTime: endTime,
                    el: $(".treasure-count-down, #pop-count-down"),
                    callback: function () {
                        $.ajax({
                            url: "/freeSilver/getSurplus?r=" + Math.random(),
                            type: "get",
                            dataType: "json",
                            success: function (result) {
                                if (result.code !== 0) {
                                    return false
                                }
                                var surplus = result.data.surplus;
                                if (surplus < 1) {
                                    playTreasureAnimate(result.data.silver)
                                } else {
                                    resetCountDown(surplus)
                                }
                            }
                        })
                    }
                })
            }
        }
    })
}
function resetCountDown(surplus) {
    if (LAST_COUNT_DOWN != null) {
        LAST_COUNT_DOWN.clear()
    }
    var endTime = new Date;
    endTime.setMinutes(endTime.getMinutes() + surplus);
    LAST_COUNT_DOWN = new CountDown({
        endTime: endTime,
        el: $(".treasure-count-down, #pop-count-down"),
        callback: function () {
            $.ajax({
                url: "/freeSilver/getSurplus?r=" + Math.random(),
                type: "get",
                dataType: "json",
                success: function (result) {
                    if (result.code !== 0) {
                        return false
                    }
                    var surplus = result.data.surplus;
                    if (surplus < 1) {
                        playTreasureAnimate(result.data.silver)
                    } else {
                        resetCountDown(surplus)
                    }
                }
            })
        }
    })
}
var verifyBox;
var CLICK_FLAG = 0;
function playTreasureAnimate(silver) {
    var step = 1;
    var guazNum = silver;
    var treasureBox = $(".treasure-box").show();
    treasureBox.prev().show();
    $(".treasure-count-down").css({cursor: "default", left: ""});
    $(".treasure").off("mouseenter").off("mouseleave");
    var interval = setInterval(_play, 100);

    function _play() {
        var next = step + 1;
        treasureBox.addClass("animate" + next).removeClass("animate" + step);
        step = next;
        if (step === 7) {
            clearInterval(interval)
        }
    }

    if (!verifyBox) {
        verifyBox = new Popup({
            content: '<i class="treasure-open-l"></i><div style="display: inline-block;width: 180px;padding-left: 10px;"><div id="silver-notice-div"></div><input id="freeSilverCaptchaInput"type="text" length="4" class="tip-input" style="width: 65px;"><img id="captchaImg" src="" alt="算算术~" style="width: 60px; height: 30px;vertical-align: top"><a id="changeCaptcha" href="javascript: void(0);">刷新</a><button class="tip-primary" style="margin-top: 10px;width: 180px;height: 30px;" id="getFreeSilverAward">领取</button></div>',
            width: 280,
            height: 135,
            closable: true,
            arrow: false
        })
    }
    $("#silver-notice-div").html("请输入计算结果领取" + guazNum + "银瓜子");
    if (CLICK_FLAG == 0) {
        CLICK_FLAG = 1;
        $("button", verifyBox.el).on("click", function (e) {
            $.ajax({
                url: "/freeSilver/getAward?r=" + Math.random(),
                type: "get",
                data: {captcha: $("input", verifyBox.el).val()},
                dataType: "json",
                success: function (result) {
                    if (result.code == 0) {
                        (new MessageBox).show($(e.currentTarget), "成功领取" + result.data.awardSilver + "银瓜子！");
                        var silverNumb = result.data.silver;
                        reloadUserData(silverNumb);
                        createTreasure();
                        $("#freeSilverCaptchaInput").val("");
                        verifyBox.hide();
                        setTimeout(function () {
                            countdown()
                        }, 3e3)
                    } else {
                        (new MessageBox).show($(e.currentTarget), result.msg)
                    }
                },
                error: function () {
                    (new MessageBox).show($(e.currentTarget), "系统错误，请稍后再试");
                    refreshCaptcha()
                },
                complete: function () {
                    if (LAST_COUNT_DOWN != null) {
                        LAST_COUNT_DOWN.clear();
                        LAST_COUNT_DOWN = null
                    }
                }
            })
        })
    }
    treasureBox.off("click").click(function () {
        verifyBox.show(treasureBox);
        refreshCaptcha()
    });
    $("#captchaImg, #changeCaptcha").on("click", refreshCaptcha)
}
function sendMessage() {
    var danmInput = $("#danmu-input");
    var msg = danmInput.val().trim();
    if (msg.length == 0 || msg == "") {
        (new MessageBox).show(danmInput, "请填写弹幕再发送");
        return
    }
    getFlashMovieObject("player_object").sendMsg(msg, colorfulDanMu.currentColor);
    danmInput.val("");
    $("#danmu-count").html(0)
}
var msgPool = $(".message-history");
function addMessage(data) {
    if (data.cmd == "DANMU_MSG") {
        var html = '<div class="talk" data-uid="' + data.info[2][0] + '">';
        if (data.info[2][0] == UID) {
            if (VIP == 1) {
                html += '<a href="/i#to-vip" target="_blank"><span class="vip-icon">老爷</span></a>'
            }
            if (ISADMIN == 1) {
                if (UID == MASTERID) {
                    html += '<span class="master-icon">播主</span>'
                } else {
                    html += '<span class="admin-icon">房管</span>'
                }
            }
            if (!$.isEmptyObject(MEDAL)) {
                html += '<span class="medal-icon medal-icon-lv' + MEDAL.level + '"><span class="medal-name">' + MEDAL.medal_name + '</span><div class="medal-info tip-box"><div class="tip-arrow"><div class="tip-arrow-outer"></div><div class="tip-arrow-inner"></div></div><span><a href="/' + MEDAL.roomid + '" target="_blank">勋章主播：' + MEDAL.anchorName + "</a></span></div></span>"
            }
            if (!$.isEmptyObject(TITLE)) {
                html += '<span class="' + TITLE.title + '"></span>'
            }
            if (!$.isEmptyObject(USER_LEVEL)) {
                if (USER_LEVEL.level > 0) {
                    html += '<span class="user-level-icon user-level-icon-lv' + USER_LEVEL.level + '"><div class="user-level-info tip-box"><div class="tip-arrow"><div class="tip-arrow-outer"></div><div class="tip-arrow-inner"></div></div><p>用户等级：' + USER_LEVEL.level + "</p><p>排名：" + USER_LEVEL.rank + "</p></div></span>"
                }
            }
            html += '<span class="talk-name">[自己] : </span>'
        } else {
            if (data.info[2][3] == 1) {
                html += '<a href="/i#to-vip" target="_blank"><span class="vip-icon">老爷</span></a>'
            }
            if (data.info[2][2] == 1) {
                if (data.info[2][0] == MASTERID) {
                    html += '<span class="master-icon">播主</span>'
                } else {
                    html += '<span class="admin-icon">房管</span>'
                }
            }
            if (data.info[3].length) {
                html += '<span class="medal-icon medal-icon-lv' + data.info[3][0] + '"><span class="medal-name">' + data.info[3][1] + '</span><div class="medal-info tip-box"><div class="tip-arrow"><div class="tip-arrow-outer"></div><div class="tip-arrow-inner"></div></div><span><a href="/' + data.info[3][3] + '" target="_blank">勋章主播：' + data.info[3][2] + "</a></span></div></span>"
            }
            if (data.info[5].length) {
                html += '<span class="' + data.info[5][0] + '"></span>'
            }
            if (data.info[4].length) {
                if (data.info[4][0] > 0) {
                    html += '<span class="user-level-icon user-level-icon-lv' + data.info[4][0] + '"><div class="user-level-info tip-box"><div class="tip-arrow"><div class="tip-arrow-outer"></div><div class="tip-arrow-inner"></div></div><p>用户等级：' + data.info[4][0] + "</p><p>排名：" + data.info[4][1] + "</p></div></span>"
                }
            }
            html += '<span class="talk-name">' + data.info[2][1] + " : </span>"
        }
        html += '<span class="talk-content">' + data.info[1] + "</span></div>";
        msgPool.append(html)
    } else if (data.cmd == "ROOM_KICKOUT" || data.cmd == "ROOM_BLOCK_INTO") {
        msgPool.append('<div class="system">用户<em style="color: #aaa">' + data.uname + "</em>已被管理员踢出房间</div>")
    } else if (data.cmd == "ROOM_BLOCK_MSG") {
        msgPool.append('<div class="system">用户<em style="color: #aaa">' + data.uname + "</em>已被管理员禁言</div>")
    } else if (data.cmd == "SYS_MSG") {
        var contentNode = null;
        var title = data.msg.substr(0, data.msg.indexOf("：") + 1);
        var content = data.msg.substr(data.msg.indexOf("：") + 1, data.msg.length);
        if (data.url.length < 1) {
            contentNode = content
        } else {
            contentNode = '<a href="' + data.url + '" target="_blank">' + content + "</a>"
        }
        var systemMsg = '<div class="announcement-container">' + '<div class="announcement-icon"></div>' + '<div class="announcement-content">' + "<p><span>" + title + "</span>" + contentNode + "</p>" + "</div>" + "</div>";
        msgPool.append(systemMsg)
    } else if (data.type == "gift") {
        msgPool.append(data.html)
    } else {
        msgPool.append('<div class="system"><span class="system-name">[系统]：</span><em>' + data + "</em></div>")
    }
    removeOverflow();
    if (msgPool.data("stop") != "true") {
        msgPool.scrollTop(msgPool[0].scrollHeight)
    }
}
function removeOverflow() {
    if (msgPool.children().length >= 100) {
        $(".message-history > div:first-child").remove();
        removeOverflow()
    }
}
function loadTop10(json) {
    var data = json.data.top_list;
    if (!data.length) {
        return
    }
    var container = $("#ranking");
    container.empty();
    for (var i = 0, j = data.length; i < j; i++) {
        container.append('<li><span class="fan-name rank' + (i + 1) + '">' + data[i].uname + '</span><span class="fan-support">' + data[i].coin + "</span></li>")
    }
}
(function (global, undefined) {
    $(function () {
        var $ranklist = $("#ranking"), requestAddress = "/gift/getTop?roomid=" + global.ROOMID;
        var rankDataRequest = function (event) {
            $ranklist.off("mouseenter", rankDataRequest);
            $.ajax({
                url: requestAddress,
                type: "GET",
                dataType: "JSON",
                success: rankDataRequest.xhrSuccess,
                error: rankDataRequest.xhrError
            })
        };
        rankDataRequest.xhrSuccess = function (result) {
            global.loadTop10(dataConverter(result.data))
        };
        rankDataRequest.xhrError = function (result) {
            console.log("Bilibili Live Error: 排行榜数据 XHR 请求失败 :(")
        };
        var dataConverter = function (ranklist) {
            var result = {};
            result.data = {};
            result.data.top_list = ranklist;
            return result
        };
        $ranklist.on("mouseenter", rankDataRequest).on("mouseleave", function () {
            $ranklist.on("mouseenter", rankDataRequest)
        });
        $(".tab.tab-ranking").on("click", rankDataRequest)
    })
})(window);
(function (global, undefined) {
    var $dataList = $("#fff-rank-list");
    $(".tab.fans-admin-list").on("click", dataRequest);
    function dataRequest() {
        $.ajax({
            url: "/gift/star",
            type: "GET",
            data: {uid: global.MASTERID, timestamp: Date.now()},
            dataType: "JSON",
            success: function (result) {
                if (result.code != 0) {
                    console.log("Bilibili Live Error: 闪耀之星排行数据获取失败, 将在 10 秒后重试.");
                    console.log("Detail: " + result.msg.toString());
                    setTimeout(function () {
                        dataRequest()
                    }, 1e4)
                }
                $dataList.find(".fff-rank-item").remove();
                (function () {
                    for (var i = 0, length = result.data.length; i < length; i++) {
                        var li = '<li class="fff-rank-item"><span class="fff-rank-name rank' + (i + 1) + '">' + result.data[i].uname + '</span><span class="fff-rank-score">' + result.data[i].coin + "</span></span></li>";
                        $dataList.append(li)
                    }
                })();
                $dataList.find(".loading-progress").remove()
            },
            error: function (result) {
                console.log("Bilibili Live Error: 闪耀之星排行数据获取失败, 将在 10 秒后重试.");
                setTimeout(function () {
                    dataRequest()
                }, 1e4)
            }
        })
    }
})(window);
(function (global, undefined) {
    var $shiningstarPanel = $(".live-controls-float-panel.shining-star-rank");
    var panelOutTimeout = null;
    var $starRank = $(".star-rank");
    $starRank.hover(mouseEnter, mouseOut);
    $shiningstarPanel.hover(preventHoverOut, mouseOut);
    function mouseEnter() {
        $shiningstarPanel.stop(true, true).fadeIn(200);
        dataRequest()
    }

    function mouseOut() {
        panelOutTimeout = setTimeout(function () {
            $shiningstarPanel.stop(true, false).fadeOut(200)
        }, 200)
    }

    function preventHoverOut() {
        clearTimeout(panelOutTimeout)
    }

    function dataRequest() {
        $.ajax({
            url: "/gift/starRank",
            type: "GET",
            data: {uid: global.MASTERID, timestamp: Date.now()},
            dataType: "JSON",
            success: function (result) {
                if (result.code != 0) {
                    console.log("Detail: " + result.msg);
                    return
                }
                $(".shining-star-rank .shining-star-type").text(result.data.type + "排名：");
                $(".shining-star-rank .shining-star-rank-count").text(result.data.rank || "--");
                $(".shining-star-rank .section-sub-title").text("最炫" + result.data.type + "之星");
                $(".shining-star-rank .star-fans-type").text("最铁" + result.data.type + "粉丝");
                $(".shining-star-rank .best-heterosexuality .shining-star-rank-list").empty();
                $(".shining-star-rank .best-star-fans .shining-star-rank-list").empty();
                (function () {
                    for (var i = 0, length = result.data.master.length; i < length; i++) {
                        var li = '<li class="shining-star-rank-list-item">' + result.data.master[i].uname + "</li>";
                        $(".shining-star-rank .best-heterosexuality .shining-star-rank-list").append(li)
                    }
                })();
                (function () {
                    for (var i = 0, length = result.data.user.length; i < length; i++) {
                        var li = '<li class="shining-star-rank-list-item">' + result.data.user[i].uname + "</li>";
                        $(".shining-star-rank .best-star-fans .shining-star-rank-list").append(li)
                    }
                })();
                $shiningstarPanel.find(".loading-progress").hide()
            },
            error: function (result) {
                console.log("Bilibili Live Error: 闪耀之星总排行数据获取失败, 不再重试.")
            }
        })
    }
})(window);
function reloadUserData(silverNumb) {
    var sNumb = formatFriendlyNumber(silverNumb);
    window.setNum(sNumb, $("#guazi-num"))
}
function reloadGoldenData(goldenNumb) {
    var gNumb = formatFriendlyNumber(goldenNumb);
    window.setNum(gNumb, $("#goldenseed-num"))
}
var FREE_SILVER_HEART = 0;
function freeSilverHeart() {
    if (__GetCookie("F_S_T_" + UID) == 1) {
        return false
    }
    setTimeout(function () {
        countdown()
    }, 3e3);
    FREE_SILVER_HEART = setInterval(function () {
        $.ajax({
            url: "/freeSilver/heart?r=" + Math.random(), type: "get", dataType: "json", success: function (result) {
                if (__GetCookie("F_S_T_" + UID) == 1) {
                    clearInterval(FREE_SILVER_HEART);
                    return true
                }
            }
        })
    }, 6e4)
}
function bindDanmMenu() {
    var menu = new Popup({
        content: '<div class="pop-menu"><a href="javascript: void(0);" class="goto-space">去他的个人空间</a><a href="javascript: void(0);" class="ignore-sender">屏蔽发送者</a><a href="javascript: void(0);" class="report-danm">举报选中弹幕</a></div>',
        width: 130,
        height: 90,
        arrow: false
    });
    var reportMenu = new Popup({
        content: '<p>请输入举报理由</p><input class="tip-input" maxlength="25" style="width:206px;height:30px;margin-top:20px;"><div style="margin-top: 40px; text-align: center;"><button class="tip-primary">确定</button><button class="tip-secondary">取消</button></div>',
        width: 246,
        height: 164,
        closable: true,
        direction: "down",
        arrow: false
    });
    $(".message-history, .up-message").on("click", ".talk-name, .talk-content", function (e) {
        var target = $(e.currentTarget);
        var parent = target.parent();
        var uid = parent.data("uid");
        $(".danm-active").removeClass("danm-active");
        if (uid == UID) {
            return
        }
        e.stopPropagation();
        parent.addClass("danm-active");
        menu.show(target);
        $(menu.el).off("click").click(function (event) {
            event.stopPropagation();
            var _target = $(event.target);
            if (_target.hasClass("goto-space")) {
                window.open("http://space.bilibili.com/" + uid, "_blank");
                menu.hide()
            } else if (_target.hasClass("ignore-sender")) {
                window.liveQuickLogin();
                ignoreSender(uid, target);
                menu.hide()
            } else if (_target.hasClass("report-danm")) {
                window.liveQuickLogin();
                reportMenu.show(_target);
                menu.hide()
            }
        });
        bindDanmReport(uid, parent.find(".talk-content").html(), reportMenu)
    });
    $("body").on("click", function (e) {
        menu.hide()
    })
}
function bindDanmReport(uid, msg, reportMenu) {
    $("button", reportMenu.el).off("click").on("click", function (event) {
        var _target = $(event.target);
        if (_target.hasClass("tip-primary")) {
            var reason = $(".tip-input", reportMenu.el).val().trim();
            if (reason == "") {
                (new MessageBox).show(_target, "请输入举报理由");
                return
            }
            $.ajax({
                url: "/liveact/dmreport",
                type: "POST",
                data: {roomid: ROOMID, uid: uid, msg: msg, reason: reason},
                dataType: "json",
                success: function (result) {
                    if (result.code == 0) {
                        (new MessageBox).show(_target, "举报成功！");
                        reportMenu.hide()
                    } else {
                        (new MessageBox).show(_target, result.msg);
                        reportMenu.hide()
                    }
                },
                error: function () {
                    (new MessageBox).show(_target, "出错了，请稍后再尝试");
                    reportMenu.hide()
                }
            })
        } else {
            reportMenu.hide()
        }
    })
}
function ignoreSender(uid, target) {
    $.ajax({
        url: "/liveact/shield_user",
        type: "POST",
        data: {roomid: ROOMID, uid: uid, type: 1},
        dataType: "json",
        success: function (result) {
            if (result.code == 0) {
                getFlashMovieObject("player_object").addShieldUser(result.data.uid, result.data.uname);
                (new MessageBox).show(target, "屏蔽成功！")
            } else {
                (new MessageBox).show(target, result.msg)
            }
        },
        error: function () {
            (new MessageBox).show(target, "出错了，请稍后再尝试")
        }
    })
}
function setNum(data, element) {
    var current = parseInt(element.html());
    var newnum = parseInt(data);
    var _delta = newnum - current;
    var _exec_times = Math.abs(Math.floor(_delta / 5));
    if (_exec_times > 100)_exec_times = 100;
    var delta = _delta / _exec_times;
    if (Math.abs(newnum - current) <= 10) {
        element.html(data);
        return
    }
    var add_cnt = 0;
    if (element.setNumTimer !== null) {
        clearInterval(element.setNumTimer);
        element.setNumTimer = null
    }
    element.setNumTimer = setInterval(function () {
        if (add_cnt++ >= _exec_times) {
            element.html(data);
            if (element.setNumTimer !== null) {
                clearInterval(element.setNumTimer);
                element.setNumTimer = null
            }
            return
        }
        element.html(parseInt(current + delta * add_cnt))
    }, 10)
}
function bindAttentionBtn(btn) {
    function _setAtt() {
        btn.html("已关注").addClass("done");
        btn.hover(function () {
            btn.html("取消关注")
        }, function () {
            btn.html("已关注")
        });
        btn.off("click");
        btn.click(function () {
            _attention(btn, 0)
        })
    }

    function _setUnAtt() {
        btn.html("关注").removeClass("done");
        btn.off("click");
        btn.off("hover");
        btn.click(function () {
            _attention(btn, 1)
        })
    }

    function _attention(btn, type) {
        window.liveQuickLogin();
        $.post("/liveact/attention/", {type: type, uid: uid}, function (result) {
            if (result.code != 0) {
                (new MessageBox).show(btn, result.msg);
                return
            }
            var $fansCountNum = $(".fans-count-num");
            var fansCountNow = parseInt($fansCountNum.attr("data-fans"), 10);
            if (type == 1) {
                $fansCountNum.attr("data-fans", fansCountNow + 1);
                $fansCountNum.text(oneHundredThousandFormat(fansCountNow + 1));
                (new MessageBox).show(btn, "关注成功!");
                _setAtt();
                feedNotice.getHeartBeat(0)
            } else {
                $fansCountNum.attr("data-fans", fansCountNow - 1);
                $fansCountNum.text(oneHundredThousandFormat(fansCountNow - 1));
                (new MessageBox).show(btn, "取消关注成功!");
                _setUnAtt();
                feedNotice.getHeartBeat(0)
            }
            ISATTENTION = type
        }, "json")
    }

    var uid = parseInt(btn.attr("uid"));
    if (ISATTENTION) {
        _setAtt()
    } else {
        _setUnAtt()
    }
}
function createTab() {
    $(".tab").on("click", function (e) {
        var target = $(e.currentTarget);
        target.parent().children().each(function (index, el) {
            var $el = $(el);
            $el.removeClass("active");
            $("#" + $el.data("target")).hide()
        });
        target.addClass("active");
        $("#" + target.data("target")).show();
        if (target.data("target") == "up-message") {
            var upMessage = $(".up-message");
            upMessage.scrollTop(upMessage[0].scrollHeight)
        }
    })
}
function background(url) {
    $(".live-room").css({background: 'url("' + url + '")'})
}
function showBlock(msg, endTime) {
    if (blockTimer)blockTimer.clear();
    blockTimer = new CountDown({
        endTime: endTime, el: $(".message-mask em"), callback: function () {
            $(".message-mask").hide()
        }
    });
    $("#mask-desc").html(msg);
    $(".message-mask").show()
}
function refreshCaptcha() {
    $("#captchaImg").attr("src", "/FreeSilver/getCaptcha?t=" + Math.random())
}
function createMessageHistory() {
    msgPool.hover(function () {
        msgPool.data("stop", "true")
    }, function () {
        msgPool.data("stop", "false");
        msgPool.scrollTop(msgPool[0].scrollHeight)
    })
}
var Seed = {
    SilverSeed: {
        getSilverSeed: function () {
            var silverseedWrap = $(".silverseed-wrap");
            var silverseedTip = new Popup({
                content: '<i class="guazi-x"></i><p style="display: inline-block;width: 220px;padding-left: 10px;">“你掉的是我左手这个金瓜子，还是右手这个银瓜子？”“还是银瓜子比较好！”<em class="tip-warn">※可以用银瓜子购买礼物，银瓜子可以通过点击宝箱或签到领取。</em></p>',
                width: 280,
                arrow: true
            });
            var silverseedBox = new Popup({
                content: '<i class="guazi-l"></i><div style="display: inline-block;width: 140px;padding-left: 10px;"><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;这是祖上留下的<em class="tip-warn">1000</em>银瓜子，去送给心仪的主（dui）播（xiang）吧！</p><div><button class="tip-primary get-free-guazi">领取</button><button class="tip-secondary">取消</button></div></div>',
                width: 230,
                height: 105,
                arrow: false
            });
            silverseedWrap.hover(function (e) {
                silverseedTip.show($(e.currentTarget))
            }, function () {
                silverseedTip.hide()
            });
            $("#getFree").on("click", function (e) {
                silverseedBox.show(silverseedWrap)
            });
            $("button", silverseedBox.el).on("click", function (e) {
                var target = $(e.currentTarget);
                if (target.hasClass("tip-primary")) {
                    $.ajax({
                        url: "/FreeSilver/getRegSilver?r=" + Math.random(),
                        type: "get",
                        dataType: "json",
                        success: function (result) {
                            if (result.code == 0) {
                                (new MessageBox).show(silverseedWrap, "成功领取1000银瓜子！");
                                var silverNumb = result.data.silver;
                                reloadUserData(silverNumb);
                                $("#getFree").remove()
                            } else {
                                (new MessageBox).show(silverseedWrap, result.msg)
                            }
                        },
                        error: function () {
                            (new MessageBox).show(silverseedWrap, "系统错误，请稍后再试")
                        }
                    })
                }
                silverseedBox.hide()
            })
        }
    },
    GoldenSeed: {
        order: "",
        goldenSeedNum: 0,
        silverSeedNum: 0,
        successPopup: null,
        messagePopup: null,
        canClick: 1,
        goldenseedTip: new Popup({
            content: '<i class="goldenseed-tip-icon"></i><p style="display: inline-block;width: 220px;padding-left: 10px;">并不是每一个瓜子都是金瓜子。<br /><em class="tip-warn">※金瓜子可以直接购买道具，还能兑换成银瓜子。主播获得由金瓜子购买的道具可以获得收入。</em></p>',
            width: 280,
            arrow: true
        }),
        buyPopup: new CenterPopup({
            content: '<div class="buyPopup-wrap"><div class="tabs"><div class="tab active" data-target="buy-goldenseed-tab">购买金瓜子</div><div class="tab" data-target="convert-silverseed-tab">兑换银瓜子</div></div><div id="buy-goldenseed-tab" class="buy-goldenseed-tab tab-content"><div class="form-item"><label for="">账户余额：</label><span class="remaining black-color">0</span><span>B币</span><a href="https://pay.bilibili.com/charge_alipay.html" target="_blank" class="blue-color pos-right">充值</a></div><div class="form-item"><label for="buy-value">购买金额：</label><input type="text" id="bcoin-input" /><span class="black-color pos-right">B币</span><p class="lh16 pdl80">1B币=1000金瓜子</p></div><p class="red-color lh16 mgt20 text-align-center">本次购买将获得<span class="calc-value">0</span>金瓜子</p><input id="buy-goldenseed-btn" class="buy-btn" type="button" value="立即购买"></div><div id="convert-silverseed-tab" class="convert-silverseed-tab tab-content" style="display: none;"><div class="form-item"><label for="">账户余额：</label><span class="remaining black-color">0</span><span>金瓜子</span><a href="javascript:;" class="blue-color pos-right">购买</a></div><div class="form-item"><label for="buy-value">兑换数量：</label><input type="text" id="goldenseed-input" /><span class="black-color pos-right">金瓜子</span><p class="pdl80">1金瓜子=1银瓜子</p></div><div class="text-info black-color"><div class="info-label">兑换数量:</div><div class="info-content"><p>≥1w附赠5%银瓜子</p><p>≥10w附赠10%银瓜子</p><p>≥50w附赠15%银瓜子</p></div></div><p class="red-color text-align-center">本次购买将获得<span class="calc-value">0</span>银瓜子</p><input id="golden-to-silver-btn" class="buy-btn" type="button" value="立即兑换"></div></div>',
            width: 350,
            closable: true
        }),
        finishPayPopup: new CenterPopup({
            content: '<div class="buyPopup-wrap"><p>正在支付中...</p><input id="finish-pay-btn" class="buy-btn" type="button" value="支付完成"></div',
            width: 350,
            closable: true
        }),
        getUser: function () {
            $.ajax({
                url: "/user/getUser", type: "get", dataType: "json", success: function (result) {
                    if (result.code == 0) {
                        $("#convert-silverseed-tab .remaining").html(formatFriendlyNumber(result.data.gold))
                    }
                }
            })
        },
        getBcoin: function () {
            $.ajax({
                url: "/payCenter/getBp", type: "get", dataType: "json", success: function (result) {
                    if (result.code == 0) {
                        $("#buy-goldenseed-tab .remaining").html(result.data.bp.bp)
                    }
                }
            })
        },
        quickPay: function (bpNum) {
            $.ajax({
                url: "/payCenter/quickPay",
                type: "get",
                data: {bpNum: bpNum},
                dataType: "json",
                success: function (result) {
                    Seed.GoldenSeed.canClick = 1;
                    $("#buy-goldenseed-btn").val("立即购买");
                    if (result.code == 0) {
                        Seed.GoldenSeed.buyPopup.hide();
                        Seed.GoldenSeed.successPopup = new CenterPopup({
                            content: "已经成功购买" + result.data.orderGold + "金瓜子",
                            width: 200,
                            type: "ok",
                            btnValue: "继续购买",
                            btnId: "popup-goon-buy-goldenseed-btn",
                            closable: true
                        });
                        Seed.GoldenSeed.successPopup.show({radius: true});
                        Seed.GoldenSeed.getBcoin();
                        reloadGoldenData(result.data.gold)
                    } else if (result.code == -400) {
                        Seed.GoldenSeed.messagePopup = new CenterPopup({
                            content: "B币余额不足，请充值。",
                            width: 200,
                            type: "message",
                            btnValue: "立即充值",
                            btnId: "popup-to-paypage-btn",
                            closable: true
                        });
                        Seed.GoldenSeed.buyPopup.hide();
                        Seed.GoldenSeed.messagePopup.show({radius: true});
                        $("#popup-to-paypage-btn", Seed.GoldenSeed.messagePopup.el).on("click", function () {
                            Seed.GoldenSeed.messagePopup.hide();
                            Seed.GoldenSeed.finishPayPopup.show({radius: true});
                            Seed.GoldenSeed.order = result.data.order;
                            window.open(result.data.cashier_url)
                        })
                    } else {
                        (new MessageBox).show($("#buy-goldenseed-btn"), result.msg)
                    }
                }
            })
        },
        getOrderStatus: function (order) {
            $.ajax({
                url: "/payCenter/orderStatus",
                type: "get",
                data: {order: order},
                dataType: "json",
                success: function (result) {
                    if (result.code == "0") {
                        Seed.GoldenSeed.finishPayPopup.hide();
                        Seed.GoldenSeed.successPopup = new CenterPopup({
                            content: "已经成功购买" + result.data.orderGold + "金瓜子",
                            width: 200,
                            type: "ok",
                            btnValue: "继续购买",
                            btnId: "popup-goon-buy-goldenseed-btn",
                            closable: true
                        });
                        Seed.GoldenSeed.successPopup.show({radius: true});
                        reloadGoldenData(result.data.gold);
                        Seed.GoldenSeed.getBcoin()
                    } else {
                        (new MessageBox).show($("#finish-pay-btn"), result.msg)
                    }
                }
            })
        },
        goldToSilver: function (goldenSeedNum) {
            $.ajax({
                url: "/gold/goldToSilver",
                type: "get",
                data: {cgold: goldenSeedNum},
                dataType: "json",
                success: function (result) {
                    if (result.code == "0") {
                        Seed.GoldenSeed.successPopup = new CenterPopup({
                            content: "已经成功兑换" + result.data.csilver + "银瓜子",
                            width: 200,
                            type: "ok",
                            btnValue: "继续兑换",
                            btnId: "popup-goon-goldtosilver-btn",
                            closable: true
                        });
                        Seed.GoldenSeed.successPopup.show({radius: true});
                        reloadGoldenData(result.data.gold);
                        reloadUserData(result.data.silver);
                        Seed.GoldenSeed.getUser();
                        $("#convert-silverseed-tab .remaining").html(formatFriendlyNumber(result.data.gold))
                    } else if (result.code == "-400") {
                        Seed.GoldenSeed.messagePopup = new CenterPopup({
                            content: "金瓜子不足，请购买",
                            width: 200,
                            type: "message",
                            btnValue: "购买金瓜子",
                            btnId: "popup-buy-goldenseed-btn",
                            closable: true
                        });
                        Seed.GoldenSeed.messagePopup.show({radius: true})
                    }
                }
            })
        },
        checkBcoinSeedInput: function (data) {
            var reg = new RegExp("^[1-9][0-9]*$");
            if (!reg.test(data)) {
                if (data != "") {
                    (new MessageBox).show($("#bcoin-input"), "请输入正确数值！")
                }
                Seed.GoldenSeed.goldenSeedNum = 0;
                $("#buy-goldenseed-tab .calc-value").html(Seed.GoldenSeed.goldenSeedNum);
                return false
            } else {
                Seed.GoldenSeed.goldenSeedNum = data * 1e3
            }
            $("#buy-goldenseed-tab .calc-value").html(Seed.GoldenSeed.goldenSeedNum);
            return true
        },
        checkGoldenSeedInput: function (data) {
            var reg = new RegExp("^[1-9][0-9]*$");
            if (!reg.test(data)) {
                if (data != "") {
                    (new MessageBox).show($("#goldenseed-input"), "请输入正确数值！")
                }
                Seed.GoldenSeed.silverSeedNum = 0;
                $("#convert-silverseed-tab .calc-value").html(Seed.GoldenSeed.silverSeedNum);
                return false
            } else {
                switch (true) {
                    case data >= 5e5:
                        Seed.GoldenSeed.silverSeedNum = parseInt(data * 1.15);
                        break;
                    case data >= 1e5:
                        Seed.GoldenSeed.silverSeedNum = parseInt(data * 1.1);
                        break;
                    case data >= 1e4:
                        Seed.GoldenSeed.silverSeedNum = parseInt(data * 1.05);
                        break;
                    default:
                        Seed.GoldenSeed.silverSeedNum = data
                }
            }
            $("#convert-silverseed-tab .calc-value").html(Seed.GoldenSeed.silverSeedNum);
            return true
        },
        activeBuyGoldenseedTab: function () {
            $(".buyPopup-wrap .tabs .tab").removeClass("active");
            $(".buyPopup-wrap .tabs .tab:first-child").addClass("active");
            $("#buy-goldenseed-tab").css("display", "block");
            $("#convert-silverseed-tab").css("display", "none")
        },
        activeConvertSilverseedTab: function () {
            $(".buyPopup-wrap .tabs .tab").removeClass("active");
            $(".buyPopup-wrap .tabs .tab:last-child").addClass("active");
            $("#convert-silverseed-tab").css("display", "block");
            $("#buy-goldenseed-tab").css("display", "none")
        },
        init: function () {
            var $goldenseedWrap = $(".goldenseed-wrap");
            $goldenseedWrap.hover(function (e) {
                Seed.GoldenSeed.goldenseedTip.show($(e.currentTarget))
            }, function () {
                Seed.GoldenSeed.goldenseedTip.hide()
            });
            var $buyGoldenseed = $("#buy-goldenseed");
            $buyGoldenseed.on("click", function (e) {
                e.preventDefault();
                if (UID) {
                    Seed.GoldenSeed.getUser();
                    Seed.GoldenSeed.getBcoin();
                    Seed.GoldenSeed.activeBuyGoldenseedTab();
                    Seed.GoldenSeed.buyPopup.show()
                } else {
                    window.liveQuickLogin()
                }
            });
            $("#bcoin-input").keyup(function () {
                var inputValue = $(this).val();
                Seed.GoldenSeed.checkBcoinSeedInput(inputValue)
            });
            $("#convert-silverseed-tab a").on("click", function (event) {
                event.preventDefault();
                Seed.GoldenSeed.activeBuyGoldenseedTab()
            });
            $("#buy-goldenseed-btn").on("click", function (event) {
                event.preventDefault();
                var inputValue = $("#bcoin-input").val();
                if (Seed.GoldenSeed.checkBcoinSeedInput(inputValue) && Seed.GoldenSeed.canClick == 1) {
                    Seed.GoldenSeed.canClick = 0;
                    $(this).val("购买中...");
                    Seed.GoldenSeed.quickPay(inputValue)
                }
            });
            $("#popup-buy-goldenseed-btn").live("click", function (event) {
                event.preventDefault();
                Seed.GoldenSeed.messagePopup.hide();
                Seed.GoldenSeed.activeBuyGoldenseedTab();
                Seed.GoldenSeed.buyPopup.show()
            });
            $("#finish-pay-btn").live("click", function (event) {
                event.preventDefault();
                Seed.GoldenSeed.getOrderStatus(Seed.GoldenSeed.order)
            });
            $("#goldenseed-input").keyup(function () {
                var inputValue = $(this).val();
                Seed.GoldenSeed.checkGoldenSeedInput(inputValue)
            });
            $("#golden-to-silver-btn").on("click", function (event) {
                event.preventDefault();
                var inputValue = $("#goldenseed-input").val();
                if (Seed.GoldenSeed.checkGoldenSeedInput(inputValue)) {
                    Seed.GoldenSeed.buyPopup.hide();
                    Seed.GoldenSeed.goldToSilver(inputValue)
                }
            });
            $("#popup-goon-buy-goldenseed-btn").live("click", function (event) {
                Seed.GoldenSeed.successPopup.hide();
                Seed.GoldenSeed.buyPopup.show();
                Seed.GoldenSeed.activeBuyGoldenseedTab()
            });
            $("#popup-goon-goldtosilver-btn").live("click", function (event) {
                Seed.GoldenSeed.successPopup.hide();
                Seed.GoldenSeed.buyPopup.show();
                Seed.GoldenSeed.activeConvertSilverseedTab()
            })
        }
    }
};
$(function () {
    freeSilverHeart();
    createTab();
    createMessageHistory();
    createReportBox();
    createTreasure();
    window.giftEvent.createGiveBox();
    colorfulDanMu.changeColor();
    Seed.GoldenSeed.init();
    Seed.SilverSeed.getSilverSeed();
    var shareTxt = ROOMTITLE + "的直播间";
    bindShare({
        url: window.location.href,
        title: shareTxt,
        pic: "",
        nickname: ANCHOR_NICK_NAME,
        desc: shareTxt,
        summary: " ",
        shortTitle: document.title,
        searchPic: false
    }, ".share-point a");
    var share = $(".share-content");
    $(".share").on("mouseenter", function () {
        share.stop(false, true);
        share.fadeIn().end()
    });
    $(".share").on("mouseleave", function () {
        share.stop(false, true);
        share.fadeOut().end()
    });
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
    bindDanmMenu();
    bindAttentionBtn($("#attention_btn"));
    if (ISADMIN != 1 && (BLOCK_TYPE == 0 || BLOCK_TYPE == 1 && IS_NEWBIE == 1)) {
        var msg = IS_NEWBIE == 1 ? "播主对注册用户开启了全局禁言" : "播主对全房间用户开启了全局禁言";
        var endTime = new Date;
        endTime.setSeconds(endTime.getSeconds() + BLOCK_TIME);
        showBlock(msg, endTime)
    }
    $(".get-free-guazi").on("click", function () {
        window.liveQuickLogin()
    });
    $("#danmu-input-container").on("click", function () {
        $("#danmu-input").focus()
    })
});
(function () {
    $(".marry-text").on("click", function () {
        window.liveQuickLogin();
        $.ajax({
            url: "/i/ajaxGetMyWearTitle", type: "get", dataType: "json", success: function (result) {
                if (result.code == 0) {
                    if (result.data.title) {
                        var $marryHtml = "";
                        $marryHtml += '<span class="' + result.data.title + '">2015年圣诞节</span>';
                        $(".cur-hat").html($marryHtml).addClass("cur-show");
                        $(".marry-hat-tip-box").show()
                    } else {
                        $(".cur-hat").empty().text("没有佩戴头衔");
                        $(".hat-box .no-medal-icon").show();
                        $(".marry-hat-tip-box").show()
                    }
                }
            }
        })
    });
    $(".marry-hat-btn").on("click", function () {
        event.stopPropagation()
    });
    $(".cur-hat").on("click", function () {
        event.preventDefault();
        $.ajax({
            url: "/i/ajaxGetMyTitleList", type: "get", dataType: "json", success: function (result) {
                if (result.code == 0) {
                    if ($(".cur-hat").hasClass("cur-show")) {
                        var $marryHtml = "";
                        $marryHtml += '<span class="' + result.data.title + '">2015年圣诞节</span>';
                        $(".has-hat").html($marryHtml);
                        $(".cur-marry-hat-tip-box").show()
                    } else {
                        var $marryHtml = "";
                        $marryHtml += '<span class="' + result.data.title + '">2015年圣诞节</span>';
                        $(".has-hat").html($marryHtml);
                        $(".cur-marry-hat-tip-box").show();
                        $(".no-hat").hide()
                    }
                }
            }
        })
    });
    $(".has-hat").on("click", function (event) {
        var marrryTitle = $(this).children("span").attr("class");
        $.ajax({
            url: "/i/ajaxWearTitle",
            type: "post",
            data: {title: marrryTitle},
            dataType: "json",
            success: function (result) {
                if (result.code == 0) {
                    var $marryHtml = "";
                    $marryHtml += '<span class="' + marrryTitle + '">2015年圣诞节</span>';
                    $(".no-medal-icon").hide();
                    $(".no-hat").show();
                    $(".cur-hat").empty().html($marryHtml).addClass("cur-show");
                    TITLE.title = marrryTitle
                }
            }
        })
    });
    $(".no-hat").on("click", function () {
        $.ajax({
            url: "/i/ajaxCancelWearTitle", type: "post", dataType: "json", success: function (result) {
                if (result.code == 0) {
                    $(".cur-hat").empty().html("没有佩戴头衔").removeClass("cur-show");
                    $(".hat-box .no-medal-icon").show();
                    $(".marry-hat-tip-box").show();
                    TITLE.title = ""
                }
            }
        })
    });
    $(document).click(function () {
        $(".marry-hat-tip-box, .cur-marry-hat-tip-box").hide()
    })
})();
$(function () {
    var $winPop = $(".winter-popup");
    $(".winter-confirm, .winter-closed").on("click", function () {
        $(".mask, .winter-popup").hide()
    });
    getRewardGift();
    function getRewardGift() {
        $.ajax({
            url: "/carnival/getReward", type: "post", dataType: "json", success: function (result) {
                if (result.code == 0) {
                    $(".winter-gift-tit .tips").text(result.data.title);
                    $(".gift-latiao span, .gift-bekala span").text(result.data.expireat);
                    $(".gift-latiao i").text("x" + result.data.num1);
                    $(".gift-bekala i").text("X" + result.data.num2);
                    $winPop.attr("data-type", "finish");
                    $(".mask").show();
                    $winPop.fadeIn()
                } else {
                }
            }
        })
    }

    function sendRewardGift() {
        $.ajax({
            url: "/carnival/sendReward", type: "post", dataType: "json", success: function (result) {
                if (result.code == 0) {
                    $(".winter-gift-tit .tips").text(result.data.title);
                    $(".gift-latiao span, .gift-bekala span").text(result.data.expireat);
                    $(".gift-latiao i").text("x" + result.data.num1);
                    $(".gift-bekala i").text("X" + result.data.num2);
                    $(".mask").show();
                    $winPop.fadeIn()
                }
            }
        })
    }
});
(function () {
    function Dialog() {
        this.$el = {};
        this.doms = {};
        this.datas = {};
        this.init()
    }

    Dialog.prototype = {
        template: function () {
            return "" + '<div class="wish-dialog" id="wis-dialog">' + '<div class="dialog-main">' + '<div class="wish-top">' + '<div class="wish-top-icon"></div>' + '<span class="wish-ok-text"><a href="/lottery/lotteryResult" target="_blank" class="ok-target">愿望达成</a></span>' + "</div>" + '<div class="wish-main">' + '<p class="wish-des"> 在绘马上画上自己的心愿（人家才不知道什么痛绘马呢），说不定就能梦想成真。每晚21点会从许愿的用户中抽取中奖用户，购买越多则中奖概率和最终奖励也会相应增加！</p>' + '<div class="wish-prize">' + '<dl class="wish-prize-list">' + "<dt>中奖奖励</dt>" + "<dd>" + '一等奖 1份 <em class="prize-content"><span class="first-prize">' + this.formatNum(this.datas.first) + "</span>银瓜子</em>" + "</dd>" + "<dd>" + '二等奖 10份 <em class="prize-content">每份<span class="second-prize">' + this.formatNum(this.datas.second) + "</span>银瓜子</em>" + "</dd>" + "<dd>" + '三等奖 <em class="third-prize-num">' + this.datas.third + '</em>份 <em class="prize-content">每份B坷垃1个</em>' + "</dd>" + "</dl>" + "</div>" + '<div class="wish-set">' + '<div class="wish-num-box">' + '<p>绘马总数：<em class="wish-num" id="total-wish-num">' + this.datas.totalnum + "</em></p>" + '<p>我挂上的绘马：<em class="wish-num" id="my-wish-num">' + this.datas.num + "</em></p>" + "</div>" + '<div class="wish-buy">' + '<div class="wish-buy-content">' + '购买数量：<input type="text" class="ipt-num" value="1">' + '<span class="wish-buy-type">' + "<ul>" + '<li class="wish-buy-item"><input checked="checked" type="radio" name="buy-type" data-type="silver" id="type-silver"><label for="type-silver">银瓜子</label></li>' + '<li class="wish-buy-item"><input type="radio" name="buy-type" data-type="gold" id="type-gold"><label for="type-gold">金瓜子</label></li>' + "</ul>" + "</span>" + "</div>" + '<div class="wish-buy-tip"><span class="buy-tip-icon"></span>每个绘马需要2000银/金瓜子</div>' + "</div>" + '<div class="wish-set-btn">' + "挂绘马" + "</div>" + "</div>" + "</div>" + "</div>" + '<div class="close"></div>' + "</div>" + "" + ""
        },
        $dialog: "",
        $mask: "",
        csses: {
            iptNum: ".ipt-num",
            btnBuy: ".wish-set-btn",
            totalNum: "#total-wish-num",
            myNum: "#my-wish-num",
            firstNum: ".first-prize",
            secondNum: ".second-prize",
            thirdPrizeNum: ".third-prize-num"
        },
        init: function () {
            this.$el = $("<div style='opacity:0'></div>").appendTo("body");
            this.bindEvent()
        },
        render: function () {
            this.$el.html();
            this.$dialog = $(this.template());
            this.$mask = $("<div class='mask'></div>");
            this.$el.append(this.$dialog).append(this.$mask);
            this.setDoms()
        },
        setDoms: function () {
            var $el = this.$el, csses = this.csses;
            this.doms = {
                $iptNum: $(csses.iptNum, $el),
                $btnBuy: $(csses.btnBuy, $el),
                $totalNum: $(csses.totalNum, $el),
                $myNum: $(csses.myNum, $el),
                $firstNum: $(csses.firstNum, $el),
                $secondNum: $(csses.secondNum, $el),
                $thirdPrizeNum: $(csses.thirdPrizeNum, $el)
            }
        },
        show: function (data) {
            this.datas = data;
            this.render();
            this.setStyle();
            this.setPosition();
            this.$el.animate({opacity: 1}, 200)
        },
        hide: function () {
            var self = this;
            this.$el.animate({opacity: 0}, 200, function () {
                self.$el.html("").css("opacity", 1)
            })
        },
        setPosition: function () {
            var allWidth = document.documentElement.clientWidth, allHeight = document.documentElement.clientHeight, dialogWidth = this.$dialog.width(), dialogHeight = this.$dialog.height(), top, left, cssData;
            top = allHeight / 2 - dialogHeight / 2;
            left = allWidth / 2 - dialogWidth / 2;
            if (top < 0) {
                top = top * 2
            }
            cssData = {width: 750, position: "fixed", zIndex: 1100, left: left, top: top};
            this.$dialog.css(cssData)
        },
        setStyle: function () {
            var clientHeight = document.documentElement.clientHeight;
            if (clientHeight < 750) {
                this.$dialog.addClass("min-dialog")
            } else {
                this.$dialog.removeClass("min-dialog")
            }
        },
        buy: function () {
            var self = this, $coin = $("[name=buy-type]", this.$el).filter("[checked]"), coinType = $coin.data("type"), $num = this.doms.$iptNum, num = $num.val();
            if (!this.checkNum()) {
                $num.focus().addClass("error");
                (new MessageBox).show(self.doms.$btnBuy, "请输入正确的数字哦~ (●'◡'●)ﾉ♥")
            } else {
                this.ajaxBuy({coinType: coinType, num: num})
            }
        },
        ajaxBuy: function (param) {
            var self = this;
            $.ajax({
                type: "post",
                url: "/lottery/buy",
                data: {coinType: param.coinType, num: param.num, token: $.cookie("LIVE_LOGIN_DATA") || ""},
                success: function (data) {
                    var dataJSON = $.parseJSON(data);
                    if (dataJSON.code === 0) {
                        self.buySuccess(dataJSON.data)
                    } else {
                        self.buyError(dataJSON.msg)
                    }
                }
            })
        },
        buySuccess: function (data) {
            var self = this;
            (new MessageBox).show(this.doms.$btnBuy, "购买成功");
            refreshAccount(data);
            ajaxGetWishNum(function (data) {
                var doms = self.doms;
                doms.$totalNum.text(data.totalnum);
                doms.$myNum.text(data.num);
                doms.$firstNum.text(self.formatNum(data.first));
                doms.$secondNum.text(self.formatNum(data.second));
                doms.$thirdPrizeNum.text(data.third)
            })
        },
        buyError: function (msg) {
            (new MessageBox).show(this.doms.$btnBuy, msg)
        },
        checkNum: function () {
            var $num = this.doms.$iptNum, num = $num.val(), flag = true;
            if (!num || /[^0-9]/.test(num)) {
                flag = false
            }
            if (flag) {
                $num.removeClass("error")
            } else {
                $num.addClass("error")
            }
            return flag
        },
        formatNum: function (num) {
            var str = "", dotNum;
            if (num >= 1e4) {
                dotNum = num / 1e4;
                str = dotNum.toString().replace(/(\d+)(\.)?(\d+)/, function (a, b, c, d) {
                    var dot;
                    if (c) {
                        dot = d.toString().substring(0, 1);
                        return b + (dot == 0 ? "" : "." + dot)
                    } else {
                        return a
                    }
                });
                str += "万"
            } else {
                str = num
            }
            return str
        },
        bindEvent: function () {
            var self = this, doms = this.doms, $el = this.$el, resizeTid = 0;
            $el.on("keyup", ".ipt-num", function () {
                self.checkNum()
            });
            $el.on("click", ".wish-set-btn", function () {
                self.buy()
            });
            $el.on("click", ".close", function () {
                self.hide()
            });
            $el.on("click", ".mask", function () {
                self.hide()
            });
            $(window).resize(function () {
                if (resizeTid) {
                    clearTimeout(resizeTid)
                }
                resizeTid = setTimeout(function () {
                    if (self.$el.html()) {
                        self.setStyle();
                        self.setPosition()
                    }
                }, 50)
            })
        }
    };
    function refreshAccount(data) {
        reloadGoldenData(data.gold);
        reloadUserData(data.silver)
    }

    function ajaxGetWishNum(cb) {
        var cb = cb || function () {
            };
        $.ajax({
            url: "/lottery/index", cache: false, success: function (data) {
                var dataJSON = $.parseJSON(data);
                if (dataJSON.code === 0) {
                    cb(dataJSON.data)
                }
            }
        })
    }

    $(function () {
        var dialog = null;
        $("#open-wish").show().click(function () {
            liveQuickLogin();
            if (!dialog) {
                dialog = new Dialog
            }
            if (!dialog.$el.html()) {
                ajaxGetWishNum(function (data) {
                    dialog.show(data)
                })
            }
        })
    })
})();