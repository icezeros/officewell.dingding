/*
 * @Author: hgs
 * @Date: 2017-06-22 13:52:55
 * @Last Modified by: hgs
 * @Last Modified time: 2017-06-26 10:53:13
 */
'use strict';

module.exports = app => {
  const createRule = {
    encrypt: 'string',
    signature: 'string',
    timestamp: 'timestamp',
    nonce: 'string',
  };
  class DingCbController extends app.Controller {
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
      const service = ctx.service.callback;
      const body = ctx.request.body;
      const query = ctx.query;
      query.encrypt = body.encrypt;
      ctx.validate(createRule, query);
      this.signatureValid(query, body.encrypt);
      // 解密
      const msg = this.dTalkApiUtil.decrypt(body.encrypt);

      if (msg.id !== this.app.config.suiteKey) ctx.throw(409);
      const obj = JSON.parse(msg.message);
      // if(obj.EventType === 'check_create_suite_url')
      let data;
      switch (obj.EventType) {
        // 套件注册事件
        case 'check_create_suite_url':
          data = await service.checkCreateSuiteUrl(obj);
          break;
        // 定时推送Ticket
        case 'suite_ticket':
          data = await service.checkCreateSuiteUrl(obj);
          break;
        // 企业授权微应用后推送临时授权码
        case 'tmp_auth_code':
          data = await service.checkCreateSuiteUrl(obj);
          break;
        // 授权变更后（如通讯录范围）
        case 'change_auth':
          data = await service.checkCreateSuiteUrl(obj);
          break;
        // 套件信息更新”事件）
        case 'check_update_suite_url':
          data = await service.checkCreateSuiteUrl(obj);
          break;
        // 解除授权
        case 'suite_relieve':
          data = await service.checkCreateSuiteUrl(obj);
          break;
        default:
          data = await service.checkCreateSuiteUrl(obj);
          break;
      }
      const aesMsg = this.dTalkApiUtil.encrypt(data);
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
      ctx.body = result;
    }
  }
  return DingCbController;
};
