require("dotenv").config();
const mysql = require("mysql");

const sessionusers = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 5 * 60 * 1000, // 5분
  expiration: 60 * 60 * 1000,
};

const users = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const connection = mysql.createConnection(users);
connection.connect();
module.exports = {
  connection: connection,
  sessionusers: sessionusers,
};
