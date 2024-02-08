'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await
            queryInterface.addColumn("Users", 'idRole', {
                allowNull: true,
                type: Sequelize.INTEGER,
            })
        await queryInterface.addConstraint(
            "Users",
            {
                fields: ["idRole"],
                type: "foreign key",
                name: "role_ref",
                references: {table: "TypeRoles", field: "id"},
                onDelete: "cascade",
                onUpdate: "cascade"
            }
        )
    },

    async down(queryInterface, Sequelize) {
    }
};
