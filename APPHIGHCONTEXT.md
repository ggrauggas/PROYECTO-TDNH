# APPHIGHCONTEXT.md — TU diabetes NUESTRA historia

Documento de contexto profundo del proyecto. Última actualización: 2026-04-12.

---

## 1. Identidad del proyecto

- **Nombre:** TU diabetes NUESTRA historia (TDNH)
- **Tipo:** Plataforma web tipo foro para personas con diabetes tipo 1
- **Autor:** Gerard Grau Gascón — TFG (prácticas, 22 años, Informática)
- **Rama principal:** `main` | Rama de trabajo activa: `changes`

---

## 2. Stack tecnológico

| Capa       | Tecnología                                     | Versión clave |
|------------|------------------------------------------------|---------------|
| Frontend   | Vue 3 (Options API), Vue Router 4, Axios       | vue ^3.3.4    |
| CSS/UI     | Bootstrap 5.3, Bootstrap Icons, SCSS, vue3-toastify | —         |
| Backend    | Node.js 18, Express 4                          | node >=18     |
| Auth       | JWT (jsonwebtoken), bcrypt                     | jwt ^9.0      |
| Seguridad  | helmet, express-rate-limit, cors               | —             |
| Base datos | PostgreSQL 15 (Docker) / Neon (producción)     | pg ^8.11      |
| ORM        | Ninguno — SQL crudo via `pg` pool              | —             |
| Build FE   | Vue CLI Service 5                              | —             |
| Dev server | nodemon (backend), vue-cli-service serve (FE)  | —             |
| Contenedor | Docker + Docker Compose                        | —             |

---

## 3. Estructura de archivos completa

```
PROYECTO-TDNH/
├── docker-compose.yml          ← orquestación de los 3 servicios
├── .env.example                ← variables para docker-compose (dev)
├── DEPLOY.md                   ← guía paso a paso: Neon + Render + Netlify
├── README.md
│
├── backend/
│   ├── Dockerfile              ← producción (npm ci --only=production)
│   ├── Dockerfile.dev          ← desarrollo (nodemon)
│   ├── .env                    ← vars locales (NO comiteado)
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.js            ← entry point; middleware + montaje de rutas
│       ├── routes/
│       │   ├── authRoutes.js
│       │   ├── postRoutes.js
│       │   ├── commentRoutes.js
│       │   ├── likeRoutes.js
│       │   ├── userRoutes.js
│       │   └── adminRoutes.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── postController.js
│       │   ├── commentController.js
│       │   ├── likeController.js
│       │   ├── userController.js
│       │   └── adminController.js
│       ├── models/
│       │   ├── userModel.js
│       │   ├── postModel.js
│       │   ├── commentModel.js
│       │   └── likeModel.js
│       ├── middlewares/
│       │   ├── authMiddleware.js   ← authenticate / optionalAuth / isAdmin
│       │   ├── errorMiddleware.js  ← notFound / databaseError / errorHandler
│       │   └── validationMiddleware.js
│       ├── utils/
│       │   ├── jwtUtils.js
│       │   ├── passwordUtils.js    ← bcrypt
│       │   └── validators.js
│       └── db/
│           ├── config/
│           │   └── database.js     ← pg pool; lee DB_* o DATABASE_URL
│           ├── migrations/
│           │   ├── 001_create_tables.sql
│           │   └── run.js
│           ├── seeders/
│           │   ├── run.js
│           │   ├── implement-bots.js
│           │   └── delete-bots.js
│           └── setup.js            ← crea tablas desde cero
│
├── frontend/
│   ├── Dockerfile              ← producción (build + nginx:stable-alpine)
│   ├── Dockerfile.dev          ← desarrollo (npm run serve)
│   ├── nginx.conf              ← SPA fallback + proxy /api → backend:3000
│   ├── netlify.toml            ← build config + redirect /* /index.html 200
│   ├── vue.config.js           ← devServer proxy + SCSS global variables
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── main.js             ← monta App, router, Bootstrap
│       ├── App.vue             ← shell de la app (NavBar + router-view)
│       ├── router/
│       │   └── index.js        ← todas las rutas + guards
│       ├── stores/
│       │   └── authStore.js    ← reactive store ligero (sin Vuex/Pinia)
│       ├── services/
│       │   ├── api.js          ← instancia axios central + interceptores
│       │   ├── authService.js
│       │   ├── postService.js
│       │   ├── commentService.js
│       │   ├── likeService.js
│       │   └── userService.js
│       ├── components/
│       │   ├── NavBar.vue
│       │   ├── PostList.vue
│       │   ├── PostItem.vue
│       │   ├── CommentSection.vue
│       │   ├── CommentItem.vue
│       │   ├── LikeButton.vue
│       │   ├── LoginForm.vue
│       │   ├── RegisterForm.vue
│       │   └── UserProfileModal.vue
│       ├── views/
│       │   ├── HomeView.vue
│       │   ├── ForumView.vue
│       │   ├── PostDetailView.vue
│       │   ├── CreatePostView.vue
│       │   ├── EditPostView.vue
│       │   ├── LoginView.vue
│       │   ├── RegisterView.vue
│       │   ├── ProfileView.vue
│       │   ├── MyPostsView.vue
│       │   ├── AdminView.vue
│       │   ├── GuideView.vue       ← modificado en rama `changes`
│       │   ├── AboutView.vue
│       │   ├── VideosView.vue
│       │   ├── DonateView.vue      ← DESHABILITADA, redirige a /
│       │   ├── QuestionnaireView.vue
│       │   ├── GlucoseView.vue
│       │   └── QuizView.vue
│       └── assets/
│           └── scss/
│               ├── main.scss
│               └── variables.scss  ← importado globalmente via vue.config.js
│
├── database/
│   ├── init/
│   │   └── 01-init.sql         ← se ejecuta solo al crear el volumen (uuid-ossp)
│   └── scripts/
│       ├── backup.sh
│       ├── restore.sh
│       ├── reset.sh
│       ├── list_backup.sh
│       └── help.sh
│
└── .claude/
    ├── CLAUDE.md               ← instrucciones para Claude Code
    └── settings.local.json
```

