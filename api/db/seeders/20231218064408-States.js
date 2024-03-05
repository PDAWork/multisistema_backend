"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const data = [
            {
                "id": 0,
                "state": "ошибок нет"
            },
            {
                "id": 1,
                "state": "обрыв"
            },
            {
                "id": 2,
                "state": "короткое замыкание"
            },
            {
                "id": 3,
                "state": "перерасход ресурса в течение заданного промежутка времени"
            },
            {
                "id": 4,
                "state": "температура/давление опустились ниже нижнего порога"
            },
            {
                "id": 5,
                "state": "температура/давление поднялись выше верхнего порога"
            },
            {
                "id": 6,
                "state": "остановка потребления ресурса в течение заданного промежутка времени"
            },
            {
                "id": 7,
                "state": "ошибка связи или внутренняя неисправность счетчика с цифровым интерфейсом (RS-485/CAN/MBUS)"
            },
            {
                "id": 8,
                "state": "некорректное значение или выход значения за пределы измеряемого диапазон"
            },
            {
                "id": 9,
                "state": "воздействие магнитного поля"
            },
            {
                "id": 10,
                "state": "обратный поток жидкости"
            }

        ];
        const t = await queryInterface.sequelize.transaction();
        for (let i = 0; i < data.length; i++) {
            await queryInterface.bulkInsert('States', [{
                id: data[i].id,
                name: data[i].state
            }], {transaction: t});
        }

        await t.commit();
        return;
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('States', null, {});
    }
};
