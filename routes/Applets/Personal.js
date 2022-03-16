const router = require('koa-router')()
const https = require('https')
const db = require('../../common/db')
const Utils = require('../../common/utils')
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
    let NewDate = Utils.formatTime(new Date)

    let CodeSession = new Promise((res, rej) => {
        https.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx5fc605f95c3f149a&secret=19258f927c56a163d920cd8d2dadeb3d&js_code=${ctx.request.body.Code}&grant_type=authorization_code`,
            (callback) => {
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
                        db.query(`insert into WeChatUserLogin (UserName,Useropenid,Sex) values ('${Username}','${Openid}',0)`, (err) => {
                            console.log(err)
                        })
                        //将当前时间设为出生年月
                        db.query(`update WeChatUserLogin set DateBirth = '${NewDate}'  where Useropenid = '${Openid}'`)

                        res(JSON.stringify(Utils.JsonObj(await GetOpenidData(Openid))[0]))
                    } else {
                        res(JSON.stringify(Utils.JsonObj(await GetOpenidData(Openid))[0]))
                    }
                })

            })
    })
    let Appid = await JSON.parse(await CodeSession).UserOpenid

    let JsonData = {
        Appid: Appid,
        nickName: Utils.JsonObj(await db.query(`select UserName from WeChatUserLogin where Useropenid = '${Appid}'`))[0].UserName
    }

    ctx.response.body = { "Data": [JsonData], Code: 200, "mgs": "success" }
})


//用户获取nickName处理
router.post('/Personal/NickName', async ctx => {
    let JsonNickName = await db.query(`select UserName from WeChatUserLogin where Useropenid = '${ctx.request.body.Appid}'`)
    let LogisticsStatusNum = await db.query(`select count(LogisticsStatus = 1 or null)as NotShippedNumber,count(LogisticsStatus = 2 or null)as ReceiptNumber,count(LogisticsStatus = 3 or null)as AfterSaleNumber from CheckDetails where Useropenid = '${ctx.request.body.Appid}'`)
    JsonData ={
        JsonNickName: JsonNickName,
        LogisticsStatusNum : LogisticsStatusNum
    }
    if(Utils.IfNullArr(JsonData)){
        ctx.response.body = {
            "Data": undefined,
            "Code" : 406,
            "mgs" : "error"
        }
    }else{
        ctx.response.body = {
            "Data": JsonData,
            "Code" : 200,
            "mgs" : "success"
        }
    }

})

//企业登录处理
router.post('/EnterpriseUserLogin', async ctx => {
    let Registration = ctx.request.body.Registration  //注册企业号
    let Password = ctx.request.body.Password          //密码
    let Appid = ctx.request.body.Appid                //Appid
    let StateCode = Utils.StringRamdom(16)            //登录状态码  暂时没什么用

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
//企业注册处理
router.post('/EnterpriseUserAdd', async ctx => {
    let Registration = ctx.request.body.Registration  //注册企业号
    let Password = ctx.request.body.Password          //密码
    let Appid = ctx.request.body.Appid                //Appid
    let StateCode = Utils.StringRamdom(16)            //登录状态码  暂时没什么用

    let RegistrationError = { undefined, "Code": 406, "msg": "RegistrationError" }
    let AppidError = { undefined, "Code": 406, "msg": "AppidError" }
    try {
        let QueryAppid = GetOpenidData(Appid)
        let QueryAppidData = Utils.JsonObj(await QueryAppid)  //

        let QueryJson = await db.query(`select Registration,Password from EnterpriseUserLogin where Registration = '${Registration}'`)
        
        let QueryData = Utils.JsonObj(QueryJson)
        //判断是否存在该用户
        if (Appid !== QueryAppidData[0].UserOpenid) {
            ctx.response.body = AppidError
            return
        }
        //判断企业号是否存在 不存在则注册
        if(Utils.IfNullArr(QueryData)){
            db.query(`insert into EnterpriseUserLogin (Registration,Password) values ('${Registration}','${Password}')`)
            ctx.response.body = { "Merchant": StateCode, "Code": 200, msg: "success" }
        }else{
            ctx.response.body = RegistrationError
        }
    } catch (error) {
        console.log(error)
        ctx.response.body = Utils.ServerErr
    }
})


module.exports = router