const AddressInfoModel = require('../model/address')
const EventModel = require('../model/event')
const { queryToPagination } = require('../module/utils')

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

  async getTransactions (ctx) {
    const pagination = queryToPagination(ctx.query)
    const query = {
      index: ctx.params.address
    }
    if (ctx.query.name) {
      query.name = ctx.query.name
    }
    const txs = await EventModel.find(query).limit(pagination.limit)
      .skip(pagination.offset)
      .sort({ _id: -1 })

    ctx.res.ok({
      body: txs
    })
  }

  async getMinerTx (ctx) {
    const pagination = queryToPagination(ctx.query)
    const txs = await EventModel.find({
      index: ctx.params.address,
      name: 'CoinBase'
    }).limit(pagination.limit)
      .skip(pagination.offset)
      .sort({ _id: -1 })

    ctx.res.ok({
      body: txs
    })
  }
}


module.exports = AddressInfoController
