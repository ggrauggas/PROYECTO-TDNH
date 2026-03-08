const { pool } = require('./db/config/database');

async function testConnection() {
  try {
    console.log('🔌 Probando conexión a la base de datos...');
    
    const result = await pool.query('SELECT NOW() as time');
    console.log('✅ Conexión exitosa!');
    console.log(`   Hora del servidor: ${result.rows[0].time}`);
    
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('\n📊 Tablas disponibles:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
  } finally {
    await pool.end();
  }
}

testConnection();