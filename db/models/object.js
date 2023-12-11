"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Object extends Model {
    static associate(models) {
      // define association here
    }
  }

  Object.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      house: DataTypes.STRING,
      lable: DataTypes.STRING,
      accountId: DataTypes.STRING,
      personalAccount: DataTypes.STRING,
      connectDate: DataTypes.DATE,
      enable: DataTypes.BOOLEAN,
      balanceObject: DataTypes.DOUBLE,
      userId: DataTypes.INTEGER,
      accesLevel: DataTypes.STRING,
      objectCompanyName: DataTypes.STRING,
      objectCompanyUrl: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Object",
    }
  );

  return Object;
};
