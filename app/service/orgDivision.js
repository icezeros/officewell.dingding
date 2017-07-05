/*
 * @Author: icezeros
 * @Date: 2017-07-04 16:54:16
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 13:35:49
 */

'use strict';
module.exports = app => {
  class OrgDivision extends app.Service {
    async authScopes(corp) {
      const { ctx } = this;
      const { helper } = ctx;
      // 获取企业token
      const corpToken = await helper.getCorpToken(corp.corpId);
      const config = this.app.config;
      // 企业部门id数组
      let departmentIds = [];
      // 用户表
      let userIds = [];
      const urlResult = await this.urlGet(config.authScopesUrl, {
        access_token: corpToken,
      });

      departmentIds = departmentIds.concat(
        urlResult.data.auth_org_scopes.authed_dept
      );
      console.log('==========', departmentIds);

      for (let i = 0; i < departmentIds.length; i++) {
        const tmpDepartUrl = await this.urlGet(config.departmentListUrl, {
          access_token: corpToken,
          id: departmentIds[i],
        });
        const tmpDepartIds = tmpDepartUrl.data.department.map(item => item.id);
        departmentIds = departmentIds.concat(tmpDepartIds);

      }

      for (let i = 0; i < departmentIds.length; i++) {
        const departmentInfo = await this.getDingDivision(corpToken, corp.corpId, departmentIds[i]);
        console.log(departmentInfo);
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

    async getDingDivision(corpToken, corpId, id) {
      const config = this.app.config;
      // const corpToken = await helper.getCorpToken(corpId);
      const urlResult = await this.urlGet(config.getDepartmentUrl, {
        access_token: corpToken,
        id,
      });
      if (urlResult.status === 200 && urlResult.errcode === 0) {
        delete urlResult.data.errcode;
        delete urlResult.data.errmsg;
        return urlResult.data;
      }
      return false;
    }
  }
  return OrgDivision;
};
