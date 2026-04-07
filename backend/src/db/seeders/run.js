const bcrypt = require('bcrypt');
const { pool } = require('../config/database');

async function runSeeders() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Iniciando seeders...');
    await client.query('BEGIN');

    // Verificar si ya hay datos para no duplicar
    const userCheck = await client.query('SELECT COUNT(*) FROM users');
    if (parseInt(userCheck.rows[0].count) > 0) {
      console.log('⚠️  Ya existen usuarios en la base de datos. Omitiendo seeders...');
      await client.query('COMMIT');
      return;
    }

    // =============================================
    // 1. Crear usuarios
    // =============================================
    console.log('👤 Creando usuarios...');

    const users = [
      // --- Admin ---
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
      // --- Usuarios normales ---
      {
        username: 'carlos_diabetes',
        email: 'carlos@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Carlos Rodríguez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2018-05-15',
        bio: 'Diagnosticado en 2018. Me encanta compartir experiencias y ayudar a otros.',
        role: 'user'
      },
      {
        username: 'ana_martinez',
        email: 'ana@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Ana Martínez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2020-03-10',
        bio: 'Recién diagnosticada, aprendiendo cada día. Madre de dos hijos.',
        role: 'user'
      },
      {
        username: 'miguel_asesor',
        email: 'miguel@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Miguel Sánchez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2010-11-22',
        bio: '15 años con diabetes. Educador en diabetes, aquí para ayudar.',
        role: 'user'
      }
    ];

    const userIds = [];
    for (const user of users) {
      const result = await client.query(
        `INSERT INTO users (username, email, password, full_name, diabetes_type, diagnosis_date, bio, role)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [user.username, user.email, user.password, user.full_name,
         user.diabetes_type, user.diagnosis_date, user.bio, user.role]
      );
      userIds.push(result.rows[0].id);
      console.log(`   ✅ Usuario creado: ${user.username} [${user.role}]`);
    }

    // userIds[0] = admin, userIds[1] = carlos, userIds[2] = ana, userIds[3] = miguel

    // =============================================
    // 2. Crear publicaciones (solo usuarios normales)
    // =============================================
    console.log('\n📝 Creando publicaciones...');

    const posts = [
      {
        user_id: userIds[1], // Carlos
        title: 'Consejos para manejar la diabetes durante el ejercicio',
        content: 'Hola a todos. Llevo varios años haciendo deporte con diabetes tipo 1 y quería compartir algunos consejos que me han funcionado:\n\n1) Siempre revisar la glucosa antes de empezar.\n2) Llevar siempre algo de azúcar rápido.\n3) Ajustar la insulina según la intensidad del ejercicio.\n\n¿Alguien más tiene consejos?',
        category: 'consejo',
        tags: 'ejercicio,deporte,consejos'
      },
      {
        user_id: userIds[2], // Ana
        title: 'Duda sobre conteo de carbohidratos',
        content: 'Hola, soy nueva en esto del conteo de carbohidratos. Me han recomendado varias apps pero no sé cuál es mejor. ¿Qué usan ustedes? ¿Algún consejo para principiantes?',
        category: 'pregunta',
        tags: 'conteo,principiantes,apps'
      },
      {
        user_id: userIds[3], // Miguel
        title: 'Experiencia: Mi viaje con la bomba de insulina',
        content: 'Después de 10 años usando plumas, el año pasado cambié a bomba de insulina. Quiero compartir mi experiencia: ventajas, desventajas y cosas que aprendí. Pregunten lo que quieran.',
        category: 'experiencia',
        tags: 'bomba,insulina,tecnologia'
      },
      {
        user_id: userIds[1], // Carlos
        title: '¿Cómo afecta el estrés a la glucosa?',
        content: 'Últimamente he notado que cuando tengo mucho estrés en el trabajo mis niveles de glucosa se disparan aunque no cambie nada en mi alimentación. ¿Os pasa lo mismo? ¿Cómo lo gestionáis?',
        category: 'pregunta',
        tags: 'estres,glucosa,emocional'
      },
      {
        user_id: userIds[3], // Miguel
        title: 'Guía rápida: qué hacer ante una hipoglucemia',
        content: 'Como educador en diabetes quiero compartir una guía rápida para actuar ante una hipoglucemia:\n\n1) Mide tu glucosa si puedes.\n2) Toma 15g de azúcar rápido (un zumo pequeño, 3 sobres de azúcar, gel de glucosa).\n3) Espera 15 minutos y vuelve a medir.\n4) Si sigue baja, repite.\n5) Una vez normalizada, toma un snack con carbohidratos de absorción lenta.\n\nGuarda siempre azúcar encima. ¡La prevención es lo más importante!',
        category: 'consejo',
        tags: 'hipoglucemia,emergencia,consejos'
      }
    ];

    const postIds = [];
    for (const post of posts) {
      const result = await client.query(
        `INSERT INTO posts (user_id, title, content, category, tags)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [post.user_id, post.title, post.content, post.category, post.tags]
      );
      postIds.push(result.rows[0].id);
      console.log(`   ✅ Publicación creada: ${post.title.substring(0, 40)}...`);
    }

    // =============================================
    // 3. Crear comentarios y respuestas
    // =============================================
    console.log('\n💬 Creando comentarios...');

    // Post 0: Ejercicio (Carlos)
    const c1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[0], userIds[3], 'Muy buenos consejos. Yo añadiría que es importante también ajustar la insulina basal según el tipo de ejercicio. Los ejercicios de fuerza afectan diferente que los aeróbicos.']
    );
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[0], userIds[1], c1.rows[0].id, '¡Cierto! No había pensado en eso. ¿Tienes algún ejemplo concreto?']
    );
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[0], userIds[3], c1.rows[0].id, 'Por ejemplo, si hago pesas suelo necesitar menos insulina basal, mientras que si corro necesito más. Es cuestión de probar y medir con tu médico.']
    );
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[0], userIds[2], 'Yo siempre llevo dextrosa en el bolsillo cuando salgo a correr. ¡Imprescindible!']
    );

    // Post 1: Conteo carbohidratos (Ana)
    const c2 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[1], userIds[3], 'Como educador, recomiendo empezar con una libreta física las primeras semanas. Apunta todo lo que comes, tu dosis y resultados. Luego ya pasas a digital.']
    );
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[1], userIds[2], c2.rows[0].id, '¡Gracias Miguel! Probaré con libreta primero, parece buen consejo.']
    );
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[1], userIds[1], 'Yo uso MyFitnessPal y me va bien. También hay una app llamada "Diabes" que está muy bien para el conteo.']
    );

    // Post 2: Bomba de insulina (Miguel)
    const c3 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[2], userIds[1], '¿Cuánto tiempo tardaste en adaptarte a la bomba? Llevo tiempo pensando en cambiar.']
    );
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[2], userIds[3], c3.rows[0].id, 'Unas 4-6 semanas hasta sentirme cómodo del todo. Los primeros días son de ajustes constantes con el endocrino, pero merece la pena.']
    );
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[2], userIds[2], 'Mi hijo lleva bomba desde los 8 años y ha cambiado su vida. ¡Mucho ánimo!']
    );

    // Post 4: Guía hipoglucemia (Miguel)
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[4], userIds[1], 'Muy útil, gracias Miguel. Yo siempre llevo un gel de glucosa en la mochila desde que me pilló una hipo en el metro.']
    );
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[4], userIds[2], 'Deberían enseñar esto en los colegios. Guardado en favoritos.']
    );

    console.log('   ✅ Comentarios y respuestas creados');

    // =============================================
    // 4. Crear likes
    // =============================================
    console.log('\n❤️  Creando likes...');

    const postLikes = [
      [userIds[2], postIds[0]], // Ana → post ejercicio
      [userIds[3], postIds[0]], // Miguel → post ejercicio
      [userIds[1], postIds[1]], // Carlos → post carbohidratos
      [userIds[3], postIds[1]], // Miguel → post carbohidratos
      [userIds[1], postIds[2]], // Carlos → post bomba
      [userIds[2], postIds[2]], // Ana → post bomba
      [userIds[2], postIds[3]], // Ana → post estrés
      [userIds[3], postIds[3]], // Miguel → post estrés
      [userIds[1], postIds[4]], // Carlos → post hipoglucemia
      [userIds[2], postIds[4]], // Ana → post hipoglucemia
    ];

    for (const [userId, postId] of postLikes) {
      await client.query(
        `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
        [userId, postId]
      );
    }

    // Likes en algunos comentarios
    const allComments = await client.query('SELECT id FROM comments ORDER BY id LIMIT 6');
    for (let i = 0; i < allComments.rows.length; i++) {
      const commentId = allComments.rows[i].id;
      // Cada comentario recibe like de un usuario diferente (rotando, excluyendo admin)
      const likerIndex = (i % 3) + 1; // userIds[1], [2] o [3]
      await client.query(
        `INSERT INTO likes (user_id, comment_id) VALUES ($1, $2)`,
        [userIds[likerIndex], commentId]
      );
    }

    console.log('   ✅ Likes creados');

    // =============================================
    // 5. Crear follows
    // =============================================
    console.log('\n👥 Creando follows...');

    const follows = [
      [userIds[1], userIds[3]], // Carlos sigue a Miguel
      [userIds[2], userIds[3]], // Ana sigue a Miguel
      [userIds[2], userIds[1]], // Ana sigue a Carlos
    ];

    for (const [followerId, followingId] of follows) {
      await client.query(
        `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)`,
        [followerId, followingId]
      );
    }

    console.log('   ✅ Follows creados');

    await client.query('COMMIT');

    console.log('\n🎉 Seeders completados exitosamente!');
    console.log('   📊 Resumen:');
    console.log('   - 1 usuario admin  (admin@admin.com / admin)');
    console.log('   - 3 usuarios normales (password123)');
    console.log('   - 5 publicaciones creadas');
    console.log('   - 11 comentarios creados');
    console.log('   - 16 likes creados');
    console.log('   - 3 follows creados');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error ejecutando seeders:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runSeeders()
    .then(() => {
      pool.end();
      process.exit(0);
    })
    .catch(() => {
      pool.end();
      process.exit(1);
    });
}

module.exports = { runSeeders };