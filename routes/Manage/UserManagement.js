const router = require('koa-router')()

const db = require("../../common/db")
const Utils = require("../../common/Utils")

function UserDetailsDataProcess(Data) { //详情数据处理

    let ArrJson = []

    for (let i = 0; i < Data.length; i++) {
        
        let Json = {
            Useropenid: Data[i].Useropenid,
            UserName: Data[i].UserName,
            UserChange: Data[i].UserName,
            Sex: Data[i].Sex,
            Email: Data[i].Email,
            EmailChange: Data[i].Email,
            Phone: Data[i].Phone,
            PhoneChange: Data[i].Phone,
            DateBirth: Data[i].DateBirth,
            DateBirthChange: Data[i].DateBirth
        }
        ArrJson.push(Json)
    }
    return ArrJson
}

//列表请求
router.get("/UserManagement", async ctx => {
    let ArrJson = []

    let Data = await db.query(`select Useropenid,UserName,Phone from WeChatUserLogin`)

    for (let i = 0; i < Data.length; i++) {
        let Json = {
            Useropenid: Data[i].Useropenid,
            UserName: Data[i].UserName,
            Phone: Data[i].Phone,
            Edit: false
        }
        ArrJson.push(Json)
    }

    Utils.SetHeader(ctx)
    ctx.response.body = ArrJson
})

//详情请求
router.get("/UserManagement/UserDetails", async ctx => {

    let Data = await db.query(`select * from WeChatUserLogin `)
    console.log(Data)
    Utils.SetHeader(ctx)
    ctx.response.body = UserDetailsDataProcess(Data)
})

//实时查询 
router.post("/UserManagement/UserManagementSearch", async ctx => {
    let Text = ctx.request.body.Text
    let DataArr = []
    let Data = await db.query(`select Useropenid,UserName from WeChatUserLogin where UserName like '%${Text}%'`)
    console.log(Data)

    for (let i = 0; i < Data.length; i++) {
        DataArr.push({
            value: Data[i].UserName,
            Useropenid: Data[i].Useropenid
        })
    }

    Utils.SetHeader(ctx)
    ctx.response.body = DataArr
})

//查询返回列表数据
router.post("/UserManagement/UserSearchReturnManagementData", async ctx => {
    let Useropenid = ctx.request.body.Useropenid
    let DataArr = []
    console.log(Useropenid)
    let Data = await db.query(`select Useropenid,UserName,Phone from WeChatUserLogin where Useropenid = '${Useropenid}' `)

    for (let i = 0; i < Data.length; i++) {
        let Json = {
            Useropenid: Data[i].Useropenid,
            UserName: Data[i].UserName,
            Phone: Data[i].Phone,
            Edit: false
        }
        DataArr.push(Json)
    }
    console.log(DataArr)
    Utils.SetHeader(ctx)
    ctx.response.body = DataArr
})

//查询返回详情数据
router.post("/UserManagement/UserSearchReturnDetailsData", async ctx => {
    let Useropenid = ctx.request.body.Useropenid
    let Data = await db.query(`select * from WeChatUserLogin where Useropenid = '${Useropenid}' `)

    Utils.SetHeader(ctx)
    ctx.response.body = UserDetailsDataProcess(Data)
})


//用户名 性别 邮箱 手机号 出生年月 修改 
router.post("/UserManagement/UserBasicInformationChange", async ctx => {
    let Useropenid = ctx.request.body.Useropenid
    let ColumnName = ctx.request.body.Name
    let ChangeText = ctx.request.body.ChangeText
    console.log(ctx.request.body)
    db.query(`update WeChatUserLogin set ${ColumnName} = '${ChangeText}' where Useropenid = '${Useropenid}'`)

    Utils.SetHeader(ctx)
    ctx.response.body = {}
})


module.exports = router