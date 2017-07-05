/*
 * @Author: icezeros.
 * @Date: 2017-07-05 19:14:37.
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 20:32:53
 */

'use strict';

module.exports = app => {
  class UserAddOrgController extends app.Controller {
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
      const aesMsg = this.dTalkApiUtil.encrypt('success');

      let result;
      if (obj.EventType === 'check_url') {
        result = {
          msg_signature: this.dTalkApiUtil.getSignature(
            query.timestamp,
            query.nonce,
            aesMsg
          ),
          timeStamp: query.timestamp,
          nonce: query.nonce,
          encrypt: aesMsg,
        };
      }
      if (obj.EventType === 'user_add_org') {
      }
      // if()
      console.log(data);
      this.ctx.body = result;
      // this.success('No Method');
    }

    async update() {
      this.fail('No Method', 405);
    }

    async destroy() {
      this.fail('No Method', 405);
    }
  }
  return UserAddOrgController;
};
