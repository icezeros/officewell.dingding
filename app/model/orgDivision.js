/*
 * @Author: icezeros
 * @Date: 2017-07-04 15:24:48
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-04 16:52:01
 */

'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const orgDivisionSchema = new mongoose.Schema(
    {
      // _id: {
      //   type: String,
      // },
      name: {
        type: String,
      },
      companyId: {
        type: String,
        required: true,
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
      ding: {
        id: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        order: {
          type: Number,
          required: true,
        },
        createDeptGroup: {
          type: Boolean,
        },
        autoAddUser: {
          type: Boolean,
        },
        deptHiding: {
          type: Boolean,
        },
        deptPermits: {
          type: String,
        },
        userPermits: {
          type: String,
        },
        outerDept: {
          type: Boolean,
        },
        outerPermitDepts: {
          type: String,
        },
        outerPermitUsers: {
          type: String,
        },
        orgDeptOwner: {
          type: String,
        },
        deptManagerUseridList: {
          type: String,
        },
      },
    },
    { collection: 'org_division' }
  );
  // orgDivisionSchema.pre('save', function(next) {
  //   // do stuff
  //   this.createdAt = new Date();
  //   next();
  // });
  // orgDivisionSchema.pre('findOneAndUpdate', function(next) {
  //   // do stuff
  //   console.log('====------===');
  //   orgDivisionSchema.modifiedAt = new Date();
  //   console.log(this.orgId);
  //   next();
  // });

  return mongoose.model('OrgDivision', orgDivisionSchema);
};
