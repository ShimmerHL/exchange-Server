const router = require("koa-router")()
const db = require("../../common/db")
const Utils = require("../../common/Utils")

router.get("/Admin",async ctx=>{
    ctx.response.body = "hello world"
})

router.get("/Test",async ctx=>{
    console.log(ctx.request.query)
    ctx.response.body = ctx.request.query
})

router.post("/TestPost",async ctx=>{
    console.log(ctx.request.body)
    ctx.response.body = `返回的数据${JSON.stringify(ctx.request.body)}`
})

module.exports = router
