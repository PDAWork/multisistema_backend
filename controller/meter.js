const model = require("../db/models/index");
const jwt = require("jsonwebtoken");

async function getMeters(req, res) {
    console.log(await model.user.findAll());
    console.log(jwt.decode(req.headers["authorization"], {complete: true}));
    csonsole.log(jwt.decode(req.headers["authorization"].split(" ")[1]));
    const object = await model.Object.findAll({
        include: [{model: model.Sensors, as: "sensors"}],
    });
    const sensors = await model.Sensors.findAll({
        include: [{model: model.Object, as: "objects"}],
    });

    res.status(200).json({object});

    return;
}

module.exports = {
    getMeters,
};
