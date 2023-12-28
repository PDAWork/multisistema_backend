"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class TypeMeter extends Model {
        static associate(models) {
        }
    }

    TypeMeter.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "TypeMeter",
            createdAt: false,
            updatedAt: false,
        }
    )
    ;
    return TypeMeter;
};
