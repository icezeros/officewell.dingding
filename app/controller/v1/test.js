/*
 * @Author: icezeros
 * @Date: 2017-06-22 13:52:55
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 20:05:24
 */
'use strict';

module.exports = app => {
  class TestController extends app.Controller {
    async index() {
      this.ctx.service.orgDivision.authScopes({
        companyId: 'sdffsdf',
        corpId: 'ding95c7228d2de5ea6c35c2f4657eb6378f',
      });

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

      delete data.errcode;
      delete data.errmsg;
      this.ctx.body = await this.ctx.service.orgDivision.create(
        '595b4f00888a752476fa9855',
        data.data
      );
    }

    async update() {
      const result = await this.ctx.curl(
        'https://oapi.dingtalk.com/call_back/register_call_back?access_token=' +
          (await this.ctx.helper.getCorpToken(
            'ding95c7228d2de5ea6c35c2f4657eb6378f'
          )),
        {
          method: 'POST',
          contentType: 'json',
          data: {
            call_back_tag: ['user_add_org'],
            token: this.app.config.ddToken,
            aes_key: this.app.config.aesKey,
            url: 'http://47.93.50.25:7100/v1/use-add-org',
          },
          dataType: 'json',
        }
      );
      console.log(result);
      this.ctx.body = result.data;
    }
  }
  return TestController;
};
