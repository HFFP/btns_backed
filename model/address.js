const Types = require('mongolass').Types
const mongolass = require('../module/mongo')

const required = true

const ABCTPrice = mongolass.model('abctprice', {
  price_ratio: { type: 'number', required },
  price_cny: { type: 'number', required },
  price_usd: { type: 'number', required },
  created_at: { type: Types.Date, required },
  percent_change_ratio: { type: 'number', required },
  percent_change_24h_ratio: { type: 'number', required },
  percent_change_price: { type: 'number', required },
  percent_change_24h_price: { type: 'number', required }
})

module.exports = ABCTPrice
