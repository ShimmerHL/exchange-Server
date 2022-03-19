const router = require('koa-router')()

const db = require("../../common/db")
const Utils = require("../../common/Utils")

function EnterpriseDetailsDataProcess(Data) { //详情数据处理

    let ArrJson = []

    for (let i = 0; i < Data.length; i++) {
        
        let Json = {
            Registration: Data[i].Registration,
            Password: Data[i].Password,
            PasswordChange: Data[i].Password,
        }
        ArrJson.push(Json)
    }
    return ArrJson
}

//列表请求
router.get("/EnterpriseManagement", async ctx => {
    let Arrson = []

    let Data = await db.query(`select Registration,Password from EnterpriseUserLogin`)

    for (let i = 0; i < Data.length; i++) {
        let Json = {
            Registration: Data[i].Registration,
            Password: Data[i].Password,
            Edit: false
        }
        Arrson.push(Json)
    }

    Utils.SetHeader(ctx)
    ctx.response.body = Arrson
})

//详情请求
router.get("/EnterpriseManagement/EnterpriseDetails", async ctx => {

    let Data = await db.query(`select * from EnterpriseUserLogin `)

    Utils.SetHeader(ctx)
    ctx.response.body = EnterpriseDetailsDataProcess(Data)
})

//实时查询 
router.post("/EnterpriseManagement/EnterpriseManagementSearch", async ctx => {
    let Text = ctx.request.body.Text
    let DataArr = []
    let Data = await db.query(`select Registration,Password from EnterpriseUserLogin where Registration like '%${Text}%'`)
    console.log(Data)

    for (let i = 0; i < Data.length; i++) {
        DataArr.push({
            value: Data[i].Registration,
            Registration: Data[i].Registration
        })
    }

    Utils.SetHeader(ctx)
    ctx.response.body = DataArr
})

//查询返回列表数据
router.post("/EnterpriseManagement/EnterpriseSearchReturnManagementData", async ctx => {
    let Registration = ctx.request.body.Registration
    let DataArr = []
    
    let Data = await db.query(`select Registration,Password from EnterpriseUserLogin where Registration = '${Registration}'`)

    for (let i = 0; i < Data.length; i++) {
        let Json = {
            Registration: Data[i].Registration,
            Password: Data[i].Password,
            Edit: false
        }
        DataArr.push(Json)
    }
    
    Utils.SetHeader(ctx)
    ctx.response.body = DataArr
})

//查询返回详情数据
router.post("/EnterpriseManagement/EnterpriseSearchReturnDetailsData", async ctx => {
    let Registration = ctx.request.body.Registration
    let Data = await db.query(`select * from EnterpriseUserLogin where Registration = '${Registration}' `)

    Utils.SetHeader(ctx)
    ctx.response.body = EnterpriseDetailsDataProcess(Data)
})


//用户名 性别 邮箱 手机号 出生年月 修改 
router.post("/EnterpriseManagement/EnterpriseBasicInformationChange", async ctx => {
    let Registration = ctx.request.body.Registration
    let ColumnName = ctx.request.body.Name
    let ChangeText = ctx.request.body.ChangeText
    console.log(ctx.request.body)
    db.query(`update EnterpriseUserLogin set ${ColumnName} = '${ChangeText}' where Registration = '${Registration}'`)

    Utils.SetHeader(ctx)
    ctx.response.body = {}
})


module.exports = router