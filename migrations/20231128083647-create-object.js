'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Objects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      house: {
        type: Sequelize.STRING
      },
      lable: {
        type: Sequelize.STRING
      },
      accountId: {
        type: Sequelize.STRING
      },
      personalAccount: {
        type: Sequelize.STRING
      },
      connectDate: {
        type: Sequelize.DATE
      },
      enable: {
        type: Sequelize.BOOLEAN
      },
      idUser: {
        type: Sequelize.INTEGER
      },
      accessLevel: {
        type: Sequelize.STRING
      },
      objectCompanyName: {
        type: Sequelize.STRING
      },
      objectCompanyAccount: {
        type: Sequelize.STRING
      },
      objectCompanyUrl: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Objects');
  }
};