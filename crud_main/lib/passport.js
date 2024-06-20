const db = require("./db.js");
const bcrypt = require("bcrypt");
const connection = db.connection;
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
// GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  connection.query("SELECT * FROM users WHERE id = ?", [id], (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (email, password, cb) => {
      // email로 체크를 진행(email이 겹치면 안되겠지?)
      connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, user) => {
          if (err) {
            return cb(err);
          }
          if (!user[0]) {
            // connection.query()의 쿼리 결과는 배열 형태...잊고 있었다.
            // req.flash()로 cb()의 세 번째 인자에 접근 가능(오류 or 추가정보)
            return cb(null, false, {
              message: "Incorrect email",
            });
          }
          bcrypt.compare(password, user[0].password, (err, same) => {
            if (err) {
              return cb(err);
            }
            if (!same) {
              return cb(null, false, {
                message: "Incorrect password",
              });
            }
            return cb(null, user[0]);
          });
        }
      );
    }
  )
);

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/callback",
//     },
//     (accessToken, refreshToken, profile, cb) => {
//       // profile: Google에서 제공하는 사용자 프로필 정보
//       console.log("GoogleStrategy", accessToken, refreshToken, profile);
//       var email = profile.emails[0].value;
//       var user = db.get("users").find({ email: email }).value();
//       if (user) {
//         // 기존 유저 정보가 있는 경우
//         user.googleID = profile.id;
//         db.get("users").find({ id: user.id }).assign(user).write();
//         // 사용자의 정보를 업데이트하고 변경사항(user.googleID)을 DB에 적용
//       } else {
//         // 기존에 유저 정보가 없는 경우
//         user = {
//           id: nanoid.nanoid(),
//           email: email,
//           nickname: nickname,
//           googleID: profile.id,
//         };
//         db.get("users").push(user).write();
//       }
//       cb(null, user);
//     }
//   )
// );
module.exports = passport;
