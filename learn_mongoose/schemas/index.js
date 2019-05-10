const mongoose = require("mongoose");

module.exports = () => {
  const connect = () => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }
    mongoose.connect(
      "mongodb://nk:pswcompassnk@localhost:27017/admin",
      {
        dbName: "test_nodejs",
        useNewUrlParser: true
      },
      err => {
        if (err) console.log("mongodb connect error", err);
        else console.log("mongodb connect success");
      }
    );
  };
  connect();

  mongoose.connection.on("error", err => {
    console.error("mongodb connect error", err);
  });

  mongoose.connection.on("disconnected", err => {
    console.error("mongodb disconnected, retry connection");
    connect(); // 재연결
  });

  require("./user");
  require("./comment");
};
