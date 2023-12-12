'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TariffObject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TariffObject.init({
    objectId: DataTypes.INTEGER,
    tariffId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'TariffObject',
  });
  return TariffObject;
};