const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function testAPI() {
  console.log('🧪 INICIANDO PRUEBAS DE API');
  console.log('===========================\n');

  try {
    // 1. Test health
    console.log('1️⃣ Probando health endpoint...');
    const health = await axios.get(`${API_URL}/health`);
    console.log('   ✅ Health check:', health.data.message);
    
    // 2. Test base de datos
    console.log('\n2️⃣ Probando conexión a BD...');
    const dbTest = await axios.get(`${API_URL}/test-db`);
    console.log('   ✅ BD conectada');
    console.log('   📊 Estadísticas:', dbTest.data.database.stats);
    
    // 3. Registrar usuario
    console.log('\n3️⃣ Registrando usuario de prueba...');
    const testUser = {
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      full_name: 'Usuario Test',
      diabetes_type: 'Tipo 1'
    };
    
    const register = await axios.post(`${API_URL}/auth/register`, testUser);
    console.log('   ✅ Usuario registrado:', register.data.data.user.username);
    
    const token = register.data.data.token;
    
    // 4. Login
    console.log('\n4️⃣ Probando login...');
    const login = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('   ✅ Login exitoso');
    
    // 5. Crear publicación
    console.log('\n5️⃣ Creando publicación de prueba...');
    const newPost = await axios.post(`${API_URL}/posts`, {
      title: 'Publicación de prueba',
      content: 'Este es el contenido de prueba para verificar que la API funciona correctamente.',
      category: 'general'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Publicación creada ID:', newPost.data.data.post.id);
    
    const postId = newPost.data.data.post.id;
    
    // 6. Obtener publicaciones
    console.log('\n6️⃣ Obteniendo publicaciones...');
    const posts = await axios.get(`${API_URL}/posts`);
    console.log('   ✅ Publicaciones obtenidas:', posts.data.data.posts.length);
    
    // 7. Crear comentario
    console.log('\n7️⃣ Creando comentario...');
    const newComment = await axios.post(`${API_URL}/comments`, {
      post_id: postId,
      content: 'Este es un comentario de prueba'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Comentario creado');
    
    // 8. Dar like
    console.log('\n8️⃣ Dando like a la publicación...');
    await axios.post(`${API_URL}/likes/post/${postId}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Like agregado');
    
    console.log('\n===========================');
    console.log('✅ TODAS LAS PRUEBAS PASARON');
    
  } catch (error) {
    console.error('\n❌ ERROR EN PRUEBAS:');
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    } else {
      console.error('   Message:', error.message);
    }
  }
}

testAPI();