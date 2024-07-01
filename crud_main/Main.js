const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const methodOverride = require("method-override");
const authrouter = require("./routes/auth.js");
const indexrouter = require("./routes/index.js");
const app = express();
const port = 3000;

const db = require("./lib/db.js");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const sessionStore = new MySQLStore(db.sessionusers);
const flash = require("connect-flash");
const passport = require("./lib/passport.js");

// set view engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "pug");

// use middle ware
app.use(
  session({
    secure: true,
    HttpOnly: true,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // 클라이언트 세션 쿠키 유효 기간 제어
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash()); // session에 flash 메시지를 저장
// 메시지가 사용자에게 표시된 후에는 자동으로 세션에서 제거됨

app.use(helmet());
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "https://cdn.jsdelivr.net/npm/axios/dist/",
          "https://cdn.jsdelivr.net/npm/sweetalert2@10",
        ],
      },
    },
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // 클라이언트가 보낸 json 데이터 파싱을 위해 필요
app.use(methodOverride("_method"));
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist/")
);
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.use("/", indexrouter);
app.use("/auth", authrouter);

// 404 처리 미들웨어는 일반적으로 모든 라우터 아래에 위치해야 함
// 요청이 어떤 라우터에도 매칭되지 않을 때만 이 미들웨어가 실행되기 때문
app.use((req, res, next) => {
  res.status(404).send("페이지를 찾지 못했습니다.");
});

// error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
