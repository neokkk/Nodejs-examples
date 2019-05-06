const express = require("express"),
  mysql = require("mysql"),
  dateFormat = require("dateformat"),
  path = require("path"),
  router = express.Router();

/* MySQL DB connect */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "test"
});
db.connect();

let memo_id = 0;

/* GET memo listing. */
router.get("/", (req, res, next) => {
  db.query("SELECT * FROM t_n_memo", (err, result) => {
    if (err) throw err;

    memo_id = result.length + 1;
    result.memo_date = dateFormat(result.memo_date, "longDate");

    res.render("memo/form", { result, memo_id });
  });
});

// create
router.post("/create", (req, res, next) => {
  const postData = req.body;

  if (postData.memo_input !== "") {
    db.query(
      "INSERT INTO t_n_memo (memo_id, memo_text, memo_user, memo_date) VALUES (?, ?, ?, Now())",
      [`${postData.memo_id}`, `${postData.memo_input}`, ""],
      (err, result) => {
        if (err) throw err;
      }
    );
    res.redirect("/memo");
  } else {
    res.redirect("/memo");
  }
});

// modify
router.get("/modify/:modify_id", (req, res, next) => {});

// update
router.post("/update", (req, res, next) => {});

// delete
router.get("/delete/:delete_id", (req, res, next) => {
  const tmp = path.parse(req.params.delete_id).base;
  const deleteId = tmp.slice(1);

  db.query(`DELETE FROM t_n_memo WHERE memo_id=${deleteId}`, (err, result) => {
    if (err) throw err;

    res.redirect("/memo");
  });
});

module.exports = router;
