const router = require('koa-router')()
const db = require('../../common/db')
const Utils = require('../../common/utils')

router.post("/CheckDetails",async ctx=>{
    console.log(ctx.request.body.OrderUnique)
    let Data = await db.query(`select * from CheckDetails where OrderUnique = '${ctx.request.body.OrderUnique}'`)
     ctx.response.body = {
        "Data": Data,
        "Code": 200,
        "mgs" : "success"
    }
})


//申请售后
router.post('/CheckDetails/AfterSales', async ctx => {
    db.query(`update CheckDetails set LogisticsStatus = 3 where OrderUnique = '${ctx.request.body.OrderUnique}'`)

    ctx.response.body = {
        "Data": undefined,
        "Code": 200,
        "msg": "success"
    }
})

module.exports = router