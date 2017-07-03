/*
 * @Author: icezeros
 * @Date: 2017-06-12 16:00:02
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-03 17:30:57
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const dingOrgInfoSchema = new mongoose.Schema(
    {
      // _id: {
      //   type: String,
      // },
      permanentCode: {
        type: String,
        required: true,
      },
      chPermanentCode: {
        type: String,
      },
      corpId: {
        type: String,
        required: true,
      },
      corpName: {
        type: String,
        required: true,
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
        required: true,
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
  // dingOrgInfoSchema.pre('save', function(next) {
  //   // do stuff
  //   this.createdAt = new Date();
  //   next();
  // });
  // dingOrgInfoSchema.pre('findOneAndUpdate', function(next) {
  //   // do stuff
  //   console.log('====------===');
  //   dingOrgInfoSchema.modifiedAt = new Date();
  //   console.log(this.orgId);
  //   next();
  // });

  return mongoose.model('DingOrgInfo', dingOrgInfoSchema);
};
