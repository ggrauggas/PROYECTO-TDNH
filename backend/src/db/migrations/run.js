const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando migraciones...');
    
    // Crear tabla de control de migraciones si no existe
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Obtener migraciones ya ejecutadas
    const executed = await client.query('SELECT name FROM migrations');
    const executedNames = executed.rows.map(row => row.name);
    
    // Leer archivos de migración
    const migrationsDir = __dirname;
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Asegurar orden correcto
    
    for (const file of migrationFiles) {
      if (!executedNames.includes(file)) {
        console.log(`📦 Ejecutando migración: ${file}`);
        
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');
        
        try {
          await client.query('BEGIN');
          await client.query(sql);
          await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
          await client.query('COMMIT');
          console.log(`✅ Migración completada: ${file}`);
        } catch (error) {
          await client.query('ROLLBACK');
          console.error(`❌ Error en migración ${file}:`, error.message);
          throw error;
        }
      } else {
        console.log(`⏭️  Migración ya ejecutada: ${file}`);
      }
    }
    
    console.log('🎉 Todas las migraciones completadas exitosamente');
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    throw error;
  } finally {
    client.release(); // Solo liberamos el cliente, no cerramos el pool
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runMigrations()
    .then(() => {
      pool.end(); // Solo cerramos si se ejecuta directamente
      process.exit(0);
    })
    .catch(() => {
      pool.end();
      process.exit(1);
    });
}

module.exports = { runMigrations };