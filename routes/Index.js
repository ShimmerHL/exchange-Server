const router = require('koa-router')()
const db = require('../common/db')

//处理礼品列表
router.get('/index', async (ctx, next) => {
  let JsonArr = await db.query("select GiftUnique,Thumbnail,CommodityName,Frequency from Details")
  ctx.body = JsonArr
})



module.exports = router
