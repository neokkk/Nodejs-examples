const mongoose = reqiuire("mongoose");

module.exports = () => {
  const connect = () => {
    mongoose.connect(
      "mongodb://nk/psw_com_nk@localhost:27017/admin",
      {
        dbName: "test_nodejs"
      },
      err => {
        if (err) console.log("mongodb connect error", error);
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
    connect();
  });

  require("./user");
  require("./comment");
};
