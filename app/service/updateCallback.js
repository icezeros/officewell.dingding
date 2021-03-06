/*
 * @Author: icezeros
 * @Date: 2017-06-23 20:18:56
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-10 11:58:46
 */

'use strict';
module.exports = app => {
  class UpdateCallback extends app.Service {
    /**
     * 用户增加事件
     *
     * @param {string} corpId      corpId
     * @param {array} userIds     userId数组
     * @param {string} eventType   eventType回调类型
     * @return {boj} boolean    需要加密的返回数据
     * @memberof UpdateCallback
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
      const helper = this.ctx.helper;
      const corpToken = await helper.getCorpToken(corpId);
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

    async addOrUpDivision(corpId, DeptIds, eventType) {
      const helper = this.ctx.helper;
      const service = this.service;
      const corpToken = await helper.getCorpToken(corpId);
      const company = await this.ctx.model.OrgCompany.findOne({
        'ding.corpId': corpId,
      });
      const companyId = company._id;

      for (let i = 0; i < DeptIds.length; i++) {
        const tmpDivision = await service.orgDivision.getDingDivision(
          corpToken,
          companyId,
          DeptIds[i]
        );
        if (!tmpDivision) {
          this.logger.error(
            eventType + ' 部门失败:companyId ' + companyId + ' userId' + DeptIds[i]
          );
          continue;
        }
        delete tmpDivision.createdAt;
        tmpDivision.disabled = false;
        switch (eventType) {
          case 'user_add_org':
            tmpDivision.createdAt = new Date();
            break;
          case 'user_modify_org':
            tmpDivision.modifiedAt = new Date();
            break;
          default:
            tmpDivision.modifiedAt = new Date();
            break;
        }
        await this.ctx.model.OrgDivision.findOneAndUpdate(
          { companyId, 'ding.id': tmpDivision.ding.id },
          tmpDivision,
          {
            new: true,
            upsert: true,
          }
        );
        // await this.ctx.model.DingUsers.create(tmpUser);
      }
      return true;
    }

    async removeDivision(corpId, DeptIds) {
      const company = await this.ctx.model.OrgCompany.findOne({
        'ding.corpId': corpId,
      });
      const companyId = company._id;
      const tmp = await this.ctx.model.OrgDivision.remove({
        companyId,
        'ding.id': DeptIds,
      });

      if (tmp.result.ok !== 1) {
        return false;
      }
      return true;
    }
  }
  return UpdateCallback;
};
