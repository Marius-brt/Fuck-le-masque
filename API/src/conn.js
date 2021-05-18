const mysql = require('mysql')
module.exports = mysql.createConnection({
    port: process.env.SQL_PORT,
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASS,
    database: process.env.SQL_DB
})