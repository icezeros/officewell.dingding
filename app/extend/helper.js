/*
 * @Author: icezeros
 * @Date: 2017-07-03 13:49:47
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 18:09:24
 */
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
  },

  // 获取suiteToken
  async getSuiteToken() {
    const ctx = this.ctx;
    const config = this.app.config;
    let suiteToken;
    const dingSysInfo = await ctx.model.DingSysInfo.findOne({
      orgId: "SYSTEM"
    });
    if (!dingSysInfo) {
      throw new Error("data err");
    }

    // 判断token是否超时
    if (
      !dingSysInfo.accessToken ||
      moment(dingSysInfo.accessToken.expire).isBefore(moment())
    ) {
      const urlData = await ctx.curl(config.getSuiteAccessTokenUrl, {
        method: "POST",
        contentType: "json",
        data: {
          suite_key: config.suiteKey,
          suite_secret: config.suiteSecret,
          suite_ticket: dingSysInfo.suiteTicket
        },
        dataType: "json"
      });
      if (urlData.status === 200) {
        const accessToken = {
          accessToken: urlData.data.suite_access_token,
          expire: moment().add(urlData.data.expires_in - 100, "s")
        };
        await ctx.model.DingSysInfo.update(
          { orgId: "SYSTEM" },
          { accessToken }
        );
        suiteToken = accessToken.accessToken;
      }
    } else {
      suiteToken = dingSysInfo.accessToken.accessToken;
    }

    return suiteToken;
  },

  // 获取企业suiteToken
  async getCorpToken(corpId) {
    const ctx = this.ctx;
    const config = this.app.config;
    let corpToken;
    const dingOrgInfo = await ctx.model.OrgCompany.findOne({
      "ding.corpId": corpId
    });
    if (!dingOrgInfo) {
      throw new Error("data err");
    }

    console.log("dingOrgInfo======", dingOrgInfo);

    // 判断token是否超时
    if (
      !dingOrgInfo.ding.accessToken ||
      moment(dingOrgInfo.ding.accessToken.expire).isBefore(moment())
    ) {
      console.log("--------token-------");

      const suiteToken = await this.getSuiteToken();
      const urlData = await ctx.curl(
        config.getCorpTokenUrl + "?suite_access_token=" + suiteToken,
        {
          method: "POST",
          contentType: "json",
          data: {
            auth_corpid: corpId,
            permanent_code: dingOrgInfo.ding.permanentCode
          },
          dataType: "json"
        }
      );
      console.log("urlData.data======", urlData.data);

      if (urlData.status === 200) {
        const accessToken = {
          accessToken: urlData.data.access_token,
          expire: moment().add(urlData.data.expires_in - 100, "s")
        };
        await ctx.model.OrgCompany.update(
          { "ding.corpId": corpId },
          {
            "ding.accessToken": accessToken
          }
        );
        corpToken = accessToken.accessToken;
      }
    } else {
      corpToken = dingOrgInfo.ding.accessToken.accessToken;
    }

    return corpToken;
  }
};
