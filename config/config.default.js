'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1498109411281_6745';
  config.middleware = [ 'errorHandler' ];
  config.ddToken = '123456';
  config.suiteKey = 'suite4xxxxxxxxxxxxxxx      ';
  config.aes_key = '4g5j64qlyl3zvetqxz5jiocdr586fn2zvjpa8zls3ij';
  // config

  config.security = {
    csrf: {
      enable: false,
    },
  };

  return config;
};
