# DEPLOY.md — TU diabetes NUESTRA historia

Guía paso a paso para desplegar el proyecto en producción usando servicios **gratuitos**:

| Capa      | Servicio       | Plan gratuito                                   |
|-----------|----------------|-------------------------------------------------|
| Base de datos | **Neon** (PostgreSQL serverless) | 0,5 GB, 190 h compute/mes         |
| Backend   | **Render**     | 750 h/mes, 512 MB RAM, se duerme a los 15 min |
| Frontend  | **Netlify**    | 100 GB ancho de banda/mes, builds ilimitados  |
| Uptime    | **UptimeRobot**| 50 monitores, pings cada 5 min                |

> **Importante sobre Render gratis**: el servicio se duerme tras 15 min sin tráfico y tarda ~30–60 s en despertar. UptimeRobot lo mantiene activo haciendo ping a `/api/health` cada 5 min.

---

## 0. Preparación previa (hecha en este commit)

Ya se ha refactorizado el proyecto para producción:

- `backend/src/db/config/database.js` → soporta `DATABASE_URL` con SSL (Neon).
- `backend/src/index.js` → CORS dinámico vía `CORS_ORIGIN`, valida `JWT_SECRET` en producción, `trust proxy` habilitado, sin rutas debug.
- `backend/src/utils/jwtUtils.js` → falla rápido si falta `JWT_SECRET` en producción.
- `frontend/src/services/api.js` → usa `VUE_APP_API_URL` (sin hardcodear localhost).
- `frontend/netlify.toml` → configuración de build + redirect SPA para Vue Router (history mode).
- `.env.example`, `backend/.env.example`, `frontend/.env.example` → variables documentadas por contexto.
- `.gitignore` → deja de ignorar `package-lock.json` (necesario para `npm ci` reproducible).

Antes de empezar:

```bash
# Asegúrate de que el repo está limpio y subido a GitHub
git status
git add .
git commit -m "chore: prepare project for production deployment"
git push origin main
```

---

## 1. Base de datos — Neon

### 1.1 Crear proyecto

1. Entra en https://neon.tech y regístrate (puedes usar GitHub).
2. **Create project**:
   - Project name: `tudiabetes`
   - Postgres version: `16` (o la más reciente)
   - Region: **Europe (Frankfurt)** (más cerca de España → menor latencia)
3. Neon te muestra la **Connection string**. Cópiala entera — es lo que usarás como `DATABASE_URL`.

   Formato:
   ```
   postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require
   ```

   > Usa el endpoint **pooled** (`...pooler...`) si aparece: maneja mejor las conexiones frías de Render.

### 1.2 Ejecutar migraciones

Neon crea la base vacía. Hay dos formas de cargar el esquema:

**Opción A — Desde tu máquina local (recomendada, una sola vez):**

```bash
cd backend
# Crea backend/.env con la DATABASE_URL de Neon
echo "DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require" > .env
echo "JWT_SECRET=placeholder_solo_para_migrar" >> .env
npm install
npm run db:setup     # Corre migraciones + seeders
```

**Opción B — Usando psql directamente:**

```bash
psql "postgresql://user:pass@host.neon.tech/db?sslmode=require" \
     -f backend/src/db/migrations/001_create_tables.sql
```

Verifica:

```bash
psql "<DATABASE_URL>" -c "\dt"
# Debe listar: users, posts, comments, likes, migrations
```

### 1.3 Crear el usuario admin

Una vez creado tu primer usuario desde la web, promuévelo a admin:

```sql
UPDATE users SET role = 'admin' WHERE email = 'tu-email@ejemplo.com';
```

---

## 2. Backend — Render

### 2.1 Crear servicio Web

1. Entra en https://render.com y conecta tu cuenta de GitHub.
2. **New +** → **Web Service** → selecciona el repo `PROYECTO-TDNH`.
3. Configuración:

   | Campo              | Valor                          |
   |--------------------|--------------------------------|
   | Name               | `tudiabetes-api`               |
   | Region             | `Frankfurt`                    |
   | Branch             | `main`                         |
   | Root Directory     | `backend`                      |
   | Runtime            | `Node`                         |
   | Build Command      | `npm ci`                       |
   | Start Command      | `npm start`                    |
   | Instance Type      | `Free`                         |

### 2.2 Variables de entorno

En **Environment** añade:

```
NODE_ENV           = production
PORT               = 3000
DATABASE_URL       = <tu connection string de Neon>
JWT_SECRET         = <secreto aleatorio de 48+ bytes>
JWT_EXPIRES_IN     = 7d
CORS_ORIGIN        = https://<tu-sitio>.netlify.app
```

Genera el `JWT_SECRET` con:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> **Nota**: `CORS_ORIGIN` debe ser *exactamente* el dominio del frontend, sin slash final. Si aún no tienes el dominio de Netlify, pon un placeholder y actualízalo después del paso 3.

### 2.3 Health check

En **Settings → Health Check Path** pon: `/api/health`

Render reiniciará el servicio si ese endpoint deja de responder 200.

### 2.4 Primer despliegue

1. Pulsa **Create Web Service**. Render clona, instala y arranca.
2. Cuando veas `Servidor backend escuchando en puerto 3000` en los logs, copia la URL pública:
   ```
   https://tudiabetes-api.onrender.com
   ```
3. Verifica:
   ```bash
   curl https://tudiabetes-api.onrender.com/api/health
   # {"status":"OK","message":"...","timestamp":"..."}
   ```

---

## 3. Frontend — Netlify

### 3.1 Crear sitio

