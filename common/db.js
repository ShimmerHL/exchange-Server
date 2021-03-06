const mysql = require('mysql2');

const db = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: 'arigado',
	database: 'appdb',
	port: '3306',
	
});

db.connect((err) => {
	if (err) throw err;
	console.log("-------->     数据库连接成功!    <--------")
});

let query = (sql, callback) => {
	return new Promise((resolve, reject) => {
		db.query(sql, (err, data) => {
			if (err){
				reject(err)
			}else {
				resolve(data)
			}
		})
		
	})

}

module.exports = {
	query
}