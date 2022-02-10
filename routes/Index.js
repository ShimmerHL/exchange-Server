const router = require('koa-router')()
const db = require('../common/db')
const Utils = require('../common/utils')

//处理礼品列表
router.get('/index', async (ctx) => {
  let JsonArr = await db.query("select GiftUnique,Thumbnail,CommodityName,Frequency from Details where Exist != 1")
  ctx.body = {
    "Data": JsonArr,
    "Code": 200,
    "msg": "Success"
  }
})


//处理首次点击搜索按钮获取的标题GiftUnique
router.get('/index/OneSearch', async (ctx) => {
  let JsonArr = await db.query(`select GiftUnique,Thumbnail,CommodityName,Frequency from details as t1 where t1.id>=(rand()*(select max(id) from details))limit 6`)

  ctx.response.body = {
    "Data": JsonArr,
    "Code": 200,
    "msg": "Success"
  }

})

//处理搜索
router.post('/index/Search', async (ctx) => {
  let SearchData = await db.query(`select GiftUnique,Thumbnail,CommodityName,Frequency from details where CommodityFunllName like '%${ctx.request.body.SearchValue}%' and Exist != 1 `)

  if (SearchData.length == 0) {
    ctx.response.body = {
      "Data": "",
      "Code": 200,
      "msg": "Success"
    }
  } else {
    ctx.response.body = {
      "Data": SearchData,
      "Code": 200,
      "msg": "Success"
    }
  }
})

//处理输入
router.post('/index/EnterSearch', async (ctx) => {
  let SearchData = await db.query(`select GiftUnique,CommodityName from details where CommodityFunllName like '%${ctx.request.body.EnterSearch}%' and Exist != 1 limit 0,6`)
  ctx.response.body = {
    "Data": SearchData,
    "Code": 200,
    "msg": "Success"
  }
})


//处理输入搜索时的标题GiftUnique
router.post('/index/SearchTitle', async (ctx) => {
  console.log(ctx.request.body.GiftUnique)
  let JsonArr = await db.query(`select GiftUnique,Thumbnail,CommodityName,Frequency from Details where GiftUnique = '${ctx.request.body.GiftUnique}'`)
  ctx.body = {
    "Data": JsonArr,
    "Code": 200,
    "msg": "Success"
  }
})
module.exports = router
