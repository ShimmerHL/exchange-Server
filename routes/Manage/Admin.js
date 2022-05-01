const router = require("koa-router")()
const db = require("../../common/db")
const Utils = require("../../common/Utils")


router.get("/admin",async ctx=>{

    console.log(ctx.request.query)
    ctx.response.body = ctx.request.query
})


module.exports = router
