const AddressModel = require('../../model/address')

async function communityAwardEvent (event, logs) {
  console.log('updateMiningEvent')

  // update address info
  if (logs.amount === '5255000000000000000000') {
    await AddressModel.updateOne({
      address: logs.user,
    },{
      $set: {
        communityAward1: true,
      }
    })
  } else if (logs.amount === '50000000000000000000000') {
    await AddressModel.updateOne({
      address: logs.user,
    },{
      $set: {
        communityAward2: true,
      }
    })
  }
  return logs.user
}

module.exports = communityAwardEvent
