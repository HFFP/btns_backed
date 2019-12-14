const AddressModel = require('../../model/address')

async function registeredInvitationEvent (event, logs) {
  console.log('registeredInvitationEvent')
  await AddressModel.updateOne({
    address: logs.from
  }, {
    $set: {
      address: logs.from,
      invitationCode: logs.code
    }
  }, {
    upsert: true
  })

}

module.exports = registeredInvitationEvent

