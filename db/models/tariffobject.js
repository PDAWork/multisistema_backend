"use strict";
const {Model} = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class TariffObject extends Model {
        static associate(models) {
        }
    }

    TariffObject.init(
        {
            objectId: DataTypes.INTEGER,
            tariffId: DataTypes.INTEGER,
            startDate: DataTypes.DATE,
            finishDate: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "TariffObject",
        }
    );
    return TariffObject;
};
