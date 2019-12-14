const AddressModel = require('../../model/address')

async function exchangeEvent (event, logs) {
  console.log('exchangeEvent')
  // when referrer is unInvited then can update referrer
  const address = await AddressModel.findOne({address:logs.from})
  if (address) {
    if (address.referrer === '0') {
      await AddressModel.updateOne({
        address: logs.from
      }, {
        $set: {
          referrer: logs.iCode
        }
      });
    }
  } else {
    await AddressModel.insertOne({
      address: logs.from,
      referrer: logs.iCode,
    })
  }
}

module.exports = exchangeEvent
