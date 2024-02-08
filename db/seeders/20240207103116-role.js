'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('TypeRoles', [{
            name: 'Master',
        }], {});
        await queryInterface.bulkInsert('TypeRoles', [{
            name: 'User',
        }], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('TypeRole', null, {});
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    }
};
