const mysql = require('mysql');

const db = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: 'arigado',
	database: 'app',     
    port: '3306'   
});

db.connect((err)=>{
	if(err) throw err;
	console.log("-------->数据库连接成功!<--------")
});

let query = (sql, callback) => {
	return new Promise((resolve, reject) => {
		db.query(sql, (err, data) => {
			if (err) reject(err)
          //  console.log(data)
			else resolve(data)
		})
	})
   
}

module.exports = {
	query
}