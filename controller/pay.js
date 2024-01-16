const model = require("../db/models/index");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');

// токен
const authorization = "Basic NjExMjc0OnRlc3RfODlOZnoxVjlEcFdlM1Rwa1JYSkhOSDFMY245aWlxNGdiQWFNejlraE4zSQ==";

async function pay(req, res) {
    try {

        var headers = {
            "Authorization": authorization,
            "Idempotence-Key": uuidv4().toString(),
            "Content-Type": 'application/json'
        };

        var params = {
            "amount": {
                "value": 200,
                "currency": "RUB"
            },
            "capture": true,
            "confirmation": {
                "type": "redirect",
                "return_url": 'https://multisistema.ru/price/#rec598340657'
            },
        };

        const payRemote = await axios.post('https://api.yookassa.ru/v3/payments', params, {
            headers: headers,
        });

        if (payRemote.status == "pending") {
            response.send({
                "url": payRemote.confirmation.confirmation_url,
            });
        }
    } catch (er) {
        console.log("ERROR");
        console.log(e.message);
        return response.send({
            "status": "error",
            "body": e.message
        });
    }

}

// exports.UkassaWebHook = functions.https.onRequest(async (request, response) => {
//     if (request.body.event == "payment.waiting_for_capture") {
//         let payment_id = request.body.object.id;
//         let status = request.body.object.status;
//         if (status == "waiting_for_capture") {
//             console.log("оплатил")
//         }
//     }
//     response.send("OK");
// });

async function getAllTariff(req, res) {
    const tariffQuery = await model.tariff.findAll();

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
                exclude: ["objectId", "tariffId", "createdAt", "updatedAt",],
            }
            ,
            include: [
                {
                    model: model.object,
                    as: 'object',
                    include: [{
                        model: model.user, as: "user", attributes: [], where: {
                            login: token.email,
                        },
                    }]
                },
                {
                    model: model.tariff,
                    as: 'tariff'
                }
            ]
        }
    );
    return res.status(200).json(allTariffObject);
}

module.exports = {
    pay,
    getAllTariff,
    getTariffObject,
    getAllTariffObject
}