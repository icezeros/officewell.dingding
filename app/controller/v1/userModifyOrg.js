/*
 * @Author: icezeros.
 * @Date: 2017-07-05 19:14:37.
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-06 17:12:44
 */

'use strict';

module.exports = app => {
  class UserModifyOrgController extends app.Controller {
    async index() {
      this.fail('No Method', 405);
    }
    async show() {
      this.fail('No Method', 405);
    }

    async create() {
      const body = this.ctx.request.body;
      // const query = this.ctx.query;
      const data = this.dTalkApiUtil.decrypt(body.encrypt);
      const obj = JSON.parse(data.message);
      let result = 'success';
      if (obj.EventType === 'user_modify_org') {
        //   this.dingBody('success');
        // } else {
        // if (obj.EventType === 'user_add_org') {

        const addResult = await this.ctx.service.updateCallback.addUser(
          obj.CorpId,
          obj.UserId,
          obj.EventType
        );
        if (!addResult) {
          result = 'fail';
        }
      }

      // if()
      this.dingBody(result);

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
  return UserModifyOrgController;
};
