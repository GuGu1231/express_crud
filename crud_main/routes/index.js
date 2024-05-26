const express = require("express");
const router = express.Router();
const connection = require("../lib/db.js");

router.get("/", (req, res) => {
  connection.query("SELECT * FROM topic", (err, datalist) => {
    if (err) {
      throw err;
    }
    res.render("main", { title: "Express", datalist });
  });
});

router.get("/create", (req, res) => {
  res.render("main", { title: "Express", datalist });
});

module.exports = router;
