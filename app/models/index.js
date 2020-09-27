require('dotenv').config();

// refers to library
const Sequelize = require("sequelize");

const dbName = process.env.DB
const userName = process.env.USER_NAME
const password = process.env.PASSWORD
const host = process.env.HOST
const dialect = process.env.DIALECT
const poolMax = parseInt(process.env.POOL_MAX)
const poolMin = parseInt(process.env.POOL_MIN)
const acquire = parseInt(process.env.ACQUIRE)
const idle = parseInt(process.env.IDLE)

// refers to instance of Sequelize
const sequelize = new Sequelize(dbName, userName, password, {
  logging: false,
  host: host,
  dialect: dialect,
  pool: {
    max: poolMax,
    min: poolMin,
    acquire: acquire,
    idle: idle
  }
});

// testing connection
sequelize
  .authenticate()
  .then(function(err) {
    console.log('Sequelize: connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Sequelize: unable to connect to the database:', err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.contractors = require("./contractors.model.js")(sequelize, Sequelize);
db.locations = require("./locations.model.js")(sequelize, Sequelize);
db.bookings = require("./bookings.model.js")(sequelize, Sequelize)

//tables relations
db.contractors.hasMany(db.bookings, {foreignKey: 'contractorsID', sourceKey: 'id'})
db.bookings.belongsTo(db.contractors, {foreignKey: 'contractorsID', targetKey: 'id'})

db.locations.hasMany(db.bookings, {foreignKey: 'locationsID', sourceKey: 'id'})
db.bookings.belongsTo(db.locations, {foreignKey: 'locationsID', targetKey: 'id'})

module.exports = db;
