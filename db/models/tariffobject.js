"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TariffObject extends Model {
    static associate(models) {}
  }
  TariffObject.init(
    {
      objectId: DataTypes.INTEGER,
      tariffId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "TariffObject",
    }
  );
  return TariffObject;
};
