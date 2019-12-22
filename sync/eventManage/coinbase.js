const AddressModel = require('../../model/address')

async function coinbaseEvent (event, logs) {
  console.log('coinbaseEvent')
  return logs.user
}

module.exports = coinbaseEvent
