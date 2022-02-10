const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const fs = require('fs')
const path = require('path')


const Index = require('./routes/Index')
const users = require('./routes/users')
const Details = require('./routes/Details')
const Personal = require('./routes/Personal')
const ModifySetup = require('./routes/ModifySetup')
const CustomGifts = require('./routes/CustomGifts')
const TotalGifts = require('./routes/TotalGifts')
const RedemptionCode = require('./routes/RedemptionCode')
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(Index.routes(), Index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(Details.routes(), Details.allowedMethods())
app.use(Personal.routes(), Personal.allowedMethods())
app.use(ModifySetup.routes(), ModifySetup.allowedMethods())
app.use(CustomGifts.routes(), CustomGifts.allowedMethods())
app.use(TotalGifts.routes(), TotalGifts.allowedMethods())
app.use(RedemptionCode.routes(), RedemptionCode.allowedMethods())
app.use(async (ctx, next) => {

  let FilePath = path.join(__dirname, ctx.url)
  let file = null
  try {
    file = fs.readFileSync(FilePath); //读取文件
  } catch (error) {
    FilePath = path.join(__dirname, '/public/images/shiroikuroko.png'); //默认图片地址
    file = fs.readFileSync(FilePath); //读取文件 
  }
  ctx.set('content-type', 'image/jpeg')
  ctx.body = file
})
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
