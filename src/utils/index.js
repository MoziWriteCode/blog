/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time) {
  if (time) {
    var date = new Date(time);
    var year = date.getFullYear();
    /* 在日期格式中，月份是从0开始的，因此要加0
     * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
     * */
    var month =
      date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1;
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var minutes =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    var seconds =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
    // 拼接
    return (
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  } else {
    return "";
  }
}

export function formatMsgTime(timespan) {
  let now = new Date().getTime(),
    diffValue = now - parseInt(timespan),
    result = "",
    minute = 1000 * 60,
    hour = minute * 60,
    day = hour * 24,
    month = day * 30,
    year = month * 12,
    _year = diffValue / year,
    _month = diffValue / month,
    _week = diffValue / (7 * day),
    _day = diffValue / day,
    _hour = diffValue / hour,
    _min = diffValue / minute;

  if (_year >= 1) {
    result = parseInt(_year) + "年前";
  } else if (_month >= 1) {
    result = parseInt(_month) + "个月前";
  } else if (_week >= 1) {
    result = parseInt(_week) + "周前";
  } else if (_day >= 1) {
    result = parseInt(_day) + "天前";
  } else if (_hour >= 1) {
    result = parseInt(_hour) + "个小时前";
  } else if (_min >= 1) {
    result = parseInt(_min) + "分钟前";
  } else {
    result = "刚刚";
  }
  return result;
}

export function formatDuring(mss) {
  mss = new Date().getTime() - mss;
  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = (mss % (1000 * 60)) / 1000;
  return (
    days + " 天 " + hours + " 小时 " + minutes + " 分钟 " + seconds + " 秒 "
  );
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

// 替换邮箱字符
export function regEmail(email) {
  if (String(email).indexOf("@") > 0) {
    const str = email.split("@");
    let _s = "";
    if (str[0].length > 3) {
      for (var i = 0; i < str[0].length - 3; i++) {
        _s += "*";
      }
    }
    var new_email = str[0].substr(0, 3) + _s + "@" + str[1];
  }
  return new_email;
}

// 替换手机字符
export function regMobile(mobile) {
  if (mobile.length > 7) {
    var new_mobile = mobile.substr(0, 3) + "****" + mobile.substr(7);
  }
  return new_mobile;
}
