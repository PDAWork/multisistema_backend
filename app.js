const express = require("express");
const authRoute = require("./routes/auth");
const objectRoute = require("./routes/object");
const meter = require("./routes/meter");
const app = express();
const jwt = require(`jsonwebtoken`);

app.use(express.json());
app.use((req, res, next) => {
  let log = {
    method: req.method || "GET",
    host: req.host || req.hostname || "localhost",
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
  //   (req, res, next) => {
  //     authenticateToken(req, res, next);
  //   },
  meter
);

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res
      .status(401)
      .json({ message: "Пользователь не авторизован" })
      .end();
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).end();
    req.user = user;
    next();
  });
}

module.exports = app;
