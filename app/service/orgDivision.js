/*
 * @Author: icezeros
 * @Date: 2017-07-04 16:54:16
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-06 11:47:40
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
      // let userIds = [];
      const urlResult = await this.urlGet(config.authScopesUrl, {
        access_token: corpToken,
      });

      departmentIds = departmentIds.concat(
        urlResult.data.auth_org_scopes.authed_dept
      );
      for (let i = 0; i < departmentIds.length; i++) {
        this.initDepartments(corp, departmentIds[i]);
      }

      // userIds = userIds.concat(urlResult.data.auth_org_scopes.authed_user);
    }

    // 创建指定部门以及子部门的信息和用户信息
    async initDepartments(corp, id) {
      const { ctx } = this;
      const { helper } = ctx;
      const corpToken = await helper.getCorpToken(corp.corpId);
      const config = this.app.config;
      // 企业部门id数组
      let departmentIds = [id];
      const departments = [];
      // 用户表
      let userIds = [];
      // for (let i = 0; i < departmentIds.length; i++) {
      const tmpDepartUrl = await this.urlGet(config.departmentListUrl, {
        access_token: corpToken,
        id,
      });
      const tmpDepartIds = tmpDepartUrl.data.department.map(item => item.id);
      departmentIds = departmentIds.concat(tmpDepartIds);

      // }

      for (let i = 0; i < departmentIds.length; i++) {
        const departmentId = departmentIds[i];
        const departmentInfo = await this.getDingDivision(
          corpToken,
          corp.corpId,
          departmentId
        );
        const department = this.dataFormat(corp.companyId, departmentInfo);
        // departments.push(this.dataFormat(corp.companyId, departmentInfo));
        await this.ctx.model.OrgDivision.findOneAndUpdate(
          {
            companyId: corp.companyId,
            'ding.id': department.ding.id,
          },
          department,
          {
            new: true,
            upsert: true,
          }
        );

        await this.service.orgUsers.initDepartmentUsers(corp, departmentId);
      }
    }

    dataFormat(companyId, data) {
      delete data.errcode;
      delete data.errmsg;
      return {
        name: data.name,
        createdAt: new Date(),
        companyId,
        ding: data,
      };
    }

    // 从钉钉获取部门信息
    async getDingDivision(corpToken, corpId, id) {
      const config = this.app.config;
      const urlResult = await this.urlGet(config.getDepartmentUrl, {
        access_token: corpToken,
        id,
      });
      if (urlResult.status === 200 && urlResult.data.errcode === 0) {
        return urlResult.data;
      }
      return false;
    }
  }
  return OrgDivision;
};
