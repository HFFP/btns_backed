const Router = require('koa-router')
const AddressInfo = require('../controller/addressInfo')

const addressInfo = new AddressInfo()
const router = new Router()

//
router.get('/api/invitationTree/:address', addressInfo.getInvitationTree)
router.get('/api/addressInfo/:address', addressInfo.getAddressInfo)

module.exports = function (app) {
  app
    // .use(compress({
    //   filter: function (content_type) {
    //     return /text/i.test(content_type)
    //   },
    //   threshold: 2048,
    //   flush: require('zlib').Z_SYNC_FLUSH
    // }))
    .use(function (ctx, next) {
      ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin)
      ctx.compress = true
      return next()
    })
    .use(router.routes())
    .use(router.allowedMethods())
}
