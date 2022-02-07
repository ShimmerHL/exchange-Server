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

module.exports = {
	JsonObj, ServerErr,ServerSuccess, StringRamdom,formatTime
}