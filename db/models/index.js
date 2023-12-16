"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
const user = require("../models/user");
const object = require("../models/object");
const sensor = require("../models/sensors");
const db = {};

let sequelize;
if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
    );
}

fs.readdirSync(__dirname)
    .filter((file) => {
        return (
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js" &&
            file.indexOf(".test.js") === -1
        );
    })
    .forEach((file) => {
        const model = require(path.join(__dirname, file))(
            sequelize,
            Sequelize.DataTypes
        );
        db[model.name] = model;
    });

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.user = user(sequelize, Sequelize);
db.object = object(sequelize, Sequelize);
db.sensor = sensor(sequelize, Sequelize);

// db.users = require('./user.js')(sequelize, Sequelize);
// db.objects = require('./object.js')(sequelize, Sequelize);

db.user.hasMany(db.object, {as: "objects"});
db.object.hasMany(db.sensor, {as: "sensors"});
db.object.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
});
db.sensor.belongsTo(db.object, {
    foreignKey: "objectId",
    as: "objects",
});

module.exports = db;
