const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../lib/db.js");
const passport = require("../lib/passport.js");

const connection = db.connection;

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  req.session.save(() => {
    const flash = req.flash("message");
    res.render("login", { message: flash });
  });
});

router.post("/register_process", (req, res) => {
  const post = req.body;
  const nickname = post.nickname;
  const email = post.email;
  const password = post.password;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(err);
      return res.json({
        success: false,
        message: "Error occurred during password hashing.",
      });
    }
    connection.query(
      "INSERT INTO users (nickname, email, password) VALUES (?, ?, ?)",
      [nickname, email, hash],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.json({
            success: false,
            message: "Error occurred during user registration.",
          });
        }
        res.json({ success: true, message: "" });
      }
    );
  });
});

router.post("/login_process", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (req.session.flash) {
      req.session.flash = {};
    }
    req.flash("message", info.message); // 실패 메시지 설정

    req.session.save(() => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/auth/login");
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return req.session.save(() => {
          res.redirect("/");
        });
      });
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
    }
  });
  req.session.save(() => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.clearCookie("connect.sid"); // 설정한 세션 쿠키의 이름(이건 기본 이름)
      res.redirect("/");
    });
  });
});

module.exports = router;
