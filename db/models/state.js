"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class State extends Model {
    static associate(models) {}
  }
  State.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "State",
    }
  );
  return State;
};
