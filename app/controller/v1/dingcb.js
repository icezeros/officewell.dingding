/*
 * @Author: icezeros
 * @Date: 2017-06-22 13:52:55
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-06 18:17:54
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
      const mm = this.encrypt(msg.Random, key);
      this.ctx.body = mm;
    }

    async create() {
      const { ctx } = this;
      const callbackService = ctx.service.callback;
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
      console.log(obj);

      switch (obj.EventType) {
        // 套件注册事件
        case 'check_create_suite_url':
          data = await callbackService.checkCreateSuiteUrl(obj);
          break;
        // 定时推送Ticket
        case 'suite_ticket':
          data = await callbackService.suiteTicket(obj);
          break;
        // 企业授权微应用后推送临时授权码
        case 'tmp_auth_code':
          data = await callbackService.tmpAuthCode(obj);
          break;
        // 授权变更后（如通讯录范围）
        case 'change_auth':
          data = await callbackService.changeAuth(obj);
          break;
        // 套件信息更新”事件）
        case 'check_update_suite_url':
          data = await callbackService.checkUpdateSuiteUrl(obj);
          break;
        // 解除授权
        case 'suite_relieve':
          data = await callbackService.suiteRelieve(obj);
          break;
        default:
          data = await callbackService.checkCreateSuiteUrl(obj);
          break;
      }
      this.dingBody(data);
    }
  }
  return DingCbController;
};
