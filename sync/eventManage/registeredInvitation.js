const AddressModel = require('../../model/address')

async function registeredInvitationEvent (event, logs) {
  console.log('registeredInvitationEvent')
  const address = await AddressModel.findOne({address:logs.from})
  if (address) {
    address.invitationCode = logs.code;
    await AddressModel.updateOne({
      address: logs.from
    }, {
      $set: {
        invitationCode: logs.code
      }
    });
  } else {
    await AddressModel.insertOne({
      address: logs.from,
      invitationCode: logs.code,
    })
  }
  return logs.from
}

module.exports = registeredInvitationEvent

