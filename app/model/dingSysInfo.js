/*
 * @Author: icezeros
 * @Date: 2017-06-12 16:00:02
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-03 11:14:59
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
  // dingSysInfoSchema.pre('save', function(next) {
  //   // do stuff
  //   this.createdAt = new Date();
  //   next();
  // });
  // dingSysInfoSchema.pre('findOneAndUpdate', function(next) {
  //   // do stuff
  //   console.log('====------===');
  //   dingSysInfoSchema.modifiedAt = new Date();
  //   console.log(this.orgId);
  //   next();
  // });

  return mongoose.model('DingSysInfo', dingSysInfoSchema);
};
