const Types = require('mongolass').Types
const mongolass = require('../module/mongo')

const required = true

const Event = mongolass.model('Event', {
  transactionHash: { type: Types, required },
  timeStamp: { type: 'number', required},
  blockNumber: { type: 'number', required},
  data: { type: Types.Mixed },
  topics: { type: Types.Mixed }
})

module.exports = Event
