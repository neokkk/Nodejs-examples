const mongoose = require("mongoose");

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env;

module.exports = () => {
  const connect = () => {
    if (NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }
    mongoose.connect(
      `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`,
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
