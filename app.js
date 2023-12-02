const express = require('express');
const authRoute = require("./routes/auth")
const app = express();
const jwt = require(`jsonwebtoken`);

app.use(express.json());

app.use("/api/auth", authRoute);

function authenticateToken(reg, res, nex) {
    // re.header["authorization"]
}

module.exports = app;
