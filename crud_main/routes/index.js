const express = require("express");
const router = express.Router();
const db = require("../lib/db.js");
const connection = db.connection;

router.get("/", (req, res) => {
  connection.query(
    "SELECT writing.id AS writing_id, title, description, created, users.nickname AS user_name FROM writing LEFT JOIN users ON writing.user_id = users.id",
    (err, datalist) => {
      if (err) {
        throw err;
      }
      res.render("main", { title: "Express", datalist });
    }
  );
});

router.get("/create", (req, res) => {
  res.render("create", { title: "Express" });
});

router.post("/create_process", (req, res) => {
  let user = req.user;
  let post = req.body;
  connection.query(
    "INSERT INTO writing (title, description, created, user_id) VALUES (?, ?, NOW(), ?)",
    [post.title, post.description, user[0].id],
    (err, data) => {
      if (err) {
        throw err;
      }
      // INSERT INTO 쿼리의 경우 반환되는 객체에서 사용 가능
      // insertId: 삽입된 행의 ID (테이블에 AUTO_INCREMENT 속성이 있는 경우)
      // res.redirect(`/writing?id=${data.insertId}}`);
      res.redirect("/");
    }
  );
});

router.get("/writing", (req, res) => {
  let qs = req.query;
  connection.query(
    `SELECT writing.id AS writing_id, title, description, created, user.name AS user_name FROM writing LEFT JOIN user ON writing.user_id = user.id WHERE writing.id = ?`,
    [qs.id],
    (err, data) => {
      if (err) {
        throw err;
      }
      res.render("writing", { title: "Express", data });
    }
  );
});

router.get("/update", (req, res) => {
  let qs = req.query;
  connection.query(
    `SELECT writing.id AS writing_id, title, description, user.name AS user_name FROM writing LEFT JOIN user ON writing.user_id = user.id WHERE writing.id = ?`,
    [qs.id],
    (err, data) => {
      if (err) {
        throw err;
      }
      connection.query("SELECT name FROM user", (err2, userlist) => {
        if (err2) {
          throw err2;
        }
        res.render("update", { title: "Express", data, userlist });
      });
    }
  );
});

// method-override middleware로 PUT, DELETE 요청 처리
router.put("/update_process", (req, res) => {
  let post = req.body;
  connection.query(
    "UPDATE writing SET title = ?, description = ?, user_id = ? WHERE id = ?",
    [post.title, post.description, post.selection, post.id],
    (err, data) => {
      if (err) {
        throw err;
      }
      res.redirect(`/writing?id=${post.id}}`);
    }
  );
});

router.delete("/delete_process", (req, res) => {
  let post = req.body;
  connection.query(
    "DELETE FROM writing WHERE id = ?",
    [post.id],
    (err, data) => {
      if (err) {
        throw err;
      }
      res.redirect(`/`);
    }
  );
});

module.exports = router;
