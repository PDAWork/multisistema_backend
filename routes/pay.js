const express = require("express");
const controller = require('../controller/pay');

const router = express.Router();

router.post("/pay", controller.pay);
router.get("/tariff", controller.getAllTariff);

module.exports = router;