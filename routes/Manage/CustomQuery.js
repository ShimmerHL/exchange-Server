const router = require('koa-router')()

const db = require("../../common/db")
const Utils = require("../../common/Utils")

function RegistrationDetailsDataProcess(Data) {

    let ArrJson = []

    for (let i = 0; i < Data.length; i++) {

        CarouselPictures = [
            { id: 1, CarouselPicturesUrl: Data[i].CarouselPictures1 },
            { id: 2, CarouselPicturesUrl: Data[i].CarouselPictures2 },
            { id: 3, CarouselPicturesUrl: Data[i].CarouselPictures3 },
            { id: 4, CarouselPicturesUrl: Data[i].CarouselPictures4 },
            { id: 5, CarouselPicturesUrl: Data[i].CarouselPictures5 }
        ]
        Specification = [
            { id: 1, SpecificationText: Data[i].Specification1, SpecificationTextChange: "", InputState: false },
            { id: 2, SpecificationText: Data[i].Specification2, SpecificationTextChange: "", InputState: false },
            { id: 3, SpecificationText: Data[i].Specification3, SpecificationTextChange: "", InputState: false },
            { id: 4, SpecificationText: Data[i].Specification4, SpecificationTextChange: "", InputState: false },
            { id: 5, SpecificationText: Data[i].Specification5, SpecificationTextChange: "", InputState: false }
        ]
        IntroduceImg = [
            { id: 1, IntroduceImgUrl: Data[i].IntroduceImg1 },
            { id: 2, IntroduceImgUrl: Data[i].IntroduceImg2 },
            { id: 3, IntroduceImgUrl: Data[i].IntroduceImg3 },
            { id: 4, IntroduceImgUrl: Data[i].IntroduceImg4 },
            { id: 5, IntroduceImgUrl: Data[i].IntroduceImg5 },
        ]


        let Json = {
            GiftUnique: Data[i].GiftUnique,
            CarouselPictures: CarouselPictures,
            Specification: Specification,
            IntroduceImg: IntroduceImg,
            BusinessName: Data[i].BusinessName,
            CommodityFunllName: Data[i].CommodityFunllName,
            CommodityName: Data[i].CommodityName,
            Registration: Data[i].Registration,
            Label: Data[i].Label,
            Remaining: Data[i].Remaining
        }
        ArrJson.push(Json)
    }
    return ArrJson
}

//列表请求
router.get("/CustomQuery", async ctx => {
    let Arrson = []

    let Data = await db.query(`select GiftUnique,CommodityName,Registration,Exist from Details`)

    for (let i = 0; i < Data.length; i++) {
        let Json = {
            GiftUnique: Data[i].GiftUnique,
            CommodityName: Data[i].CommodityName,
            Registration: Data[i].Registration,
            Exist: Data[i].Exist,
            Edit: false
        }
        Arrson.push(Json)
    }

    Utils.SetHeader(ctx)
    ctx.response.body = Arrson
})

//详情请求
router.get("/CustomQuery/CustomQueryDetails", async ctx => {

    let Data = await db.query(`select * from Details `)

    Utils.SetHeader(ctx)
    ctx.response.body = RegistrationDetailsDataProcess(Data)
})

//实时查询 
router.post("/CustomQuery/CustomQuerySearch", async ctx => {
    let Text = ctx.request.body.Text
    let DataArr = []
    let Data = await db.query(`select distinct Registration from Details where Registration like '%${Text}%'`)

    for (let i = 0; i < Data.length; i++) {
        DataArr.push({
            value: Data[i].Registration,
            Registration: Data[i].Registration
        })
    }
    
    Utils.SetHeader(ctx)
    ctx.response.body =  DataArr//去重
})

//查询返回列表数据
router.post("/CustomQuery/CustomQuerySearchReturnData", async ctx => {
    let Registration = ctx.request.body.Registration
    let DataArr = []
    let Data = await db.query(`select GiftUnique,CommodityName,Registration,Exist from Details where Registration = '${Registration}'`)

    for (let i = 0; i < Data.length; i++) {
        let Json = {
            GiftUnique: Data[i].GiftUnique,
            CommodityName: Data[i].CommodityName,
            Registration: Data[i].Registration,
            Exist: Data[i].Exist,
            Edit: false
        }
        DataArr.push(Json)
    }
    Utils.SetHeader(ctx)
    ctx.response.body = DataArr
})

//查询返回详情数据
router.post("/CustomQuery/CustomQuerySearchReturnDetailsData", async ctx => {
    let Registration = ctx.request.body.Registration
    let Data = await db.query(`select * from Details where Registration = '${Registration}' `)

    Utils.SetHeader(ctx)
    ctx.response.body = RegistrationDetailsDataProcess(Data)
})

module.exports = router