/*
 * @Author: icezeros
 * @Date: 2017-07-04 16:54:16
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-04 17:54:17
 */

'use strict';
module.exports = app => {
  class OrgDivision extends app.Service {
    async create(companyId, data) {
      const division = {
        name: data.name,
        companyId,
        ding: data,
      };
      return await this.ctx.model.OrgDivision.create(division);
    }
  }
  return OrgDivision;
};
