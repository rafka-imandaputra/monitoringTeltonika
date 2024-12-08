require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

// const pool = new Pool({
//     connectionString: 'postgresql://postgres:LBMHEDlIMcnMWMzOibdwsMSkSFmbbhKN@junction.proxy.rlwy.net:21281/railway',  // Use the full connection string
//   });

module.exports = pool