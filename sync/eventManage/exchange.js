const AddressModel = require('../../model/address')

async function exchangeEvent (event, logs) {
  console.log('exchangeEvent')
  // when referrer is unInvited then can update referrer
  const address = await AddressModel.findOne({address:logs.from})
  if (address) {
    // can't update referrer if has exchanged
    // "1" is registerEvent default value
    // if (address.referrer === '1') {
    //   await AddressModel.updateOne({
    //     address: logs.from
    //   }, {
    //     $set: {
    //       referrer: logs.iCode
    //     }
    //   });
    //   await updateInvitationTree(logs.iCode, address, 1)
    // }
  } else {
    const address = await AddressModel.insertOne({
      address: logs.from,
      referrer: logs.iCode,
    })
    await updateInvitationTree(logs.iCode, address.ops[0], 1)
  }
  return logs.from;
}

async function updateInvitationTree(iCode, address, level) {
  if (iCode !== '0') {
    const invitationAddress = await AddressModel.findOne({invitationCode:iCode});

    if (invitationAddress) {
      invitationAddress.invitationList.push(address.address);
      invitationAddress.invitationDetail[address.address] = {
        level: level
      }
      await AddressModel.updateOne({
        invitationCode: iCode
      },{
        $set: {
          invitationList: invitationAddress.invitationList,
          invitationDetail: invitationAddress.invitationDetail
        }
      })
      await updateInvitationTree(invitationAddress.referrer, address, level + 1)
    }
  }
}

module.exports = exchangeEvent
