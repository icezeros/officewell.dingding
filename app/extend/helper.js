"use strict";
const _ = require("lodash");
const moment = require("moment");
const R = require("ramda");
// _.moment = moment;
module.exports = {
  get _() {
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
    if (!this[_]) {
      // 实际情况肯定更复杂
      this[_] = _;
    }
    return this[_];
  },
  get R() {
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
    if (!this[R]) {
      // 实际情况肯定更复杂
      this[R] = R;
    }
    return this[R];
  },
  get moment() {
    return moment;
  },

  timeConvert(time) {
    if (!moment(time).isValid()) return false;

    return moment(time) / 1000;
  },

  timeDeConvert(time) {
    time = Number(time) * 1000;
    if (!moment(time).isValid()) return false;

    return time;
  }
};
