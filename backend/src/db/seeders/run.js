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
    // 1. Crear 3 usuarios de prueba
    // =============================================
    console.log('👤 Creando usuarios...');
    
    const users = [
      {
        username: 'carlos_diabetes',
        email: 'carlos@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Carlos Rodríguez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2018-05-15',
        bio: 'Diagnosticado en 2018. Me encanta compartir experiencias y ayudar a otros.'
      },
      {
        username: 'ana_martinez',
        email: 'ana@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Ana Martínez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2020-03-10',
        bio: 'Recién diagnosticada, aprendiendo cada día. Madre de dos hijos.'
      },
      {
        username: 'miguel_asesor',
        email: 'miguel@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Miguel Sánchez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2010-11-22',
        bio: '15 años con diabetes. Educador en diabetes, aquí para ayudar.'
      }
    ];

    const userIds = [];
    for (const user of users) {
      const result = await client.query(
        `INSERT INTO users (username, email, password, full_name, diabetes_type, diagnosis_date, bio) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) 
         RETURNING id`,
        [user.username, user.email, user.password, user.full_name, user.diabetes_type, user.diagnosis_date, user.bio]
      );
      userIds.push(result.rows[0].id);
      console.log(`   ✅ Usuario creado: ${user.username}`);
    }

    // =============================================
    // 2. Crear publicaciones
    // =============================================
    console.log('\n📝 Creando publicaciones...');

    const posts = [
      {
        user_id: userIds[0], // Carlos
        title: 'Consejos para manejar la diabetes durante el ejercicio',
        content: 'Hola a todos. Llevo varios años haciendo deporte con diabetes tipo 1 y quería compartir algunos consejos que me han funcionado: 1) Siempre revisar la glucosa antes de empezar, 2) Llevar siempre algo de azúcar rápido, 3) Ajustar la insulina según la intensidad. ¿Alguien más tiene consejos?',
        category: 'consejo',
        tags: 'ejercicio,deporte,consejos'
      },
      {
        user_id: userIds[1], // Ana
        title: 'Duda sobre conteo de carbohidratos',
        content: 'Hola, soy nueva en esto del conteo de carbohidratos. Me han recomendado varias apps pero no sé cuál es mejor. ¿Qué usan ustedes? ¿Algún consejo para principiantes?',
        category: 'pregunta',
        tags: 'conteo,principiantes,apps'
      },
      {
        user_id: userIds[2], // Miguel
        title: 'Experiencia: Mi viaje con la bomba de insulina',
        content: 'Después de 10 años usando plumas, el año pasado cambié a bomba de insulina. Quiero compartir mi experiencia: ventajas, desventajas y cosas que aprendí. Pregunten lo que quieran.',
        category: 'experiencia',
        tags: 'bomba,insulina,tecnologia'
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
      console.log(`   ✅ Publicación creada: ${post.title.substring(0, 30)}...`);
    }

    // =============================================
    // 3. Crear comentarios y respuestas
    // =============================================
    console.log('\n💬 Creando comentarios y respuestas...');

    // Comentarios en la primera publicación (ejercicio)
    const comment1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [postIds[0], userIds[2], 'Muy buenos consejos. Yo añadiría que es importante también ajustar la insulina basal según el tipo de ejercicio. Los ejercicios de fuerza afectan diferente que los aeróbicos.']
    );

    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) 
       VALUES ($1, $2, $3, $4)`,
      [postIds[0], userIds[0], comment1.rows[0].id, '¡Cierto! No había pensado en eso. ¿Tienes algún ejemplo concreto?']
    );

    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) 
       VALUES ($1, $2, $3, $4)`,
      [postIds[0], userIds[2], comment1.rows[0].id, 'Por ejemplo, si hago pesas suelo necesitar menos insulina basal, mientras que si corro necesito más. Es cuestión de probar y medir.']
    );

    // Comentarios en la segunda publicación (conteo)
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) 
       VALUES ($1, $2, $3)`,
      [postIds[1], userIds[0], 'Yo uso MyFitnessPal y me va bien. También hay una app específica llamada "Diabes" que está muy bien para conteo.']
    );

    const comment2 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) 
       VALUES ($1, $2, $3) 
       RETURNING id`,
      [postIds[1], userIds[2], 'Como educador, recomiendo empezar con una libreta física las primeras semanas. Apunta todo lo que comes, tu dosis y resultados. Luego ya pasas a digital.']
    );

    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) 
       VALUES ($1, $2, $3, $4)`,
      [postIds[1], userIds[1], comment2.rows[0].id, '¡Gracias Miguel! Probaré con libreta primero, parece buen consejo.']
    );

    // =============================================
    // 4. Crear likes
    // =============================================
    console.log('\n❤️  Creando likes...');

    // Likes en publicaciones
    await client.query(
      `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
      [userIds[1], postIds[0]]
    );
    await client.query(
      `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
      [userIds[2], postIds[0]]
    );
    await client.query(
      `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
      [userIds[0], postIds[1]]
    );
    await client.query(
      `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
      [userIds[2], postIds[1]]
    );
    await client.query(
      `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
      [userIds[0], postIds[2]]
    );
    await client.query(
      `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
      [userIds[1], postIds[2]]
    );

    // Likes en comentarios
    const commentsResult = await client.query('SELECT id FROM comments LIMIT 5');
    for (let i = 0; i < commentsResult.rows.length; i++) {
      const comment = commentsResult.rows[i];
      const likeUserIndex = i % userIds.length;
      await client.query(
        `INSERT INTO likes (user_id, comment_id) VALUES ($1, $2)`,
        [userIds[likeUserIndex], comment.id]
      );
    }

    // =============================================
    // 5. Crear algunas relaciones de follow
    // =============================================
    console.log('\n👥 Creando follows...');

    await client.query(
      `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)`,
      [userIds[0], userIds[2]]
    );
    await client.query(
      `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)`,
      [userIds[1], userIds[2]]
    );
    await client.query(
      `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)`,
      [userIds[1], userIds[0]]
    );

    await client.query('COMMIT');
    
    console.log('\n🎉 Seeders completados exitosamente!');
    console.log(`   📊 Resumen:`);
    console.log(`   - 3 usuarios creados`);
    console.log(`   - 3 publicaciones creadas`);
    console.log(`   - 6+ comentarios creados`);
    console.log(`   - 9+ likes creados`);
    console.log(`   - 3 follows creados`);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error ejecutando seeders:', error);
    throw error;
  } finally {
    client.release(); // Solo liberamos el cliente, no cerramos el pool
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runSeeders()
    .then(() => {
      pool.end(); // Solo cerramos si se ejecuta directamente
      process.exit(0);
    })
    .catch(() => {
      pool.end();
      process.exit(1);
    });
}

module.exports = { runSeeders };