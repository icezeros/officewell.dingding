/*
 * @Author: icezeros.
 * @Date: 2017-07-05 19:14:37.
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-06 17:05:46
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
      const query = this.ctx.query;
      console.log(body);
      console.log(this.ctx.query);
      const data = this.dTalkApiUtil.decrypt(body.encrypt);
      const obj = JSON.parse(data.message);
      console.log(obj);
      let result = 'success';
      if (obj.EventType === 'user_modify_org') {
        //   this.dingBody('success');
        // } else {
        // if (obj.EventType === 'user_add_org') {
        console.log('======================');
        console.log('======================');
        console.log('======================');
        console.log('======================');
        console.log(obj);

        const addResult = await this.ctx.service.userCallback.addUser(
          obj.CorpId,
          obj.UserId,
          obj.EventType
        );
        if (!addResult) {
          result = 'fail';
        }
      }
      this.dingBody(result);

      // if()
      console.log(data);
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
