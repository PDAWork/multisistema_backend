const app = require("./app");
const http = require("http").createServer(app),
    io = require('socket.io')(http);
const model = require("./db/models/index");
require("dotenv").config();

const port = process.env.PORT || 3000;
http.listen(port, (err) => {
    if (err) {
        console.log(`Ошибка сервера ${err}`)
    }
    model.orders.afterBulkCreate((order, options) => {
        io.on(order.idOrder, (socket) => {
            console.log(`Client with id ${socket.id} connect`);
        });
    })
    model.orders.afterBulkUpdate(async (order, options) => {

        io.emit(order.where.idOrder, order.attributes.status);
        var orderQuery = await model.orders.findOne(
            {
                where: {
                    idOrder: order.where.idOrder
                }
            }
        )
        const startDate = new Date();
        const finishDate = new Date().setFullYear(startDate.getFullYear() + 1);
        model.tariffObject.update(
            {
                objectId: orderQuery.objectId,
                tariffId: orderQuery.tariffId,
                startDate: startDate,
                finishDate: finishDate

            },
            {
                where: {
                    objectId: orderQuery.objectId,
                },
            },
        )
    });

    console.log(`Сервер запущен на ${port}`)
})
;
