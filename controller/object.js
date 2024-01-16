const model = require("../db/models");
const jwt = require("jsonwebtoken");
const axios = require("axios");

/// Получить один объект но с сокращенной информацией
function getObjectShortened(req, res) {
}

/// Получить один объект но с полной информацией
async function getObjectFull(req, res) {
    console.log(req.params.id);
    console.log(req);
    const id = req.params.id;
    const object = await model.object.findOne({where: {id: id}})
    if (object === null) {
        res.status(404).json();
        return;
    }
    return res.status(200).json(object);
}

/// Получить все объекты пользователя и подробную информацию
async function getObjects(req, res) {
    const token = jwt.decode(req.headers["authorization"].split(" ")[1]);

    const user = await model.user.findOne({
        where: {
            login: token.email,
        },
    });

    if (user == null) {
        res.status(404).json({
            message: "Такого пользователя нет",
        });
        return;
    }

    let object = await getData(user.id);

    let isCheck = false;
    const currentDate = new Date();
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;

    for (let index = 0; index < object.length; index++) {
        console.log(object[index].updatedAt);
        const updateDate = new Date(object[index].updatedAt);
        const timeDifference = currentDate.getTime() - updateDate.getTime();
        if ((isCheck = timeDifference > oneWeekInMillis)) {
            break;
        }
    }

    if (isCheck || object.length === 0) {
        const t = await model.sequelize.transaction();
        try {
            const resultUserObject = await getObjectSaurus(user);
            for (
                let index = 0;
                index < resultUserObject.data.data.objects.length;
                index++
            ) {
                const object = resultUserObject.data.data.objects[index];
                const objectQuery = await model.object.findOrCreate(
                    {
                        where: {id: object.id},
                        defaults: {
                            house: object.house,
                            number: object.number,
                            lable: object.label,
                            accountId: object.object_company_account,
                            personalAccount: object.personal_account,
                            connectDate: object.connect_dt,
                            enable: object.enable,
                            balanceObject: 0,
                            userId: user.id,
                            accesLevel: object.access_level,
                            objectCompanyName: object.object_company_name,
                            objectCompanyUrl: object.object_company_url,
                        },
                        transaction: t
                    },
                );

                if (!objectQuery) {
                    await model.object.update(
                        {
                            house: object.house,
                            lable: object.label,
                            accountId: object.object_company_account,
                            personalAccount: object.personal_account,
                            connectDate: object.connect_dt,
                            enable: object.enable,
                            accesLevel: object.access_level,
                            objectCompanyName: object.object_company_name,
                            objectCompanyUrl: object.object_company_url,
                        },
                        {where: {id: object.id}}, {transaction: t}
                    );
                }

            }
            t.commit();
        } catch (error) {
            await t.rollback();
            res.status(500).json({
                message: error.message,
            });
            return;
        }

    }
    object = await getData(user.id);

    return res.status(200).json(object);
}


async function getData(userId) {
    const data = await model.object.findAll({
        attributes: {
            exclude: ['userId', "UserId"]
        },
        where: {
            userId: userId,
        },
    });
    return data;
}

async function getObjectSaurus(user) {
    const userRequest = await axios.post(
        "https://api.saures.ru/1.0/login",
        {
            email: user.login,
            password: user.password,
        },
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    const resultUserObject = await axios.get(
        `https://api.saures.ru/1.0/user/objects?sid=${userRequest.data.data.sid}`
    );

    return resultUserObject;
}

module.exports = {
    getObjectShortened,
    getObjectFull,
    getObjects,
};
