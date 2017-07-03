/*
 * @Author: icezeros
 * @Date: 2017-07-03 13:49:47
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-03 15:40:52
 */
'use strict';
const _ = require('lodash');
const moment = require('moment');
const R = require('ramda');
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
  },
  async getSuiteToken() {
    const ctx = this.ctx;
    const config = this.app.config;
    let suiteToken;
    const dingSysInfo = await ctx.model.DingSysInfo.findOne({
      orgId: 'SYSTEM',
    });
    if (!dingSysInfo) {
      throw new Error('data err');
    }

    // 判断token是否超时
    if (
      !dingSysInfo.accessToken ||
      moment(dingSysInfo.accessToken.expire).isBefore(moment())
    ) {
      console.log({
        suite_key: config.suiteKey,
        suite_secret: config.suiteSecret,
        suite_ticket: dingSysInfo.suiteTicket,
      });

      const urlData = await ctx.curl(config.getSuiteAccessTokenUrl, {
        method: 'POST',
        contentType: 'json',
        data: {
          suite_key: config.suiteKey,
          suitesecret: config.suiteSecret,
          suite_ticket: dingSysInfo.suiteSecret,
        },
        dataType: 'json',
      });
      console.log(urlData.data);

      if (urlData.status === 200) {
        const accessToken = {
          accessToken: urlData.data.suite_access_token,
          expire: moment().add(urlData.data.expires_in - 100, 's'),
        };
        await ctx.model.DingSysInfo.update(
          { orgId: 'SYSTEM' },
          { accessToken }
        );
        suiteToken = accessToken.accessToken;
      }
    }
    suiteToken = dingSysInfo.accessToken.accessToken;

    return suiteToken;
  },
};
