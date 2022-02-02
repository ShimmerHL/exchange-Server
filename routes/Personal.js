const router = require('koa-router')()
const https = require('https')
const db = require("../common/db")
const Utils = require("../common/utils")
let StrRom = require('string-random')

let Session_Key = ""
let Openid = ""
let Username = ""
//返回Openid
async function GetOpenidData(data) {
    return await db.query(`select UserOpenid from WeChatUserLogin where UserOpenid = '${data}'`, (err) => {
        console.log(err)
    })
}
//用户登录处理
router.post('/Personal', async ctx => {
    //获取唯一标识
    let Data = ""
    Username = ctx.request.body.UserName
    let CodeSession = new Promise((res, rej) => {
        https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx5fc605f95c3f149a&secret=19258f927c56a163d920cd8d2dadeb3d&js_code=${ctx.request.body.Code}&grant_type=authorization_code`,
            (callback) => {
                let PostData = ""
                if (callback.statusCode == 200) {
                    callback.on('data', (chunk) => {
                        Data += chunk
                    })
                }
                callback.on("end", async () => {
                    let params = JSON.parse(Data.toString())
                    Session_Key = params.session_key
                    Openid = params.openid
                    let IfOpenid = Utils.JsonObj(await GetOpenidData(Openid))
                    //判断用户是否存在
                    if (IfOpenid.length == 0) {
                        //不存在则添加
                        db.query(`insert into WeChatUserLogin (UserName,Useropenid) values ('${Username}','${Openid}')`, (err) => {
                            console.log(err)
                        })
                        res(Utils.JsonObj(await GetOpenidData(Openid)))
                    } else {
                        res(JSON.stringify(Utils.JsonObj(await GetOpenidData(Openid))[0]))
                    }
                })

            })
    })
    ctx.response.body = await CodeSession
})
//企业登录处理
router.post('/EnterpriseUserLogin', async ctx => {
    let Registration = ctx.request.body.Registration
    let Password = ctx.request.body.Password
    let Appid = ctx.request.body.Appid
    let StateCode = StrRom(16)

    let RegistrationError = { undefined, "Code": 406, "msg": "RegistrationError" }
    let AppidError = { undefined, "Code": 406, "msg": "AppidError" }
    try {
        let QueryAppid = GetOpenidData(Appid)
        let QueryAppidData = Utils.JsonObj(await QueryAppid)

        let QueryJson = await db.query(`select Registration,Password from EnterpriseUserLogin where Registration = '${Registration}'`)
        let QueryData = Utils.JsonObj(QueryJson)

        if (Appid !== QueryAppidData[0].UserOpenid) {
            ctx.response.body = AppidError
            return
        }

        if (Registration !== QueryData[0].Registration && Password == QueryData[0].Password) {
            ctx.response.body = RegistrationError
            return
        }

        db.query(`update EnterpriseUserLogin set StateCode = '${StateCode}' where Registration = ${Registration}`)

        ctx.response.body = { "Merchant": StateCode, "Code": 200, msg: "success" }
    } catch (error) {
        console.log(error)
        ctx.response.body = Utils.ServerErr
    }
})


module.exports = router