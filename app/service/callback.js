/*
 * @Author: icezeros
 * @Date: 2017-06-23 20:18:56
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-03 17:14:43
 */

'use strict';
module.exports = app => {
  class Callback extends app.Service {
    /**
     * 套件注册事件
     *
     * @param {boj} data            钉钉POST解密后的数据
     * @return {boj} data.Random    需要加密的返回数据
     * @memberof Callback
     */
    async checkCreateSuiteUrl(data) {
      return data.Random;
    }

    /**
     * 定时推送Ticket
     *
     * @param {boj} data            钉钉POST解密后的数据
     * @return {boj} data.Random    需要加密的返回数据
     * @memberof Callback
     */
    async suiteTicket(data) {
      let result = await this.ctx.model.DingSysInfo.findOneAndUpdate(
        { orgId: 'SYSTEM' },
        { suiteTicket: data.SuiteTicket }
      );
      if (!result) {
        result = await this.ctx.model.DingSysInfo.create({
          orgId: 'SYSTEM',
          SuiteTicket: data.SuiteTicket,
        });
      }
      if (!result) {
        return 'fail';
      }
      return 'success';
    }

    /**
     * 企业授权微应用后推送临时授权码
     *
     * @param {boj} data            钉钉POST解密后的数据
     * @return {boj} data.Random    需要加密的返回数据
     * @memberof Callback
     */
    async tmpAuthCode(data) {
      console.log('data', data);

      const ctx = this.ctx;
      const helper = ctx.helper;
      const config = this.app.config;

      // 企业临时授权码
      const AuthCode = data.AuthCode;
      const suiteToken = await helper.getSuiteToken;
      console.log(
        'config.getPermanentCodeUrl?suite_access_token=' + suiteToken
      );

      const urlResult = await ctx.curl(
        config.getPermanentCodeUrl + '?suite_access_token=' + suiteToken,
        {
          method: 'POST',
          contentType: 'json',
          data: {
            tmp_auth_code: AuthCode,
          },
          dataType: 'json',
        }
      );
      console.log('urlResult.data', urlResult.data);

      const urlData = urlResult.data;
      // 将企业永久授权码等企业信息保存到mongodb中
      const orgData = ctx.model.DingOrgInfo.create({
        permanentCode: urlData.permanent_code,
        chPermanentCode: urlData.ch_permanent_code,
        authCorpInfo: urlData.auth_corp_info,
        corpid: urlData.auth_corp_info.corpid,
        corpName: urlData.auth_corp_info.corp_name,
      });

      return 'success';
    }
    async changeAuth(data) {
      return data;
    }
    async checkUpdateSuiteUrl(data) {
      return data.Random;
    }
    async suiteRelieve(data) {
      return data;
    }
    async default(data) {
      return data;
    }
  }
  return Callback;
};
