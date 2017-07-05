/*
 * @Author: icezeros
 * @Date: 2017-07-04 16:54:16
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 15:17:56
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

    async initDepartmentUsers(corp, department_id) {
      const { ctx } = this;
      const { helper } = ctx;
      const config = this.app.config;
      const corpToken = await helper.getCorpToken(corp.corpId);
      const urlData = await this.urlGet(config.getDepartUserListUrl, {
        corpToken,
        department_id,
      });

      const simpleList = urlData.data.userlist;
      for (let i = 0; i < simpleList.length; i++) {
        const tmpUserUrl = this.urlGet(config.getUser, {
          corpToken,
          userid: simpleList.userid,
        });
        if (tmpUserUrl.data.errcode !== 0) {
          this.logger.error('DingGetUserError:companyId:' + corp.companyId + + simpleList + tmpUserUrl.data)
          continue;
        }
        const tmpUser = this.dataFormat(corp.companyId, tmpUserUrl.data)
        const result = await this.DingUsers.findOneAndUpdate({
          companyId: corp.companyId,
          userId: tmpUser,
        });
        console.log(result);

      }

    }

    dataFormat(companyId, data) {
      data.userId = data.userid;
      data.unionId = data.unionid;
      data.companyId = companyId;
      delete data.userid;
      delete data.unionid;
      delete data.companyId;
      return data;
    }
  }
  return OrgUsers;
};
