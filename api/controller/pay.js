const model = require("../db/models/index");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {v4: uuidv4} = require('uuid');
const {Op} = require("sequelize");


// токен
const authorization = process.env.API_TOKEN_YOUKASSA;

async function pay(req, res) {
    try {

        const objectId = req.body.objectId;
        const tariff = await model.tariff.findOne({
            where: {
                id: req.body.tariffId
            }
        });

        var headers = {
            "Authorization": authorization,
            "Idempotence-Key": uuidv4().toString(),
            "Content-Type": 'application/json'
        };

        var params = {
            "amount": {
                "value": tariff.cost,
                "currency": "RUB"
            },
            "capture": false,
            "confirmation": {
                "type": "redirect",
                "return_url": ''
            },
        };

        const payRemote = await axios.post('https://api.yookassa.ru/v3/payments', params, {
            headers: headers,
        });

        if (payRemote.data.status == "pending") {
            const token = jwt.decode(req.headers["authorization"].split(" ")[1]);

            const user = await model.user.findOne({
                where: {
                    login: token.email,
                },
            });

            await model.orders.create({
                "idOrder": payRemote.data.id,
                "status": "pending",
                "userId": user.id,
                "tariffId": tariff.id,
                "objectId": objectId,
            })
            console.log(payRemote.data.id)
            return await res.send({
                "url": payRemote.data.confirmation.confirmation_url,
                "orderId": payRemote.data.id
            });
        }

    } catch (e) {
        console.log("ERROR");
        console.log(e.message);
        return res.send({
            "status": "error",
            "body": e.message
        });
    }

}

async function webhook(request, response) {
    console.log(request.body)
    if (request.body.event == "payment.waiting_for_capture") {
        let payment_id = request.body.object.id;
        let status = request.body.object.status;
        console.log("оплата прошла");
        if (status == "waiting_for_capture") {
            console.log("оплата прошла")
            await model.orders.update({"status": "succeeded"}, {
                where: {
                    idOrder: payment_id
                }
            })
            await getPayment(payment_id);
            console.log("оплатил");
        }
    }
    response.send("OK");
}

const getPayment = async (payment_id) => {
    const url = `https://api.yookassa.ru/v3/payments/${payment_id}/capture`;

    var headers = {
        "Authorization": authorization,
        "Idempotence-Key": uuidv4().toString(),
        "Content-Type": 'application/json'
    };

    return await axios.post(url, {}, {
        headers: headers,
    }).then((res) => res.data).then(async (res) => {
        console.log("Платеж успешно подтвержден", res);
        return true;
    }).catch((err) => {
        console.log("Ошибка при подтверждении платежа", err);
        return false;
    });
}

async function getAllTariff(req, res) {
    const tariffQuery = await model.tariff.findAll({
        where: {
            id: {
                [Op.ne]: 1,
            }
        }
    });

    return res.status(200).json(tariffQuery);
}

// Номер объекта чтобы вывести номер тариф по данному объекту
async function getTariffObject(req, res) {
    const objectIdRequest = req.params.idObject;
    const tariffObjectQuery = await model.tariffObject.findAll(
        {
            where: {
                objectId: objectIdRequest,
            },
            attributes: {
                exclude: ["objectId", "tariffId", "createdAt", "updatedAt",],
            }
            ,
            include: [
                {
                    model: model.object,
                    as: 'object'
                },
                {
                    model: model.tariff,
                    as: 'tariff'
                }
            ]
        }
    );
    return res.status(200).json(tariffObjectQuery);
}

// Номер пользователя
// Выводим все объекты пользователя с его тарифами
async function getAllTariffObject(req, res) {
    const token = jwt.decode(req.headers["authorization"].split(" ")[1]);
    const allTariffObject = await model.tariffObject.findAll(
            {
                attributes: {
                    exclude: ["tariffId", "objectId", "createdAt", "updatedAt",],
                },
                include: [
                    {
                        model: model.object,
                        as: 'object',
                        include: [{
                            model: model.user, as: "user", attributes: [], where: {
                                login:
                                token.email,
                            },
                        }]
                    },
                    {
                        model: model.tariff,
                        as:
                            'tariff'
                    }
                ]
            }
        )
    ;
    return res.status(200).json(allTariffObject);
}

module.exports = {
    pay,
    getAllTariff,
    getTariffObject,
    getAllTariffObject,
    webhook
}