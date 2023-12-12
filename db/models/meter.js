'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeMeter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TypeMeter.init({
    meterId: DataTypes.INTEGER,
    materName: DataTypes.STRING,
    snMeter: DataTypes.STRING,
    eircNum: DataTypes.STRING,
    ingoText: DataTypes.STRING,
    typeId: DataTypes.INTEGER,
    stateId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Meter',
  });
  return TypeMeter;
};