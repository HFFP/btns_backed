const btnsContract = require('../../module/btnsContract')

const AddressModel = require('../../model/address')

async function bootUpEvent (event, logs) {
  console.log('bootUpEvent')

  // sendBootUpAward
  const addressInfo = await AddressModel.findOne({address: logs.user})
  let immediate = []
  let distant = []
  for(const tmp in addressInfo.invitationDetail) {
    if (addressInfo.invitationDetail[tmp].level > 1) {
      distant.push(tmp)
    } else {
      immediate.push(tmp)
    }
  }
  await btnsContract.sendBootUpAward(immediate, distant)

  // update address info
  await AddressModel.updateOne({
    address: logs.user,
  },{
    $set: {
      bootUp: true
    }
  })
  return logs.user;
}

module.exports = bootUpEvent
