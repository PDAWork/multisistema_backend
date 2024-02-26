const model = require("../db/models/index");
const jwt = require("jsonwebtoken");
const axios = require("axios");

class ApiSauresException {
    constructor(name, message) {
    }
}

async function getMeters(req, res) {
    const token = jwt.decode(req.headers["authorization"].split(" ")[1]);
    const idObject = req.body.idObject;
    const date = new Date();
    const dateWhere = req.body.date === undefined ? date.toISOString().slice(0, 19) :
        new Date(req.body.date).toISOString().slice(0, 19);

    const sensor = await getData(token, idObject, dateWhere.slice(0, 10))

    let isCheck = false;
    if (sensor.length !== 0) {
        const currentDate = new Date();
        const oneWeekInMillis = 60 * 60 * 1000; // обвновление каждый час
        for (let index = 0; index < sensor.length; index++) {
            for (let i = 0; i < sensor[index].meters.length; i++) {
                console.log(sensor[index].meters[i].meter.MetersVals.length);
                if (sensor[index].meters[i].meter.MetersVals.length == 0) {
                    const updateDateMeter = new Date(sensor[index].meters[i].meter.updatedAt);
                    const timeDifferenceMeter = currentDate.getTime() - updateDateMeter.getTime();
                    if ((isCheck = timeDifferenceMeter > oneWeekInMillis)) {
                        break;
                    }
                    break;
                }
                const updateDate = new Date(sensor[index].meters[i].meter.MetersVals[0].updatedAt);
                const timeDifference = currentDate.getTime() - updateDate.getTime();
                if ((isCheck = timeDifference > oneWeekInMillis)) {
                    break;
                }
                if (isCheck = (sensor[index].meters[i].meter == null)) {
                    break;
                }
            }
            if (isCheck) {
                break;
            }
        }
    }

    if (isCheck || sensor.length === 0) {
        const t = await model.sequelize.transaction();

        try {
            const metersSaurus = await getMetersSaurus(token, idObject, dateWhere);
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
                            meterName: metersSaurus[i].meters[j].meter_name,
                            snMeter: metersSaurus[i].meters[j].sn,
                            eircNum: metersSaurus[i].meters[j].eirc_num,
                            infoText: metersSaurus[i].meters[j].vals[0] === 0 ? metersSaurus[i].meters[j].passive_text : metersSaurus[i].meters[j].active_text,
                            typeId: metersSaurus[i].meters[j].type.number,
                            stateId: metersSaurus[i].meters[j].state.number === undefined ? 0 : metersSaurus[i].meters[j].state.number,
                        },
                        transaction: t
                    });


                    if (!createdMeter) {
                        await model.meter.update({
                            id: metersSaurus[i].meters[j].meter_id,
                            meterName: metersSaurus[i].meters[j].meter_name,
                            snMeter: metersSaurus[i].meters[j].sn,
                            eircNum: metersSaurus[i].meters[j].eirc_num,
                            infoText: metersSaurus[i].meters[j].info_text,
                            typeId: metersSaurus[i].meters[j].type.number,
                            stateId: metersSaurus[i].meters[j].state == null ? 0 : metersSaurus[i].meters[j].state.number,
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
                        console.log(dateWhere);
                        const [resultMetersVals, createdMetersVals] = await model.metersVals.findOrCreate({
                            where: {
                                meterId: metersSaurus[i].meters[j].meter_id,
                                date: new Date(dateWhere.slice(0, 10)),
                            },
                            defaults: {
                                meterId: metersSaurus[i].meters[j].meter_id,
                                date: new Date(dateWhere.slice(0, 10)),
                                value: metersSaurus[i].meters[j].vals[k],
                            },
                            transaction: t
                        });

                        if (!createdMetersVals) {
                            console.log(dateWhere);
                            await model.metersVals.update({
                                value: metersSaurus[i].meters[j].vals[k],
                            }, {
                                where: {meterId: metersSaurus[i].meters[j].meter_id, date: dateWhere.slice(0, 10)},
                                transaction: t
                            });
                        }
                    }
                }
            }
            await t.commit();
        } catch (e) {
            console.log(e);
            res.status(400).json([]);
            await t.rollback()
            return;
        }
    }

    const sensorResult = await getData(token, idObject, dateWhere.slice(0, 10));
    return await res.status(200).json(sensorResult);

}

async function getData(token, idObject, date) {
    console.log('Local');
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
                        where: {
                            date: new Date(date)
                        },
                        required: false,
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
    console.log('Remote');
    try {
        const userRequest = await axios.post("https://api.saures.ru/1.0/login", {
            email: user.email, password: user.password,
        }, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        const resultUserObject = await axios.get(`https://api.saures.ru/1.0/object/meters?sid=${userRequest.data.data.sid}&id=${idObject}&date=${date}`);
        console.log(resultUserObject);
        return resultUserObject.data.data.sensors;
    } catch (e) {
        throw new ApiSauresException('Api', 'Ошибка')
    }
}


module.exports = {
    getMeters,
};
