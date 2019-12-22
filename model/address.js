const Types = require('mongolass').Types
const mongolass = require('../module/mongo')

const required = true

const AddressInfo = mongolass.model('Address', {
  address: { type: Types.String, required },
  invitationCode: { type: Types.String, required, default: '0'},
  referrer: { type: Types.String, required, default: '0'},
  bootUp: { type: Types.Boolean, required, default: false},
  millType: { type: Types.Number, required, default: 0},
  miningTime: { type: Types.Date, required, default: 0},
  invitationList: { type: Types.Mixed, default: []},
  invitationDetail: {type: Types.Mixed, default: {}},
  communityAward1: { type: Types.Boolean, default: false},
  communityAward2: { type: Types.Boolean, default: false}
})

module.exports = AddressInfo