1. Entra en https://app.netlify.com y conecta GitHub.
2. **Add new site → Import an existing project** → elige el repo.
3. Netlify detectará automáticamente `frontend/netlify.toml` con:
   - Base directory: `frontend`
   - Build command: `npm ci && npm run build`
   - Publish directory: `frontend/dist`

   No toques nada más en esta pantalla.

### 3.2 Variables de entorno

**Site settings → Environment variables → Add a variable**:

```
VUE_APP_API_URL = https://tudiabetes-api.onrender.com/api
VUE_APP_TITLE   = TU diabetes NUESTRA historia
```

> Las variables de Vue CLI se inyectan **en tiempo de build**. Si las cambias, necesitas hacer un redeploy (**Deploys → Trigger deploy → Clear cache and deploy site**).

### 3.3 Primer despliegue

1. Pulsa **Deploy site**.
2. Tras ~2-3 min tendrás una URL del tipo `https://random-name-123.netlify.app`.
3. (Opcional) **Site configuration → Change site name** para cambiarla por `tudiabetes.netlify.app`.

### 3.4 Conectar el CORS del backend

Vuelve a Render y actualiza la variable:

```
CORS_ORIGIN = https://tudiabetes.netlify.app
```

Render redesplegará automáticamente. Verifica desde el navegador abriendo la consola en tu sitio Netlify y comprueba que las llamadas a la API no den errores de CORS.

### 3.5 Verificación end-to-end

- Abre la web de Netlify.
- Regístrate con un usuario nuevo.
- Comprueba que puedes iniciar sesión, crear un post y dejar un comentario.
- Si algo falla, mira los logs en tiempo real: `Render → tu servicio → Logs`.

---

## 4. Uptime — UptimeRobot

Mantener despierto el backend de Render (evitando el frío de 30-60s).

1. Regístrate en https://uptimerobot.com (plan Free).
2. **+ Add New Monitor**:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: `tudiabetes-api`
   - URL: `https://tudiabetes-api.onrender.com/api/health`
   - Monitoring Interval: **5 minutes** (el mínimo del plan gratis)
3. **Create Monitor**.
4. (Recomendado) Añade un segundo monitor para el frontend:
   - URL: `https://tudiabetes.netlify.app`

> El plan gratuito de Render ofrece 750 h/mes. Un ping cada 5 min mantiene el servicio activo 24/7 = ~720 h/mes, justo dentro del límite. Si prevés picos de tráfico, vigila el consumo en el dashboard de Render.

> **Alternativa ética**: si te preocupa mantenerlo despierto artificialmente cuando no hay usuarios, usa un intervalo de 10-15 min — el primer usuario del día esperará un arranque en frío, pero consumes menos cuota.

---

## 5. Dominio personalizado (opcional)

- **Netlify**: Site settings → Domain management → Add custom domain. Netlify proporciona HTTPS gratis vía Let's Encrypt.
- **Render**: Settings → Custom Domain. Añadirás un CNAME a tu DNS.
- **Importante**: tras cambiar el dominio del frontend, actualiza `CORS_ORIGIN` en Render.

---

## 6. Checklist post-despliegue

- [ ] `/api/health` responde 200 desde la URL pública.
- [ ] Registro y login funcionan desde la web.
- [ ] Crear post, comentar y dar like funcionan.
- [ ] Hay al menos **un usuario admin** (`UPDATE users SET role='admin'...`).
- [ ] `JWT_SECRET` es un valor aleatorio, no el de ejemplo.
- [ ] `CORS_ORIGIN` apunta al dominio real de Netlify, sin slash final.
- [ ] UptimeRobot tiene activo el monitor a `/api/health`.
- [ ] El `.env` real **no** está commiteado (solo `.env.example`).

---

## 7. Troubleshooting

| Síntoma                                         | Causa probable                                              | Solución                                                  |
|-------------------------------------------------|-------------------------------------------------------------|-----------------------------------------------------------|
| Netlify: error de CORS en la consola            | `CORS_ORIGIN` no coincide con el dominio del frontend       | Copia exactamente la URL de Netlify (sin slash final)     |
| Render: crash al arrancar, `FATAL: JWT_SECRET…` | Variable no configurada o menor de 32 chars                 | Regenera con `crypto.randomBytes(48)`                     |
| Login funciona pero al recargar vuelve a `/`    | Falta el redirect SPA                                       | Revisa `frontend/netlify.toml` (`/* → /index.html 200`)   |
| La primera petición del día tarda ~60 s        | Render free duerme tras 15 min                              | Comprueba que UptimeRobot está pingeando                  |
| `SSL off` o `no pg_hba.conf entry`              | Neon requiere SSL y la conexión no lo usa                   | La cadena debe terminar en `?sslmode=require`             |
| `relation "users" does not exist`               | Migraciones no ejecutadas en Neon                           | Ejecuta `npm run db:setup` apuntando a `DATABASE_URL`     |
| Rate limit excesivo detrás de Render            | Render pone IPs compartidas; `trust proxy` debe estar on    | Ya está configurado (`app.set('trust proxy', 1)`)         |

---

## 8. Actualizaciones futuras

Ambas plataformas despliegan automáticamente al hacer `git push origin main`:

```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main
# → Render rebuild backend
# → Netlify rebuild frontend
```

Para migraciones de BD nuevas:
1. Añade el archivo SQL en `backend/src/db/migrations/`.
2. Haz push.
3. Ejecuta `npm run db:migrate` localmente apuntando a `DATABASE_URL` de Neon (Render no ejecuta migraciones automáticamente).

Alternativa: añadir `"postinstall": "node src/db/migrations/run.js"` al `package.json` del backend para que Render las ejecute en cada build — **cuidado**: si una migración falla, el build rompe el servicio.
