const { runMigrations } = require('./migrations/run');
const { runSeeders } = require('./seeders/run');

async function setupDatabase() {
  console.log('Configurando base de datos...\n');
  
  try {
    // Ejecutar migraciones (NO debe cerrar el pool internamente)
    await runMigrations();
    
    console.log('\nEjecutando seeders...\n');
    
    // Ejecutar seeders (NO debe cerrar el pool internamente)
    await runSeeders();
    
    console.log('\nBase de datos configurada correctamente!');
    console.log('   Ya puedes iniciar la aplicación.');
    
  } catch (error) {
    console.error('\nError configurando la base de datos:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = { setupDatabase };