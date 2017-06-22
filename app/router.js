'use strict';

module.exports = app => {
  app.get('/', 'home.index');
  app.resources('verification', '/v1/verification', 'v1.verification');
};
