/*
 * @Author: icezeros
 * @Date: 2017-06-12 16:00:02
 * @Last Modified by: icezeros
 * @Last Modified time: 2017-07-05 16:11:42
 */
'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const dingUsersSchema = new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      companyId: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      active: {
        type: Boolean,
      },
      orderInDepts: {
        type: Object,
      },
      isAdmin: {
        type: Boolean,
        required: true,
      },
      isBoss: {
        type: Boolean,
        required: true,
      },
      dingId: {
        type: String,
        required: true,
      },
      unionId: {
        type: String,
        required: true,
      },
      isLeaderInDepts: {
        type: Object,
        required: true,
      },
      isHide: {
        type: Boolean,
        required: true,
      },
      department: {
        type: Array,
        required: true,
      },
      position: {
        type: String,
      },
      avatar: {
        type: String,
      },
      jobnumber: {
        type: String,
      },
      extattr: {
        type: Object,
      },

      createdAt: {
        type: Date,
        default: new Date(),
        required: true,
      },
      modifiedAt: {
        type: Date,
      },
      disabled: {
        type: Boolean,
      },
    },
    { collection: 'ding_users_info' }
  );
  dingUsersSchema.pre('save', function(next) {
    this.createdAt = new Date();
    next();
  });
  // dingUsersSchema.pre('update', function(next) {
  //   // do stuff
  //   console.log('====------===');
  //   dingUsersSchema.modifiedAt = new Date();
  //   console.log(this.orgId);
  //   next();
  // });

  return mongoose.model('DingUsers', dingUsersSchema);
};
