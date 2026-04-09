const { pool } = require('../config/database');

async function deleteBots() {
  const client = await pool.connect();

  try {
    console.log('🗑️  Eliminando bots y sus conversaciones...');
    await client.query('BEGIN');

    // Obtener IDs de bots (todos los usuarios con email @example.com)
    const botResult = await client.query(
      `SELECT id, username FROM users WHERE email LIKE '%@example.com' ORDER BY id`
    );

    if (botResult.rows.length === 0) {
      console.log('⚠️  No hay bots en la base de datos.');
      await client.query('COMMIT');
      return;
    }

    const botIds = botResult.rows.map(r => r.id);
    console.log(`   Encontrados ${botIds.length} bots: ${botResult.rows.map(r => r.username).join(', ')}`);

    // Los DELETE en CASCADE se encargan de posts, comments, likes y follows
    const deleted = await client.query(
      `DELETE FROM users WHERE id = ANY($1) RETURNING username`,
      [botIds]
    );

    await client.query('COMMIT');

    console.log(`\n✅ ${deleted.rows.length} bots eliminados (posts, comentarios, likes y follows incluidos)`);
    deleted.rows.forEach(r => console.log(`   - ${r.username}`));

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error eliminando bots:', error);
    throw error;
  } finally {
    client.release();
  }
}

if (require.main === module) {
  deleteBots()
    .then(() => { pool.end(); process.exit(0); })
    .catch(() => { pool.end(); process.exit(1); });
}

module.exports = { deleteBots };
