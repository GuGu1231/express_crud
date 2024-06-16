const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/register", (req, res) => {
  res.render("register", { title: "Express" });
});
router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/register_process", (req, res) => {
  const post = req.body;
  const nickname = post.nickname;
  const email = post.email;
  const password = post.password;
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error(err);
    }
});
router.post("/register_process", function (request, response) {
  bcrypt.hash(password, 10, (err, hash) => {
    var user = db.get("users").find({ email: email }).value();
    if (user) {
      // 기존 유저가 있는 경우(구글 아이디로 로그인한 경우)
      user.password = hash;
      user.nickname = nickname;
      db.get("users").find({ id: user.id }).assign(user).write();
    } else {
      // 기존 유저가 없는 경우
      var user = {
        id: nanoid.nanoid(),
        email: email,
        password: hash,
        nickname: nickname,
      };
      db.get("users").push(user).write();
    }
    request.login(user, () => {
      response.redirect("/");
    });
  });
});
// router.post(
//   "/login_process",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/auth/login",
//   })
// );

module.exports = router;
