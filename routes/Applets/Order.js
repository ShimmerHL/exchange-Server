let router = require("koa-router")()
const db = require('../../common/db')
const Utils = require('../../common/utils')
//处理订单列表
router.post('/Order', async ctx => {
    //db.query(``)
    let JsonData = await db.query(`select OrderUnique,CommodityFunllName,LogisticsStatus,Thumbnail,BusinessName,OrderTime from CheckDetails where Useropenid = '${ctx.request.body.Appid}'`)
    ctx.response.body = {
        "Data": JsonData,
        "Code": 200,
        "mgs": "success"
    }
})
//处理待发货
router.post('/Order/ToBeDelivered', async ctx => {
    console.log(ctx.request.body)
    db.query(`update CheckDetails set LogisticsStatus = 2,StatusInformation = '快递已经离你越来越近啦' where OrderUnique = '${ctx.request.body.OrderUnique}'`)
    ctx.response.body = {
        "Data": undefined,
        "Code": 200,
        "msg": "success"
    }
    
})
//处理待收货
router.post('/Order/PendingReceipt', async ctx => {
    console.log(ctx.request.body)
    db.query(`update CheckDetails set LogisticsStatus = 0,StatusInformation = '订单已完成' where OrderUnique = '${ctx.request.body.OrderUnique}'`)

    ctx.response.body = {
        "Data": undefined,
        "Code": 200,
        "msg": "success"
    }
})
//处理售后
router.post('/Order/AfterSales', async ctx => {
    console.log(ctx.request.body)
    db.query(`update CheckDetails set LogisticsStatus,StatusInformation = '订单已完成' = 0 where OrderUnique = '${ctx.request.body.OrderUnique}'`)

    ctx.response.body = {
        "Data": undefined,
        "Code": 200,
        "msg": "success"
    }
})


module.exports = router