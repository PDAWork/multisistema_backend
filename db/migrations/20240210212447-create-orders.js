'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Orders', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            idOrder: {
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.STRING
            },
            userId: {
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
            "Orders",
            {
                fields: ["userId"],
                type: "foreign key",
                name: "orders_ref_user",
                references: {table: "Users", field: "id"},
                onDelete: "cascade",
                onUpdate: "cascade"
            }
        )
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('orders');
    }
};