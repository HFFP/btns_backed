const Types = require('mongolass').Types
const mongolass = require('../module/mongo')

const required = true

const Event = mongolass.model('Event', {
  name: { type: Types.String, required },
  transactionHash: { type: Types.String, required },
  timeStamp: { type: Types.Number, required},
  blockNumber: { type: Types.Number, required},
  data: { type: Types.String },
  eventName: { type: Types.Number},
  topics: { type: Types.Mixed },
  decode: { type: Types.Mixed },
  index: { type: Types.String }  // 用来关联地址
})

module.exports = Event
