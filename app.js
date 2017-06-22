/*
 * @Author: hgs
 * @Date: 2017-06-22 13:32:31
 * @Last Modified by: hgs
 * @Last Modified time: 2017-06-22 13:39:57
 */

'use strict';
const moment = require('moment');

module.exports = app => {
  app.beforeStart(function* () {
    // 应用会等待这个函数执行完成才启动
    app.logger.info(app.config.env);
  });

  app.validator.addRule('DATE', (rule, value) => {
    try {
      if (!moment(Number(value) * 1000).isValid()) return 'must be date';
    } catch (err) {
      return 'must be json string';
    }
  });

  class CustomController extends app.Controller {
    success(data, status) {
      data = data || {};
      if (status) {
        this.ctx.status = status;
      } else {
        switch (this.ctx.method) {
          case 'GET':
            this.ctx.status = 200;
            break;
          case 'POST':
          case 'PUT':
            this.ctx.status = 201;
            break;
          case 'DELETE':
            this.ctx.status = 204;
            break;
          default:
            this.ctx.status = 200;
            break;
        }
      }
      this.ctx.body = {
        status: 'success',
        data,
      };
    }

    fail(msg, status, data) {
      msg = msg || 'not found';
      status = status || 400;
      // this.ctx.throw(402, msg);
      this.ctx.status = status;
      const body = {
        status: 'fail',
        message: msg,
      };
      if (data) {
        body.data = data;
      }
      this.ctx.body = body;
    }
    redirect() {
      this.ctx.body = 'test';
    }
  }

  app.Controller = CustomController;
};
