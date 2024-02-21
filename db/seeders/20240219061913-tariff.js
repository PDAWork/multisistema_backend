'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Tariffs', [{
            name: 'Без тарифа',
            cost: 0,
        }], {});
        await queryInterface.bulkInsert('Tariffs', [{
            name: 'Годовой',
            cost: 990
        }], {});
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Tariff', null, {});
    }
};
