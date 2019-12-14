const Types = require('mongolass').Types
const mongolass = require('../module/mongo')

const required = true

const Event = mongolass.model('Event', {
  name: { type: 'string', required },
  transactionHash: { type: 'string', required },
  timeStamp: { type: 'number', required},
  blockNumber: { type: 'number', required},
  data: { type: 'string' },
  topics: { type: Types.Mixed },
  eventName: { type: 'string'},
  decode: { type: Types.Mixed },
})

module.exports = Event
