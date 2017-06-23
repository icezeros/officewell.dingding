'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1498109411281_6745';
  config.middleware = [ 'errorHandler' ];
  config.ddToken = '123456';
  config.suiteKey = 'suitejrn329ssum6e2iki';
  config.aes_key = '5p95wcajc9no5p4v9ailj863u7gnf47zopkoj0vakl6';
  // config

  config.security = {
    csrf: {
      enable: false,
    },
  };

  return config;
};
