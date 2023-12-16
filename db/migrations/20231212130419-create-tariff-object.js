"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TariffObjects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      objectId: {
        type: Sequelize.INTEGER,
      },
      tariffId: {
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

    await queryInterface.addConstraint("TariffObjects", {
      fields: ["tariffId"],
      type: "foreign key",
      name: "tariff_ref_tariff",
      references: { table: "Tariffs", field: "id" },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    await queryInterface.addConstraint("TariffObjects", {
      fields: ["objectId"],
      type: "foreign key",
      name: "object_ref_tariff",
      references: { table: "Objects", field: "id" },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TariffObjects");
  },
};
