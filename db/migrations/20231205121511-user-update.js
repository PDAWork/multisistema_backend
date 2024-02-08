'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        queryInterface.addColumn("Users", 'refreshToken', {
            allowNull: true,
            type: Sequelize.TEXT,
        })
    },

    async down(queryInterface, Sequelize) {
    }
};
