'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await
            queryInterface.addColumn("TariffObjects", "startDate", {
                allowNull: false,
                type: Sequelize.DATE,
            })
        await queryInterface.addColumn("TariffObjects", "finishDate", {
            allowNull: false,
            type: Sequelize.DATE,
        })
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('TariffObjects');
        /**
         * Add reverting commands here.
         *
         * Example:
         *
         */
    }
};
