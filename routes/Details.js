const router = require('koa-router')()
const db = require('../common/db')
const Utils = require('../common/utils')

//处理商品详情页面
router.post('/Details', async (ctx) => {
    const Comparison = null && undefined && '' && NaN
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
        SpecificationExist: !Specification,
        Frequency: DBQuery.Frequency,
        Remaining: DBQuery.Remaining,
    }
    ctx.response.body = JSON.stringify(JsonData)
})


module.exports = router
