const model = require("../db/models/index");
const jwt = require("jsonwebtoken");
const axios = require("axios");

async function getMeters(req, res) {
    const token = jwt.decode(req.headers["authorization"].split(" ")[1]);
    const idObject = req.body.idObject;

    //  Поиск метрик пользователя
    const sensor = await model.sensor.findAll(
        {
            include: [
                {
                    model: model.object, as: "objects", attributes: [], where: {
                        id: idObject
                    }
                },
            ]
        },
        {
            model: model.user, as: "user", attributes: ["password", "login"], where: {
                login: token.email,
            },
        }
    );

    let isCheck = false;

    if (sensor.length !== 0) {
        const currentDate = new Date();
        const oneWeekInMillis = 60 * 60 * 1000; // обвновление каждый час
        for (let index = 0; index < sensor.length; index++) {
            const updateDate = new Date(sensor[index].updatedAt);
            const timeDifference = currentDate.getTime() - updateDate.getTime();
            if ((isCheck = timeDifference > oneWeekInMillis)) {
                console.log("date")
                break;
            }
        }
    }

    if (isCheck || sensor.length === 0) {
        console.log("update");
        const date = new Date();
        const metersSaurus = await getMetersSaurus(token, idObject, date.toISOString().slice(0, 19));
        const t = await model.sequelize.transaction();

        try {
            for (let i = 0; i < metersSaurus.length; i++) {
                let [resultSensor, createdSensor] = await model.sensor.findOrCreate({
                    where: {sn: metersSaurus[i].sn},
                    defaults: {
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
                    transaction: t
                });

                if (!createdSensor) {
                    await model.sensor.update({
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
                    }, {
                        where: {sn: metersSaurus[i].sn},
                        transaction: t
                    });
                }

                for (let j = 0; j < metersSaurus[i].meters.length; j++) {
                    let [resultMeter, createdMeter] = await model.meter.findOrCreate({
                        where: {id: metersSaurus[i].meters[j].meter_id},
                        defaults: {
                            id: metersSaurus[i].meters[j].meter_id,
                            materName: metersSaurus[i].meters[j].meter_name,
                            snMeter: metersSaurus[i].meters[j].sn,
                            eircNum: metersSaurus[i].meters[j].eirc_num,
                            infoText: metersSaurus[i].meters[j].vals[0] === 0 ? metersSaurus[i].meters[j].passive_text : metersSaurus[i].meters[j].active_text,
                            typeId: metersSaurus[i].meters[j].type.number,
                            stateId: metersSaurus[i].meters[j].state.number,
                        },
                        transaction: t
                    });


                    if (!createdMeter) {
                        await model.meter.update({
                            id: metersSaurus[i].meters[j].meter_id,
                            materName: metersSaurus[i].meters[j].meter_name,
                            snMeter: metersSaurus[i].meters[j].sn,
                            eircNum: metersSaurus[i].meters[j].eirc_num,
                            infoText: metersSaurus[i].meters[j].info_text,
                            typeId: metersSaurus[i].meters[j].type.number,
                            stateId: metersSaurus[i].meters[j].state.number,
                        }, {
                            where: {id: metersSaurus[i].meters[j].meter_id},
                            transaction: t
                        });
                    } else {
                        await model.sensorMeter.create({
                            meterId: metersSaurus[i].meters[j].meter_id, sensorId: metersSaurus[i].sn,
                        }, {transaction: t})
                    }

                    for (let k = 0; k < metersSaurus[i].meters[j].vals.length; k++) {
                        const [resultMetersVals, createdMetersVals] = await model.metersVals.findOrCreate({
                            where: {meterId: metersSaurus[i].meters[j].meter_id},
                            defaults: {
                                meterId: metersSaurus[i].meters[j].meter_id,
                                value: metersSaurus[i].meters[j].vals[k],
                            },
                            transaction: t
                        });

                        if (!createdMetersVals) {
                            await model.metersVals.update({
                                value: metersSaurus[i].meters[j].vals[k],
                            }, {
                                where: {meterId: metersSaurus[i].meters[j].meter_id},
                                transaction: t
                            });
                        }
                    }
                }
            }
            await t.commit();
        } catch (e) {
            console.log(e);
            res.status(200).json([]);
            return;
        }
    }

    const sensorResult = await getData(token, idObject);
    return await res.status(200).json(sensorResult);

}

async function getData(token, idObject) {
    return await model.sensor.findAll({
        attributes: {
            exclude: ["ObjectId", "objectId"],
        }, include: [{
            model: model.sensorMeter, as: "meters", attributes: {
                exclude: ["meterId", "sensorId", "createdAt", "updatedAt",],
            }, include: [{
                attributes: {
                    exclude: ["createdAt", "updatedAt",],
                }, as: "meter",
                model: model.meter,
                include: [
                    {model: model.typeMeter, as: "TypeMeter"}, // Include the association with alias and exclude all attributes
                    {model: model.states, as: "State"},
                    {
                        model: model.metersVals,
                        attributes: {
                            exclude: ["id", "meterId", "createdAt", "updatedAt",],
                        }
                    }
                ]
            },],
        }, {
            model: model.object, as: "objects", attributes: [], where: {
                id: idObject
            }, include: [{
                model: model.user, as: "user", attributes: [], where: {
                    login: token.email,
                },
            }]
        },

        ],
    },);
}

async function getMetersSaurus(user, idObject, date) {
    try {
        const userRequest = await axios.post("https://api.saures.ru/1.0/login", {
            email: user.email, password: user.password,
        }, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const resultUserObject = await axios.get(`https://api.saures.ru/1.0/object/meters?sid=${userRequest.data.data.sid}&id=${idObject}&date=${date}`);
        return resultUserObject.data.data.sensors;
    } catch (e) {
        return [];
    }
}


module.exports = {
    getMeters,
};
