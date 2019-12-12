const Types = require('mongolass').Types
const mongolass = require('../module/mongo')

const required = true

const AddressInfo = mongolass.model('AddressInfo', {
  address: { type: 'string', required },
  invitationCode: { type: 'number' },
  referrer: { type: 'number', default: 0 },
  bootUp: { type: 'bool', default: false},
  millType: { type: 'number', default: 0 },
  bootUpTime: { type: Types.Date, default: 0}
})

module.exports = AddressInfo
