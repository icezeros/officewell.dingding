/*
 * @Author: hgs
 * @Date: 2017-06-12 16:00:02
 * @Last Modified by: hgs
 * @Last Modified time: 2017-06-23 22:45:53
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const dingOrgInfoSchema = new mongoose.Schema(
    {
      // _id: {
      //   type: String,
      // },
      peskId: {
        type: String,
      },
      userId: {
        type: String,
      },
      action: {
        type: String,
      },
      t: {
        type: Date,
      },
      d: {
        type: Date,
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
      modifiedAt: {
        type: Date,
      },
      isDelete: {
        type: Boolean,
        default: false,
      },
    },
    { collection: 'ding_org_info' }
  );

  return mongoose.model('DingOrgInfoAction', dingOrgInfoSchema);
};
