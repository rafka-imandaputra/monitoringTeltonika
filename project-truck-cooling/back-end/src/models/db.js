const { Pool } = require('pg');

const pool = new Pool({
  user: 'acit',
  host: 'localhost',
  database: 'Proyek3',
  password: 'raafi6905',
  port: 5432,
});

module.exports = pool;