/*
 * @Author: icezeros
 * @Date: 2017-06-22 13:52:55
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 11:22:26
 */
'use strict';

module.exports = app => {
  class TestController extends app.Controller {
    async index() {
      this.ctx.service.orgDivision.authScopes({ corp: 'ding95c7228d2de5ea6c35c2f4657eb6378f' });

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
  return TestController;
};
