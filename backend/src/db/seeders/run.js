const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

async function runSeeders() {
  const client = await pool.connect();

  try {
    console.log('🌱 Iniciando seeders base...');
    await client.query('BEGIN');

    // Verificar si ya hay datos para no duplicar
    const userCheck = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count) > 0) {
      console.log('⚠️  Ya existen usuarios en la base de datos. Omitiendo seeders...');
      await client.query('COMMIT');
      return;
    }

    // =============================================
    // Crear usuario admin y usuario Gerard Grau
    // =============================================
    console.log('👤 Creando usuarios base...');

    const users = [
      {
        username: 'admin',
        email: 'admin@admin.com',
        password: await bcrypt.hash('admin', 10),
        full_name: 'Administrador',
        diabetes_type: null,
        diagnosis_date: null,
        bio: 'Cuenta de administración de la plataforma.',
        role: 'admin'
      },
      {
        username: 'gerard',
        email: 'gerardgrau2004@gmail.com',
        password: await bcrypt.hash('admin', 10),
        full_name: 'Gerard Grau Gascón',
        diabetes_type: 'Tipo 1',
        diagnosis_date: null,
        bio: 'Desarrollador y administrador de la plataforma.',
        role: 'admin'
      }
    ];

    for (const user of users) {
      await client.query(
        `INSERT INTO users (username, email, password, full_name, diabetes_type, diagnosis_date, bio, role)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [user.username, user.email, user.password, user.full_name,
         user.diabetes_type, user.diagnosis_date, user.bio, user.role]
      );
      console.log(`   ✅ Usuario creado: ${user.username} [${user.role}]`);
    }

    await client.query('COMMIT');

    console.log('\n🎉 Seeders base completados!');
    console.log('   - 2 usuarios creados: admin + gerardgrau');
    console.log('   - Ejecuta "npm run db:bots:add" para poblar el foro con conversaciones de muestra');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error ejecutando seeders:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  runSeeders()
    .then(() => { pool.end(); process.exit(0); })
    .catch(() => { pool.end(); process.exit(1); });
}

module.exports = { runSeeders };
