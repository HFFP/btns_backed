const AddressInfoModel = require('../model/address')

class AddressInfoController {
  async getInvitationTree (ctx) {
    const address = await AddressInfoModel.findOne({address: ctx.params.address});

    ctx.res.ok({
      body: address ? address.invitationDetail : {}
    })
  }

  async getAddressInfo (ctx) {
    const address = await AddressInfoModel.findOne({address: ctx.params.address});
    ctx.res.ok({
      body: address ? {
        bootUp: address.bootUp,
        miningTime: new Date(address.miningTime).getTime()
      } : {}
    })
  }
}


module.exports = AddressInfoController
