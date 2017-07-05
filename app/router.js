'use strict';

module.exports = app => {
  // app.get('/', 'home.index');
  app.resources('dingcb', '/v1/dingcb', 'v1.dingcb');
  app.resources('userAddOrg', '/v1/user-add-org', 'v1.userAddOrg');
  app.resources('userLeaveOrg', '/v1/user-leave-org', 'v1.userLeaveOrg');
  app.resources('test', '/v1/test', 'v1.test');
  app.resources('home', '/', 'home');
};
