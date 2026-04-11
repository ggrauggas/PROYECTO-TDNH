const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    }
  : {
      host: process.env.DB_HOST || 'database',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'tudiabetes',
      user: process.env.DB_USER || 'tudiabetes_user',
      password: process.env.DB_PASSWORD || 'tudiabetes_password',
      ssl: isProduction ? { rejectUnauthorized: false } : false
    };

const pool = new Pool({
  ...poolConfig,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('connect', () => {
  if (!isProduction) {
    console.log('Conectado a la base de datos PostgreSQL');
  }
});

pool.on('error', (err) => {
  console.error('Error inesperado en la conexión a la base de datos:', err);
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('Conexión a la base de datos verificada');
    client.release();
    return true;
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
    return false;
  }
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection
};
