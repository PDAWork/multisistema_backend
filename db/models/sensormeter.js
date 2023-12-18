"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SensorMeter extends Model {
    static associate(models) {}
  }
  SensorMeter.init(
    {
      meterId: DataTypes.INTEGER,
      objectId: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "SensorMeter",
    }
  );
  return SensorMeter;
};