---

## 4. Esquema de base de datos

Tablas definidas en `backend/src/db/migrations/001_create_tables.sql`:

| Tabla     | Columnas clave                                                                  | Relaciones                        |
|-----------|---------------------------------------------------------------------------------|-----------------------------------|
| `users`   | id, username, email, password, full_name, diabetes_type, diagnosis_date, bio, avatar_url, role (`user`/`admin`), is_active, last_login | — |
| `posts`   | id, user_id, title, content, category, tags, view_count, is_pinned, is_closed  | FK → users(id) CASCADE            |
| `comments`| id, post_id, user_id, parent_comment_id, content, is_edited                    | FK → posts, users, comments (self)|
| `likes`   | id, user_id, post_id?, comment_id? (exclusivos), CHECK constraint              | FK → users, posts, comments       |
| `follows` | id, follower_id, following_id, UNIQUE, CHECK no self-follow                    | FK → users x2                     |

- `updated_at` auto-gestionado por trigger en `users`, `posts`, `comments`.
- Índices en todas las FK y columnas de búsqueda frecuente.
- **Nota:** `isBanned` referenciado en el código como campo de usuarios; en la migración SQL no aparece como columna explícita — podría estar gestionado por `is_active`.

---

## 5. API REST — Rutas del backend

Base: `http://localhost:3000/api` (dev) | `https://<render-url>/api` (prod)

### Health
| Método | Ruta          | Auth | Descripción       |
|--------|---------------|------|-------------------|
| GET    | /health       | —    | Estado del server |

### Auth (`/api/auth`)
| Método | Ruta      | Auth         | Descripción              |
|--------|-----------|--------------|--------------------------|
| POST   | /register | —            | Registro de usuario      |
| POST   | /login    | —            | Login, devuelve JWT      |
| GET    | /profile  | authenticate | Perfil del usuario actual|
| PUT    | /profile  | authenticate | Actualizar perfil        |

### Posts (`/api/posts`)
| Método | Ruta          | Auth              | Descripción                     |
|--------|---------------|-------------------|---------------------------------|
| GET    | /             | optionalAuth      | Listar posts (paginado)         |
| GET    | /user/:userId | —                 | Posts de un usuario             |
| GET    | /:id          | optionalAuth      | Post por ID                     |
| POST   | /             | authenticate      | Crear post                      |
| PUT    | /:id          | authenticate      | Editar post (owner/admin)       |
| DELETE | /:id          | authenticate      | Eliminar post (owner/admin)     |

### Comments (`/api/comments`)
| Método | Ruta             | Auth         | Descripción                |
|--------|------------------|--------------|----------------------------|
| GET    | /post/:postId    | optionalAuth | Comentarios de un post     |
| POST   | /                | authenticate | Crear comentario           |
| PUT    | /:id             | authenticate | Editar comentario          |
| DELETE | /:id             | authenticate | Eliminar comentario        |

### Likes (`/api/likes`) — todos requieren authenticate
| Método | Ruta                  | Descripción               |
|--------|-----------------------|---------------------------|
| POST   | /post/:postId         | Dar like a post           |
| DELETE | /post/:postId         | Quitar like de post       |
| POST   | /comment/:commentId   | Dar like a comentario     |
| DELETE | /comment/:commentId   | Quitar like de comentario |

