class OrderBookController {
  async getOrderBook (ctx) {

    ctx.res.ok({
      body: {
        buy: [{price: 1, amount: 10}, {price: 0.9, amount: 10}, {price: 0.8, amount: 10}],
        sell: [{price: 1.8, amount: 10}, {price: 1.9, amount: 10}, {price: 2, amount: 10}],
      }
    })
  }

}

module.exports = OrderBookController
