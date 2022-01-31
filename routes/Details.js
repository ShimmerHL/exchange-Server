const router = require('koa-router')()
const db = require('../common/db')
const JG = require('../common/JSON')

router.post('/Details', async (ctx) => {
    const Comparison = null && undefined && '' && NaN
    let GiftUnique = JG.JsonObj(ctx.request.body)
    let DBQuery = JG.JsonObj(await db.query(`select * from Details where GiftUnique= '${GiftUnique.GiftUnique}'`))[0]
    let CarouselPictures = []
    let Specification = []
    let IntroduceImg = []
    for (const key in DBQuery) {
        if(key.slice(0,15) == 'CarouselPicture'){
            CarouselPictures.push(DBQuery[key])
        }else if(key.slice(0,13) == 'Specification'&& DBQuery[key] !== Comparison){
            Specification.push(DBQuery[key])
        } else if(key.slice(0,12) == 'IntroduceImg'){
            IntroduceImg.push(DBQuery[key])
        }
    }
    // console.log(CarouselPictures)
    // console.log(Specification)
    // console.log(IntroduceImg)
    
    let Json = {
        GiftUnique: DBQuery.GiftUnique,
        CommodityName : DBQuery.CommodityName,
        CommodityFunllName: DBQuery.CommodityFunllName,
        CarouselPictures: [...CarouselPictures],
        Specification: [...Specification],
        BusinessName: DBQuery.BusinessName,
        IntroduceImg: [...IntroduceImg],
        SpecificationExist: !Specification,
        Frequency: DBQuery.Frequency,
        Remaining: DBQuery.Remaining,
    }
    ctx.response.body = JSON.stringify(Json)
   // console.log(JSON.stringify(Json))
})


module.exports = router
