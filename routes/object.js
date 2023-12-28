const express = require("express");
const controller = require('../controller/object');

const router = express.Router();

router.get("/objects", controller.getObjects);
router.get("/objectFull/:id", controller.getObjectFull);
router.get("/objectShortened/:id", controller.getObjectShortened);

module.exports = router;