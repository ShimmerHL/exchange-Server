const router = require("koa-router")()
const db = require('../../common/db')
const Utils = require('../../common/utils')

let Appid = ""

router.post('/ModifySetup', async ctx => {
    Appid = ctx.request.body.Appid
    let UserData = Utils.JsonObj(await db.query(`select * from WeChatUserLogin where Useropenid = '${Appid}'`))[0]
    console.log()
    let JsonData = {
        NickName: UserData.UserName,
        Sex: UserData.Sex,
        Email: UserData.Email,
        Phone: UserData.Phone,
        DateBirth: UserData.DateBirth.substring(0, 10)
    }

    ctx.response.body = { "Data": [JsonData], Code: 200, mgs: "success" }
})

//处理更改性别
router.post('/ModifySetup/ReviseSex', async ctx => {
    db.query(`update WeChatUserLogin set  sex = '${ctx.request.body.Sex}' where Useropenid = '${Appid}'`)
    ctx.response.body = { "Data": [null], Code: 200, mgs: "success" }
})

//处理更改出生年月
router.post('/ModifySetup/DateBirth', async ctx => {
    db.query(`update WeChatUserLogin set  DateBirth = '${ctx.request.body.DateBirth}' where Useropenid = '${Appid}'`)
    ctx.response.body = { "Data": [null], Code: 200, mgs: "success" }
})

//处理更改昵称
router.post('/ModifySetup/ReviseNickName', async ctx => {
    db.query(`update WeChatUserLogin set  UserName = '${ctx.request.body.NickName}' where Useropenid = '${Appid}'`)
    ctx.response.body = { "Data": [null], Code: 200, mgs: "success" }
})
//处理更改手机号
router.post('/ModifySetup/RevisePhone', async ctx => {
    db.query(`update WeChatUserLogin set  Phone = '${ctx.request.body.Phone}' where Useropenid = '${Appid}'`)
    ctx.response.body = { "Data": [null], Code: 200, mgs: "success" }
})
//处理更改邮箱
router.post('/ModifySetup/ReviseEmail', async ctx => {
    db.query(`update WeChatUserLogin set  Email = '${ctx.request.body.Email}' where Useropenid = '${Appid}'`)
    ctx.response.body = { "Data": [null], Code: 200, mgs: "success" }
})



module.exports = router