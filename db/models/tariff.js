"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Tariff extends Model {
        static associate(models) {
        }
    }

    Tariff.init(
        {
            name: DataTypes.STRING,
            cost: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Tariff",
            createdAt: false,
            updatedAt: false,
        }
    );
    return Tariff;
};
