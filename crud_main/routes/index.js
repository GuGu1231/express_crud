const express = require("express");
const router = express.Router();
const connection = require("../lib/db.js");

// 일단 여기에 다 만들어보고 정리가 필요하면 라우터 분리 진행
// topic.js 보류

router.get("/", (req, res) => {
  connection.query(
    "SELECT writing.id AS writing_id, title, description, created, user.name AS user_name FROM writing LEFT JOIN user ON writing.user_id = user.id",
    (err, datalist) => {
      if (err) {
        throw err;
      }
      res.render("main", { title: "Express", datalist });
    }
  );
});

router.get("/writing", (req, res) => {
  let qs = req.query;
  connection.query(
    `SELECT title, description, created, user.name AS user_name FROM writing LEFT JOIN user ON writing.user_id = user.id WHERE writing.id = ${qs.id}`,
    (err, data) => {
      if (err) {
        throw err;
      }
      res.render("writing", { title: "Express", data });
    }
  );
});

router.get("/create", (req, res) => {
  connection.query(
    "SELECT writing.id AS writing_id, title, description, created, user.name AS user_name FROM writing LEFT JOIN user ON writing.user_id = user.id",
    (err, datalist) => {
      if (err) {
        throw err;
      }
      res.render("create", { title: "Express", datalist });
    }
  );
});

router.get("/create_process", (req, res) => {
  //- insert into 구문 구현
  connection.query(
    "SELECT writing.id AS writing_id, title, description, created, user.name AS user_name FROM writing LEFT JOIN user ON writing.user_id = user.id",
    (err, datalist) => {
      if (err) {
        throw err;
      }
      res.render("create", { title: "Express", datalist });
    }
  );
});

module.exports = router;
