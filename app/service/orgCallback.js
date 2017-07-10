/*
 * @Author: icezeros
 * @Date: 2017-06-23 20:18:56
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-10 11:58:21
 */

'use strict';
module.exports = app => {
  class UserCallback extends app.Service {
    /**
     * 用户增加事件
     *
     * @param {string} corpId          corpId
     * @param {array} userIds         userId数组
     * @param {string} eventType      回调类型
     * @return {boj} data.Random    需要加密的返回数据
     * @memberof UserCallback
     */
    async addUser(corpId, userIds, eventType) {
      const helper = this.ctx.helper;
      const service = this.service;
      const corpToken = await helper.getCorpToken(corpId);
      const company = await this.ctx.model.OrgCompany.findOne({
        'ding.corpId': corpId,
      });
      const companyId = company._id;
      for (let i = 0; i < userIds.length; i++) {
        const tmpUser = await service.orgUsers.getUser(
          corpToken,
          companyId,
          userIds[i]
        );
        if (!tmpUser) {
          this.logger.error(
            eventType + ' 用户失败:companyId ' + companyId + ' userId' + userIds[i]
          );
          continue;
        }
        delete tmpUser.createdAt;
        tmpUser.disabled = false;
        switch (eventType) {
          case 'user_add_org':
            tmpUser.createdAt = new Date();
            break;
          case 'user_modify_org':
            tmpUser.modifiedAt = new Date();
            break;
          default:
            tmpUser.modifiedAt = new Date();
            break;
        }
        await this.ctx.model.DingUsers.findOneAndUpdate(
          { companyId, userId: tmpUser.userId },
          tmpUser,
          {
            new: true,
            upsert: true,
          }
        );
        // await this.ctx.model.DingUsers.create(tmpUser);
      }
      return true;
    }

    async removeUser(corpId, userIds) {
      // const helper = this.ctx.helper;
      // const corpToken = await helper.getCorpToken(corpId);
      const company = await this.ctx.model.OrgCompany.findOne({
        'ding.corpId': corpId,
      });
      const companyId = company._id;
      const tmp = await this.ctx.model.DingUsers.updateMany(
        {
          companyId,
          userId: userIds,
        },
        {
          disabled: true,
        }
      );
      if (tmp.result.ok !== 1) {
        return false;
      }
      return true;
    }
  }
  return UserCallback;
};
