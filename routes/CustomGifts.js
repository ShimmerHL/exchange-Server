const router = require('koa-router')()
const multer = require('koa-multer')
const { rmdir, mkdir } = require('fs')

let Utils = require('../common/utils')
let db = require('../common/db')

//图片文件夹创建路径
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
//礼品数量默认为1
let GiftNumber = 1
//记录接口是否调用过
let Finish = [null, null, null, null, null, null, null]
//前端发送的记录
let FrontEnd = [null, null, null, null, null, null, null]
//默认热度
let Frequency = 0

//初始化数据
function Initialize(){
    ImgDir = ""
    GiftUnique = ""
    Registration = ""
    CarouselPicturesImg = []
    CommodityName = ""
    CommodityFunllName = ""
    BusinessName = ""
    Specification = []
    IntroduceImg = []
    GiftNumber = 1
    Finish = [null, null, null, null, null, null, null]
    FrontEnd = [null, null, null, null, null, null, null]
}
//完成时写入数据库
let Insert = (Finish, FrontEnd) => {
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

    if (Finish.equals(FrontEnd)) {
        if (CarouselPicturesImg.length !== 5) {
            for (let i = CarouselPicturesImg.length; i < 5; i++) {
                CarouselPicturesImg.push(" ")
            }
        }
        if (Specification.length !== 5) {
            for (let i = Specification.length; i < 5; i++) {
                Specification.push(" ")
            }
        }
        if (IntroduceImg.length !== 5) {
            for (let i = IntroduceImg.length; i < 5; i++) {
                IntroduceImg.push(" ")
            }
        }
        
         db.query(`INSERT INTO CustomGifts
        (GiftUnique,CarouselPictures1,CarouselPictures2,CarouselPictures3,CarouselPictures4,CarouselPictures5,
            Specification1,Specification2,Specification3,Specification4,Specification5,
            IntroduceImg1,IntroduceImg2,IntroduceImg3,IntroduceImg4,IntroduceImg5,
            BusinessName,CommodityFunllName,CommodityName,Registration,GiftNumber) VALUES 
            ('${GiftUnique}','${CarouselPicturesImg[0]}','${CarouselPicturesImg[1]}','${CarouselPicturesImg[2]}',
            '${CarouselPicturesImg[3]}','${CarouselPicturesImg[4]}','${Specification[0]}',
            '${Specification[1]}','${Specification[2]}','${Specification[3]}',
            '${Specification[4]}','${IntroduceImg[0]}','${IntroduceImg[1]}',
            '${IntroduceImg[2]}','${IntroduceImg[3]}','${IntroduceImg[4]}',
            '${BusinessName}','${CommodityFunllName}','${CommodityName}','${Registration}',${GiftNumber})`, (err) => {
            console.log(err)
        })
        let dbInert =  db.query(`INSERT INTO Details
            (GiftUnique,CarouselPictures1,CarouselPictures2,CarouselPictures3,CarouselPictures4,CarouselPictures5,
                Specification1,Specification2,Specification3,Specification4,Specification5,
                IntroduceImg1,IntroduceImg2,IntroduceImg3,IntroduceImg4,IntroduceImg5,
                BusinessName,CommodityFunllName,CommodityName,Frequency,Remaining,Thumbnail,Registration) VALUES 
                ('${GiftUnique}','${CarouselPicturesImg[0]}','${CarouselPicturesImg[1]}','${CarouselPicturesImg[2]}',
                '${CarouselPicturesImg[3]}','${CarouselPicturesImg[4]}','${Specification[0]}',
                '${Specification[1]}','${Specification[2]}','${Specification[3]}',
                '${Specification[4]}','${IntroduceImg[0]}','${IntroduceImg[1]}',
                '${IntroduceImg[2]}','${IntroduceImg[3]}','${IntroduceImg[4]}',
                '${BusinessName}','${CommodityFunllName}','${CommodityName}',
                ${Frequency},${GiftNumber},'${CarouselPicturesImg[0]}','${Registration}')`, (err) => {
            console.log(err)
        })
        Initialize()
        //写入完成
       return dbInert
    } else {
        Initialize()
        return 0
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

//获取商家唯一Code和需要插入的数据统计与礼品总数
router.post("/CustomGifts", async ctx => {

    FrontEnd = ctx.request.body.FrontEnd
    Registration = ctx.request.body.Registration
    GiftUnique = Utils.StringRamdom(15) + Date.now()
    GiftNumber = ctx.request.body.GiftNumber

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

    ctx.body = Utils.ServerSuccess
    //完成时将数组位标志为1
    Finish[0] = "1"
})
try {
    //处理轮播图片
    router.post("/CustomGifts/CarouselPictures", upload.single('img'), async ctx => {

        //当未创建文件夹时退出
        if (ImgDir == "") {
            return
        }
        ctx.body = {
            filename: ctx.req.file.filename,//返回文件名
            body: ctx.req.body
        }

        //将图片路径和名存储到数组
        CarouselPicturesImg.push("/" + ctx.req.file.destination + ctx.req.file.filename)

        //完成时将数组位标志为1
        Finish[1] = "1"
    })
} catch (error) {
    console.log(error)
    rmdir(ImgDir, (err) => {
        if (err) console.log(err)

    })
    ctx.response.body = Utils.ServerErr
}


router.post("/CustomGifts/CommodityName", async ctx => {
    CommodityName = ctx.request.body.CommodityName
    Finish[2] = "1"

    ctx.body = Utils.ServerSuccess
})

router.post("/CustomGifts/CommodityFunllName", async ctx => {
    CommodityFunllName = ctx.request.body.CommodityFunllName
    Finish[3] = "1"

    ctx.body = Utils.ServerSuccess
})

router.post("/CustomGifts/BusinessName", async ctx => {
    BusinessName = ctx.request.body.BusinessName
    Finish[4] = "1"

    ctx.body = Utils.ServerSuccess
})

router.post("/CustomGifts/Specification", async ctx => {
    Specification = ctx.request.body.Specification
    Finish[5] = "1"

    ctx.body = Utils.ServerSuccess
})

try {
    //处理详情图片
    router.post("/CustomGifts/IntroduceImg", upload.single('img'), async ctx => {
        //当未创建文件夹时退出
        if (ImgDir == "") {
            return
        }

        ctx.body = {
            filename: ctx.req.file.filename,//返回文件名
            body: ctx.req.body
        }

        //将图片路径和名存储到数组
        IntroduceImg.push("/" + ctx.req.file.destination + ctx.req.file.filename)

        //完成时将数组位标志为1
        Finish[6] = "1"
    })
} catch (error) {
    console.log(error)
    rmdir(ImgDir, (err) => {
        if (err) console.log(err)

    })
    ctx.response.body = Utils.ServerErr
}

router.get('/CustomGifts/dbSuccess', async ctx => {
    console.log(CarouselPicturesImg)
    //插入数据
    let InsertOk =  await Insert(Finish, FrontEnd)
    if (InsertOk == 0) {
        ctx.body = {
            undefined,
            "Code": 500,
            "mgs": "err"
        }

    } else {
        ctx.body = {
            undefined,
            "Code": 200,
            "mgs": "Success"
        }
    }

})


module.exports = router

