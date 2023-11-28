const db = require('mysql2');

const connection = db.createConnection(
    {
        host: process.process.env.DB.HOST || "localhost",
        user: process.env.DB.USER || "root",
        database: process.env.DB.DATABASE || "multisistema"
    }
) 