const Types = require('mongolass').Types
const mongolass = require('../module/mongo')

const required = true

const AddressInfo = mongolass.model('Address', {
  address: { type: Types.String, required },
  invitationCode: { type: Types.String, required, default: '0'},
  referrer: { type: Types.String, required, default: '0'},
  bootUp: { type: Types.Boolean, required, default: false},
  millType: { type: Types.Number, required, default: 0},
  bootUpTime: { type: Types.Date, required, default: 0},
})

module.exports = AddressInfo
