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
    // 1. Crear usuarios (1 admin + 13 usuarios)
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
      // --- Usuarios normales con historias ---
      {
        username: 'carlos_diabetes',
        email: 'carlos@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Carlos Rodríguez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2018-05-15',
        bio: 'Diagnosticado en 2018. Deportista y amante del fitness. Aquí para compartir mi experiencia con ejercicio y diabetes.',
        role: 'user'
      },
      {
        username: 'ana_martinez',
        email: 'ana@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Ana Martínez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2020-03-10',
        bio: 'Recién diagnosticada en 2020, aprendiendo cada día. Madre de dos hijos. Compartiendo mi viaje hacia la aceptación.',
        role: 'user'
      },
      {
        username: 'miguel_asesor',
        email: 'miguel@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Miguel Sánchez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2010-11-22',
        bio: '15 años con diabetes. Educador en diabetes certificado. Aquí para ayudar y aprender juntos.',
        role: 'user'
      },
      {
        username: 'lucia_tipo2',
        email: 'lucia@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Lucía Pérez',
        diabetes_type: 'Tipo 2',
        diagnosis_date: '2015-07-08',
        bio: 'Diagnosticada con tipo 2 hace 11 años. Creo en el cambio de hábitos y la vida saludable.',
        role: 'user'
      },
      {
        username: 'diego_bomba',
        email: 'diego@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Diego López',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2016-02-14',
        bio: 'Usuario de bomba de insulina desde hace 5 años. Ingeniero por profesión, siempre investigando nuevas tecnologías para la diabetes.',
        role: 'user'
      },
      {
        username: 'elena_mama',
        email: 'elena@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Elena García',
        diabetes_type: null,
        diagnosis_date: null,
        bio: 'Madre de tres niños, uno con diabetes tipo 1. Aquí para entender mejor y apoyar la comunidad.',
        role: 'user'
      },
      {
        username: 'pablo_runner',
        email: 'pablo@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Pablo Torres',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2014-09-20',
        bio: 'Corredor de maratones con diabetes. Probando que los límites son solo mentales.',
        role: 'user'
      },
      {
        username: 'sofia_artist',
        email: 'sofia@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Sofía Blanco',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2019-06-11',
        bio: 'Artista gráfica. Utilizo mis habilidades para crear contenido visual sobre diabetes.',
        role: 'user'
      },
      {
        username: 'javier_estudiante',
        email: 'javier@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Javier Nuñez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2017-04-03',
        bio: 'Estudiante de Medicina. Fascinado por la investigación de diabetes y nuevas terapias.',
        role: 'user'
      },
      {
        username: 'rosa_veterana',
        email: 'rosa@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Rosa Fernández',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2000-12-15',
        bio: '26 años viviendo con diabetes. He visto cómo evoluciona la tecnología. Mentora del grupo.',
        role: 'user'
      },
      {
        username: 'mateo_nutricion',
        email: 'mateo@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Mateo Álvarez',
        diabetes_type: 'Tipo 2',
        diagnosis_date: '2018-01-10',
        bio: 'Nutricionista especializado en diabetes. Compartiendo consejos de alimentación y bienestar.',
        role: 'user'
      },
      {
        username: 'clara_psico',
        email: 'clara@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Clara Moreno',
        diabetes_type: null,
        diagnosis_date: null,
        bio: 'Psicóloga especializada en enfermedades crónicas. Aquí para ayudar con el aspecto emocional.',
        role: 'user'
      },
      {
        username: 'rafael_viajero',
        email: 'rafael@example.com',
        password: await bcrypt.hash('password123', 10),
        full_name: 'Rafael Dominguez',
        diabetes_type: 'Tipo 1',
        diagnosis_date: '2012-08-25',
        bio: 'Viajero nómada con diabetes. Probando que puedes vivir aventuras sin límites.',
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

    // =============================================
    // 2. Crear publicaciones (muchas más, con naturalidad)
    // =============================================
    console.log('\n📝 Creando publicaciones...');

    const posts = [
      // --- Carlos (deportista, id=1) ---
      {
        user_id: userIds[1],
        title: 'Consejos para manejar la diabetes durante el ejercicio intenso',
        content: 'Llevo 6 años haciendo deporte con diabetes tipo 1 y he aprendido mucho. Aquí van mis mejores consejos:\n\n1) Revisar glucosa 30 min antes de ejercitar\n2) Llevar siempre gel de glucosa\n3) Ajustar insulina según intensidad (yo bajo un 20-30%)\n4) Hidratarse bien\n5) Monitorizar post-ejercicio\n\n¿Qué otros trucos usáis?',
        category: 'consejo',
        tags: 'ejercicio,deporte,insulina'
      },
      {
        user_id: userIds[1],
        title: '¿Alguien más corre maratones con diabetes?',
        content: 'Estoy pensando en correr mi primera maratón el próximo año. ¿Alguien ha hecho algo similar? Tengo muchas dudas sobre cómo gestionar la glucosa durante 4+ horas de carrera.',
        category: 'pregunta',
        tags: 'maratón,ejercicio,deportes'
      },
      {
        user_id: userIds[1],
        title: 'Mi rutina de gym con diabetes',
        content: 'Después de 6 años, he perfeccionado mi rutina. Aquí comparto lo que funciona:\n- Entrenamiento: 5 días a la semana\n- Antes: medir glucosa, tomar 15g carbos rápidos si bajo\n- Después: proteína y carbos complejos\n- HbA1c: 6.8%\n\nLas ganancias de músculo son reales, solo hay que ser constante.',
        category: 'experiencia',
        tags: 'gym,musculo,ejercicio'
      },
      // --- Ana (madre, id=2) ---
      {
        user_id: userIds[2],
        title: 'Dudas sobre conteo de carbohidratos para principiantes',
        content: 'Hace poco que me diagnosticaron. Siento que el conteo de carbos es lo más difícil de toda esta historia. ¿Cómo empezasteis vosotros? ¿Apps recomendadas?',
        category: 'pregunta',
        tags: 'carbohidratos,principiantes'
      },
      {
        user_id: userIds[2],
        title: 'Cómo explico la diabetes a mis hijos',
        content: 'He intentado que entiendan sin asustarlos. Aquí está mi experiencia:\n- "Mamá necesita pinchazos para estar fuerte"\n- Los dejo que me ayuden en algunos momentos\n- Normalizar es clave\n- A veces preguntan por qué "otros no lo hacen"\n\nConsiderando ir a un educador infantil pronto.',
        category: 'experiencia',
        tags: 'familia,niños,aceptacion'
      },
      {
        user_id: userIds[2],
        title: '¿Alguien más se siente abrumado al principio?',
        content: 'Llevo 4 años y sigo teniendo días donde me siento abrumada. ¿Es normal? A veces me pregunto si lo hago bien.',
        category: 'pregunta',
        tags: 'emociones,aceptacion'
      },
      // --- Miguel (educador, id=3) ---
      {
        user_id: userIds[3],
        title: 'Guía completa: Mi viaje de 15 años con diabetes tipo 1',
        content: 'He visto la evolución de esta enfermedad desde 2010 hasta hoy. Aquí quiero compartir:\n\n2010: Plumas y glucómetro de dedo\n2015: Primeros CGM (FreeStyle Libre)\n2018: Bomba de insulina\n2020: Sensor integrado con bomba\n\nLa tecnología cambia la vida, pero la disciplina es lo más importante.\n\nAlguna pregunta específica?',
        category: 'experiencia',
        tags: 'tecnologia,evolucion,15años'
      },
      {
        user_id: userIds[3],
        title: 'Qué hacer ante una hipoglucemia: Protocolo efectivo',
        content: 'Como educador, les enseño este protocolo:\n\n1. RECONOCER: temblores, sudor, taquicardia\n2. MEDIR: si es posible (si no, asumir hipo)\n3. 15 GRAMOS: zumo pequeño, 3 terrones, gel\n4. ESPERAR 15 MIN: medir de nuevo\n5. SI SIGUE BAJA: repetir\n6. SNACK: pan, galletas (carbos lentos)\n7. PREVENCIÓN: revisar qué pasó\n\nMuchos errores nuevos con las dosis.',
        category: 'consejo',
        tags: 'hipoglucemia,emergencia,protocolo'
      },
      {
        user_id: userIds[3],
        title: 'Bomba vs Plumas: Mi experiencia después de 10 años con plumas',
        content: 'Cambié a bomba hace 5 años. Ventajas:\n- Control más fino\n- Menos inyecciones\n- Datos para ajustar\n\nDesventajas:\n- Caro (afortunadamente cubierto aquí)\n- Dependencia de infusión\n- Aprendizaje lento\n\nMi HbA1c bajó 0.5 puntos en el primer año. Lo recomiendo, pero no es solución mágica.',
        category: 'experiencia',
        tags: 'bomba,plumas,tecnologia'
      },
      // --- Lucía (tipo 2, id=4) ---
      {
        user_id: userIds[4],
        title: 'Cómo revertir la diabetes tipo 2 con cambios de hábitos',
        content: 'Sé que muchos dicen que tipo 2 es "por culpa de X", pero yo lo viví diferente. Mi historia:\n\n2015: Diagnóstico en 180 mg/dL\n2017: Empecé con dieta\n2020: Sin medicación\n2024: HbA1c 5.1% (normal)\n\nNunca pensé que sería posible. Ahora soy como testigo de que los cambios reales son posibles.',
        category: 'experiencia',
        tags: 'tipo2,habitos,cambio'
      },
      {
        user_id: userIds[4],
        title: '¿Dieta cetogénica con diabetes tipo 2? Mi experiencia',
        content: 'Probé keto durante 6 meses. Resultados:\n- Peso: -12 kg\n- HbA1c: mejora de 0.8 puntos\n- Energía: buena\n\nPero socialmente fue complicado. Ahora hago una versión flexible. ¿Alguien más probó?',
        category: 'experiencia',
        tags: 'dieta,keto,tipo2'
      },
      // --- Diego (bomba, id=5) ---
      {
        user_id: userIds[5],
        title: 'Tecnología: Mi setup actual con Medtronic 780G',
        content: 'Estoy fascinado con la automación. Mi setup:\n- Bomba: Medtronic 780G (algoritmo automático)\n- Sensor: Integrado en la bomba\n- App: Seguimiento en teléfono\n\nEsta combinación ha sido transformadora. HbA1c 6.2% sin apenas pensarlo.',
        category: 'experiencia',
        tags: 'bomba,tecnologia,automatizacion'
      },
      {
        user_id: userIds[5],
        title: 'Problemas con infusiones: Qué aprendí',
        content: 'En 5 años con bomba he tenido infusiones problemáticas. Aquí mis aprendizajes:\n\n1. Cambiar cada 2-3 días, no esperar a 6\n2. Variar zonas (abdomen, brazos, muslos)\n3. Revisar si hay enrojecimiento\n4. Mantener desinfectante a mano\n5. Tener repuestos siempre\n\nLas infecciones cuestan tiempo y glucosa inestable.',
        category: 'consejo',
        tags: 'bomba,infusiones,mantenimiento'
      },
      // --- Elena (madre no diabética, id=6) ---
      {
        user_id: userIds[6],
        title: 'Soy madre de un niño con diabetes tipo 1',
        content: 'Mi hijo fue diagnosticado a los 6 años. El primer año fue devastador. Pero ahora, 3 años después:\n\n- Él es más fuerte que cualquiera de nosotros\n- Maneja su propia bolsa con todo\n- Va a campamentos de verano (con ayuda)\n- Su HbA1c es mejor que la mía de cuando fumaba\n\nVengo aquí a aprender cómo apoyarlo mejor.',
        category: 'experiencia',
        tags: 'familia,niños,diabetes-infantil'
      },
      {
        user_id: userIds[6],
        title: '¿Cómo se lo explico a otros padres en la escuela?',
        content: 'Algunos padres de la escuela de mi hijo todavía piensan que es culpa de "comer azúcar". ¿Cómo explicáis vosotros? Quiero que lo entienda bien, pero sin sentirme juzgada.',
        category: 'pregunta',
        tags: 'familia,escuela,discriminacion'
      },
      // --- Pablo (corredor, id=7) ---
      {
        user_id: userIds[7],
        title: 'Corriendo maratones con diabetes: Mi primer 42K',
        content: 'Hace 2 años corrí mi primera maratón con diabetes. Tiempo: 4h 15min. Aquí lo que aprendí:\n\n- Empecé a reducir insulina 48h antes\n- Durante: llevé geles cada 5km\n- Después: hiperglucemia de reacción (stress, adrenalina)\n- La próxima vez cambiaré la estrategia\n\nEs posible, solo necesita preparación.',
        category: 'experiencia',
        tags: 'maraton,deporte,reto'
      },
      {
        user_id: userIds[7],
        title: '¿Alguien se anima a un reto de running comunitario?',
        content: 'Pensaba en organizar un reto: correr 100km en equipo durante un mes. Cada uno corre lo que puede, cuando puede. Objetivo: mostrar que la diabetes no nos detiene.\n\n¿Interesados?',
        category: 'pregunta',
        tags: 'reto,comunidad,running'
      },
      // --- Sofía (artista, id=8) ---
      {
        user_id: userIds[8],
        title: 'Proyecto: Ilustraciones sobre la vida con diabetes',
        content: 'He creado una serie de ilustraciones sobre momentos cotidianos con diabetes. Desde el "cuidado, ¡hipo!" hasta "orgulloso de mi HbA1c".\n\nPenso crear un libro o zine. ¿Alguien quiere verlas? ¿Feedback?',
        category: 'pregunta',
        tags: 'arte,comunidad,proyecto'
      },
      {
        user_id: userIds[8],
        title: 'Cómo el arte me ayudó a aceptar mi diabetes',
        content: 'Cuando me diagnosticaron, estaba en una espiral oscura. Pero entonces empecé a dibujar sobre ello. Cada ilustración fue una catarsis. Ahora tengo 200+ dibujos que cuentan mi historia.\n\nAl arte lo llamo "mi medicamento emocional".',
        category: 'experiencia',
        tags: 'arte,salud-mental,aceptacion'
      },
      // --- Javier (estudiante de medicina, id=9) ---
      {
        user_id: userIds[9],
        title: 'Como estudiante de medicina con diabetes tipo 1',
        content: 'Estoy en 3er año de medicina y convivo con diabetes. Es extraño: aprendo sobre insulina en clase y luego me la inyecto. Mi perspectiva:\n\n- Entiendo mejor los mecanismos fisiológicos\n- Me frustra a veces que los médicos no escuchen\n- Quiero especializarme en endocrinología',
        category: 'experiencia',
        tags: 'medicina,educacion,perspectiva'
      },
      {
        user_id: userIds[9],
        title: '¿Qué preguntas debería hacer a mi endocrinólogo?',
        content: 'Tengo cita en 2 semanas. ¿Qué cosas importantes podría preguntar que normalmente no se menciona?',
        category: 'pregunta',
        tags: 'medicos,consulta'
      },
      // --- Rosa (veterana, id=10) ---
      {
        user_id: userIds[10],
        title: '26 años con diabetes: Cómo cambió todo',
        content: 'Empecé en 1998 con jeringuillas de vidrio reutilizables. Esto es lo que he visto:\n\n1998-2005: Era mortificante, aislamiento\n2005-2010: Empezaron las plumas, cambió todo\n2010-2015: CGM básicos (salía de la bolsa para medir)\n2015-2020: Sensores en tiempo real\n2020-2024: Algoritmos inteligentes\n\nLa historia de esperanza es real. Cada generación tiene herramientas mejores.',
        category: 'experiencia',
        tags: 'historia,tecnologia,esperanza'
      },
      {
        user_id: userIds[10],
        title: 'Mentoría: ¿Alguien nuevo necesita consejos?',
        content: 'Llevo 26 años. He visto todo. Si alguien acaba de ser diagnosticado y se siente perdido, escribidme. Pasé por ahí y sé cómo duele. Estoy aquí para ayudar.',
        category: 'consejo',
        tags: 'mentoria,apoyo,bienvenida'
      },
      // --- Mateo (nutricionista, id=11) ---
      {
        user_id: userIds[11],
        title: 'Nutrición para diabetes tipo 2: Plan práctico',
        content: 'Como nutricionista especializado en diabetes, les comparto mi plan básico:\n\n1. Plato saludable: 50% verdura, 25% proteína, 25% carbos\n2. Carbos: integral, no blanco\n3. Proteína: en cada comida\n4. Grasas: monoinsaturadas (oliva, aguacate)\n5. Agua: 2L diarios\n\nNo es complicado. Es consistencia.',
        category: 'consejo',
        tags: 'nutricion,tipo2,dieta'
      },
      {
        user_id: userIds[11],
        title: '¿Puedo comer azúcar con diabetes?',
        content: 'Pregunta frecuente. Respuesta corta: sí, pero inteligentemente.\n\n- No prohíbas, que genera frustración\n- Pequeñas porciones, rara vez\n- Siempre con proteína o grasa (ralentiza absorción)\n- Mide el impacto con tu glucómetro\n\nLa culpa es peor que el azúcar.',
        category: 'consejo',
        tags: 'nutricion,azucar,psicologia'
      },
      // --- Clara (psicóloga, id=12) ---
      {
        user_id: userIds[12],
        title: 'La salud mental es parte del tratamiento de diabetes',
        content: 'Trabajo con pacientes con diabetes desde hace años. Lo que he visto:\n\n- Depresión: común en los primeros años\n- Ansiedad: asociada a hipoglucemias\n- Culpa: "debería tener mejor HbA1c"\n- Burnout: fatiga emocional constante\n\nEstoy aquí para recordar: tu mente importa tanto como tu insulina.',
        category: 'consejo',
        tags: 'salud-mental,psicologia,apoyo'
      },
      {
        user_id: userIds[12],
        title: '¿Alguien más lucha con el burnout de diabetes?',
        content: 'No es solo un número en la HbA1c. Es el peso emocional de pensar en ello 24/7. ¿Cómo lo manejáis? ¿Habéis ido a terapia?',
        category: 'pregunta',
        tags: 'salud-mental,apoyo'
      },
      // --- Rafael (viajero, id=13) ---
      {
        user_id: userIds[13],
        title: 'Viajando por el mundo con diabetes: Guía práctica',
        content: 'He viajado a 40+ países con diabetes tipo 1. Mis aprendizajes:\n\n1. Llevar DOBLE medicamento en equipajes separados\n2. Llevar prescripción médica (en inglés)\n3. Zonas horarias: ajustar insulina poco a poco\n4. Frigoríficos del hotel: pedir con tiempo\n5. Seguros de viaje: asegurar cobertura\n6. Amigos locales: siempre busco diabéticos en cada ciudad\n\nLa diabetes no te detiene. Te hace mejor viajero.',
        category: 'experiencia',
        tags: 'viajes,mundo,aventura'
      },
      {
        user_id: userIds[13],
        title: '¿Alguien se anima a un viaje grupal de diabéticos?',
        content: 'Estoy pensando en organizar un viaje para personas con diabetes. Destino aún abierto. Objetivo: demostrar que podemos vivir sin límites.\n\n¿Interesados? ¿Dónde preferís ir?',
        category: 'pregunta',
        tags: 'viajes,comunidad,reto'
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
    // 3. Crear comentarios en threads naturales
    // =============================================
    console.log('\n💬 Creando comentarios e interacciones...');

    let commentCount = 0;

    // Thread 1: Carlos - Ejercicio intenso (responden: Miguel, Pablo, Diego)
    const c1_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[0], userIds[3], 'Excelentes consejos Carlos. Añadiría que los ejercicios de fuerza y aeróbico requieren ajustes diferentes. En mi caso, corriendo necesito más insulina que en pesas.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[0], userIds[1], c1_1.rows[0].id, '¡Cierto! Eso es lo que me falta entender mejor. ¿Cómo sabes cuánta insulina restar?']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[0], userIds[3], c1_1.rows[0].id, 'Es cuestión de medir y anotar. Yo llevo un registro: "50 min gym = -20% basal". Luego ajusto según la glucosa post-ejercicio.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[0], userIds[5], 'Con bomba es más fácil. Puedo bajar la basal en tiempo real desde el reloj. Pero tus consejos siguen siendo válidos.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[0], userIds[7], 'Correr es diferente de hacer gym. En mi maratón del año pasado suspendí la insulina basal 3h antes. Cada cuerpo es diferente.']
    );
    commentCount++;

    // Thread 2: Ana - Carbohidratos principiantes (responden: Miguel, Mateo, Rosa)
    const c2_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[3], userIds[3], 'Ana, empieza con una app simple como MyFitnessPal o Carb Manager. Pero lo mejor es una libreta durante 1-2 semanas. Así entiendes qué está pasando.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[3], userIds[2], c2_1.rows[0].id, 'Gracias Miguel. Libraré en libreta primero. Tengo una mano de aplicaciones y me abruma más que ayuda.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[3], userIds[11], 'Como nutricionista digo: el conteo exacto es un mito. Apunta grupos: "un puño de arroz = ~30g carbos". Eso es suficiente.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[3], userIds[10], 'Cuando empecé no existían apps. Usaba tablas de papel. Ahora lo tenéis fácil. Ánimo, se pasa.']
    );
    commentCount++;

    // Thread 3: Miguel - Protocolo hipoglucemia (responden: Carlos, Rosa, Sofía)
    const c3_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[7], userIds[1], 'Protocolo oro. Yo llevo siempre gel en el bolsillo. Una vez me pasó una hipo en el metro y ese gel me salvó.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[7], userIds[3], c3_1.rows[0].id, 'Exacto, la prevención y siempre llevar algo encima es lo más importante. Algunos cometen el error de no reconocer los síntomas a tiempo.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[7], userIds[10], 'A través de 26 años aprendí que cada hipo enseña algo. Ahora las evito 95% del tiempo porque reconozco patrones.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[7], userIds[8], 'Lo dibujé. El protocolo de Miguel es lo que está en mi serie de ilustraciones. Me encanta cómo lo explica.']
    );
    commentCount++;

    // Thread 4: Lucía - Dieta cetogénica (responden: Mateo, Javier, Rafael)
    const c4_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[9], userIds[11], 'Lucía, genial tu experiencia. Pero advierto: keto es bueno a corto plazo. A largo plazo, necesitas sostenibilidad social. Felicidades por mantenerlo 6 meses.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[9], userIds[4], c4_1.rows[0].id, 'Sí, por eso ahora hago una versión flexible. Keto estricto era demasiado aislante socialmente.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[9], userIds[9], 'Desde la perspectiva médica, keto puede ser efectivo para tipo 2, pero necesita supervisión. ¿Tu endocrino lo aprobó?']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[9], userIds[13], 'Cuando viajé a Japón probé dieta alta en carbos complejos (arroz). Funcionó diferente que en casa. Interesante.']
    );
    commentCount++;

    // Thread 5: Diego - Tecnología Medtronic (responden: Rosa, Pablo, Mateo)
    const c5_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[10], userIds[10], 'Diego, estoy considerando ese modelo. ¿Cuántos años llevas con bombas? ¿Cuál fue tu evolución tecnológica?']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[10], userIds[5], c5_1.rows[0].id, 'Rosa, llevo 5 años. Empecé con una bomba básica 2019, ahora 780G. La diferencia es noite y día en términos de automatización.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[10], userIds[7], 'Para correr ¿la bomba realmente funciona bien? Tengo miedo de que se atasque.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[10], userIds[11], 'Desde nutrición veo que los pacientes con bomba suelen tener mejor HbA1c que con plumas. Los datos ayudan a ajustar mejor.']
    );
    commentCount++;

    // Thread 6: Elena - Explicar a otros padres (responden: Rosa, Clara, Miguel)
    const c6_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[13], userIds[10], 'Elena, mucha ánimo. A mí me pasaba hace años. Los padres aprenden. Si necesitas folletos informativos, hay de la ADA.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[13], userIds[6], c6_1.rows[0].id, 'Gracias Rosa, buscaré esos folletos. Me cuesta porque siento que me juzgan.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[13], userIds[12], 'Elena, eso es culpa reflejada. Tú no tienes culpa. Tu hijo no tiene culpa. Es genética + ambiente, nunca solo una cosa.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[13], userIds[3], 'La educación es lo que cambia mentalidades. Si quieres, puedo hacer un taller en la escuela.']
    );
    commentCount++;

    // Thread 7: Pablo - Maratones (responden: Carlos, Rosa, Rafael)
    const c7_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[14], userIds[1], 'Pablo, ¡increíble! 4h15min es un buen tiempo. Yo pensaba en maratón pero aún tengo dudas. ¿Qué cambiarías la próxima vez?']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[14], userIds[7], c7_1.rows[0].id, 'La hiperglucemia post-carrera es común. Próxima vez entro con insulina sin reducir, a ver si mejora. Y menos geles, quizá.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[14], userIds[10], 'Hace años veía a diabéticos sedentarios. Ahora hay maratonianos. La comunidad ha evolucionado. Orgullo.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[14], userIds[13], 'Correr es como viajar. El cuerpo aprende. Yo corro en cada ciudad que visito ahora.']
    );
    commentCount++;

    // Thread 8: Sofía - Proyecto de arte (responden: Elena, Clara, Javier)
    const c8_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[16], userIds[6], 'Sofía, ¡sí! Quiero ver. Mi hijo podría beneficiarse de visuaes que muestren que la diabetes no es lo peor del mundo.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[16], userIds[8], c8_1.rows[0].id, 'Elena, perfecto. Intento que las ilustraciones sean empoderadoras, no victimistas. El arte que sana.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[16], userIds[12], 'Sofía, como psicóloga te digo: el arte es terapia. Un zine sobre diabetes podría impactar a muchos.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[16], userIds[9], 'Como futuro médico, necesitamos más empatía en la medicina. Tu arte ayuda. Vamos a colaborar?']
    );
    commentCount++;

    // Thread 9: Javier - Preguntas al endocrino (responden: Miguel, Rosa, Mateo)
    const c9_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[18], userIds[3], 'Pregunta siempre sobre: sensores, bombas, plan de ejercicio, metas HbA1c personalizado. Y pide un educador en diabetes.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[18], userIds[9], c9_1.rows[0].id, 'Miguel, excelente. Anotaré. También preguntaré sobre el rol del ejercicio en mi plan.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[18], userIds[10], 'Con 26 años de experiencia: los mejores médicos son los que escuchan. Si tu endo no te escucha, cambia de endo.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[18], userIds[11], 'Javier, pregunta sobre ajustes de insulina según actividad física. Eso marca una diferencia enorme.']
    );
    commentCount++;

    // Thread 10: Rosa - Mentoría (responden: Ana, Clara, Elena)
    const c10_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[19], userIds[2], 'Rosa, gracias. Algunos días estoy asustada. Ayudaría hablar con alguien que pasó por esto.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[19], userIds[10], c10_1.rows[0].id, 'Ana, escríbeme cuando quieras. He visto todo: depresión, aceptación, rebeldía. Es normal.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[19], userIds[12], 'Rosa, tu oferta de mentoría es exactamente lo que muchos necesitan. ¡Gracias por estar!']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[19], userIds[6], 'Rosa, como madre de un niño con diabetes, necesito mentoría también. ¿Aceptas madres preocupadas?']
    );
    commentCount++;

    // Thread 11: Mateo - Nutrición tipo 2 (responden: Lucía, Javier)
    const c11_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[20], userIds[4], 'Mateo, el plato saludable me cambió la vida. Desde que sigo eso, bajé peso sin conteos obsesivos.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[20], userIds[11], c11_1.rows[0].id, 'Lucía, exacto. El método visual es menos estresante que contar cada carbohidrato. Sostenibilidad psicológica.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[20], userIds[9], 'Desde medicina confirmamos: proteína en cada comida mejora la respuesta glucémica. Bien hecho, Mateo.']
    );
    commentCount++;

    // Thread 12: Clara - Salud mental (responden: Ana, Rosa, Sofía)
    const c12_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[22], userIds[2], 'Clara, exacto. Hace poco hablé con una psicóloga. Me ayudó a ver que mis miedos son normales.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[22], userIds[12], c12_1.rows[0].id, 'Ana, es importante normalizarlo. Muchos creemos que "deberíamos aguantarlo solos". No es verdad.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[22], userIds[10], 'En 26 años aprendí: la mente afecta glucosa. Estrés = picos. Relajación = control. Todo está conectado.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[22], userIds[8], 'El arte me ayudó psicológicamente. Clara, ¿es terapia formal o simplemente expresión?']
    );
    commentCount++;

    // Thread 13: Rafael - Viajes (responden: Elena, Javier)
    const c13_1 = await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id`,
      [postIds[24], userIds[6], 'Rafael, increíble. Mi hijo sueña con viajar y me aterroriza que la diabetes le limite. Tu historia es esperanza.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, parent_comment_id, content) VALUES ($1, $2, $3, $4)`,
      [postIds[24], userIds[13], c13_1.rows[0].id, 'Elena, cuéntale que ya he estado en 40 países. Los límites son mentales. La diabetes es un detalle.']
    );
    commentCount++;
    await client.query(
      `INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)`,
      [postIds[24], userIds[9], 'Rafael, ¿recomendarías algún destino en particular para alguien con diabetes tipo 1?']
    );
    commentCount++;

    console.log(`   ✅ ${commentCount} comentarios creados`);

    // =============================================
    // 4. Crear likes distribuidos (40+ total)
    // =============================================
    console.log('\n❤️  Creando likes...');

    const likes = [
      // Posts de Carlos
      [userIds[3], postIds[0]], [userIds[5], postIds[0]], [userIds[7], postIds[0]], [userIds[2], postIds[0]],
      [userIds[3], postIds[1]], [userIds[7], postIds[1]], [userIds[10], postIds[1]],
      [userIds[5], postIds[2]], [userIds[11], postIds[2]], [userIds[1], postIds[2]],

      // Posts de Ana
      [userIds[3], postIds[3]], [userIds[10], postIds[3]], [userIds[11], postIds[3]],
      [userIds[3], postIds[4]], [userIds[6], postIds[4]], [userIds[12], postIds[4]],
      [userIds[10], postIds[5]], [userIds[12], postIds[5]],

      // Posts de Miguel
      [userIds[1], postIds[6]], [userIds[5], postIds[6]], [userIds[7], postIds[6]], [userIds[10], postIds[6]],
      [userIds[1], postIds[7]], [userIds[2], postIds[7]], [userIds[4], postIds[7]], [userIds[6], postIds[7]],
      [userIds[1], postIds[8]], [userIds[2], postIds[8]], [userIds[5], postIds[8]], [userIds[10], postIds[8]],

      // Posts de Lucía
      [userIds[4], postIds[9]], [userIds[11], postIds[9]], [userIds[12], postIds[9]],
      [userIds[11], postIds[10]], [userIds[9], postIds[10]],

      // Posts de Diego
      [userIds[5], postIds[11]], [userIds[10], postIds[11]], [userIds[3], postIds[11]],
      [userIds[7], postIds[12]], [userIds[1], postIds[12]], [userIds[5], postIds[12]],

      // Posts de Elena
      [userIds[10], postIds[13]], [userIds[3], postIds[13]], [userIds[12], postIds[13]], [userIds[6], postIds[13]],
      [userIds[10], postIds[14]], [userIds[12], postIds[14]],

      // Posts de Pablo
      [userIds[1], postIds[15]], [userIds[7], postIds[15]], [userIds[3], postIds[15]], [userIds[5], postIds[15]],
      [userIds[1], postIds[16]], [userIds[7], postIds[16]],

      // Posts de Sofía
      [userIds[6], postIds[17]], [userIds[12], postIds[17]], [userIds[2], postIds[17]], [userIds[9], postIds[17]],
      [userIds[12], postIds[18]], [userIds[10], postIds[18]],

      // Posts de Javier
      [userIds[3], postIds[19]], [userIds[10], postIds[19]], [userIds[1], postIds[19]],
      [userIds[9], postIds[20]], [userIds[11], postIds[20]],

      // Posts de Rosa
      [userIds[2], postIds[21]], [userIds[10], postIds[21]], [userIds[3], postIds[21]], [userIds[12], postIds[21]],
      [userIds[1], postIds[22]], [userIds[2], postIds[22]], [userIds[5], postIds[22]],

      // Posts de Mateo
      [userIds[4], postIds[23]], [userIds[11], postIds[23]], [userIds[9], postIds[23]],
      [userIds[4], postIds[24]], [userIds[12], postIds[24]],

      // Posts de Clara
      [userIds[2], postIds[25]], [userIds[10], postIds[25]], [userIds[8], postIds[25]], [userIds[12], postIds[25]],
      [userIds[2], postIds[26]], [userIds[10], postIds[26]], [userIds[12], postIds[26]],

      // Posts de Rafael
      [userIds[6], postIds[27]], [userIds[13], postIds[27]], [userIds[10], postIds[27]],
      [userIds[1], postIds[28]], [userIds[7], postIds[28]], [userIds[13], postIds[28]],
    ];

    for (const [userId, postId] of likes) {
      try {
        await client.query(
          `INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`,
          [userId, postId]
        );
      } catch (e) {
        // Ignorar duplicados
      }
    }

    // Algunos likes en comentarios
    const comments = await client.query('SELECT id FROM comments ORDER BY id LIMIT 15');
    for (let i = 0; i < comments.rows.length; i++) {
      const commentId = comments.rows[i].id;
      const likerIndex = (1 + (i % 12)); // Usar cualquier usuario excepto admin
      try {
        await client.query(
          `INSERT INTO likes (user_id, comment_id) VALUES ($1, $2)`,
          [userIds[likerIndex], commentId]
        );
      } catch (e) {
        // Ignorar duplicados
      }
    }

    console.log('   ✅ Likes creados');

    // =============================================
    // 5. Crear algunos follows interesantes
    // =============================================
    console.log('\n👥 Creando follows...');

    const follows = [
      // Todos siguen a Rosa (veterana/mentora)
      [userIds[2], userIds[10]], // Ana → Rosa
      [userIds[1], userIds[10]], // Carlos → Rosa
      [userIds[4], userIds[10]], // Lucía → Rosa
      [userIds[9], userIds[10]], // Javier → Rosa
      [userIds[8], userIds[10]], // Sofía → Rosa

      // Muchos siguen a Miguel (educador)
      [userIds[1], userIds[3]], // Carlos → Miguel
      [userIds[2], userIds[3]], // Ana → Miguel
      [userIds[5], userIds[3]], // Diego → Miguel
      [userIds[11], userIds[3]], // Mateo → Miguel

      // Intereses específicos
      [userIds[7], userIds[1]], // Pablo → Carlos (ejercicio)
      [userIds[5], userIds[5]], // (no se sigue a sí mismo, skip)
      [userIds[4], userIds[11]], // Lucía → Mateo (nutrición)
      [userIds[11], userIds[4]], // Mateo → Lucía (tipo 2)
      [userIds[9], userIds[3]], // Javier → Miguel (educación)
      [userIds[8], userIds[12]], // Sofía → Clara (salud mental/arte)
      [userIds[6], userIds[3]], // Elena → Miguel (educador, tiene niño)
      [userIds[13], userIds[7]], // Rafael → Pablo (deportistas)
    ];

    for (const [followerId, followingId] of follows) {
      if (followerId === followingId) continue; // Skip auto-follows
      try {
        await client.query(
          `INSERT INTO follows (follower_id, following_id) VALUES ($1, $2)`,
          [followerId, followingId]
        );
      } catch (e) {
        // Ignorar duplicados
      }
    }

    console.log('   ✅ Follows creados');

    await client.query('COMMIT');

    console.log('\n🎉 Seeders completados exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - 1 admin + 13 usuarios (14 total)`);
    console.log(`   - 29 publicaciones creadas`);
    console.log(`   - ${commentCount} comentarios creados (threads naturales)`);
    console.log(`   - ${likes.length} likes creados`);
    console.log('   - Usuarios con historias propias e interactuando');
    console.log('   - Comunidad activa y realista 🚀');

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
