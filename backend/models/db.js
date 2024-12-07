const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',  
  database: 'btl_csdl' 
});

db.connect((err) => {
  if (err) {
    console.error('Không thể kết nối đến cơ sở dữ liệu: ', err);
    process.exit(1);
  }
  console.log('Kết nối đến MySQL thành công.');
});

module.exports = db;
