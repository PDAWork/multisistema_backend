const express = require("express");
const authRoute = require("./routes/auth");
const objectRoute = require("./routes/object");
const meter = require("./routes/meter");
const payRouter = require("./routes/pay");
const app = express();
const jwt = require(`jsonwebtoken`);
const model = require('./db/models/index');
const compression = require('compression');

app.use(express.json());
app.use(compression());

app.use((req, res, next) => {
    let log = {
        method: req.method || "GET",
        host: req.host || "localhost",
        port: req.port || "443",
        path: req.pathname || req.path || "/",
        body: req.body,
        // headers: req.headers || {},
    };
    console.log(log);
    next();
});

app.use("/api/auth", authRoute);
app.use(
    "/api/object",
    (req, res, next) => {
        authenticateToken(req, res, next);
    },
    objectRoute
);
app.use(
    "/api/meter",
    meter
);


app.use(
    "/api/pay",
    (req, res, next) => {
        if (req.path == "/webhook") {
            next();
            return;
        }
        authenticateToken(req, res, next);
    },
    payRouter
)

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null)
        return res
            .status(401)
            .json({message: "Пользователь не авторизован"})
            .end();
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(403).json({message: "Время действия токена истекло"});
            } else {
                return res.status(403).json({message: "Неверный токен"});
            }
        }
        req.user = user;
        next();
    });
}

module.exports = app;
