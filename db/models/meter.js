"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class TypeMeter extends Model {
        static associate(models) {
        }
    }

    TypeMeter.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
            },
            materName: DataTypes.STRING,
            snMeter: DataTypes.STRING,
            eircNum: DataTypes.STRING,
            ingoText: DataTypes.STRING,
            typeId: DataTypes.INTEGER,
            stateId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Meter",
        }
    );
    return TypeMeter;
};
