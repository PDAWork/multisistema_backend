'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await
            queryInterface.addColumn("Orders", "tariffId", {
                allowNull: true,
                type: Sequelize.INTEGER,
            })
        await queryInterface.addColumn("Orders", "objectId", {
            allowNull: true,
            type: Sequelize.INTEGER,
        })
        await queryInterface.addConstraint(
            "Orders",
            {
                fields: ["tariffId"],
                type: "foreign key",
                name: "tariff_ref_orders",
                references: {table: "Tariffs", field: "id"},
                onDelete: "cascade",
                onUpdate: "cascade"
            }
        )
        await queryInterface.addConstraint(
            "Orders",
            {
                fields: ["objectId"],
                type: "foreign key",
                name: "object_ref_orders",
                references: {table: "Objects", field: "id"},
                onDelete: "cascade",
                onUpdate: "cascade"
            }
        )
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Orders');
    }
};
