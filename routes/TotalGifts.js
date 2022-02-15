const router = require('koa-router')()
const db = require('../common/db')
const Utils = require('../common/utils')

router.post('/TotalGifts', async ctx => {
    console.log(ctx.request.body.Registration)
    let Data = await db.query(`select GiftUnique,Thumbnail,CommodityFunllName,Exist from Details where Registration = '${ctx.request.body.Registration}' order by id desc`)

    ctx.response.body = {
        "Data": Data,
        "Code": 200,
        "mgs": "Success"
    }
})



module.exports = router