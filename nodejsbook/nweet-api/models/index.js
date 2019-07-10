const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json.js')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.Domain = require('./domain')(sequelize, Sequelize);

// 포스트 (한 유저가 많은 포스트 소유 - 1 : n 관계)
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

// 해시태그 (여러 포스트가 많은 해시태그 소유 - n : n 관계)
db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' }); // 다대다 관계에서는 새로운 테이블이 필요 (through: '테이블명')

// 팔로잉 - 팔로우 (n : n)
db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followings', foreignKey: 'followersId' });
db.User.belongsToMany(db.User, { through: 'Follow', as: 'Followers', foreignKey: 'followingId' });

// 좋아요 (n : n)
db.User.belongsToMany(db.Post, { through: 'Like' });
db.Post.belongsToMany(db.User, { through: 'Like', as: 'Liker' });

// 유저 - 발급키 (1 : n)
db.User.hasMany(db.Domain);
db.Domain.belongsTo(db.User);

module.exports = db;
