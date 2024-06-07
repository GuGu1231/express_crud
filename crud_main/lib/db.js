const mysql = require("mysql");
require("dotenv").config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port : 3307 // pc는 mysql server port가 뭔지는 모르겠으나 기본 설정이 돼있는듯
});
connection.connect();
module.exports = connection;
