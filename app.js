/*
 * @Author: hgs
 * @Date: 2017-06-22 13:32:31
 * @Last Modified by: hgs
 * @Last Modified time: 2017-06-22 13:51:57
 */

'use strict';
const moment = require('moment');
const crypto = require('crypto');

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

    /**
     * 加密方法
     * @param key 加密key
     * @param iv       向量
     * @param data     需要加密的数据
     * @returns string
     */
    encrypt(data, key) {
      key = new Buffer(key, 'base64');
      const iv = key.slice(0, 16);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let crypted = cipher.update(data, 'utf8', 'binary');
      crypted += cipher.final('binary');
      crypted = new Buffer(crypted, 'binary').toString('base64');
      return crypted;
    }

    decrypt(crypted, key) {
      // const key = new Buffer(mkey, 'base64');

      // const aesMsg = new Buffer(mAesMsg, 'base64');

      // const decipher = crypto.createDecipheriv(
      //   'aes-256-cbc',
      //   key,
      //   key.slice(0, 16)
      // );
      crypted = new Buffer(crypted, 'base64');
      key = new Buffer(key, 'base64');
      const iv = key.slice(0, 16);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      // const decoded = decipher.update(crypted, 'base64', 'utf8');
      const decoded = decipher.update(crypted).toString('utf8');
      return decoded;
      // let len = decoded.slice(16, 20);
      // len = parseInt(new Buffer(len, 'utf8').toString('hex'), 16);
      // const msg = decoded.slice(20).slice(0, -27);
      // let obj;
      // try {
      //   obj = JSON.parse(msg);
      // } catch (error) {
      //   this.ctx.throw(401, '');
      // }
      // if (msg.length !== len) this.ctx.throw(401);
      // return obj;
    }
  }

  app.Controller = CustomController;
};
