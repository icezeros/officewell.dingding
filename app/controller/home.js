/*
 * @Author: hgs
 * @Date: 2017-06-22 13:52:55
 * @Last Modified by: hgs
 * @Last Modified time: 2017-06-23 17:36:32
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
      const data = this.dTalkApiUtil.encrypt('asdffasdfsf');
      console.log(data);

      // const mm = this.encrypt('{"EventType":"check_create_suite_url","Random":"LPIdSnlF","TestSuiteKey":"suite4xxxxxxxxxxxxxxx"}', key);
      // console.log('---     ', mm);

      // const msg = this.decrypt(mm, key);
      // console.log('===     ', msg);

      this.ctx.body = data;
    }
  }
  return HomeController;
};