### Users (`/api/users`)
| Método | Ruta            | Auth         | Descripción          |
|--------|-----------------|--------------|----------------------|
| GET    | /:id/profile    | —            | Perfil público       |
| GET    | /:id/stats      | authenticate | Estadísticas         |

### Admin (`/api/admin`) — requieren authenticate + isAdmin
| Método | Ruta          | Descripción             |
|--------|---------------|-------------------------|
| GET    | /users        | Listar todos los usuarios|
| PUT    | /users/:id    | Modificar usuario       |
| DELETE | /users/:id    | Eliminar usuario        |

---

## 6. Rutas del frontend (Vue Router)

| Path               | Componente            | Auth         | Notas                          |
|--------------------|-----------------------|--------------|--------------------------------|
| `/`                | HomeView              | —            |                                |
| `/forum`           | ForumView             | —            |                                |
| `/post/:id`        | PostDetailView        | —            |                                |
| `/create-post`     | CreatePostView        | requiresAuth |                                |
| `/edit-post/:id`   | EditPostView          | requiresAuth |                                |
| `/login`           | LoginView             | guest        | Redirige a /forum si autenticado|
| `/register`        | RegisterView          | guest        |                                |
| `/guide`           | GuideView             | —            | Modificada en rama `changes`   |
| `/about`           | AboutView             | —            |                                |
| `/donate`          | redirect → `/`        | —            | DESHABILITADA                  |
| `/videos`          | VideosView            | —            |                                |
| `/profile`         | ProfileView           | requiresAuth |                                |
| `/my-posts`        | MyPostsView           | requiresAuth |                                |
| `/admin`           | AdminView             | requiresAuth + requiresAdmin |           |
| `/questionnaire`   | QuestionnaireView     | requiresAuth |                                |
| `/glucose`         | GlucoseView           | requiresAuth |                                |
| `/quiz`            | QuizView              | —            | Test público para principiantes|
| `/*`               | redirect → `/`        | —            | Fallback 404                   |

**Guards:**
- `requiresAuth` → redirige a `/login?redirect=<ruta>` si no autenticado
- `requiresAdmin` → redirige a `/` si rol != `admin`
- `guest` → redirige a `/forum` si ya autenticado

---

## 7. Configuración Docker (desarrollo)

### docker-compose.yml — servicios y puertos

```
┌─────────────────────────────────────────────────────────┐
│  Host                                                   │
│  :5432 ──→ tu-diabetes-db       (postgres:15-alpine)    │
│  :3000 ──→ tu-diabetes-backend  (node:18-alpine)        │
│  :8080 ──→ tu-diabetes-frontend (node:18-alpine)        │
└─────────────────────────────────────────────────────────┘
          todos en red: tu-diabetes-network (bridge)
```

### Dependencias y healthcheck
- `backend` espera a que `database` pase su healthcheck (`pg_isready`) antes de arrancar.
- `frontend` espera a que `backend` esté levantado (sin healthcheck, solo `depends_on`).

### Volúmenes
- `postgres_data` → volumen nombrado para persistencia de la DB entre reinicios.
- `./backend:/app` + `/app/node_modules` → hot-reload del código en dev sin reinstalar deps.
- `./frontend:/app` + `/app/node_modules` → ídem para el frontend.

### Variables inyectadas por docker-compose
| Servicio  | Variable          | Valor                                      |
|-----------|-------------------|--------------------------------------------|
| database  | POSTGRES_DB       | tudiabetes                                 |
| database  | POSTGRES_USER     | tudiabetes_user                            |
| database  | POSTGRES_PASSWORD | tudiabetes_password                        |
| backend   | DB_HOST           | database ← nombre del servicio Docker      |
| backend   | DB_PORT           | 5432                                       |
| backend   | JWT_SECRET        | (placeholder dev — cambiar en producción)  |
| backend   | NODE_ENV          | development                                |
| frontend  | VUE_APP_API_URL   | http://localhost:3000                      |

### Inicialización de la DB
`./database/init/` se monta en `/docker-entrypoint-initdb.d` del contenedor postgres.  
Solo se ejecuta una vez, cuando el volumen `postgres_data` está vacío.  
El archivo `01-init.sql` únicamente crea la extensión `uuid-ossp`.  
El esquema real se aplica manualmente con `npm run db:setup` o `npm run db:migrate`.

---

## 8. Dockerfiles

### Backend Dockerfile.dev
- Base: `node:18-alpine`
- Instala `nodemon` globalmente
- Copia `package*.json` → `npm install` → copia src → `nodemon src/index.js`
- Puerto: 3000

