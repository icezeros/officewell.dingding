'use strict';

module.exports = app => {
  // app.get('/', 'home.index');
  app.resources('dingcb', '/v1/dingcb', 'v1.dingcb');
  app.resources('home', '/', 'home');
};
