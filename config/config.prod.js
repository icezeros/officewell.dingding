/*
 * @Author: icezeros
 * @Date: 2017-06-27 15:41:13
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-10 15:57:09
 */
'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1498109411281_6745';
  config.middleware = ['errorHandler'];

  config.mongoose = {
    url: 'mongodb://officewell:proofficewell2017@47.93.50.25:27017/officewell',
  };

  config.security = {
    csrf: {
      enable: false,
    },
  };

  return config;
};
