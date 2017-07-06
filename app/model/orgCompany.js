/*
 * @Author: icezeros
 * @Date: 2017-07-04 15:24:48
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-06 13:37:51
 */

'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const orgCompanySchema = new mongoose.Schema(
    {
      // _id: {
      //   type: String,
      // },
      name: {
        type: String,
      },
      url: {
        type: String,
      },
      ding: {
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
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
      modifiedAt: {
        type: Date,
      },
      disabled: {
        type: Boolean,
      },
    },
    { collection: 'org_company' }
  );
  orgCompanySchema.pre('save', function(next) {
    // do stuff
    this.createdAt = new Date();
    next();
  });
  orgCompanySchema.pre('update', function(next) {
    // do stuff
    this.update({}, { $set: { modifiedAt: new Date() } });
    // console.log('====------===');
    // orgCompanySchema.modifiedAt = new Date();
    // console.log(this.orgId);
    next();
  });

  return mongoose.model('OrgCompany', orgCompanySchema);
};
