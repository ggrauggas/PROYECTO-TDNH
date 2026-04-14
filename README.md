# TU diabetes NUESTRA historia

Plataforma web tipo foro para personas con diabetes tipo 1 (y sus familias) donde pueden compartir experiencias, hacer preguntas, recibir apoyo de la comunidad y acceder a recursos sobre la enfermedad. Proyecto de TFG desarrollado por Gerard Grau Gascón.

---

## Índice

1. [Descripción general](#descripción-general)
2. [Stack tecnológico](#stack-tecnológico)
3. [Estructura del proyecto](#estructura-del-proyecto)
4. [Requisitos previos](#requisitos-previos)
5. [Despliegue con Docker (recomendado)](#despliegue-con-docker-recomendado)
6. [Desarrollo local sin Docker](#desarrollo-local-sin-docker)
7. [Base de datos](#base-de-datos)
8. [Seeders](#seeders)
9. [Credenciales por defecto](#credenciales-por-defecto)
10. [API REST](#api-rest)
11. [Rutas del frontend](#rutas-del-frontend)
12. [Autenticación y roles](#autenticación-y-roles)
13. [Funcionalidades principales](#funcionalidades-principales)

---

## Descripción general

La plataforma permite a los usuarios:

- Registrarse e iniciar sesión con JWT
- Publicar posts en el foro (con categorías: experiencia, consejo, pregunta)
- Comentar posts y responder a otros comentarios (sistema de hilos anidados)
- Dar likes a posts y comentarios
- Ver el perfil de usuario con estadísticas (posts, comentarios, likes recibidos)
- Cambiar su foto de perfil
- Registrar y visualizar datos de glucosa
- Completar un cuestionario de perfil de salud
- Hacer un quiz de conocimientos sobre diabetes
- Acceder a una guía informativa, vídeos y sección de donaciones

Los administradores disponen además de un panel de administración y aparecen con una etiqueta verificada junto a sus publicaciones y comentarios.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Vue.js 3 (Options API), Vue Router 4, Bootstrap 5, SCSS |
| Backend | Node.js, Express 4 |
| Base de datos | PostgreSQL 15 |
| Autenticación | JWT (`jsonwebtoken`) + bcrypt |
| Contenedores | Docker, Docker Compose |
| HTTP client | Axios |
| Seguridad | Helmet, express-rate-limit, CORS |

---

## Estructura del proyecto

```
PROYECTO-TDNH/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile / Dockerfile.dev
│   ├── package.json
│   └── src/
│       ├── index.js                  # Entrada: middlewares y rutas
│       ├── controllers/              # Lógica de negocio
│       │   ├── authController.js
│       │   ├── postController.js
│       │   ├── commentController.js
│       │   ├── likeController.js
│       │   └── userController.js
│       ├── models/                   # SQL directo con pg
│       │   ├── userModel.js
│       │   ├── postModel.js
│       │   ├── commentModel.js
│       │   └── likeModel.js
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── postRoutes.js
│       │   ├── commentRoutes.js
│       │   ├── likeRoutes.js
│       │   └── userRoutes.js
│       ├── middlewares/
│       │   ├── authMiddleware.js     # JWT verify + roles
│       │   ├── errorMiddleware.js
│       │   └── validationMiddleware.js
│       ├── utils/
│       │   ├── jwtUtils.js
│       │   ├── passwordUtils.js      # bcrypt
│       │   └── validators.js
│       └── db/
│           ├── config/database.js    # Pool pg
│           ├── migrations/
│           │   └── 001_create_tables.sql
│           ├── setup.js              # Ejecuta migraciones
│           └── seeders/
│               ├── run.js            # Seed base (admin + gerardgrau)
│               ├── implement-bots.js # Añade 13 bots con conversaciones
│               └── delete-bots.js   # Elimina todos los bots
├── frontend/
│   ├── Dockerfile / Dockerfile.dev
│   ├── package.json
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── router/index.js
│       ├── stores/authStore.js       # Estado reactivo (sin Vuex/Pinia)
│       ├── services/
│       │   ├── api.js                # Axios base (inyecta token, maneja 401)
│       │   ├── authService.js
│       │   ├── postService.js
│       │   ├── commentService.js
│       │   ├── likeService.js
│       │   └── userService.js
│       ├── views/                    # Páginas
│       └── components/              # Componentes reutilizables
└── database/
    └── init/
        └── 01-init.sql               # Extensiones iniciales de PostgreSQL
```

---

## Requisitos previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose)
- Git

Para desarrollo local sin Docker también se necesita:
- Node.js 18+
- PostgreSQL 15 corriendo localmente

---

## Despliegue con Docker (recomendado)

### 1. Clonar el repositorio

```bash
git clone https://github.com/ggrauggas/PROYECTO-TDNH.git
cd PROYECTO-TDNH
```

### 2. Levantar todos los servicios

```bash
docker-compose up --build
```

Esto arranca tres contenedores:

| Contenedor | Puerto | Descripción |
|---|---|---|
| `tu-diabetes-db` | 5432 | PostgreSQL |
| `tu-diabetes-backend` | 3000 | API REST |
| `tu-diabetes-frontend` | 8080 | Aplicación Vue.js |

La primera vez que se levanta la base de datos, Docker ejecuta automáticamente `database/init/01-init.sql` (instala la extensión `uuid-ossp`).

### 3. Crear las tablas

En una terminal separada (con los contenedores ya corriendo):

```bash
docker-compose exec backend npm run db:setup
```

### 4. Poblar la base de datos (seeders)

Ver la sección [Seeders](#seeders) más abajo.

### 5. Acceder a la aplicación

- **Frontend:** http://localhost:8080
- **API:** http://localhost:3000/api
- **Health check:** http://localhost:3000/api/health

### Comandos útiles de Docker

```bash
docker-compose up           # Levantar (sin reconstruir imágenes)
docker-compose up --build   # Reconstruir imágenes y levantar
docker-compose down         # Parar y eliminar contenedores
docker-compose down -v      # Parar y eliminar contenedores + volúmenes (borra la BD)
docker-compose logs backend # Ver logs del backend
docker-compose restart backend  # Reiniciar solo el backend
```

---

## Desarrollo local sin Docker

### Backend

```bash
cd backend
```

Crear el fichero `backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tudiabetes
DB_USER=tudiabetes_user
DB_PASSWORD=tudiabetes_password
JWT_SECRET=cualquier_secreto_largo
JWT_EXPIRES_IN=7d
PORT=3000
```

```bash
npm install
npm run db:setup    # Crea las tablas (solo una vez)
npm run db:seed     # Crea usuarios base
npm run dev         # Servidor con hot reload en :3000
```

### Frontend

```bash
cd frontend
npm install
npm run serve       # Dev server en :8080
```

> La URL de la API está hardcodeada en `frontend/src/services/api.js` apuntando a `http://localhost:3000/api`. Cámbiala ahí si usas otro puerto o entorno.

---

## Base de datos

PostgreSQL sin ORM. Todas las queries son SQL directo a través del pool de `pg`.

### Esquema de tablas

```
users
  id, username, email, password, full_name, diabetes_type,
  diagnosis_date, bio, avatar_url (TEXT), role, is_active,
  last_login, created_at, updated_at

posts
  id, user_id → users, title, content, category, tags,
  view_count, is_pinned, is_closed, created_at, updated_at

comments
  id, post_id → posts, user_id → users,
  parent_comment_id → comments (hilos anidados),
  content, is_edited, created_at, updated_at

likes
  id, user_id → users,
  post_id → posts  (nullable)
  comment_id → comments  (nullable)
  created_at
  [CHECK: exactamente uno de post_id o comment_id debe ser NOT NULL]

follows
  id, follower_id → users, following_id → users, created_at
```

Todas las relaciones tienen `ON DELETE CASCADE`: al borrar un usuario se eliminan automáticamente sus posts, comentarios, likes y follows.

### Ejecutar la migración manualmente

```bash
# Con Docker
docker-compose exec backend npm run db:migrate

# Local
cd backend && npm run db:migrate
```

---

## Seeders

Hay tres scripts de seeders independientes:

### `npm run db:seed` — Usuarios base

Crea **únicamente** los dos usuarios de administración. Solo se ejecuta si la base de datos está vacía.

```bash
# Con Docker
docker-compose exec backend npm run db:seed

# Local
cd backend && npm run db:seed
```

### `npm run db:bots:add` — Implementar bots

Añade **13 usuarios bot** con historias realistas, junto con sus posts, comentarios (en hilos anidados), likes y follows. Solo se ejecuta si no existen bots previamente.

```bash
docker-compose exec backend npm run db:bots:add
```

Usuarios bot creados:

| Usuario | Perfil |
|---|---|
| `carlos_diabetes` | Deportista, tipo 1 desde 2018 |
| `ana_martinez` | Recién diagnosticada, madre de familia |
| `miguel_asesor` | Educador en diabetes, 15 años de experiencia |
| `lucia_tipo2` | Tipo 2, revertida con cambios de hábitos |
| `diego_bomba` | Ingeniero, usuario de bomba Medtronic 780G |
| `elena_mama` | Madre de niño con diabetes tipo 1 |
| `pablo_runner` | Maratoniano con diabetes |
| `sofia_artist` | Artista gráfica, ilustraciones sobre diabetes |
| `javier_estudiante` | Estudiante de Medicina con tipo 1 |
| `rosa_veterana` | 26 años con diabetes, mentora |
| `mateo_nutricion` | Nutricionista especializado en diabetes |
| `clara_psico` | Psicóloga en enfermedades crónicas |
| `rafael_viajero` | Nómada digital, 40+ países con diabetes |

### `npm run db:bots:delete` — Eliminar bots

Elimina todos los bots (detectados por su email `@example.com`) y en cascada todos sus posts, comentarios, likes y follows.

```bash
docker-compose exec backend npm run db:bots:delete
```

### Flujo completo recomendado (primera vez)

```bash
docker-compose up --build
docker-compose exec backend npm run db:setup
docker-compose exec backend npm run db:seed
docker-compose exec backend npm run db:bots:add
```

---

## Credenciales por defecto

| Usuario | Email | Contraseña | Rol |
|---|---|---|---|
| `admin` | admin@admin.com | `*******` | Administrador |
| `gerardgrau` | gerardgrau2004@gmail.com | ``*******`` | Administrador |
| Bots | `*@example.com` | `password123` | Usuario |

> Cambia las contraseñas y el `JWT_SECRET` antes de desplegar en producción.

---

## API REST

Base URL: `http://localhost:3000/api`

### Autenticación

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registro de usuario |
| POST | `/auth/login` | No | Login, devuelve JWT |
| GET | `/auth/profile` | Sí | Perfil del usuario autenticado |
| PUT | `/auth/profile` | Sí | Actualizar perfil (incluyendo avatar) |

### Posts

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/posts` | Opcional | Listar posts (paginado) |
| GET | `/posts/:id` | Opcional | Detalle de un post |
| GET | `/posts/user/:userId` | No | Posts de un usuario |
| POST | `/posts` | Sí | Crear post |
| PUT | `/posts/:id` | Sí | Editar post (autor o admin) |
| DELETE | `/posts/:id` | Sí | Eliminar post (autor o admin) |

### Comentarios

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/comments/post/:postId` | Opcional | Comentarios de un post (árbol) |
| POST | `/comments` | Sí | Crear comentario o respuesta |
| PUT | `/comments/:id` | Sí | Editar comentario |
| DELETE | `/comments/:id` | Sí | Eliminar comentario |

### Likes

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/likes/post/:postId` | Sí | Toggle like en post |
| POST | `/likes/comment/:commentId` | Sí | Toggle like en comentario |

### Usuarios

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/users/:id/stats` | Sí | Estadísticas de un usuario |

### Formato de respuesta

Todas las respuestas siguen la misma estructura:

```json
{ "status": "success", "data": { ... } }
{ "status": "error",   "message": "Descripción del error" }
```

### Rate limiting

100 peticiones por IP cada 15 minutos en todas las rutas `/api`.

---

## Rutas del frontend

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Página de inicio |
| `/forum` | Público | Listado del foro |
| `/post/:id` | Público | Detalle de un post |
| `/create-post` | Autenticado | Crear nueva publicación |
| `/edit-post/:id` | Autenticado | Editar publicación propia |
| `/login` | Invitado | Formulario de login |
| `/register` | Invitado | Formulario de registro |
| `/profile` | Autenticado | Perfil y edición de cuenta |
| `/my-posts` | Autenticado | Mis publicaciones |
| `/glucose` | Autenticado | Registro de datos de glucosa |
| `/questionnaire` | Autenticado | Cuestionario de perfil de salud |
| `/quiz` | Público | Test de conocimientos |
| `/guide` | Público | Guía informativa |
| `/videos` | Público | Sección de vídeos |
| `/about` | Público | Quiénes somos |
| `/donate` | Público | Donaciones |
| `/admin` | Admin | Panel de administración |

---

## Autenticación y roles

El token JWT se almacena en `localStorage` y se inyecta automáticamente en cada petición desde `frontend/src/services/api.js`. Si el servidor devuelve 401, el servicio hace logout automático.

### Roles

| Rol | Permisos |
|---|---|
| `user` | Leer, crear posts/comentarios, likes, editar/borrar lo propio |
| `admin` | Todo lo anterior + panel de admin, borrar cualquier post/comentario, badge verificado en el foro |

Los administradores se identifican visualmente en el foro con una etiqueta **"Admin verificado"** junto a su nombre en posts y comentarios.
