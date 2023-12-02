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
                type: Sequelize.BOOLEAN,
                default: false
            },
            balanceObject: {
                type: Sequelize.DOUBLE
            },
            userId: {
                type: Sequelize.INTEGER
            },
            accesLevel: {
                type: Sequelize.STRING
            },
            objectCompanyName: {
                type: Sequelize.STRING
            },
            objectCompanyUrl: {
                type: Sequelize.STRING
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
            "Objects",
            {
                fields: ["userId"],
                type: "foreign key",
                name: "object_ref_user",
                references: {table: "Users", field: "id"},
                onDelete: "cascade",
                onUpdate: "cascade"
            }
        )
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Objects');
    }
};