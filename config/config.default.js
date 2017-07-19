/*
 * @Author: icezeros
 * @Date: 2017-06-27 15:41:13
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-07 17:27:27
 */
'use strict';

module.exports = appInfo => {
  const config = {};

  // should change to your own
  config.keys = appInfo.name + '_1498109411281_6745';
  config.middleware = ['errorHandler'];
  config.ddToken = 'sdfg7dh74g9DG7d';
  config.suiteKey = 'suitejrn329ssum6e2iki';
  config.aesKey = '5p95wcajc9no5p4v9ailj863u7gnf47zopkoj0vakl6';
  config.suiteSecret = 'CgSxWaHy0faBelBWZrJlETAC2XPcdWk4R4Leun1POmH_YjY7z1rZpuDaLIN_4FeJ';
  // 获取套件访问token URL
  config.getSuiteAccessTokenUrl = 'https://oapi.dingtalk.com/service/get_suite_token';
  // 获取企业永久授权码
  config.getPermanentCodeUrl = 'https://oapi.dingtalk.com/service/get_permanent_code';
  // 激活套件
  config.activateSuiteUrl = 'https://oapi.dingtalk.com/service/activate_suite';
  // 获取企业访问token URL
  config.getCorpTokenUrl = 'https://oapi.dingtalk.com/service/get_corp_token';
  // 获取企业部门详情
  config.getDepartmentUrl = 'https://oapi.dingtalk.com/department/get';
  // 获取企业通讯录权限
  config.authScopesUrl = 'https://oapi.dingtalk.com/auth/scopes';
  // 获取部门列表
  config.departmentListUrl = 'https://oapi.dingtalk.com/department/list';
  // 获取部门成员
  config.getDepartUserListUrl = 'https://oapi.dingtalk.com/user/simplelist';
  // 获取成员详情
  config.getUser = 'https://oapi.dingtalk.com/user/get';
  // 注册通讯录变更回调地址
  config.dingCallback = 'https://oapi.dingtalk.com/call_back/register_call_back';
  // 通讯录变更回调地址
  config.callback = 'http://47.93.50.25:7100/v1/update-callback';

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