### Backend Dockerfile (producción)
- Base: `node:18-alpine`
- `npm ci --only=production` (sin devDeps)
- Puerto: 3000, CMD: `npm start`

### Frontend Dockerfile.dev
- Base: `node:18-alpine`
- `npm install` → `npm run serve` (vue-cli dev server)
- Puerto: 8080

### Frontend Dockerfile (producción)
- **Multi-stage:**
  1. `node:18-alpine` — `npm install && npm run build` → genera `/app/dist`
  2. `nginx:stable-alpine` — sirve `/app/dist` en puerto 80
- Usa `nginx.conf` copiado al contenedor
- `nginx.conf` incluye proxy `/api` → `http://backend:3000`

---

## 9. Configuración del frontend

### `frontend/src/services/api.js`
- `baseURL` = `process.env.VUE_APP_API_URL || 'http://localhost:3000/api'`
- Interceptor request: inyecta `Authorization: Bearer <token>` desde `localStorage`
- Interceptor response: en 401 limpia localStorage y redirige a `/login`
- Timeout: 15 000 ms

### `frontend/vue.config.js`
- Dev server en puerto 8080
- Proxy `/api` → `process.env.VUE_APP_API_URL || 'http://backend:3000'`  
  (esto permite que el código llame a `/api/...` en dev sin CORS problems)
- SCSS global: `@import "~@/assets/scss/variables.scss"` en todos los componentes

### `frontend/netlify.toml`
- Base dir: `frontend`
- Build: `npm ci && npm run build`
- Publish: `frontend/dist`
- Redirect: `/* → /index.html 200` (requerido para Vue Router en history mode)

---

## 10. Autenticación y seguridad

- **JWT** almacenado en `localStorage` (clave `token`), usuario en `localStorage` (clave `user`).
- `authStore.js` — store reactivo que inicializa el estado desde localStorage al cargar la app.
- **Roles:** `user` (default) y `admin`.
- **Rate limiting:** 100 req / 15 min / IP en todas las rutas `/api`.
- **CORS:** orígenes permitidos via variable de entorno `CORS_ORIGIN` (comma-separated).
  - Dev: `http://localhost:8080,http://127.0.0.1:8080`
  - Prod: URL de Netlify exacta, sin slash final
- **Helmet** activo para cabeceras de seguridad HTTP.
- En producción, `JWT_SECRET` debe tener ≥ 32 chars — el servidor aborta si no.

---

## 11. Despliegue en producción (stack gratuito)

| Capa      | Servicio    | URL prod esperada                        |
|-----------|-------------|------------------------------------------|
| DB        | Neon        | `*.neon.tech` (PostgreSQL serverless)    |
| Backend   | Render      | `https://tudiabetes-api.onrender.com`    |
| Frontend  | Netlify     | `https://tudiabetes.netlify.app`         |
| Uptime    | UptimeRobot | ping a `/api/health` cada 5 min          |

### Variables de entorno en producción
**Render (backend):**
```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
JWT_SECRET=<48-byte hex aleatorio>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://tudiabetes.netlify.app
```

**Netlify (frontend — inyectadas en build):**
```
VUE_APP_API_URL=https://tudiabetes-api.onrender.com/api
VUE_APP_TITLE=TU diabetes NUESTRA historia
```

### Flujo de despliegue
```
git push origin main
  ├── Render: rebuild backend automático (npm ci → npm start)
  └── Netlify: rebuild frontend automático (npm ci → npm run build)
```

Migraciones de BD nuevas → ejecutar manualmente apuntando a `DATABASE_URL` de Neon:
```bash
cd backend && npm run db:migrate
```

---

## 12. Comandos de desarrollo rápidos

```bash
# Todo el stack
docker-compose up --build      # primera vez / tras cambiar Dockerfile
docker-compose up              # arrancar sin rebuild
docker-compose down            # parar

# Solo backend (fuera de Docker)
cd backend && npm run dev      # nodemon, hot-reload

# Solo frontend (fuera de Docker)
cd frontend && npm run serve   # dev server :8080

# Base de datos
npm run db:setup               # crear tablas desde cero
npm run db:migrate             # ejecutar migraciones pendientes
npm run db:seed                # insertar datos de prueba
npm run db:bots:add            # añadir bots de prueba
npm run db:bots:delete         # eliminar bots
```

---

## 13. Convenciones del proyecto

- **Respuesta API:** siempre `{ status: 'success'|'error', data|message }`
- **Modelos:** SQL puro, sin ORM — cada model encapsula todas las queries de su tabla
- **Servicios frontend:** un archivo por dominio, todas las llamadas HTTP pasan por `api.js`
- **Componentes:** Options API (no Composition API)