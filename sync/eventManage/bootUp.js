const AddressModel = require('../../model/address')

async function bootUpEvent (event, logs) {
  console.log('bootUpEvent')

  // sendBootUpAward


  // update address info
  await AddressModel.updateOne({
    address: logs.user,
  },{
    $set: {
      bootUp: true
    }
  })

}

module.exports = bootUpEvent
