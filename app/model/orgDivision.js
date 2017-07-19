/*
 * @Author: icezeros
 * @Date: 2017-07-04 15:24:48
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-10 14:23:59
 */

'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const orgDivisionSchema = new mongoose.Schema(
    {
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
        parentid: {
          type: String,
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
        deptPerimits: {
          type: String,
        },
        userPerimits: {
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
  orgDivisionSchema.pre('save', function(next) {
    this.createdAt = new Date();
    next();
  });
  orgDivisionSchema.pre('update', function(next) {
    this.update({}, { $set: { modifiedAt: new Date() } });

    next();
  });

  return mongoose.model('OrgDivision', orgDivisionSchema);
};
