const Types = require('mongolass').Types
const mongolass = require('../module/mongo')

const required = true

const AddressInfo = mongolass.model('Address', {
  address: { type: 'string', required },
  invitationCode: { type: 'string' },
  referrer: { type: 'string', default: 0, required},
  bootUp: { type: 'bool', default: false, required},
  millType: { type: 'number', default: 0, required},
  bootUpTime: { type: Types.Date, default: 0, required},
})

module.exports = AddressInfo
