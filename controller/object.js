const model = require("../db/models");
const jwt = require('jsonwebtoken');

/// Получить один объект но с сокращенной информацией
function getObjectShortened(req, res) {

}

/// Получить один объект но с полной информацией
function getObjectFull(req, res) {
    res.send(req.params["id"]);
}

/// Получить все объекты пользователя и подробную информацию
async function getObjects(req, res) {
    // console.log(jwt.decode(req.headers["authorization"], {complete: true}))
    console.log(jwt.decode (req.headers["authorization"].split(' ')[1]))
    const user = await model.User.findOne({
        where: {
            id: req.params.id
        }
    })
    if (user == null) {
        res.status(404).json({
            message: "Такого пользователя нет"
        });
        return;
    }
    const object = await model.Object.findAll({
        where: {
            userId: req.params.id
        }
    });
    if (object.length === 0) {
        res.status(404).json({
            message: "У пользователя нет ни одного объект"
        });


    }


    res.status(200).json(object);
}


module.exports = {
    getObjectShortened,
    getObjectFull,
    getObjects
};