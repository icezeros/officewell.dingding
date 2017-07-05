/*
 * @Author: icezeros
 * @Date: 2017-06-22 13:32:31
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 13:38:09
 */

'use strict';
const moment = require('moment');
const crypto = require('crypto');
const dTalkApiUtil = require('./app/extend/util').DTalkCrypt;

module.exports = app => {
  app.beforeStart(function* () {
    // 应用会等待这个函数执行完成才启动
    app.logger.info(app.config.env);
  });

  app.validator.addRule('timestamp', (rule, value) => {
    try {
      if (!moment(Number(value) * 1000).isValid()) return 'must be timestamp';
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

    get dTalkApiUtil() {
      return new dTalkApiUtil(
        this.app.config.ddToken,
        this.app.config.aesKey,
        this.app.config.suiteKey
      );
    }

    /**
     * 加密方法
     * @param key 加密key
     * @param iv       向量
     * @param data     需要加密的数据
     * @returns string
     */

    encrypt(data, key) {
      data = JSON.stringify(data);
      key = new Buffer(key, 'base64');
      const iv = key.slice(0, 16);
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let randNum = Math.random();
      while (randNum < 0.1) {
        randNum = Math.random();
      }
      randNum = Math.floor(randNum * 10000000000000000).toString();

      let buf = new Buffer(randNum);
      // let buf = new Buffer('hU3bEfGZZewzhG5a');

      const aa = new Buffer(4);
      // aa.writeInt32BE(97);
      aa.writeInt32BE(data.length);

      buf += aa;

      buf += new Buffer(data);
      // buf += new Buffer(this.app.config.suiteKey);
      const bb = new Buffer(27);
      bb.write('suite4xxxxxxxxxxxxxxx');

      buf += bb;

      let crypted = cipher.update(buf, 'utf8', 'binary');
      crypted += cipher.final('binary');
      crypted = new Buffer(crypted, 'binary').toString('base64');
      return crypted;
    }

    decrypt(crypted, key) {
      crypted = new Buffer(crypted, 'base64');
      key = new Buffer(key, 'base64');
      const iv = key.slice(0, 16);
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      // const decoded = decipher.update(crypted, 'base64', 'utf8');
      const decoded = decipher.update(crypted).toString('utf8');
      // return decoded;
      let len = decoded.slice(16, 20);
      len = parseInt(new Buffer(len, 'utf8').toString('hex'), 16);
      const suiteKeyLength = this.app.config.suiteKey.length;
      const msg = decoded.slice(20).slice(0, '-' + suiteKeyLength);
      let obj;
      try {
        obj = JSON.parse(msg);
      } catch (error) {
        this.ctx.throw(401, '');
      }
      if (msg.length !== len) this.ctx.throw(401);
      return obj;
    }

    signatureValid(query, encrypt) {
      const sha1 = crypto.createHash('sha1');

      const array = [
        this.app.config.ddToken,
        query.timestamp,
        query.nonce,
        encrypt,
      ];
      const str = array.sort().join('');
      sha1.update(str);
      const result = sha1.digest('hex');
      if (result !== query.signature) {
        this.ctx.throw(409);
      }
      return true;
    }

    signatureGet(timestamp, nonce, encrypt) {
      const sha1 = crypto.createHash('sha1');
      const array = [this.app.config.ddToken, timestamp, nonce, encrypt];
      const str = array.sort().join('');
      sha1.update(str);
      return sha1.digest('hex');
    }
  }

  class CustomService extends app.Service {
    async urlGet(url, params) {
      let n = 0;
      let flag = true;
      let result;
      const ctx = this.ctx;


      // 网络请求出错时，重复10次
      while (flag && n < 10) {
        n++;
        result = await ctx.curl(url, {
          method: 'GET',
          contentType: 'json',
          data: params,
          dataType: 'json',
        });
        if (result.status === 200) {
          flag = false;
        }
      }
      return result;
    }
  }

  app.Controller = CustomController;
  app.Service = CustomService;
};
