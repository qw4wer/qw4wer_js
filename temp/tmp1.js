/**
 * Created by qw4wer on 2016/2/17.
 */
function t(e) {
    if (e && !(p.doms.chatArea.locked && e.info[2][0] != UID || e.info[2][0] == UID && e.info[0][5] == DANMU_RND)) {
        var t = '<div><div class="chat-msg" data-uname="' + e.info[2][1] + '" data-uid="' + e.info[2][0] + '">', o = "";
        if (1 == e.info[2][4] || e.info[2][0] == UID && 1 == SVIP ? o = "year" : (1 == e.info[2][3] || e.info[2][0] == UID && 1 == VIP) && (o = "month"), o && (t += '<a href="/i#to-vip" target="_blank"><span class="vip-icon"><i class="live-icon vip-color v-middle ' + o + '"></i></span></a>'), (1 == e.info[2][2] && e.info[2][0] == MASTERID || e.info[2][0] == UID && 1 == ISADMIN && UID == MASTERID) && (t += '<span class="square-icon master">播主</span>'), (1 == e.info[2][2] || e.info[2][0] == UID && 1 == ISADMIN) && e.info[2][0] != MASTERID && (t += '<span class="square-icon admin">房管</span>'), (e.info[2][0] == UID && !$.isEmptyObject(MEDAL) || e.info[3] && e.info[3].length) && (t = e.info[3] && e.info[3].length ? n({
                level: e.info[3][0],
                name: e.info[3][1],
                roomid: e.info[3][3],
                anchor: e.info[3][2]
            }, t) : n({
                level: MEDAL.level,
                name: MEDAL.medal_name,
                roomid: MEDAL.roomid,
                anchor: MEDAL.anchorName
            }, t)), e.info[2][0] != UID || $.isEmptyObject(TITLE) || (t += '<span class="live-title-icon ' + TITLE.title + '"></span>'), t.indexOf("live-title-icon") < 0 && e.info[5] && e.info[5].length && (t += '<span class="live-title-icon ' + e.info[5][0] + '"></span>'), e.info[2][0] == UID ? (!$.isEmptyObject(USER_LEVEL) && USER_LEVEL.level > 0 && (t += '<span class="user-level-icon lv-' + USER_LEVEL.level + '"><div class="user-level-info"><div class="content"><p>用户等级：' + USER_LEVEL.level + "</p><p>排名：" + USER_LEVEL.rank + "</p></div></div></span>"), t += '<span class="user-name">[自己] : </span>', t = t.replace('<div class="chat-msg"', '<div class="chat-msg mine"')) : ($.isArray(e.info[4]) && e.info[4].length > 0 && e.info[4][0] > 0 && (t += '<span class="user-level-icon lv-' + e.info[4][0] + '"><div class="user-level-info"><div class="content"><p>用户等级：' + e.info[4][0] + "</p><p>排名：" + e.info[4][1] + "</p></div></div></span>"), t += '<span class="user-name color">' + e.info[2][1] + " : </span>"), t += '<span class="msg-content">' + e.info[1] + "</span></div></div>", c.children().length > 100) {
            var i = c.children().first();
            i.remove().html(t), c.append(i), i = null
        } else c.append(t);
        !p.doms.mouseover && c.scrollTop(c[0].scrollHeight), t = null
    }
}