const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Importar middlewares de error
const errorMiddleware = require('./middlewares/errorMiddleware');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const userRoutes = require('./routes/userRoutes');

// Configurar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);

// Middlewares de seguridad
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 'error',
    message: 'Demasiadas peticiones, por favor intenta más tarde'
  }
});
app.use('/api', limiter);

// CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(morgan('dev'));

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Registrar rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/users', userRoutes);

// Ruta de prueba para base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const { pool } = require('./db/config/database');
    
    const dbTest = await pool.query('SELECT NOW() as time');
    const users = await pool.query('SELECT COUNT(*) FROM users');
    const posts = await pool.query('SELECT COUNT(*) FROM posts');
    const comments = await pool.query('SELECT COUNT(*) FROM comments');
    
    res.json({
      status: 'success',
      database: {
        connected: true,
        time: dbTest.rows[0].time,
        stats: {
          users: users.rows[0].count,
          posts: posts.rows[0].count,
          comments: comments.rows[0].count
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error conectando a la base de datos',
      error: error.message
    });
  }
});

// Middleware para rutas no encontradas
app.use(errorMiddleware.notFound);

// Middleware de manejo de errores
app.use(errorMiddleware.databaseError);
app.use(errorMiddleware.errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
  console.log(`📝 Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API disponible en: http://localhost:${PORT}/api`);
  console.log(`📋 Rutas registradas:`);
  console.log(`   - GET  /api/health`);
  console.log(`   - GET  /api/test-db`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - GET  /api/auth/profile (protegida)`);
  console.log(`   - GET  /api/posts`);
  console.log(`   - POST /api/posts (protegida)`);
  console.log(`   - GET  /api/comments/post/:postId`);
  console.log(`   - POST /api/comments (protegida)`);
  console.log(`   - POST /api/likes/post/:postId (protegida)`);
});