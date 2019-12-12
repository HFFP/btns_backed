const Router = require('koa-router')
const OrderBook = require('../controller/OrderBook')

const orderBook = new OrderBook()
const router = new Router()

//
router.get('/api/getOrderBook/', orderBook.getOrderBook)

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
