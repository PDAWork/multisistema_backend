'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = [
            {
                "id": 1,
                "name": "Холодная вода"
            },
            {
                "id": 2,
                "name": "Горячая вода"
            },
            {
                "id": 3,
                "name": "Газ"
            },
            {
                "id": 4,
                "name": "Протечка"
            },
            {
                "id": 5,
                "name": "Температура"
            },
            {
                "id": 6,
                "name": "Шаровой кран"
            },
            {
                "id": 7,
                "name": "Тепло"
            },
            {
                "id": 8,
                "name": "Электричество"
            },
            {
                "id": 9,
                "name": "Датчик"
            },
            {
                "id": 10,
                "name": "Состояние шарового крана"
            },
            {
                "id": 11,
                "name": "Тепло"
            },
            {
                "id": 12,
                "name": "Тепло"
            },
            {
                "id": 13,
                "name": "Тепло"
            },
            {
                "id": 14,
                "name": "Давление"
            }
        ]
        const t = await queryInterface.sequelize.transaction();
        for (let i = 0; i < data.length; i++) {
            await queryInterface.bulkInsert('TypeMeters', [{
                id: data[i].id,
                name: data[i].name
            }], {transaction: t});
        }

        await t.commit();
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('TypeMeters', null, {});
    }
};
