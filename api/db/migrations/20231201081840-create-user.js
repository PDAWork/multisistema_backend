'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            login: {
                type: Sequelize.DataTypes.STRING(64),
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false

            },
            firstName: {
                type: Sequelize.DataTypes.STRING(64),
                allowNull: false
            },
            lastName: {
                type: Sequelize.DataTypes.STRING(64),
                allowNull: false
            },
            phone: {
                type: Sequelize.DataTypes.STRING(16),
                allowNull: false
            },
            sid: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            createdAt: {
                allowNull: true,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
    }
};