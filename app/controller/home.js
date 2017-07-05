/*
 * @Author: icezeros
 * @Date: 2017-06-22 13:52:55
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-04 19:02:15
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
      const query = this.ctx.query;
      this.ctx.body = (await this.ctx.curl(
        query.url +
          ((await this.ctx.helper.getCorpToken(
            'ding95c7228d2de5ea6c35c2f4657eb6378f'
          )) +
            query.data)
      )).data;
    }

    async create() {
      const query = this.ctx.query;
      const data = await this.ctx.curl(
        'https://oapi.dingtalk.com/department/get?access_token=' +
          ((await this.ctx.helper.getCorpToken(
            'ding95c7228d2de5ea6c35c2f4657eb6378f'
          )) +
            query.data),
        {
          dataType: 'json',
        }
      );
      console.log(data.data);

      delete data.errcode;
      delete data.errmsg;
      this.ctx.body = await this.ctx.service.orgDivision.create(
        '595b4f00888a752476fa9855',
        data.data
      );
    }

    async update() {
      await this.ctx.model.OrgDivision.update(
        { _id: '595b733be8e35f7584eedb05' },
        { name: '开发部11' }
      );
      this.ctx.body = '=======';
    }
  }
  return HomeController;
};
