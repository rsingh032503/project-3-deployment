// const Pool = require("pg").Pool
require('dotenv').config();



const pool = new Pool({
    user: process.env.PSQL_USER,
    host: process.env.PSQL_HOST,
    database: process.env.PSQL_DATABASE,
    password: process.env.PSQL_PASSWORD,
    port: parseInt(process.env.APP_PORT, 10),
    // ssl: {rejectUnauthorized: false}
});

module.exports = pool;