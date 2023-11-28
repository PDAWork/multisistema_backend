'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Object extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }

    Object.init({
        house: DataTypes.STRING,
        lable: DataTypes.STRING,
        accountId: DataTypes.STRING,
        personalAccount: DataTypes.STRING,
        connectDate: DataTypes.DATE,
        enable: DataTypes.BOOLEAN,
        idUser: DataTypes.INTEGER,
        accessLevel: DataTypes.STRING,
        objectCompanyName: DataTypes.STRING,
        objectCompanyAccount: DataTypes.STRING,
        objectCompanyUrl: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Object',
    });

    return Object;
};

