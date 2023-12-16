"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MetersVals extends Model {
    static associate(models) {}
  }
  MetersVals.init(
    {
      meterId: DataTypes.INTEGER,
      date: DataTypes.DATE,
      value: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "MetersVals",
    }
  );
  return MetersVals;
};
