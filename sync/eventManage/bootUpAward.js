const AddressModel = require('../../model/address')

async function bootUpAwardEvent (event, logs) {
  console.log('bootUpAward')
  return logs.user
}

module.exports = bootUpAwardEvent
