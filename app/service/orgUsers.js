/*
 * @Author: icezeros
 * @Date: 2017-07-04 16:54:16
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-04 20:33:34
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
