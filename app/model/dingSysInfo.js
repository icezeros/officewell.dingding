/*
 * @Author: icezeros
 * @Date: 2017-06-12 16:00:02
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-10 14:25:31
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const dingSysInfoSchema = new mongoose.Schema(
    {
      // _id: {
      //   type: String,
      // },
      orgId: {
        type: String,
      },
      suiteTicket: {
        type: String,
      },
      accessToken: {
        accessToken: {
          type: String,
        },
        expire: {
          type: Date,
        },
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
    { collection: 'ding_sys_info' }
  );
  dingSysInfoSchema.pre('save', function(next) {
    this.createdAt = new Date();
    next();
  });
  dingSysInfoSchema.pre('update', function(next) {
    this.update({}, { $set: { modifiedAt: new Date() } });
    next();
  });

  return mongoose.model('DingSysInfo', dingSysInfoSchema);
};
