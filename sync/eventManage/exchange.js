const AddressModel = require('../../model/address')

async function exchangeEvent (event, logs) {
  console.log('exchangeEvent')
  await AddressModel.updateOne({
    address: logs.from,
    referrer: '0'
  }, {
    $set: {
      address: logs.from,
      referrer: logs.iCode
    }
  }, {
    upsert: true
  })
}

module.exports = exchangeEvent
