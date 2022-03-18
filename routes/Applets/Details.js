const router = require('koa-router')()
const db = require('../../common/db')
const Utils = require('../../common/utils')

//处理商品详情页面
router.post('/Details', async (ctx) => {
    const Comparison = null || undefined || " " || NaN
    let GiftUnique = Utils.JsonObj(ctx.request.body)
    let DBQuery = Utils.JsonObj(await db.query(`select * from Details where GiftUnique= '${GiftUnique.GiftUnique}'`))[0]
    let CarouselPictures = []
    let Specification = []
    let IntroduceImg = []
    for (const key in DBQuery) {
        if (key.slice(0, 15) == 'CarouselPicture') {
            CarouselPictures.push(DBQuery[key])
        } else if (key.slice(0, 13) == 'Specification' && DBQuery[key] !== Comparison) {
            Specification.push(DBQuery[key])
        } else if (key.slice(0, 12) == 'IntroduceImg') {
            IntroduceImg.push(DBQuery[key])
        }
    }
    let JsonData = {
        GiftUnique: DBQuery.GiftUnique,
        CommodityName: DBQuery.CommodityName,
        CommodityFunllName: DBQuery.CommodityFunllName,
        CarouselPictures: [...CarouselPictures],
        Specification: [...Specification],
        BusinessName: DBQuery.BusinessName,
        IntroduceImg: [...IntroduceImg],
        SpecificationExist: Specification.length == 0? false:true,
        Remaining: DBQuery.Remaining,
    }
    ctx.response.body = JSON.stringify(JsonData)
})

router.post('/Details/Submit', async (ctx) => {
    let GiftInformation = await db.query(`select CommodityFunllName,Thumbnail,BusinessName from Details where GiftUnique = '${ctx.request.body.GiftUnique}'`) //礼品全名

    let OrderUnique = Utils.RandomNumber() //创建订单唯一id
    let LogisticsStatus = "1" //物流默认状态 0已完成 1待发货 2待收货 3售后中
    let StateTime = "1990-01-01"//更新状态时间 暂未做
    let Receiver = ctx.request.body.Receiver  //接收者
    let Phone = ctx.request.body.Phone  //接收者手机号
    let RegionAndAddress = ctx.request.body.Region + " " + ctx.request.body.Address //接收地址
    let CommodityFunllName = GiftInformation[0].CommodityFunllName //礼品全名
    let Thumbnail = GiftInformation[0].Thumbnail //礼品缩略图
    let BusinessName = GiftInformation[0].BusinessName //企业名
    let RedemptionCode = ctx.request.body.RedemptionCode //礼品兑换码
    let OrderTime = ctx.request.body.OrderTime //创建时间
    let GiftUnique = ctx.request.body.GiftUnique //礼品id
    let Appid = ctx.request.body.Appid  //用户Appid
    let StatusInformation = "商家已发货,正在通知快递取件" //物流状态信息
    function InsertStart() {
        db.query(`insert into CheckDetails (
            OrderUnique,LogisticsStatus,StateTime,Receiver,
            Phone,RegionAndAddress,CommodityFunllName,Thumbnail,
            BusinessName,RedemptionCode,OrderTime,GiftUnique,Useropenid,StatusInformation) values
            ('${OrderUnique}','${LogisticsStatus}','${StateTime}','${Receiver}',
            '${Phone}','${RegionAndAddress}','${CommodityFunllName}','${Thumbnail}',
            '${BusinessName}', '${RedemptionCode}','${OrderTime}','${GiftUnique}','${Appid}','${StatusInformation}')`)
    }
    //查询兑换码
    let ComparedCode = db.query(`select * from RedemptionCode where RedemptionCode = '${RedemptionCode}'`)

    //不存在或已使用或商家不对返回406
    if (Utils.IfNullArr(await ComparedCode) || Utils.JsonObj(await ComparedCode)[0].Used !== 0 || Utils.JsonObj(await ComparedCode)[0].GiftUnique !== GiftUnique) {
        ctx.response.body = {
            "Data": undefined,
            "Code": 406,
            "mgs": "err"
        }
    } else {
        InsertStart()
        db.query(`update RedemptionCode set Used = 1 where RedemptionCode ='${RedemptionCode}'`)
        db.query(`update Details set Remaining = Remaining - 1 where GiftUnique='${GiftUnique}'`)
        ctx.response.body = {
            "Data": [{ "OrderUnique": OrderUnique }],
            "Code": 200,
            "mgs": "err"
        }
    }
})



module.exports = router
