"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.json")[env];
// Model
const user = require("../models/user");
const object = require("../models/object");
const sensor = require("../models/sensors");
const meter = require("../models/meter");
const typeMeter = require('../models/typemeter');
const states = require('../models/state');
const metersVals = require('../models/metersvals');

const sensorMeter = require("../models/sensormeter");
const tariff = require("../models/tariff");
const tariffObject = require("../models/tariffobject");
const orders = require("../models/orders");
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
db.meter = meter(sequelize, Sequelize);
db.typeMeter = typeMeter(sequelize, Sequelize);
db.states = states(sequelize, Sequelize);
db.sensorMeter = sensorMeter(sequelize, Sequelize);
db.metersVals = metersVals(sequelize, Sequelize);
db.tariff = tariff(sequelize, Sequelize);
db.tariffObject = tariffObject(sequelize, Sequelize);
db.orders = orders(sequelize, Sequelize);

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

db.meter.belongsToMany(db.sensor, {
    foreignKey: "sensorId",
    through: "SensorMeters"
});
db.sensor.belongsToMany(db.meter, {
    foreignKey: "meterId",
    through: "SensorMeters"
});

db.sensorMeter.belongsTo(
    db.sensor, {
        foreignKey: "sensorId",
    }
)

db.sensorMeter.belongsTo(
    db.meter, {
        as: "meter",
        foreignKey: "meterId",
    }
)

db.sensor.hasMany(db.sensorMeter, {
    as: "meters",
    foreignKey: "sensorId"
})
db.meter.hasMany(db.sensorMeter, {
    foreignKey: "meterId"
})

db.meter.hasMany(db.metersVals, {
    foreignKey: "meterId"
})

db.meter.belongsTo(db.typeMeter, {
    foreignKey: "typeId",
    as: "TypeMeter" // Add an alias for the association
});


db.meter.belongsTo(db.states, {
    foreignKey: "stateId",
    as: "State" // Add an alias for the association
});


db.tariffObject.belongsTo(db.tariff, {
    foreignKey: "tariffId",
    as: "tariff"
})
db.tariffObject.belongsTo(db.object, {
    foreignKey: "objectId",
    as: "object"
})


module.exports = db;
