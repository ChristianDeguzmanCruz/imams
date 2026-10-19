require('dotenv').config();
const pool = require('./db');

async function testConnection() {
  console.log(
    process.env.DATABASE_URL ? 'URL found' : 'URL is MISSING'
  );

  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Connected! Oras sa database:', result.rows[0].now);
  } catch (err) {
    console.error('Connection failed:', err.message, err.code);
  } finally {
    await pool.end();
  }
}

testConnection();