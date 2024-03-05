const express = require("express");
const controller = require('../controller/meter');

const router = express.Router();

router.get("/meter", controller.getMeters);

module.exports = router;