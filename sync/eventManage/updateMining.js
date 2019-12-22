const AddressModel = require('../../model/address')

async function updateMiningEvent (event, logs) {
  console.log('updateMiningEvent')
  // update address info
  await AddressModel.updateOne({
    address: logs.user,
  },{
    $set: {
      millType: Number(logs.millType),
      miningTime: logs.time * 1000
    }
  })
  return logs.user
}

module.exports = updateMiningEvent
