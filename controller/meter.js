const model = require("../db/models/index");
const jwt = require("jsonwebtoken");
const axios = require("axios");

async function getMeters(req, res) {
    const token = jwt.decode(req.headers["authorization"].split(" ")[1]);
    const idObject = req.body.idObject;

    //  Поиск метрик пользователя
    const meter = await model.sensor.findAll(
        {
            include: [
                {
                    model: model.object,
                    as: "objects",
                    attributes: [],
                    where:
                        {
                            id: idObject
                        }
                },

            ]
        },
        {
            model: model.user,
            as:
                "user",
            attributes:
                ["password", "login"],
            where:
                {
                    login: token.email,
                }
            ,
        }
    );

    // Если их нет то выгрузить их с API saurus
    if (meter.length == 0) {
        console.log("not local")
        const date = new Date();
        const metersSaurus = await getMetersSaurus(token, idObject, date.toISOString().slice(0, 19));
        const t = await model.sequelize.transaction();

        try {
            for (let i = 0; i < metersSaurus.length; i++) {
                await model.sensor.create(
                    {
                        sn: metersSaurus[i].sn,
                        name: metersSaurus[i].name,
                        model: metersSaurus[i].model,
                        active: metersSaurus[i].active,
                        ssid: metersSaurus[i].ssid,
                        hardwere: metersSaurus[i].hardwere,
                        firmwawe: metersSaurus[i].firmwawe,
                        batery: metersSaurus[i].bat,
                        localip: metersSaurus[i].local_ip,
                        checkHours: metersSaurus[i].check_hours,
                        checkPeriodDipslay: metersSaurus[i].check_period_dipslay,
                        lastConnection: metersSaurus[i].last_connection,
                        lastConnectionWarning: metersSaurus[i].last_connection_warning,
                        licChennels: metersSaurus[i].lic_chennels,
                        requests: metersSaurus[i].requests,
                        rssi: metersSaurus[i].rssi,
                        log: metersSaurus[i].log,
                        scan: metersSaurus[i].scan,
                        vol: metersSaurus[i].vol,
                        send: metersSaurus[i].send,
                        readoutDate: metersSaurus[i].readout_date,
                        requestDate: metersSaurus[i].request_date,
                        capState: metersSaurus[i].cap_state,
                        powerSupply: metersSaurus[i].power_supply,
                        emptyInputs: metersSaurus[i].empty_inputs,
                        nbiot: metersSaurus[i].nbiot,
                        objectId: idObject,
                    },
                )
                for (let j = 0; j < metersSaurus[i].meters.length; j++) {
                    await model.meter.create({
                            id: metersSaurus[i].meters[j].meterId,
                            materName: metersSaurus[i].meters[j].meter_name,
                            snMeter: metersSaurus[i].meters[j].sn,
                            eircNum: metersSaurus[i].meters[j].eirc_num,
                            ingoText: "metersSaurus[i].meters[j]",
                            typeId: metersSaurus[i].meters[j].type.number,
                            stateId: metersSaurus[i].meters[j].state.number,
                        },
                        {transaction: t}
                    );
                }
            }
            await t.commit();
        } catch (e) {
        }
        res.status(200).json(metersSaurus);
        return;
    }
    console.log("local")

    // Если они есть то получаем даные
    // const object = await model.object.findAll({
    //     attributes: {
    //         exclude: ['UserId',],
    //     },
    //     include:
    //         [
    //             {
    //                 model: model.sensor,
    //                 as: "sensors",
    //                 attributes:
    //                     {exclude: ['ObjectId']}
    //             },
    //             {
    //                 model: model.user,
    //                 as: "user",
    //                 attributes: [],
    //                 where: {
    //                     login: "zharkov_s@multisistema.ru",
    //                 },
    //             },
    //         ],
    // });

    const meterT = await model.sensor.findAll(
            {
                include: [
                    {
                        model: model.sensorMeter,
                        include: [model.sensor, model.meter]
                    },
                    {
                        model: model.object,
                        as: "objects",
                        attributes: [],
                        where:
                            {
                                id: idObject
                            },
                        include: [
                            {
                                model: model.user,
                                as: "user",
                                attributes: [],
                                where: {
                                    login: token.email,
                                },
                            }
                        ]
                    },


                ]

            },
        )
    ;


    res.status(200).json(meterT);

    return;
}

async function getMetersSaurus(user, idObject, date) {
    try {
        const userRequest = await axios.post(
            "https://api.saures.ru/1.0/login",
            {
                email: user.email,
                password: user.password,
            },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        const resultUserObject = await axios.get(
            `https://api.saures.ru/1.0/object/meters?sid=${userRequest.data.data.sid}&id=${idObject}&date=${date}`
        );
        return resultUserObject.data.data.sensors;
    } catch (e) {
        return [];
    }
}


module.exports = {
    getMeters,
};
