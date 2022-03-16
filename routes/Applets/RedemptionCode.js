const router = require('koa-router')()
const db = require('../../common/db')
const Utils = require('../../common/utils')
//获取注册号下的所有礼品
router.post('/RedemptionCode', async ctx => {
    console.log(ctx.request.body)
    let Data = await db.query(`select RedemptionCode as Code,Used from RedemptionCode where GiftUnique = '${ctx.request.body.GiftUnique}'`)

    ctx.response.body = {
        "Data": Data,
        "Code": 200,
        "mgs": "Success"
    }
})
//删除礼品
router.post('/RedemptionCode/RemoveGift', async ctx => {
    console.log(ctx.request.body.GiftUnique)
    let GiftUnique = ctx.request.body.GiftUnique
    let RemoveCustomGifts = await db.query(`update Details set Exist = 1 where GiftUnique = '${GiftUnique}'`, (err) => {
        console.log(err)
    })
    let RemoveDetails = db.query(`update RedemptionCode set Used = 1 where GiftUnique = '${GiftUnique}'`, (err) => {
        console.log(err)
    })
    ctx.response.body = {
        undefined,
        "Code": 200,
        "mgs": "Success"
    }
})

module.exports = router