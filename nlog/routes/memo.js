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
  db.query("SELECT * FROM t_n_memo ORDER BY memo_id DESC", (err, result) => {
    if (err) throw err;

    memo_id = result.length + 1;

    for (let i = 0; i < result.length; i++) {
      result[i].memo_date = dateFormat(result[i].memo_date, "yy-mm-dd HH:MM");
    }
    res.render("memo/template", { result, memo_id, modify: null });
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
router.get("/modify/:modify_id", (req, res, next) => {
  const tmp = path.parse(req.params.modify_id).base, // :modify_id
    modifyId = tmp.slice(1); // modify_id

  db.query(
    `SELECT memo_id, memo_text FROM t_n_memo WHERE memo_id=${modifyId}`,
    (err, result) => {
      if (err) throw err;

      res.render("memo/template", { modify: result });
    }
  );
});

// update
router.post("/update", (req, res, next) => {
  const postData = req.body;

  postData.memo_update_id = Number(postData.memo_update_id);

  db.query(
    `UPDATE t_n_memo SET memo_text='${
      postData.memo_update_input
    }' WHERE memo_id=${postData.memo_update_id}`,
    (err, result) => {
      if (err) throw err;

      res.redirect("/memo");
    }
  );
});

// delete
router.get("/delete/:delete_id", (req, res, next) => {
  const tmp = path.parse(req.params.delete_id).base, // :delete_id
    deleteId = tmp.slice(1); // delete_id

  db.query(`DELETE FROM t_n_memo WHERE memo_id=${deleteId}`, (err, result) => {
    if (err) throw err;

    res.redirect("/memo");
  });
});

module.exports = router;
