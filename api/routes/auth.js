const express = require("express");
const controller = require('../controller/auth');

const router = express.Router();

router.post("/signIn", controller.signIn);
router.post("/signUp", controller.signUp);
router.post("/refresh", controller.refreshToken);

module.exports = router;