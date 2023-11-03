const Pool = require("pg").Pool
const dotenv = require('dotenv').config();



// const pool = new Pool({
//     user: process.env.PSQL_USER,
//     host: process.env.PSQL_HOST,
//     database: process.env.PSQL_DATABASE,
//     password: process.env.PSQL_PASSWORD,
//     port: parseInt(process.env.APP_PORT, 10),
//     // ssl: {rejectUnauthorized: false}
// });

const pool = new Pool({
    user: "csce315_909_rahul_2003",
    host: "csce-315-db.engr.tamu.edu",
    database: "csce315331_09m_db",
    password: "Rs03252003#",
    port: 5432,
    // ssl: {rejectUnauthorized: false}
});

module.exports = pool;