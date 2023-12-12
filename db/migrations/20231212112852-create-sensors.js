'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Sensors', {
      sn: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      model: {
        type: Sequelize.STRING
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      ssid: {
        type: Sequelize.STRING
      },
      hardwere: {
        type: Sequelize.STRING
      },
      firmwawe: {
        type: Sequelize.STRING
      },
      batery: {
        type: Sequelize.INTEGER
      },
      localip: {
        type: Sequelize.STRING
      },
      checkHours: {
        type: Sequelize.INTEGER
      },
      checkPeriodDipslay: {
        type: Sequelize.STRING
      },
      lastConnection: {
        type: Sequelize.DATE
      },
      lastConnectionWarning: {
        type: Sequelize.STRING
      },
      licChennels: {
        type: Sequelize.INTEGER
      },
      requests: {
        type: Sequelize.INTEGER
      },
      rssi: {
        type: Sequelize.STRING
      },
      log: {
        type: Sequelize.DOUBLE
      },
      scan: {
        type: Sequelize.INTEGER
      },
      vol: {
        type: Sequelize.INTEGER
      },
      send: {
        type: Sequelize.INTEGER
      },
      readoutDate: {
        type: Sequelize.DATE
      },
      requestDate: {
        type: Sequelize.DATE
      },
      capState: {
        type: Sequelize.BOOLEAN
      },
      powerSupply: {
        type: Sequelize.BOOLEAN
      },
      emptyInputs: {
        type: Sequelize.BOOLEAN
      },
      nbiot: {
        type: Sequelize.STRING
      },
      objectId: {
        type: Sequelize.INTEGER
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
    await queryInterface.addConstraint(
      "Sensors",
      {
        fields: ["objectId"],
        type: "foreign key",
        name: "object_ref_sensor",
        references: { table: "Objects", field: "id" },
        onDelete: "cascade",
        onUpdate: "cascade"
      }
    )

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Sensors');
  }
};