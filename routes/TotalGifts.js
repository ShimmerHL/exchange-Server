const router = require('koa-router')()
const db = require('../common/db')
const Utils = require('../common/utils')

router.post('/TotalGifts', async ctx => {
    let Data = await db.query(`select GiftUnique,Thumbnail,CommodityFunllName,Exist from Details where Registration = '${ctx.request.body.Registration}'`)

    ctx.response.body = {
        "Data": Data,
        "Code": 200,
        "mgs": "Success"
    }
})



module.exports = router