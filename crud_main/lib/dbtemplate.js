const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: "",
});
connection.connect();
module.exports = connection;
