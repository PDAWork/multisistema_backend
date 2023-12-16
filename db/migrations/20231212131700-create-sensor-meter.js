"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SensorMeters", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      meterId: {
        type: Sequelize.INTEGER,
      },
      objectId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.addConstraint("SensorMeters", {
      fields: ["meterId"],
      type: "foreign key",
      name: "meter_ref_object",
      references: { table: "Meters", field: "id" },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("SensorMeters", {
      fields: ["objectId"],
      type: "foreign key",
      name: "object_ref_meter",
      references: { table: "Objects", field: "id" },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("SensorMeters");
  },
};
