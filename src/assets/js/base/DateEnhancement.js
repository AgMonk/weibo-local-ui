Date.prototype.format = function (fmt) {
    let o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (let k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

Date.prototype.toDate = function () {
    return this.format("yyyy-MM-dd");
}

Date.prototype.toDateTime = function () {
    return this.format("yyyy-MM-dd hh:mm:ss");
}

Date.prototype.toTimestamp = function () {
    return this.format("yyyy-MM-dd hh:mm:ss.S");
}

Date.prototype.plusSecond = function (second) {
    return new Date(this.getTime() + second * 1000)
}
Date.prototype.plusMinutes = function (minute) {
    return this.plusSecond(60 * minute)
}
Date.prototype.plusHours = function (hour) {
    return this.plusMinutes(60 * hour)
}
Date.prototype.plusDays = function (day) {
    return this.plusHours(24 * day)
}

Date.prototype.minusSecond = function (second) {
    return new Date(this.getTime() - second * 1000)
}
Date.prototype.minusMinutes = function (minute) {
    return this.minusSecond(60 * minute)
}
Date.prototype.minusHours = function (hour) {
    return this.minusMinutes(60 * hour)
}
Date.prototype.minusDays = function (day) {
    return this.minusHours(24 * day)
}

Date.prototype.getTimeSeconds = function () {
    return Math.floor(this.getTime() / 1000)
}

Date.prototype.withUnixSeconds = function (time) {
    return new Date(time * 1000)
}

Date.prototype.toObj = function () {
    const res = {
        time: this.getTimeSeconds(),
        datetime: this.toDateTime(),
        date: this.toDate(),
    };
    const range = new Date().getTimeSeconds() - this.getTimeSeconds();
    if (range < 60) {
        res.before = `${range}秒前`;
    } else if (range < 60 * 60) {
        res.before = `${Math.floor(range / 60)}分钟前`;
    } else if (range < 60 * 60 * 24) {
        res.before = `${Math.floor(range / 60 / 6) / 10}小时前`;
    } else {
        res.before = `${Math.floor(range / 60 / 6 / 24) / 10}天前`;
    }

    return res
}