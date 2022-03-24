const router = require('koa-router')()

const db = require("../../common/db")
const Utils = require("../../common/Utils")

function LogisticsDetailsDataProcess(Data) {
    let ArrJson = []

    for (let i = 0; i < Data.length; i++) {
        let Json = {
            OrderUnique: Data[i].OrderUnique,
            LogisticsStatus:  Data[i].LogisticsStatus,
            LogisticsStatusChange:  Data[i].LogisticsStatus,
            StateTime:  Data[i].StateTime,
            StateTimeChange:  Data[i].StateTime,
            Receiver:  Data[i].Receiver,
            ReceiverChange:  Data[i].Receiver,
            Phone: Data[i].Phone,
            PhoneChange: Data[i].Phone,
            RegionAndAddress: Data[i].RegionAndAddress,
            RegionAndAddressChange: Data[i].RegionAndAddress,
            CommodityFunllName: Data[i].CommodityFunllName,
            Thumbnail: Data[i].Thumbnail,
            BusinessName: Data[i].BusinessName,
            RedemptionCode: Data[i].RedemptionCode,
            OrderTime: Data[i].OrderTime,
            GiftUnique: Data[i].GiftUnique,
            Useropenid: Data[i].Useropenid,
            StatusInformation: Data[i].StatusInformation
        }
        ArrJson.push(Json)
    }
    return ArrJson
}

//列表请求
router.get("/LogisticsManagement", async ctx => {
    let ArrJson = []

    let Data = await db.query(`select OrderUnique,CommodityFunllName,UserName from CheckDetails join WeChatUserLogin on CheckDetails.Useropenid = WeChatUserLogin.Useropenid`)

    for (let i = 0; i < Data.length; i++) {
        let Json = {
            OrderUnique: Data[i].OrderUnique,
            CommodityFunllName: Data[i].CommodityFunllName,
            UserName: Data[i].UserName,
            Edit: false
        }
        ArrJson.push(Json)
    }
    Utils.SetHeader(ctx)
    ctx.response.body = ArrJson
})

//详情请求
router.get("/LogisticsManagement/LogisticsDetails", async ctx => {

    let Data = await db.query(`select *,DATE_FORMAT(StateTime,'%Y-%m-%d %H:%i:%s') from CheckDetails `)

    Utils.SetHeader(ctx)
    ctx.response.body = LogisticsDetailsDataProcess(Data)
})

//实时查询 
router.post("/LogisticsManagement/LogisticsManagementSearch", async ctx => {
    let Text = ctx.request.body.Text
    let DataArr = []

    let Data = await db.query(`select UserName,Useropenid from WeChatUserLogin where UserName like '%${Text}%'`)

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
router.post("/LogisticsManagement/LogisticsSearchReturnManagementData", async ctx => {
    let Useropenid = ctx.request.body.Useropenid
    let DataArr = []
    
    let Data = await db.query(`select OrderUnique,CommodityFunllName,UserName from CheckDetails join WeChatUserLogin on (CheckDetails.Useropenid = WeChatUserLogin.Useropenid) where CheckDetails.Useropenid = '${Useropenid}' `)
    for (let i = 0; i < Data.length; i++) {
        let Json = {
            OrderUnique: Data[i].OrderUnique,
            CommodityFunllName: Data[i].CommodityFunllName,
            UserName: Data[i].UserName,
            Edit: false
        }
        DataArr.push(Json)
    }

    Utils.SetHeader(ctx)
    ctx.response.body = DataArr
})

//查询返回详情数据
router.post("/LogisticsManagement/LogisticsSearchReturnDetailsData", async ctx => {
    let Useropenid = ctx.request.body.Useropenid
    let Data = await db.query(`select * from CheckDetails where Useropenid = '${Useropenid}' `)

    Utils.SetHeader(ctx)
    ctx.response.body =LogisticsDetailsDataProcess(Data)
})

//规格 礼品全名 礼品缩略名 企业名 礼品标签 修改 
router.post("/LogisticsManagement/LogisticsBasicInformationChange", async ctx => {
    let OrderUnique = ctx.request.body.OrderUnique
    let ColumnName = ctx.request.body.Name
    let ChangeText = ctx.request.body.ChangeText
    console.log(ctx.request.body)
    if(ColumnName == "StateTime"){
        let StateTimeStr = ChangeText.substring(0, 19).split("T")

        ChangeText = StateTimeStr
    }
    console.log(ChangeText)
    db.query(`update CheckDetails set ${ColumnName} = '${ChangeText}' where OrderUnique = '${OrderUnique}'`)

    Utils.SetHeader(ctx)
    ctx.response.body = {}
})


module.exports = router