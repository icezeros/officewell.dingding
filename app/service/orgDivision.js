/*
 * @Author: icezeros
 * @Date: 2017-07-04 16:54:16
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 11:45:12
 */

'use strict';
module.exports = app => {
  class OrgDivision extends app.Service {
    async authScopes(corp) {
      const service = this;
      const { ctx } = service;
      const { helper } = ctx;
      console.log('corp.corpId', corp.corpId);

      const corpToken = await helper.getCorpToken(corp.corpId);
      console.log('corpToken', corpToken);

      const config = this.app.config;
      let departmentIds = [];
      let userIds = [];
      const urlResult = await this.urlGet(config.authScopesUrl, {
        access_token: corpToken,
      });
      // departmentIds.push("");
      // userIds.push("");

      departmentIds = departmentIds.concat(
        urlResult.data.auth_org_scopes.authed_dept
      );
      for (let i = 0; i < departmentIds.length; i++) {
        const tmpDepartUrl = await this.urlGet(config.departmentListUrl, {
          access_token: corpToken,
          id: departmentIds[i],
        });
        console.log('tmpDepartUrl.data', tmpDepartUrl.data);

        const tmpDepartIds = tmpDepartUrl.data.department.map(item => item.id);
        console.log('tmpDepartIds', tmpDepartIds);
        
        departmentIds.concat(tmpDepartIds);
      }

      userIds = userIds.concat(urlResult.data.auth_org_scopes.authed_user);
      console.log('departmentIds=======', departmentIds);
      console.log('userIds=======', userIds);
    }

    async initDepartments(corp, id) {
      const { ctx } = this;
      const { helper } = ctx;
      const corpToken = await helper.getCorpToken(corp.corpId);
      const config = this.app.config;
      const departList = await this.urlGet(config.departmentListUrl, {
        access_token: corpToken,
        id,
      });
    }

    async create(companyId, data) {
      const division = {
        name: data.name,
        companyId,
        ding: data,
      };
      return await this.ctx.model.OrgDivision.create(division);
    }

    dataFormat(companyId, data) {
      return {
        name: data.name,
        companyId,
        ding: data,
      };
    }

    async getDingDivision(corpId, id) {
      const { ctx } = this;
      const { helper } = ctx;
      const config = this.app.config;
      const corpToken = await helper.getCorpToken(corpId);
      const urlResult = await this.urlGet(config.getDepartmentUrl, {
        access_token: corpToken,
        id
      });
      if (urlResult.status === 200 && urlResult.errcode === 0) {
        return urlResult.data;
      }
      return false;
    }
  }
  return OrgDivision;
};
