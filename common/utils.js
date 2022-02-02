//格式化Obj类型Json数据
let JsonObj = json => {
    return JSON.parse(JSON.stringify(json))
}


//返回服务器意外错误
let ServerErr = {
    "data": undefined,
    "Code": 406,
    "msg": "Error"
}


module.exports = {
    JsonObj,
    ServerErr,
}