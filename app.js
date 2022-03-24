const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const fs = require('fs')
const path = require('path')
const cors = require('koa2-cors')
const koaBody = require('koa-body')

const Index = require('./routes/Applets/Index')
const Details = require('./routes/Applets/Details')
const Personal = require('./routes/Applets/Personal')
const ModifySetup = require('./routes/Applets/ModifySetup')
const CustomGifts = require('./routes/Applets/CustomGifts')
const TotalGifts = require('./routes/Applets/TotalGifts')
const RedemptionCode = require('./routes/Applets/RedemptionCode')
const CheckDetails = require('./routes/Applets/CheckDetails')
const Order = require('./routes/Applets/Order')
const Admin = require('./routes/Manage/Admin')
const GiftManagement = require('./routes/Manage/GiftManagement')
const UserManagement = require('./routes/Manage/UserManagement')
const EnterpriseManagement = require('./routes/Manage/EnterpriseManagement')
const CustomQuery = require('./routes/Manage/CustomQuery')
const LogisticsManagement = require('./routes/Manage/LogisticsManagement')

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
app.use(Details.routes(), Details.allowedMethods())
app.use(Personal.routes(), Personal.allowedMethods())
app.use(ModifySetup.routes(), ModifySetup.allowedMethods())
app.use(CustomGifts.routes(), CustomGifts.allowedMethods())
app.use(TotalGifts.routes(), TotalGifts.allowedMethods())
app.use(RedemptionCode.routes(), RedemptionCode.allowedMethods())
app.use(CheckDetails.routes(), CheckDetails.allowedMethods())
app.use(Order.routes(), Order.allowedMethods())
app.use(Admin.routes(), Admin.allowedMethods())
app.use(GiftManagement.routes(), GiftManagement.allowedMethods())
app.use(UserManagement.routes(), UserManagement.allowedMethods())
app.use(EnterpriseManagement.routes(), EnterpriseManagement.allowedMethods())
app.use(CustomQuery.routes(), CustomQuery.allowedMethods())
app.use(LogisticsManagement.routes(), LogisticsManagement.allowedMethods())

app.use(cors())  //跨域
//解决上传文件过大问题

app.use(async (ctx, next) => {  //意外端口访问返回图片

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
