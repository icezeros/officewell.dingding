/*
 * @Author: icezeros
 * @Date: 2017-06-27 15:41:13
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-03 13:30:40
 */
'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1498109411281_6745';
  config.middleware = [ 'errorHandler' ];
  config.ddToken = 'sdfg7dh74g9DG7d';
  config.suiteKey = 'suitejrn329ssum6e2iki';
  config.aesKey = '5p95wcajc9no5p4v9ailj863u7gnf47zopkoj0vakl6';
  config.suiteSecret =
    'CgSxWaHy0faBelBWZrJlETAC2XPcdWk4R4Leun1POmH_YjY7z1rZpuDaLIN_4FeJ';
  //获取套件访问token URL
  config.getSuiteAccessTokenUrl = 'https://oapi.dingtalk.com/service/get_suite_token';

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
