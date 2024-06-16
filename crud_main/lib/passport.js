const db = require("./db.js");
const connection = db.connection;
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;
// GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

passport.serializeUser((user, cb) => {
  console.log("serializeUser", user);
  cb(null, user.id);
});
passport.deserializeUser((id, cb) => {
  connection.query("SELECT * FROM users WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.log(err);
      cb(err);
    } else {
      cb(null, results);
    }
  });
  console.log("deserializeUser", id);
  cb(null, id);
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (email, password, cb) => {
      console.log("LocalStrategy", email, password);
      var user = db.get("users").find({ email: email }).value();
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            return cb(null, user);
          } else {
            return cb(null, false, { message: "Incorrect password" });
          }
        });
      } else {
        return cb(null, false, { message: "Incorrect email" });
      }
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
