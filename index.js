const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const routes = require('./route/index')
const responseHandler = require('./middleware/responseHandler')
const config = require('config')

const app = new Koa()

app.use(bodyParser())
app.use(responseHandler())
routes(app);

app.listen(config.port,'0.0.0.0', function () {
  console.log(`🚀 app running on http://localhost:${config.port}`)
})

require('./sync')
