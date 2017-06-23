/*
 * @Author: hgs
 * @Date: 2017-06-22 13:52:55
 * @Last Modified by: hgs
 * @Last Modified time: 2017-06-23 18:11:54
 */
'use strict';

module.exports = app => {
  const createRule = {
    encrypt: 'string',
    signature: 'string',
    timestamp: 'timestamp',
    nonce: 'string',
  };
  class HomeController extends app.Controller {
    async index() {
      const aesMsg =
        '1a3NBxmCFwkCJvfoQ7WhJHB+iX3qHPsc9JbaDznE1i03peOk1LaOQoRz3+nlyGNhwmwJ3vDMG+OzrHMeiZI7gTRWVdUBmfxjZ8Ej23JVYa9VrYeJ5as7XM/ZpulX8NEQis44w53h1qAgnC3PRzM7Zc/D6Ibr0rgUathB6zRHP8PYrfgnNOS9PhSBdHlegK+AGGanfwjXuQ9+0pZcy0w9lQ==';
      // const aesMsg = 'ClskN5PFdfuTOlfWVp8GEuUrBf1Uagiu+29aimRYpB8CkFKVLJV0+IXkYWoUIQ1gXaICQ4GxL8E5Ry9Ie+MsUw==';
      const key = '4g5j64qlyl3zvetqxz5jiocdr586fn2zvjpa8zls3ij';
      const msg = this.decrypt(aesMsg, key);
      console.log('===     ', msg);
      const mm = this.encrypt(msg.Random, key);
      console.log('===     ', mm);

      this.ctx.body = mm;
    }

    async create() {
      const { ctx } = this;
      const body = ctx.request.body;
      console.log('body===', body);
      const query = ctx.query;
      console.log('query===', query);

      query.encrypt = body.encrypt;
      ctx.validate(createRule, query);
      this.signatureValid(query, body.encrypt);
      // const key = '4g5j64qlyl3zvetqxz5jiocdr586fn2zvjpa8zls3ij';
      // const msg = this.decrypt(body.encrypt, this.app.config.aes_key);
      const msg = this.dTalkApiUtil.decrypt(body.encrypt);
      console.log('msg===', msg.message);
      const obj = JSON.parse(msg.message);
      const aesMsg = this.dTalkApiUtil.encrypt(obj.Random);
      const timestamp = ctx.helper.moment().format('x');
      const nonce = '123456';
      const result = {
        msg_signature: this.dTalkApiUtil.getSignature(
          query.timestamp,
          query.nonce,
          aesMsg
        ),
        timeStamp: query.timestamp,
        nonce: query.nonce,
        encrypt: aesMsg,
      };

      console.log('result===', result);

      // const msg2 = this.decrypt(aesMsg, key);
      ctx.body = result;
      // this.success(result);
    }
  }
  return HomeController;
};
