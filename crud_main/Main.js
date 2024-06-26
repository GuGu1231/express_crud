const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const methodOverride = require("method-override");
const topicrouter = require("./routes/topic.js");
const indexrouter = require("./routes/index.js");

const app = express();
const port = 3000;

// set view engine
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "pug");

// use middle ware
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  "/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist/")
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexrouter);
app.use("/topic", topicrouter);

app.use(function (req, res, next) {
  res.status(404).send("Sorry cant find that!");
});

// error handling middleware
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
