'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Meters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      meterName: {
        type: Sequelize.STRING
      },
      snMeter: {
        type: Sequelize.STRING
      },
      eircNum: {
        type: Sequelize.STRING
      },
      infoText: {
        type: Sequelize.STRING
      },
      typeId: {
        type: Sequelize.INTEGER
      },
      stateId: {
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
      "Meters",
      {
        fields: ["typeId"],
        type: "foreign key",
        name: "type_ref_meter",
        references: { table: "TypeMeters", field: "id" },
        onDelete: "cascade",
        onUpdate: "cascade"
      }
    )
    await queryInterface.addConstraint(
      "Meters",
      {
        fields: ["stateId"],
        type: "foreign key",
        name: "state_ref_meter",
        references: { table: "States", field: "id" },
        onDelete: "cascade",
        onUpdate: "cascade"
      }
    )
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Meters');
  }
};