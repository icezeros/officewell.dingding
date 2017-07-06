/*
 * @Author: icezeros
 * @Date: 2017-07-04 16:54:16
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-06 11:47:55
 */

'use strict';
module.exports = app => {
  class OrgUsers extends app.Service {
    async create(companyId, data) {
      data.userId = data.userid;
      data.unionId = data.unionid;
      data.companyId = companyId;
      delete data.userid;
      delete data.unionid;
      delete data.companyId;
      return await this.ctx.model.DingUsers.create(data);
    }

    async initDepartmentUsers(corp, departmentId) {
      const { ctx } = this;
      const { helper } = ctx;
      const config = this.app.config;
      console.log('corp-----', corp);

      const corpToken = await helper.getCorpToken(corp.corpId);
      const urlData = await this.urlGet(config.getDepartUserListUrl, {
        access_token: corpToken,
        department_id: departmentId,
      });

      const simpleList = urlData.data.userlist;
      for (let i = 0; i < simpleList.length; i++) {
        const tmpUserId = simpleList[i].userid;
        const tmpUser = await this.getUser(
          corpToken,
          corp.companyId,
          tmpUserId
        );
        if (!tmpUser) {
          this.logger.error(
            '初始化同步数据错误:company' + corp.companyId + 'userId' + tmpUserId
          );
          continue;
        }
        tmpUser.createdAt = new Date();

        const result = await this.ctx.model.DingUsers.findOneAndUpdate(
          { companyId: corp.companyId, userId: tmpUser.userId },
          tmpUser,
          {
            new: true,
            upsert: true,
          }
        );
        console.log(result);
      }
    }

    async getUser(accessToken, companyId, userId) {
      const config = this.app.config;
      const tmpUserUrl = await this.urlGet(config.getUser, {
        access_token: accessToken,
        userid: userId,
      });

      if (tmpUserUrl.data.errcode !== 0) {
        this.logger.error(
          'DingGetUserError:company' + companyId + 'userId' + userId
        );
        return false;
      }
      console.log('companyId', companyId);
      console.log('tmpUserUrl.data', tmpUserUrl.data);

      return this.dataFormat(companyId, tmpUserUrl.data);
    }

    dataFormat(companyId, data) {
      data.userId = data.userid;
      data.unionId = data.unionid;
      data.companyId = companyId;
      data.orderInDepts = strToJson(data.orderInDepts);
      data.isLeaderInDepts = strToJson(data.isLeaderInDepts);
      // data.createdAt = new Date();

      delete data.userid;
      delete data.unionid;
      function strToJson(str) {
        const json = new Function('return ' + str)();
        return json;
      }
      return data;
    }
  }
  return OrgUsers;
};
