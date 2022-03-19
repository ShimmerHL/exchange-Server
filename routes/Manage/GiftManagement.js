const router = require('koa-router')()
const multer = require('koa-multer')

const db = require("../../common/db")
const Utils = require("../../common/Utils")

let ImgUrl = ""  //临时存储用于修改的路径

let storage = multer.diskStorage({
    destination: (request, file, cb) => {
        cb(null, ImgUrl)
    },
    filename: function (request, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

let upload = multer({
    storage: storage
})

function GiftDetailsDataProcess(Data) {

    let ArrJson = []

    let CarouselPictures = []
    let Specification = []
    let IntroduceImg = []

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
            BusinessNameChange: Data[i].BusinessName,
            CommodityFunllName: Data[i].CommodityFunllName,
            CommodityFunllNameChange: Data[i].CommodityFunllName,
            CommodityName: Data[i].CommodityName,
            CommodityNameChange: Data[i].CommodityName,
            Registration: Data[i].Registration,
            Label: Data[i].Label,
            Remaining: Data[i].Remaining
        }
        ArrJson.push(Json)
    }
    return ArrJson
}

//列表请求
router.get("/GiftManagement", async ctx => {
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
router.get("/GiftManagement/GiftDetails", async ctx => {

    let Data = await db.query(`select * from Details `)

    Utils.SetHeader(ctx)
    ctx.response.body = GiftDetailsDataProcess(Data)
})

//实时查询 
router.post("/GiftManagement/GiftManagementSearch", async ctx => {
    let Text = ctx.request.body.Text
    let DataArr = []

    let Data = await db.query(`select GiftUnique,CommodityFunllName from Details where CommodityFunllName like '%${Text}%'`)

    for (let i = 0; i < Data.length; i++) {
        DataArr.push({
            value: Data[i].CommodityFunllName,
            GiftUnique: Data[i].GiftUnique
        })
    }
    Utils.SetHeader(ctx)
    ctx.response.body = DataArr
})

//查询返回列表数据
router.post("/GiftManagement/GiftSearchReturnManagementData", async ctx => {
    let GiftUnique = ctx.request.body.GiftUnique
    let DataArr = []
    let Data = await db.query(`select GiftUnique,CommodityName,Registration,Exist from Details where GiftUnique = '${GiftUnique}'`)

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
router.post("/GiftManagement/GiftSearchReturnDetailsData", async ctx => {
    let GiftUnique = ctx.request.body.GiftUnique
    let Data = await db.query(`select * from Details where GiftUnique = '${GiftUnique}' `)

    Utils.SetHeader(ctx)
    ctx.response.body = GiftDetailsDataProcess(Data)
})

//礼品Exist状态修改 
router.post("/GiftManagement/GiftDeleteOrRecover", async ctx => {
    let GiftUnique = ctx.request.body.GiftUnique
    let Exist = ctx.request.body.Exist

    db.query(`update Details set Exist = '${Exist}' where GiftUnique = '${GiftUnique}'`)
    db.query(`update RedemptionCode set Used = '${Exist}' where GiftUnique = '${GiftUnique}'`)

    Utils.SetHeader(ctx)
    ctx.response.body = {}
})

//获取存储路径
router.post("/GiftManagement/ImageStoragePath", async ctx => {
    let GiftUnique = ctx.request.body.GiftUnique
    let Registration = ctx.request.body.Registration

    ImgUrl = `public/images/${Registration}/${GiftUnique}/`
    Utils.SetHeader(ctx)
    ctx.body = {}
})

//图片上传  //必须使用req获取node原生http请求才能获取数据
router.post("/GiftManagement/UpLoadImg", upload.single('Img'), async ctx => {
    let ImgName = ctx.req.file.filename
    let GiftUnique = ctx.req.body.GiftUnique
    let ColumnName = ctx.req.body.Name

    let FinishUrl = "/" + ImgUrl + ImgName

    db.query(`update CustomGifts set ${ColumnName} = '${FinishUrl}' where GiftUnique = '${GiftUnique}'`)
    db.query(`update Details set ${ColumnName} = '${FinishUrl}' where GiftUnique = '${GiftUnique}'`)

    Utils.SetHeader(ctx)
    ctx.body = FinishUrl
})

//规格或图片删除
router.post("/GiftManagement/DeleteCarouselPicturesOrImg", async ctx => {
    let GiftUnique = ctx.request.body.GiftUnique
    let ColumnName = ctx.request.body.Name
    db.query(`update CustomGifts set ${ColumnName} = ' ' where GiftUnique = '${GiftUnique}'`)
    db.query(`update Details set ${ColumnName} = ' ' where GiftUnique = '${GiftUnique}'`)
    Utils.SetHeader(ctx)
    ctx.response.body = {}
})

//规格 礼品全名 礼品缩略名 企业名 礼品标签 修改 
router.post("/GiftManagement/GiftBasicInformationChange", async ctx => {
    let GiftUnique = ctx.request.body.GiftUnique
    let ColumnName = ctx.request.body.Name
    let ChangeText = ctx.request.body.ChangeText
    console.log(ctx.request.body)
    db.query(`update CustomGifts set ${ColumnName} = '${ChangeText}' where GiftUnique = '${GiftUnique}'`)
    db.query(`update Details set ${ColumnName} = '${ChangeText}' where GiftUnique = '${GiftUnique}'`)

    Utils.SetHeader(ctx)
    ctx.response.body = {}
})


module.exports = router