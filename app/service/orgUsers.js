/*
 * @Author: icezeros
 * @Date: 2017-07-04 16:54:16
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 16:21:19
 */

"use strict";
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

    async initDepartmentUsers(corp, department_id) {
      const { ctx } = this;
      const { helper } = ctx;
      const config = this.app.config;
      console.log("corp-----", corp);

      const corpToken = await helper.getCorpToken(corp.corpId);
      const urlData = await this.urlGet(config.getDepartUserListUrl, {
        access_token: corpToken,
        department_id,
      });

      const simpleList = urlData.data.userlist;
      for (let i = 0; i < simpleList.length; i++) {
        const tmpUserId = simpleList[i].userid;
        const tmpUserUrl = await this.urlGet(config.getUser, {
          access_token: corpToken,
          userid: tmpUserId,
        });

        if (tmpUserUrl.data.errcode !== 0) {
          this.logger.error(
            "DingGetUserError:companyId:" +
              corp.companyId +
              simpleList +
              tmpUserUrl.data
          );
          continue;
        }
        const tmpUser = this.dataFormat(corp.companyId, tmpUserUrl.data);
        console.log("----------", tmpUser);

        const result = await this.ctx.model.DingUsers.findOneAndUpdate(
          { companyId: corp.companyId, userId: tmpUser.userId },
          tmpUser,
          { upsert: true }
        );
        console.log(result);
      }
    }

    dataFormat(companyId, data) {
      data.userId = data.userid;
      data.unionId = data.unionid;
      data.companyId = companyId;
      data.orderInDepts = strToJson(data.orderInDepts);
      data.isLeaderInDepts = strToJson(data.isLeaderInDepts);
      data.createdAt = new Date();

      delete data.userid;
      delete data.unionid;
      delete data.companyId;
      function strToJson(str) {
        const json = new Function("return " + str)();
        return json;
      }
      return data;
    }
  }
  return OrgUsers;
};
