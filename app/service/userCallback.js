/*
 * @Author: icezeros
 * @Date: 2017-06-23 20:18:56
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-06 00:58:26
 */

'use strict';
module.exports = app => {
  class UserCallback extends app.Service {
    /**
     * 用户增加事件
     *
     * @param {boj} data            钉钉POST解密后的数据
     * @return {boj} data.Random    需要加密的返回数据
     * @memberof UserCallback
     */
    async addUser(corpId, userIds, eventType) {
      const helper = this.ctx.helper;
      const config = this.app.config;
      const service = this.service;
      const corpToken = await helper.getCorpToken(corpId);
      const company = await this.ctx.model.OrgCompany.findOne({
        'ding.corpId': corpId,
      });
      const companyId = company._id;
      console.log(corpToken);
      console.log(company);

      for (let i = 0; i < userIds.length; i++) {
        const tmpUser = await service.orgUsers.getUser(
          corpToken,
          companyId,
          userIds[i]
        );
        console.log(tmpUser);

        if (!tmpUser) {
          this.logger.error(
            '新增用户失败:company' + companyId + ' userId' + userIds[i]
          );
          continue;
        }
        delete tmpUser.createdAt;
        switch (eventType) {
          case 'user_add_org':
            tmpUser.createdAt = new Date();
            break;
          case 'user_leave_org':
            tmpUser.disabled = true;
            break;
          case 'user_modify_org':
            tmpUser.modifiedAt = new Date();
            break;
          default:
            break;
        }
        await this.ctx.model.DingUsers.findOneAndUpdate(
          { companyId, userId: tmpUser.userId },
          tmpUser,
          { upsert: true }
        );
        // await this.ctx.model.DingUsers.create(tmpUser);
      }
      return true;
    }
  }
  return UserCallback;
};
