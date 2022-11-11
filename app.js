const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger_middler = require('./middlewares/logger')
const logger = require('koa-logger')
const cors = require('koa-cors')
const index = require('./routes/index')
const users = require('./routes/users')
const session = require('koa-session')

// error handler
onerror(app)

app.keys=['wwkblog']

const CONFIG = {
  key:'koa:sess',
  masAge:86400000, // cookie 的过期时间maxAge in ms(default is 1 days)
  overwrite:true, // 默认可以重写
  httpOnly:true, // cookie 是否只有服务器可以访问
  signed:true,
  rolling:false, // 每次请求时强行设置cookie ，这将重置cookie 过期时间(默认false)
  renew:false
}

const options = {
  allowedHeaders: ["Origin", "Content-Type", "Accept", "Authorization"],
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "*",
  preflightContinue: false
};
app.use(cors(options))
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
app.use(logger_middler()); // 服务器查看日志 中间件
app.use(session(CONFIG,app))

// logger console
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
