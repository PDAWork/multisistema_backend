'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sensors extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Sensors.init({
    sn: DataTypes.STRING,
    name: DataTypes.STRING,
    model: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    ssid: DataTypes.STRING,
    hardwere: DataTypes.STRING,
    firmwawe: DataTypes.STRING,
    batery: DataTypes.INTEGER,
    localip: DataTypes.STRING,
    checkHours: DataTypes.INTEGER,
    checkPeriodDipslay: DataTypes.STRING,
    lastConnection: DataTypes.DATE,
    lastConnectionWarning: DataTypes.STRING,
    licChennels: DataTypes.INTEGER,
    requests: DataTypes.INTEGER,
    rssi: DataTypes.STRING,
    log: DataTypes.DOUBLE,
    scan: DataTypes.INTEGER,
    vol: DataTypes.INTEGER,
    send: DataTypes.INTEGER,
    readoutDate: DataTypes.DATE,
    requestDate: DataTypes.DATE,
    capState: DataTypes.BOOLEAN,
    powerSupply: DataTypes.BOOLEAN,
    emptyInputs: DataTypes.BOOLEAN,
    nbiot: DataTypes.STRING,
    objectId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sensors',
  });
  return Sensors;
};