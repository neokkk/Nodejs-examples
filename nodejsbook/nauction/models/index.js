const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development',
      config = require('../config/config')[env],
      db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Good = require('./good')(sequelize, Sequelize);
db.Auction = require('./auction')(sequelize, Sequelize);

// 1 : n = action : user
db.User.hasMany(db.Auction);
db.Auction.belongsTo(db.User);

// 1 : n = auction : good
db.Good.hasMany(db.Auction);
db.Auction.belongsTo(db.Good);

// 1 : n = user : good (등록자)
db.Good.belongsTo(db.User, { as: 'owner' });

// 1 : n = user : good (낙찰자)
db.Good.belongsTo(db.User, { as: 'sold' });

module.exports = db;