//格式化Obj类型Json数据
let JsonObj = json => {
	return JSON.parse(JSON.stringify(json))
}

//输出指定长度的随机字符串
function StringRamdom(len) {
	let code = []
	let strRom = ""

	for (let i = 0; i <= 9; i++) {
		code.push(i)
	}

	for (let i = 65; i <= 122; i++) {
		if (i == 91) { i = 97 }
		if (i >= 65) code.push(String.fromCharCode(i))
	}
	code.sort(() => { return 0.5 - Math.random() })

	for (let i = 0; i <= len; i++) {
		strRom += code[i]
	}

	return strRom
}
//空数组判断
let IfNullArr = (arr) =>{
	return Object.prototype.isPrototypeOf(arr)&& Object.keys(arr).length === 0
}
//创建订单号
function RandomNumber() {
	function setTimeDateFmt(s) {  // 个位数补齐订单号十位数
		return s < 10 ? '0' + s : s;
	}

    const now = new Date()
    let month = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    let seconds = now.getSeconds()
    month = setTimeDateFmt(month)
    day = setTimeDateFmt(day)
    hour = setTimeDateFmt(hour)
    minutes = setTimeDateFmt(minutes)
    seconds = setTimeDateFmt(seconds)
    let orderCode = now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 1000000)).toString();
    console.log(orderCode)
    return orderCode;
}

//返回服务器意外错误
let ServerErr = {
	"data": undefined,
	"Code": 406,
	"msg": "Error"
}

//返回请求成功
let ServerSuccess = {
	"data": undefined,
	"Code": 200,
	"msg": "Success"
}


//获取年月日时分秒
function formatTime(date){
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
  
	return `${[year, "0" + month, "0" + day].map(num => num).join('-')}`
}

let SetHeader = (ctx)=>{  //跨域请求头
	ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
}

let ServerUrl = "http://localhost:3000"

module.exports = {
	JsonObj, ServerErr,ServerSuccess, StringRamdom,formatTime,IfNullArr,RandomNumber,SetHeader,ServerUrl
}