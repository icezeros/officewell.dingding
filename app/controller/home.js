'use strict';

module.exports = app => {
  class HomeController extends app.Controller {
    async index() {
      const aesMsg =
        '1a3NBxmCFwkCJvfoQ7WhJHB+iX3qHPsc9JbaDznE1i03peOk1LaOQoRz3+nlyGNhwmwJ3vDMG+OzrHMeiZI7gTRWVdUBmfxjZ8Ej23JVYa9VrYeJ5as7XM/ZpulX8NEQis44w53h1qAgnC3PRzM7Zc/D6Ibr0rgUathB6zRHP8PYrfgnNOS9PhSBdHlegK+AGGanfwjXuQ9+0pZcy0w9lQ==';
      const key = '4g5j64qlyl3zvetqxz5jiocdr586fn2zvjpa8zls3ij';
      const msg = this.decrypt(aesMsg, key);
      console.log('===     ', msg);
      const mm = this.encrypt(msg, key);
      console.log('===     ', mm);

      this.ctx.body = 'hi, egg';
    }
  }
  return HomeController;
};
