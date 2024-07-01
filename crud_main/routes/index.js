const express = require("express");
const router = express.Router();
const db = require("../lib/db.js");
const connection = db.connection;

// 로그인 상태 확인 미들웨어 함수(writing쪽은 front쪽을 구현해놔서 따로 빼둠)
function authenticated_json(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    // 401은 권한 없음(Unauthorized)
    res.status(401).json({ message: "로그인이 필요합니다" });
  }
}

// 서버측 사용자 검증(로그인 체크)
// 로그인 상태 확인 미들웨어 함수
function authenticated(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    // 401은 권한 없음(Unauthorized)
    res.status(401).send("Unauthorized");
  }
}

// 서버측 사용자 검증(권한 체크)
function hasPermission(req, res, next) {
  const user = req.user[0]; // 현재 로그인한 id(배열 형태로 들어옴)
  const queryId = req.query.id; // querystring의 id값
  connection.query(
    "SELECT user_id FROM writing WHERE id = ?",
    [queryId],
    (err, results) => {
      if (err) {
        res.status(500).send("Server Error");
      } else if (results.length > 0 && results[0].user_id === user.id) {
        next();
      } else {
        // 403은 forbidden(금지됨)
        res.status(403).send("Forbidden");
      }
    }
  );
}

router.get("/", (req, res) => {
  connection.query(
    "SELECT writing.id AS writing_id, title, description, created, users.nickname AS user_name FROM writing LEFT JOIN users ON writing.user_id = users.id",
    (err, datalist) => {
      if (err) {
        throw err;
      }
      if (req.user) {
        let user = req.user[0];
        res.render("main", { title: "Express", datalist, user });
      } else {
        res.render("main", { title: "Express", datalist });
      }
    }
  );
});

router.get("/writing", authenticated_json, (req, res) => {
  if (req.user) {
    let user = req.user[0];
    let qs = req.query;
    connection.query(
      `SELECT writing.id AS writing_id, title, description, created, users.nickname AS user_name, user_id FROM writing LEFT JOIN users ON writing.user_id = users.id WHERE writing.id = ?`,
      [qs.id],
      (err, data) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Internal Server Error");
        }
        if (!data || data.length === 0) {
          return res.status(404).send("No data found");
        }
        res.render("writing", { title: "Express", data, user });
      }
    );
  }
});

router.get("/create", authenticated, (req, res) => {
  res.render("create", { title: "Express" });
});

router.post("/create_process", authenticated, (req, res) => {
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
      res.redirect(`/writing?id=${data.insertId}}`);
    }
  );
});

router.get("/update", authenticated, hasPermission, (req, res) => {
  let qs = req.query;
  connection.query(
    `SELECT writing.id AS writing_id, title, description, users.nickname AS user_name FROM writing LEFT JOIN users ON writing.user_id = users.id WHERE writing.id = ?`,
    [qs.id],
    (err, data) => {
      if (err) {
        throw err;
      }
      res.render("update", { title: "Express", data });
    }
  );
});

// method-override middleware로 PUT, DELETE 요청 처리
router.put("/update_process", authenticated, (req, res) => {
  let post = req.body;
  connection.query(
    "UPDATE writing SET title = ?, description = ? WHERE id = ?",
    [post.title, post.description, post.id],
    (err, data) => {
      if (err) {
        throw err;
      }
      res.redirect(`/writing?id=${post.id}}`);
    }
  );
});

router.delete("/delete_process", authenticated, (req, res) => {
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

// router.get("/user", authenticated, (req, res) => {
//   connection.query("SELECT * FROM usersi"
//   res.render("user", { title: "Express" });
// });

module.exports = router;
