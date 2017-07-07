/*
 * @Author: icezeros.
 * @Date: 2017-07-05 19:14:37.
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-06 20:33:58
 */

'use strict';

module.exports = app => {
  class UpdateCallbackController extends app.Controller {
    async index() {
      this.fail('No Method', 405);
    }
    async show() {
      this.fail('No Method', 405);
    }

    async create() {
      const body = this.ctx.request.body;
      // const query = this.ctx.query;
      console.log(body);
      console.log(this.ctx.query);
      const data = this.dTalkApiUtil.decrypt(body.encrypt);
      const obj = JSON.parse(data.message);
      console.log(obj);
      // const aesMsg = this.dTalkApiUtil.encrypt('success');

      let result;
      switch (obj.EventType) {
        case 'check_url':
          result = true;
          break;
        case 'user_modify_org':
        case 'org_admin_remove':
        case 'org_admin_add':
        case 'user_add_org':
          result = await this.ctx.service.updateCallback.addUser(
            obj.CorpId,
            obj.UserId,
            obj.EventType
          );
          break;
        case 'user_leave_org':
          result = await this.ctx.service.updateCallback.removeUser(
            obj.CorpId,
            obj.UserId
          );
          break;
        case 'org_dept_modify':
        case 'org_dept_create':
          result = await this.ctx.service.updateCallback.addOrUpDivision(
            obj.CorpId,
            obj.DeptId,
            obj.EventType
          );
          break;
        case 'org_dept_remove':
          result = await this.ctx.service.updateCallback.removeDivision(
            obj.CorpId,
            obj.DeptId
          );
          break;
        case 'org_remove':
          result = true;
          break;
        case 'org_change':
          result = true;
          break;
        default:
          result = true;
          break;
      }
      if (result) {
        this.dingBody('success');
      } else {
        this.dingBody('fail');
      }

      // this.ctx.body = result;
      // this.success('No Method');
    }

    async update() {
      this.fail('No Method', 405);
    }

    async destroy() {
      this.fail('No Method', 405);
    }
  }
  return UpdateCallbackController;
};
