const router = require('koa-router')()
const multer = require('koa-multer')
const { mkdirSync, mkdir } = require('fs')

let Utils = require('../common/utils')
let db = require('../common/db')

let ImgDir = ""
//礼品唯一id
let GiftUnique = ""
//营业注册号
let Registration = ""
//轮播图片路径
let CarouselPicturesImg = []
//礼品缩略名
let CommodityName = ""
//礼品全名
let CommodityFunllName = ""
//礼品企业名称
let BusinessName = ""
//礼品规格
let Specification = []
//详情图片路径
let IntroduceImg = []
//记录接口是否调用过
let Finish = [null, null, null, null, null, null, null]
//前端发送的记录
let FrontEnd = [null, null, null, null, null, null, null]
//完成时写入数据库
let Insert = (Finish, FrontEnd) => {
    console.log(Finish, FrontEnd)
    //数组添加比对方法
    Array.prototype.equals = function (array) {
        if (!array)
            return false;

        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    }
    
    console.log(Finish.equals(FrontEnd))
    if(Finish.equals(FrontEnd)){
        if(CarouselPicturesImg.length !== 5){
            for (let i = CarouselPicturesImg.length; i < 5; i++) {
                CarouselPicturesImg.push(" ")
            }
        }
        if(Specification.length !== 5){
            for (let i = Specification.length; i < 5; i++) {
                Specification.push(" ")
            }
        }
        if(IntroduceImg.length !== 5){
            for (let i = IntroduceImg.length; i < 5; i++) {
                IntroduceImg.push(" ")
            }
        }

        db.query(`INSERT INTO CustomGifts
        (GiftUnique,CarouselPictures1,CarouselPictures2,CarouselPictures3,CarouselPictures4,CarouselPictures5,
            Specification1,Specification2,Specification3,Specification4,Specification5,
            IntroduceImg1,IntroduceImg2,IntroduceImg3,IntroduceImg4,IntroduceImg5,
            BusinessName,CommodityFunllName,CommodityName,Registration) VALUES 
            ('${GiftUnique}','${CarouselPicturesImg[0]}','${CarouselPicturesImg[1]}','${CarouselPicturesImg[2]}',
            '${CarouselPicturesImg[3]}','${CarouselPicturesImg[4]}','${Specification[0]}',
            '${Specification[1]}','${Specification[2]}','${Specification[3]}',
            '${Specification[4]}','${IntroduceImg[0]}','${IntroduceImg[1]}',
            '${IntroduceImg[2]}','${IntroduceImg[3]}','${IntroduceImg[4]}',
            '${BusinessName}','${CommodityFunllName}','${CommodityName}','${Registration}')`,(err)=>{
                console.l(err)
            })
    }else{
        return
    }
}

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ImgDir)
    },
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");
        cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})

let upload = multer({
    storage: storage
})


//获取商家唯一Code
router.post("/CustomGifts", async ctx => {
    FrontEnd = ctx.request.body.FrontEnd
    console.log(ctx.request.body.FrontEnd)
    Registration = ctx.request.body.Registration
    GiftUnique = Utils.StringRamdom(11)

    ImgDir = `public/images/${Registration}/${GiftUnique}/`
    mkdir(ImgDir, { recursive: true }, (err) => {
        if (err) {
            console.log("创建文件夹时出错啦")
            console.log(err)
            ImgDir = ""
            ctx.body = Utils.ServerErr
            return
        }
    });
    //完成时将数组位标志为1
    Finish[0] = "1"
})

//处理轮播图片
router.post("/CustomGifts/CarouselPictures", upload.single('img'), async ctx => {
    //当未创建文件夹时退出
    if (ImgDir == "") {
        return
    }
    // ctx.body = {
    //     filename: ctx.req.file.filename,//返回文件名
    //     body: ctx.req.body
    // }
    //将图片路径和名存储到数组
    CarouselPicturesImg.push("/" + ctx.req.file.destination + ctx.req.file.filename)

    //完成时将数组位标志为1
    Finish[1] = "1"
})

router.post("/CustomGifts/CommodityName", async ctx => {
    CommodityName = ctx.request.body.CommodityName
    Finish[2] = "1"
})

router.post("/CustomGifts/CommodityFunllName", async ctx => {
    CommodityFunllName = ctx.request.body.CommodityFunllName
    Finish[3] = "1"
})

router.post("/CustomGifts/BusinessName", async ctx => {
    BusinessName = ctx.request.body.BusinessName
    Finish[4] = "1"
})

router.post("/CustomGifts/Specification", async ctx => {
    Specification = ctx.request.body.Specification
    Finish[5] = "1"
})

//处理详情图片
router.post("/CustomGifts/IntroduceImg", upload.single('img'), async ctx => {
    //当未创建文件夹时退出
    if (ImgDir == "") {
        return
    }

    // ctx.body = {
    //     filename: ctx.req.file.filename,//返回文件名
    //     body: ctx.req.body
    // }
    //将图片路径和名存储到数组
    IntroduceImg.push("/" + ctx.req.file.destination + ctx.req.file.filename)

    //完成时将数组位标志为1
    Finish[6] = "1"
    Insert(Finish, FrontEnd)
})

module.exports = router

