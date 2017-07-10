'use strict';

module.exports = app => {
  // app.get('/', 'home.index');
  app.resources('dingcb', '/v1/dingcb', 'v1.dingcb');
  app.resources('updateCallback', '/v1/update-callback', 'v1.updateCallback');
  app.resources('test', '/v1/test', 'v1.test');
  app.resources('home', '/', 'home');
};
