"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tariff extends Model {
    static associate(models) {}
  }
  Tariff.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Tariff",
    }
  );
  return Tariff;
};
