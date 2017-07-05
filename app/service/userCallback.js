/*
 * @Author: icezeros
 * @Date: 2017-06-23 20:18:56
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 23:36:14
 */

'use strict';
module.exports = app => {
  class UserCallback extends app.Service {
    /**
     * 套件注册事件
     *
     * @param {boj} data            钉钉POST解密后的数据
     * @return {boj} data.Random    需要加密的返回数据
     * @memberof UserCallback
     */
    async addUser(corpId, userIds) {
      const helper = this.ctx.helper;
      const config = this.app.config;
      const service = this.service;
      const corpToken = await helper.getCorpToken(corpId);
      const company = await this.ctx.model.OrgCompany.findOne({
        'ding.corpId': corpId,
      });
      console.log(corpToken);
      console.log(company);

      for (let i = 0; i < userIds.length; i++) {
        const tmpUser = await service.orgUsers.getUser(
          corpToken,
          company._id,
          userIds[i]
        );
        console.log(tmpUser);

        if (!tmpUser) {
          this.logger.error(
            '新增用户失败:company' + company._id + ' userId' + userIds[i]
          );
          continue;
        }
        await this.ctx.model.DingUsers.create(tmpUser);
      }
      return true;
    }
  }
  return UserCallback;
};
