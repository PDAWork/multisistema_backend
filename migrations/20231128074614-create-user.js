'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      login: {
        validate: {
          isEmail: true,          
        },
        unique: true,
        type: Sequelize.STRING(64)
      },
      password: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING(16)
      },
      firstName: {
      
        type: Sequelize.STRING(64)
      },
      lastName: {
        type: Sequelize.STRING(64)
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