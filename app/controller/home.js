/*
 * @Author: icezeros
 * @Date: 2017-06-22 13:52:55
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-03 19:48:16
 */
'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      // const aesMsg =
      //   '1a3NBxmCFwkCJvfoQ7WhJHB+iX3qHPsc9JbaDznE1i03peOk1LaOQoRz3+nlyGNhwmwJ3vDMG+OzrHMeiZI7gTRWVdUBmfxjZ8Ej23JVYa9VrYeJ5as7XM/ZpulX8NEQis44w53h1qAgnC3PRzM7Zc/D6Ibr0rgUathB6zRHP8PYrfgnNOS9PhSBdHlegK+AGGanfwjXuQ9+0pZcy0w9lQ==';
      // const key = '4g5j64qlyl3zvetqxz5jiocdr586fn2zvjpa8zls3ij';
      // const msg = this.decrypt(aesMsg, key);
      // console.log('===     ', msg);
      // const data = await this.dTalkApiUtil.encrypt('asdffasdfsf');
      // await this.ctx.service.callback.suiteTicket({ SuiteTicket: 'sdfs---fsg' });
      // const aa = await this.ctx.helper.getSuiteToken();
      const aa = await this.ctx.helper.getCorpToken(
        'ding95c7228d2de5ea6c35c2f4657eb6378f'
      );

      console.log(aa);
      this.ctx.body = 'data';
    }
    async show() {
      this.ctx.body = (await this.ctx.curl(
        'https://oapi.dingtalk.com/service/get_auth_info?suite_access_token=' +
          (await this.ctx.helper.getSuiteToken()),
        {
          method: 'POST',
          contentType: 'json',
          data: {
            suite_key: this.app.config.suiteKey,
            auth_corpid: 'ding95c7228d2de5ea6c35c2f4657eb6378f',
          },
          dataType: 'json',
        }
      )).data;
    }
  }
  return HomeController;
};
