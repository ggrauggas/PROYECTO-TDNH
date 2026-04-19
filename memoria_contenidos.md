# MEMORIA DEL PROYECTO — TU diabetes NUESTRA historia
## Contenidos generados para el documento base

---

## 4.1 Cambios en secciones solicitadas

---

### Sección 1.4 — Orientaciones para el desarrollo y recursos

El desarrollo se llevó a cabo siguiendo un enfoque iterativo e incremental, sin aplicar una metodología ágil formal. El trabajo se organizó en fases sucesivas: diseño de la base de datos, implementación del backend, desarrollo del frontend y pruebas de integración. Esto permitió detectar y corregir errores de forma progresiva a lo largo del proceso.

Para el control de versiones se utilizó Git junto con GitHub, lo que permitió mantener un historial de cambios claro y revertir modificaciones cuando fue necesario.

**Tecnologías utilizadas**

*Frontend*

- **Vue 3** (v3.3.4): marco de trabajo progresivo de JavaScript para la construcción de interfaces de usuario. Se eligió por su sistema de componentes reactivos, su curva de aprendizaje accesible y la compatibilidad con la Options API, que facilita la organización de la lógica en componentes de complejidad moderada.
- **Vue Router** (v4.2.2): librería oficial de enrutamiento para Vue 3. Permite gestionar la navegación de la aplicación de página única, aplicar guardas de acceso y controlar el historial del navegador.
- **Axios** (v1.4.0): cliente HTTP basado en promesas. Se utilizó para centralizar todas las llamadas a la API REST mediante interceptores que inyectan automáticamente el token JWT en cada petición y gestionan los errores de autenticación.
- **Bootstrap** (v5.3.0): marco de trabajo CSS con componentes de interfaz predefinidos y sistema de rejilla adaptable. Se eligió por su amplia documentación y por la velocidad que aporta al diseño "responsive".
- **Bootstrap Icons** (v1.10.5): biblioteca de iconos SVG compatible con Bootstrap, utilizada en los elementos visuales de la interfaz.
- **SCSS / Sass** (v1.63.2): preprocesador CSS que permitió definir variables globales de color, tipografía y espaciado, garantizando la coherencia visual en toda la aplicación.
- **vue3-toastify** (v0.1.8): librería de notificaciones no intrusivas para Vue 3, utilizada para informar al usuario de acciones completadas o de errores producidos.

*Backend*

- **Node.js** (v18): entorno de ejecución de JavaScript del lado del servidor. Se eligió por su rendimiento asíncrono orientado a eventos y por la uniformidad que aporta al usar el mismo lenguaje tanto en el frontend como en el backend.
- **Express** (v4.18.2): marco de trabajo minimalista para Node.js. Se eligió por su flexibilidad para estructurar la aplicación en capas sin imponer una arquitectura rígida.
- **express-validator** (v7.0.1): middleware de validación de datos de entrada integrado con Express, utilizado para validar los cuerpos de las peticiones HTTP antes de que lleguen a los controladores.
- **jsonwebtoken** (v9.0.0): implementación del estándar "JSON Web Tokens" para la generación y verificación de tokens de autenticación sin estado.
- **bcrypt** (v5.1.0): librería de cifrado de contraseñas basada en el algoritmo bcrypt, diseñada para ser computacionalmente costosa y resistente a ataques de fuerza bruta.
- **pg** (v8.11.0): cliente PostgreSQL para Node.js. Se utilizó directamente, sin ORM, para mantener el control total sobre las consultas SQL y aprovechar características avanzadas de PostgreSQL como las CTEs recursivas.
- **nodemailer** (v8.0.5): módulo para el envío de correos electrónicos desde Node.js, utilizado en el flujo de verificación de dirección de correo durante el registro de usuarios.
- **Helmet** (v7.2.0): middleware de seguridad para Express que configura cabeceras HTTP de protección contra vulnerabilidades web comunes (XSS, "clickjacking", etc.).
- **express-rate-limit** (v6.11.2): middleware para limitar el número de peticiones por IP, configurado a 100 peticiones por 15 minutos para proteger la API contra abusos.
- **cors** (v2.8.5): middleware para gestionar la política de intercambio de recursos entre orígenes, configurado dinámicamente mediante la variable de entorno `CORS_ORIGIN`.
- **morgan** (v1.10.1): middleware de registro de peticiones HTTP, habilitado en el entorno de desarrollo para facilitar la depuración.
- **dotenv** (v16.0.3): módulo para cargar variables de entorno desde archivos `.env`, utilizado exclusivamente en el entorno de desarrollo local.
- **nodemon** (v2.0.22, dependencia de desarrollo): herramienta que reinicia automáticamente el servidor al detectar cambios en el código fuente durante el desarrollo.

*Base de datos*

- **PostgreSQL** (v15 en desarrollo, v16 en producción): sistema de gestión de bases de datos relacional de código abierto. Se eligió por su robustez, soporte de tipos de datos avanzados, integridad referencial y la posibilidad de usar CTEs recursivas para representar la jerarquía de comentarios.

*Control de versiones*

- **Git**: sistema de control de versiones distribuido utilizado para registrar el historial de cambios del proyecto.
- **GitHub**: plataforma de alojamiento de repositorios Git que actúa también como disparador automático de los despliegues en Render y Netlify.

*Contenedores*

- **Docker**: plataforma de contenedores utilizada para reproducir el entorno de desarrollo de forma consistente independientemente del sistema operativo.
- **Docker Compose**: herramienta de orquestación de contenedores que permite levantar la base de datos, el backend y el frontend con un único comando.

*Despliegue*

- **Render**: plataforma de "hosting" gestionado para el backend Node.js, con despliegue automático al publicar cambios en la rama principal.
- **Netlify**: plataforma de distribución de contenido global para el frontend Vue compilado, con soporte nativo para aplicaciones de página única.
- **Neon**: base de datos PostgreSQL "serverless" utilizada en producción, con soporte de SSL y conexión mediante cadena de conexión estándar.
- **UptimeRobot**: servicio de monitorización que realiza "pings" periódicos al backend para mantenerlo activo en el plan gratuito de Render.

---

### Sección 2.2 — Definición de requerimientos (subsección: Casos de uso e historias de usuario)

**Actores del sistema**

- **Visitante**: usuario no autenticado que accede a la plataforma sin haber iniciado sesión.
- **Usuario registrado**: usuario autenticado con rol `user` que dispone de las funcionalidades completas del foro.
- **Administrador**: usuario autenticado con rol `admin` que, además de las funcionalidades del usuario registrado, dispone de acceso al panel de administración.

**Casos de uso principales**

| ID | Actor | Descripción |
|----|-------|-------------|
| CU-01 | Visitante | Registrarse en la plataforma con nombre de usuario, correo electrónico y contraseña. |
| CU-02 | Visitante | Verificar la dirección de correo electrónico mediante un código de 4 dígitos. |
| CU-03 | Visitante | Iniciar sesión con correo electrónico y contraseña. |
| CU-04 | Usuario registrado | Cerrar sesión. |
| CU-05 | Usuario registrado | Crear una publicación en el foro con título, contenido, categoría y etiquetas. |
| CU-06 | Usuario registrado | Editar o eliminar sus propias publicaciones. |
| CU-07 | Usuario registrado | Comentar en una publicación y responder a comentarios existentes. |
| CU-08 | Usuario registrado | Editar o eliminar sus propios comentarios. |
| CU-09 | Usuario registrado | Dar o quitar "like" a publicaciones y comentarios. |
| CU-10 | Usuario registrado | Editar su perfil (nombre, biografía, tipo de diabetes, fecha de diagnóstico, avatar). |
| CU-11 | Visitante | Consultar la guía informativa sobre diabetes sin necesidad de registro. |
| CU-12 | Visitante | Visualizar los vídeos educativos sin necesidad de registro. |
| CU-13 | Administrador | Listar, bloquear, cambiar el rol y eliminar usuarios desde el panel de administración. |

**Historias de usuario**

| ID | Como... | quiero... | para... |
|----|---------|-----------|---------|
| HU-01 | visitante | registrarme con nombre de usuario, correo y contraseña | acceder a las funcionalidades del foro |
| HU-02 | visitante | verificar mi correo con un código | confirmar mi identidad y activar mi cuenta |
| HU-03 | visitante | iniciar sesión con mis credenciales | acceder a mi cuenta y al contenido exclusivo |
| HU-04 | usuario registrado | crear publicaciones clasificadas por categoría | compartir mis experiencias de forma organizada |
| HU-05 | usuario registrado | editar y eliminar mis publicaciones | corregir errores o retirar contenido |
| HU-06 | usuario registrado | comentar en publicaciones y responder a otros comentarios | mantener conversaciones organizadas en hilos |
| HU-07 | usuario registrado | dar y quitar "likes" en publicaciones y comentarios | expresar mi apoyo al contenido de otros usuarios |
| HU-08 | usuario registrado | editar mi perfil | mantener mi información personal actualizada |
| HU-09 | visitante | consultar la guía informativa sin registrarme | obtener información sobre la diabetes sin barreras |
| HU-10 | administrador | gestionar usuarios desde un panel web | mantener el orden y la calidad de la comunidad |
| HU-11 | administrador | bloquear usuarios que incumplan las normas | proteger a la comunidad de comportamientos inapropiados |

---

### Sección 3.1 — Descripción de la metodología ágil

El desarrollo del proyecto siguió un enfoque iterativo e incremental, organizado en seis secciones de trabajo sucesivas que se corresponden con las fases naturales del ciclo de vida del software. Aunque no se aplicó una metodología ágil formal como "Scrum" o "Kanban", el trabajo se estructuró de manera que cada sección produjera un entregable funcional sobre el que se construía la siguiente.

A continuación se describe el contenido y los objetivos de cada sección:

**Sección 1 — Estructuración**

Esta sección comprende la definición inicial del proyecto: la elección del "stack" tecnológico, la organización del repositorio Git, la creación de la estructura de directorios del backend y del frontend, la configuración de Docker Compose para el entorno local y la definición de los archivos de variables de entorno. El objetivo de esta sección fue establecer una base sólida y reproducible sobre la que desarrollar el resto del proyecto.

**Sección 2 — Base de datos**

En esta sección se diseñó el esquema relacional de la base de datos PostgreSQL, se escribieron las migraciones SQL para la creación de las tablas y se definieron los "seeders" con datos de prueba. También se configuró el volumen de Docker para la persistencia de los datos y se establecieron los comandos de gestión de la base de datos disponibles para el equipo de desarrollo.

**Sección 3 — Backend**

Esta sección abarca el desarrollo de toda la capa de servidor: los modelos de acceso a la base de datos, los controladores con la lógica de negocio, las rutas de la API REST y los "middlewares" de autenticación, autorización y gestión de errores. Al finalizar esta sección, la API estaba completamente funcional y verificable desde herramientas de prueba de APIs.

**Sección 4 — Frontend**

En esta sección se desarrolló la interfaz de usuario con Vue 3, incluyendo todas las vistas, componentes reutilizables, el sistema de enrutamiento, los servicios de comunicación con la API y los estilos globales con SCSS. El objetivo fue ofrecer una experiencia de usuario coherente, "responsive" y accesible desde cualquier dispositivo.

**Sección 5 — Despliegue**

Esta sección recoge el proceso de puesta en producción de la aplicación: la configuración del servicio de base de datos en Neon, el despliegue del backend en Render, la publicación del frontend en Netlify y la configuración del monitoreo de disponibilidad con UptimeRobot.

**Sección 6 — Ajustes finales**

La última sección comprende la validación de la aplicación con usuarios reales, la corrección de los errores detectados y la optimización del rendimiento y de la experiencia de usuario. En esta fase se estableció también la estrategia de ramas de Git para separar el entorno de desarrollo del entorno de producción.

---

### Sección 3.2 — Backlog del producto

El "backlog" del producto recoge el conjunto de funcionalidades identificadas durante el análisis de requisitos, ordenadas según su prioridad para el correcto funcionamiento de la plataforma. Las funcionalidades de mayor prioridad se implementaron en las primeras secciones del desarrollo, mientras que las de menor impacto se abordaron en secciones posteriores.

| Prioridad | Funcionalidad | Sección |
|-----------|---------------|---------|
| Alta | Registro e inicio de sesión con JWT | 3 |
| Alta | Verificación de dirección de correo electrónico | 3 |
| Alta | Creación, edición y eliminación de publicaciones | 3 — 4 |
| Alta | Sistema de comentarios con anidamiento jerárquico | 3 — 4 |
| Alta | Sistema de "likes" en publicaciones y comentarios | 3 — 4 |
| Alta | Panel de administración para la gestión de usuarios | 3 — 4 |
| Media | Perfil de usuario editable | 4 |
| Media | Guía informativa sobre diabetes tipo 1 | 4 |
| Media | Sección de vídeos educativos | 4 |
| Media | Cuestionario de perfil y test de conocimientos | 4 |
| Media | Módulo de seguimiento de niveles de glucosa | 4 |
| Baja | Página de donaciones | 4 |
| Baja | Despliegue en producción con servicios gratuitos | 5 |
| Baja | Monitorización de disponibilidad del backend | 5 |

---

### Sección 3.3 — Planificación temporal

El proyecto se planificó en seis secciones de trabajo con una estimación total de 40 horas de desarrollo. La tabla siguiente recoge la distribución temporal:

| Sección | Descripción | Tiempo estimado |
|---------|-------------|-----------------|
| 1 | Estructuración y configuración inicial | 4 h |
| 2 | Diseño e implementación de la base de datos | 6 h |
| 3 | Desarrollo del backend (API REST) | 13 h |
| 4 | Desarrollo del frontend (interfaz de usuario) | 13 h |
| 5 | Despliegue en producción | 2 h |
| 6 | Ajustes finales y validación con usuarios reales | 2 h |
| **Total** | | **40 h** |

Los diagramas de la arquitectura de la base de datos, del esquema general de la aplicación y el diagrama de Gantt se incluyen en la sección 4.2 del presente documento.

---

### Sección 4.1 — Sección 1: Estructuración

#### Diseño de la solución

La estructuración del proyecto se abordó con el objetivo de establecer una arquitectura clara, mantenible y reproducible. Se definió una organización de repositorio con dos directorios principales —`backend/` y `frontend/`— junto con la configuración de infraestructura en la raíz del repositorio.

**Control de versiones con Git**

El proyecto se gestionó con Git desde el primer momento. Se creó un repositorio en GitHub que sirvió tanto como copia de seguridad como disparador de los despliegues automáticos en producción. Se adoptó una estrategia de dos ramas principales: `main`, correspondiente al entorno de producción, y `changes`, utilizada para el desarrollo activo. Los cambios de `changes` se fusionaron en `main` únicamente cuando el estado del proyecto se consideró estable y listo para desplegar.

**Estructura del backend**

El backend se organizó siguiendo el patrón MVC (Modelo-Vista-Controlador), adaptado a una API REST sin capa de vista:

- `backend/src/controllers/`: lógica de negocio de cada dominio (autenticación, publicaciones, comentarios, "likes", usuarios y administración).
- `backend/src/models/`: acceso a la base de datos mediante consultas SQL directas usando el cliente `pg`.
- `backend/src/routes/`: definición de los "endpoints" de la API y asignación de controladores y "middlewares".
- `backend/src/middlewares/`: funciones intermedias para la autenticación JWT, la autorización por rol y la gestión de errores.
- `backend/src/utils/`: utilidades transversales (generación y verificación de JWT, cifrado de contraseñas, envío de correos).
- `backend/src/db/`: configuración de la conexión a PostgreSQL, migraciones SQL y "seeders".

**Estructura del frontend**

El frontend se organizó según las convenciones de Vue CLI:

- `frontend/src/views/`: componentes de página, uno por cada ruta de la aplicación.
- `frontend/src/components/`: componentes reutilizables (barra de navegación, tarjetas de publicación, sección de comentarios, botón de "like", etc.).
- `frontend/src/services/`: módulos de comunicación con la API, uno por dominio.
- `frontend/src/router/`: definición de rutas y guardas de navegación.
- `frontend/src/stores/`: almacén reactivo ligero para el estado de autenticación del usuario.
- `frontend/src/assets/scss/`: hojas de estilo globales y variables SCSS.

**Variables de entorno**

Se definieron archivos `.env.example` en la raíz del repositorio, en `backend/` y en `frontend/`, que documentan todas las variables de entorno necesarias sin exponer valores reales. Estos archivos sirven de plantilla para que cualquier desarrollador configure su entorno local.

Las variables principales del backend son:

- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: parámetros de conexión a PostgreSQL local.
- `DATABASE_URL`: cadena de conexión completa, usada en producción con Neon.
- `JWT_SECRET`: clave secreta para la firma de tokens JWT. En producción se exige un mínimo de 32 caracteres.
- `JWT_EXPIRES_IN`: tiempo de expiración del token (valor predeterminado: 7 días).
- `PORT`: puerto en el que escucha el servidor Express (valor predeterminado: 3000).
- `CORS_ORIGIN`: dominio del frontend autorizado para realizar peticiones a la API.
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: configuración SMTP para el envío de correos de verificación.

La variable principal del frontend es:

- `VUE_APP_API_URL`: URL base de la API REST, inyectada en tiempo de compilación por Vue CLI.

**Docker Compose**

Se configuró un archivo `docker-compose.yml` en la raíz del repositorio que orquesta tres servicios:

- `database`: contenedor PostgreSQL 15 con un "healthcheck" que garantiza que el servicio esté listo antes de que el backend intente conectarse. Los datos se persisten en un volumen Docker llamado `postgres_data`.
- `backend`: contenedor Node.js 18 con "nodemon" para recarga automática en desarrollo. Arranca únicamente cuando la base de datos supera el "healthcheck".
- `frontend`: contenedor Node.js 18 con el servidor de desarrollo de Vue CLI, disponible en el puerto 8080.

#### Implementación

Se inicializó el repositorio Git, se crearon los directorios de trabajo y se configuró el archivo `.gitignore` para excluir `node_modules`, archivos `.env` reales y artefactos de compilación. Se instalaron las dependencias iniciales mediante `npm install` y se verificó el arranque correcto de todos los servicios con `docker-compose up`.

#### Pruebas

Se verificó que todos los contenedores arrancaban correctamente y que los servicios eran accesibles en sus respectivos puertos: base de datos en el 5432, backend en el 3000 y frontend en el 8080.

---

### Sección 4.2 — Sección 2: Base de datos

#### Diseño de la solución

Se diseñó un esquema relacional con cinco tablas principales: `users`, `posts`, `comments`, `likes` y `follows`. El diseño tuvo en cuenta los siguientes principios:

- **Integridad referencial**: todas las relaciones entre tablas se definieron mediante claves foráneas con restricciones `ON DELETE CASCADE` o `ON DELETE SET NULL` según la lógica del dominio.
- **Índices**: se crearon índices en las columnas más consultadas (identificadores de usuario en publicaciones y comentarios, fecha de creación, categoría) para optimizar el rendimiento de las consultas.
- **"Triggers"**: se definieron disparadores PostgreSQL que actualizan automáticamente el campo `updated_at` de las tablas `users`, `posts` y `comments` al modificar cualquier registro, sin requerir lógica adicional en la capa de aplicación.
- **"Soft delete"**: las publicaciones no se eliminan físicamente de la base de datos, sino que se marcan con el campo `is_deleted = true` y se registra el identificador del usuario que realizó la eliminación en `deleted_by`. Esto permite auditar las eliminaciones y mantener la integridad de los datos relacionados.
- **Comentarios anidados**: la tabla `comments` incluye una clave foránea autorreferencial (`parent_comment_id`) que permite representar respuestas a comentarios existentes. La consulta de la jerarquía completa de comentarios se realiza mediante CTEs (expresiones de tabla comunes) recursivas de PostgreSQL.

**Migraciones**

El esquema de la base de datos se gestionó mediante archivos de migración SQL numerados secuencialmente en `backend/src/db/migrations/`:

- `001_create_tables.sql`: creación inicial de todas las tablas, índices, restricciones y "triggers".
- `002_add_soft_delete.sql`: adición de los campos `is_deleted` y `deleted_by` a la tabla `posts`.
- `003_add_glucose_enabled.sql`: adición del campo `glucose_enabled` a la tabla `users` para activar el módulo de seguimiento de glucosa.
- `004_add_email_verification.sql`: adición de los campos `is_verified`, `verification_code` y `verification_code_expires` a la tabla `users` para el flujo de verificación de correo electrónico.

Un script de ejecución (`backend/src/db/migrations/run.js`) lee los archivos SQL en orden numérico y los ejecuta contra la base de datos configurada, registrando en una tabla `migrations` qué archivos ya se han aplicado para evitar ejecuciones duplicadas.

**"Seeders"**

Se desarrollaron "seeders" para poblar la base de datos con datos de prueba representativos. Los "seeders" generan publicaciones y comentarios de ejemplo que permiten validar la interfaz de usuario sin necesidad de crear contenido manualmente. Se proporcionaron también scripts para eliminar los datos de prueba (`delete-bots.js`) una vez concluido el desarrollo.

#### Implementación

En el entorno de desarrollo con Docker, la base de datos se inicializa automáticamente al primer arranque del contenedor mediante los archivos SQL montados en el directorio `/docker-entrypoint-initdb.d` del contenedor PostgreSQL.

Los comandos disponibles para la gestión de la base de datos son los siguientes, ejecutados desde el directorio `backend/`:

- `npm run db:setup`: ejecuta todas las migraciones y los "seeders".
- `npm run db:migrate`: ejecuta únicamente las migraciones pendientes.
- `npm run db:seed`: ejecuta únicamente los "seeders".

#### Pruebas

Se verificó la correcta creación de todas las tablas, índices y restricciones mediante la consulta `\dt` en psql. Se comprobó el funcionamiento de los "triggers" de actualización de `updated_at` y la restricción de unicidad en la tabla `likes`.

---

### Sección 4.3 — Sección 3: Backend

#### Diseño de la solución

El backend se diseñó como una API REST con arquitectura en capas. Cada "endpoint" HTTP sigue el flujo: ruta → "middleware" → controlador → modelo → base de datos. Esta separación de responsabilidades facilita las pruebas, el mantenimiento y la extensión del código.

Todos los "endpoints" de la API responden con la estructura estándar `{ status: "success" | "error", data | message }`, lo que simplifica el tratamiento de respuestas en el frontend.

**Modelos (`backend/src/models/`)**

Los modelos encapsulan todas las consultas SQL del dominio correspondiente. No se utilizó ningún ORM para mantener el control total sobre las consultas y aprovechar las capacidades avanzadas de PostgreSQL.

- `userModel.js`: gestión completa del ciclo de vida del usuario: creación, autenticación, verificación de correo electrónico, actualización de perfil, obtención de perfil público y estadísticas, y operaciones de administración.
- `postModel.js`: CRUD de publicaciones con soporte de "soft delete", paginación de resultados y enriquecimiento de datos con información del autor y conteos de comentarios y "likes".
- `commentModel.js`: CRUD de comentarios con soporte de anidamiento mediante CTE recursiva de PostgreSQL, que devuelve el árbol jerárquico completo de comentarios de una publicación.
- `likeModel.js`: gestión de "likes" en publicaciones y comentarios, con prevención de duplicados mediante restricciones `UNIQUE` en la base de datos y uso de `ON CONFLICT DO NOTHING`.

**Controladores (`backend/src/controllers/`)**

- `authController.js`: registro de usuarios con generación de código de verificación de 4 dígitos enviado por correo electrónico (caducidad de 15 minutos), verificación del código, reenvío del código y autenticación con generación de token JWT de 7 días de validez.
- `postController.js`: creación, listado paginado (20 publicaciones por página), obtención individual con incremento de contador de vistas, actualización (solo el propietario) y eliminación lógica (propietario o administrador).
- `commentController.js`: creación de comentarios con soporte de `parent_comment_id` para respuestas anidadas, obtención en árbol jerárquico, actualización y eliminación.
- `likeController.js`: alternancia de "likes" en publicaciones y comentarios, y listado de usuarios que dieron "like" a una publicación.
- `userController.js`: obtención de perfil público, estadísticas del usuario (número de publicaciones, comentarios y "likes" recibidos) y eliminación de cuenta propia.
- `adminController.js`: listado de todos los usuarios con conteos agregados, actualización de usuarios (incluyendo el bloqueo, que aplica "soft delete" a todas sus publicaciones) y eliminación de usuarios. Se implementaron salvaguardas para impedir que un administrador se bloquee o se elimine a sí mismo.

**Rutas (`backend/src/routes/`)**

- `authRoutes.js`: agrupa los "endpoints" `/api/auth/*` (registro, verificación de correo, reenvío de código, "login", obtención y actualización del perfil).
- `postRoutes.js`: agrupa los "endpoints" `/api/posts/*`, con autenticación opcional en las rutas de lectura para enriquecer la respuesta con información de "likes" del usuario autenticado.
- `commentRoutes.js`: agrupa los "endpoints" `/api/comments/*`.
- `likeRoutes.js`: agrupa los "endpoints" `/api/likes/*`, todos con autenticación obligatoria.
- `userRoutes.js`: agrupa los "endpoints" `/api/users/*` para la gestión del perfil público y la cuenta propia.
- `adminRoutes.js`: agrupa los "endpoints" `/api/admin/*`, restringidos a usuarios con rol `admin`.

**"Middlewares" (`backend/src/middlewares/`)**

- `authMiddleware.js`: verifica el token JWT del encabezado `Authorization: Bearer <token>` y adjunta el usuario a `req.user`. `authenticate` exige autenticación; `optionalAuth` procesa el token si existe sin requerirlo. `isAdmin` e `isOwner` implementan la autorización basada en roles y propiedad del recurso.
- `errorMiddleware.js`: gestión centralizada de errores HTTP 404, errores genéricos de aplicación y errores específicos de PostgreSQL (violación de unicidad, violación de clave foránea, etc.), con respuestas estructuradas y uniformes.

**Utilidades (`backend/src/utils/`)**

- `jwtUtils.js`: generación y verificación de tokens JWT, con validación del secreto en producción (mínimo 32 caracteres).
- `passwordUtils.js`: cifrado y comparación de contraseñas con bcrypt.
- `emailUtils.js`: envío de correos de verificación mediante Nodemailer, con configuración SMTP mediante variables de entorno.
- `validators.js`: reglas de validación de datos de entrada reutilizables.

#### Implementación

Se implementaron 21 "endpoints" distribuidos en 6 grupos de rutas. Se aplicó limitación de tasa ("rate limiting") global de 100 peticiones por 15 minutos por IP. Se habilitó `trust proxy` para el correcto funcionamiento del "rate limiting" detrás del "proxy" de Render en producción.

#### Pruebas

Se verificó el funcionamiento de todos los "endpoints" mediante pruebas manuales con Insomnia antes de pasar al desarrollo del frontend. Se comprobaron especialmente los flujos de autenticación, la correcta aplicación de las guardas de rol y el comportamiento del "soft delete" en publicaciones.

---

### Sección 4.4 — Sección 4: Frontend

#### Diseño de la solución

El frontend se desarrolló como una aplicación de página única ("Single Page Application") con Vue 3 utilizando la Options API. El enrutamiento se gestiona en modo "history" con Vue Router 4, lo que requiere la redirección de todas las rutas al archivo `index.html` tanto en el servidor de desarrollo como en producción (configurada en `frontend/netlify.toml`).

**Estilos globales (SCSS)**

Se definieron variables SCSS globales en `frontend/src/assets/scss/variables.scss` para los colores corporativos, la tipografía y los espaciados. La hoja de estilos principal `main.scss` importa estas variables y define los estilos base de la aplicación, garantizando la coherencia visual en todos los componentes sin duplicar valores.

**Enrutamiento (`frontend/src/router/index.js`)**

Se definieron las siguientes rutas con sus correspondientes guardas de acceso:

- Rutas públicas: `/` (inicio), `/forum`, `/post/:id`, `/login`, `/register`, `/verify-email`, `/guide`, `/about`, `/videos`, `/quiz`.
- Rutas autenticadas (`requiresAuth`): `/create-post`, `/edit-post/:id`, `/profile`, `/my-posts`, `/questionnaire`.
- Ruta exclusiva para administradores (`requiresAdmin`): `/admin`.
- Ruta condicional (`requiresGlucose`): `/glucose`, accesible únicamente si el usuario tiene `glucose_enabled = true`.
- Rutas de invitado (`guest`): `/login`, `/register`, que redirigen al inicio si el usuario ya está autenticado.

**Vistas (`frontend/src/views/`)**

- `HomeView.vue`: página de inicio con sección "hero", descripción de las funcionalidades principales y llamada a la acción para el registro.
- `ForumView.vue`: contenedor del foro que integra el componente `PostList`.
- `PostDetailView.vue`: detalle de una publicación individual con la sección de comentarios anidados.
- `CreatePostView.vue` y `EditPostView.vue`: formularios de creación y edición de publicaciones con campos de título, contenido, categoría y etiquetas.
- `LoginView.vue` y `RegisterView.vue`: envolturas de los formularios de autenticación.
- `VerifyEmailView.vue`: formulario de introducción del código de verificación de 4 dígitos recibido por correo electrónico.
- `ProfileView.vue`: gestión del perfil del usuario autenticado (datos personales, cambio de contraseña y estadísticas de actividad).
- `MyPostsView.vue`: listado paginado de las publicaciones propias del usuario autenticado.
- `AdminView.vue`: panel de administración para la gestión de usuarios, con opciones de bloqueo, cambio de rol y eliminación.
- `GuideView.vue`: guía educativa sobre diabetes tipo 1 dirigida a personas recién diagnosticadas, accesible sin registro.
- `GlucoseView.vue`: módulo de seguimiento de niveles de glucosa con representación gráfica e historial de registros, accesible solo si el usuario tiene `glucose_enabled = true`.
- `QuizView.vue`: test de conocimientos sobre diabetes tipo 1.
- `QuestionnaireView.vue`: cuestionario inicial para personalizar la experiencia del usuario en la plataforma.
- `VideosView.vue`: galería de vídeos educativos de fuentes verificadas, accesible sin registro.
- `AboutView.vue`: página informativa sobre los objetivos y el origen del proyecto.
- `DonateView.vue`: página de donaciones, deshabilitada en producción y con redirección automática a la página de inicio.

**Componentes (`frontend/src/components/`)**

- `NavBar.vue`: barra de navegación "responsive" con acceso a las secciones principales, menú desplegable del usuario autenticado y adaptación al dispositivo.
- `PostList.vue`: listado paginado de publicaciones con campo de búsqueda y filtros.
- `PostItem.vue`: tarjeta de publicación con título, autor, categoría, etiquetas y contadores de vistas, "likes" y comentarios.
- `CommentSection.vue`: sección de comentarios de una publicación con soporte de respuestas anidadas y carga dinámica.
- `CommentItem.vue`: comentario individual con acciones de respuesta, edición y eliminación.
- `LikeButton.vue`: botón de alternancia de "like" reutilizable tanto en publicaciones como en comentarios.
- `LoginForm.vue` y `RegisterForm.vue`: formularios de autenticación con validación en el cliente.
- `UserProfileModal.vue`: modal con el perfil público de un usuario, accesible desde su nombre en publicaciones y comentarios.
- `LegalModal.vue`: modal con los términos y condiciones y la política de privacidad de la plataforma.
- `CookieBanner.vue`: aviso de uso de cookies conforme a la normativa vigente, con opción de aceptación persistente.

**Servicios (`frontend/src/services/`)**

- `api.js`: instancia centralizada de Axios con la URL base de la API, interceptores para la inyección automática del token JWT en cada petición y gestión del cierre de sesión ante respuestas 401.
- `authService.js`: métodos de registro, verificación de correo, inicio de sesión, cierre de sesión y obtención del usuario actual desde `localStorage`.
- `postService.js`, `commentService.js`, `likeService.js`, `userService.js`: módulos de comunicación con los respectivos grupos de "endpoints" de la API.

#### Implementación

Todas las llamadas a la API se canalizan a través de `api.js`, lo que centraliza la lógica de autenticación y gestión de errores. El estado de autenticación del usuario se gestiona mediante `stores/authStore.js`, un almacén reactivo ligero sin Vuex ni Pinia, inicializado desde `localStorage` al cargar la aplicación.

#### Pruebas

Se verificó la correcta visualización y comportamiento de todas las vistas en los principales navegadores y en dispositivos móviles. Se comprobaron los flujos de registro, verificación de correo, creación de publicaciones, comentarios anidados y "likes", así como el acceso restringido a las rutas protegidas.

---

### Sección 4.5 — Sección 5: Despliegue

#### Diseño de la solución

Se optó por un despliegue en servicios gratuitos en la nube, con el objetivo de mantener la aplicación accesible sin coste económico. La arquitectura de producción separa los tres componentes de la aplicación en servicios independientes:

| Capa | Servicio | Plan gratuito |
|------|----------|---------------|
| Base de datos | Neon (PostgreSQL "serverless") | 0,5 GB, 190 h de cómputo al mes |
| Backend | Render ("Web Service") | 750 h/mes, 512 MB RAM |
| Frontend | Netlify (CDN global) | 100 GB de ancho de banda al mes |
| Monitorización | UptimeRobot | 50 monitores, "ping" cada 5 minutos |

#### Implementación

**Paso 1 — Base de datos en Neon**

Se creó un proyecto PostgreSQL 16 en Neon con la región Europa (Frankfurt) para minimizar la latencia con los usuarios hispanohablantes. Una vez obtenida la cadena de conexión en el formato `postgresql://usuario:contraseña@host.neon.tech/basededatos?sslmode=require`, se ejecutaron las migraciones apuntando a Neon:

```
cd backend
npm run db:setup
```

A continuación, se promovió al usuario administrador mediante la siguiente consulta SQL:

```sql
UPDATE users SET role = 'admin' WHERE email = 'correo@ejemplo.com';
```

**Paso 2 — Backend en Render**

Se creó un "Web Service" en Render conectado al repositorio de GitHub, con la siguiente configuración:

- Directorio raíz: `backend`
- Comando de construcción: `npm ci`
- Comando de inicio: `npm start`
- Ruta de comprobación de salud: `/api/health`

Se configuraron las variables de entorno: `DATABASE_URL` (cadena de conexión de Neon), `JWT_SECRET` (secreto aleatorio de 48 bytes), `JWT_EXPIRES_IN` (7 días), `NODE_ENV` (`production`) y `CORS_ORIGIN` (dominio del frontend en Netlify). El "JWT_SECRET" se generó con el comando:

```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Una vez desplegado, se verificó el funcionamiento mediante una petición a `/api/health`, que devuelve `{"status":"OK"}`.

**Paso 3 — Frontend en Netlify**

Se importó el repositorio en Netlify, que detectó automáticamente el archivo `frontend/netlify.toml` con la configuración de compilación: directorio base `frontend`, comando `npm ci && npm run build` y directorio de publicación `frontend/dist`. El archivo `netlify.toml` incluye también la regla de redirección `/* → /index.html 200`, necesaria para que Vue Router en modo "history" funcione correctamente al acceder directamente a cualquier ruta.

Se configuró la variable de entorno `VUE_APP_API_URL` apuntando a la URL pública del servicio de Render. Tras obtener el dominio de Netlify, se actualizó la variable `CORS_ORIGIN` en Render para que coincidiera exactamente con dicho dominio, sin barra final.

**Paso 4 — Monitorización con UptimeRobot**

Se creó un monitor de tipo HTTP(s) en UptimeRobot apuntando a `https://tudiabetes-api.onrender.com/api/health` con un intervalo de 5 minutos. Este "ping" periódico mantiene activo el servicio de Render, que en el plan gratuito entra en estado inactivo tras 15 minutos sin tráfico, tardando entre 30 y 60 segundos en despertar.

**Actualizaciones futuras**

Cualquier "push" a la rama `main` del repositorio de GitHub desencadena automáticamente la recompilación del backend en Render y del frontend en Netlify, sin necesidad de intervención manual.

#### Pruebas

Se realizó una verificación "end-to-end" tras el despliegue: registro de usuario, verificación de correo electrónico, inicio de sesión, creación de publicación, publicación de comentario y alternancia de "like". Se comprobó también la correcta configuración de CORS accediendo a la consola del navegador en la URL de Netlify.

---

### Sección 4.6 — Sección 6: Ajustes finales

#### Optimización y validación final

Una vez desplegada la aplicación en producción, se procedió a compartir el enlace con usuarios reales pertenecientes al grupo objetivo: personas con diabetes tipo 1 y sus familiares. Su uso activo de la plataforma permitió detectar incidencias que no habían sido identificadas durante las pruebas internas, como problemas de usabilidad en dispositivos móviles, mensajes de error poco informativos y comportamientos inesperados en flujos de autenticación.

**Estrategia de ramas**

Para garantizar que la versión accesible al público siempre fuera estable, se adoptó la siguiente estrategia de ramas en Git:

- Rama `main`: contiene el código de producción. Todo "push" a esta rama desencadena automáticamente el redespliegue tanto en Render (backend) como en Netlify (frontend), sin intervención manual.
- Rama `changes`: rama de desarrollo activo. Las nuevas funcionalidades y las correcciones de errores se desarrollaron en esta rama, que solo se fusionó en `main` cuando el estado del código se consideró estable y correctamente probado.

Esta separación permitió desarrollar y probar cambios de forma segura sin interrumpir el servicio para los usuarios que ya utilizaban la plataforma.

#### Pruebas finales

Se realizó una revisión completa de los flujos principales de la aplicación: registro con verificación de correo, inicio de sesión, creación y edición de publicaciones, publicación de comentarios anidados, alternancia de "likes" y acceso al panel de administración. Se verificó la correcta visualización en dispositivos móviles, tabletas y escritorio.

#### Documentación y publicación

Se elaboró el documento `DEPLOY.md` con la guía completa de despliegue, que describe paso a paso la configuración de Neon, Render, Netlify y UptimeRobot, incluyendo la solución a los problemas más habituales. Este documento facilita la reproducción del entorno de producción en caso de migración a una infraestructura diferente.

---

### Sección 5.1 — Resumen de los resultados

El desarrollo del proyecto produjo una plataforma web funcional y desplegada en producción que cumple con todos los objetivos planteados. Se implementó un foro interactivo completo con publicaciones categorizadas, comentarios anidados, "likes" y un sistema de roles con panel de administración. La autenticación segura mediante JWT con verificación de correo electrónico garantiza la identidad de los usuarios registrados.

El "stack" tecnológico elegido —Vue 3 en el frontend y Node.js/Express con PostgreSQL en el backend— demostró ser adecuado para el alcance del proyecto, permitiendo un desarrollo ágil sin sacrificar robustez ni escalabilidad futura. La arquitectura en capas del backend facilitó la incorporación progresiva de funcionalidades sin necesidad de refactorizaciones extensas.

La plataforma se puso a disposición de usuarios reales, lo que permitió validar la experiencia de usuario en condiciones reales y recoger retroalimentación para iteraciones futuras. La infraestructura de despliegue basada en servicios gratuitos —Neon, Render, Netlify y UptimeRobot— demostró ser suficiente para soportar el tráfico inicial sin coste económico.

---

### Sección 5.2 — Posibles mejoras

**Infraestructura y escalabilidad**

La infraestructura actual de producción se basa en planes gratuitos con limitaciones de almacenamiento, memoria y número de despliegues. Como mejora prioritaria, se plantea la migración a planes de pago de los servicios utilizados:

- **Neon**: el plan gratuito ofrece 0,5 GB de almacenamiento y 190 horas de cómputo al mes. Con un mayor volumen de usuarios y publicaciones, sería necesario migrar a un plan que ofrezca mayor almacenamiento y conexiones concurrentes sin límite.
- **Render**: el plan gratuito limita el servicio a 512 MB de RAM y provoca arranques en frío tras periodos de inactividad. La contratación de un plan de instancia dedicada eliminaría los arranques en frío, garantizaría mayor velocidad de respuesta y permitiría un mayor número de despliegues simultáneos.
- **Netlify**: aunque el plan gratuito es suficiente para el tráfico actual, un crecimiento significativo del número de usuarios requeriría ampliar el ancho de banda disponible y el número de compilaciones concurrentes.

**Dominio personalizado**

Actualmente la plataforma se sirve bajo los subdominios por defecto de Netlify y Render. La adquisición de un dominio propio mejoraría la imagen de la plataforma, facilitaría su posicionamiento en motores de búsqueda y transmitiría mayor confianza a los usuarios. Tanto Render como Netlify soportan dominios personalizados con certificado SSL gratuito mediante "Let's Encrypt".

**Nuevas funcionalidades**

A partir de la retroalimentación recibida de los primeros usuarios reales de la plataforma, se identificaron las siguientes mejoras funcionales:

- Sistema de notificaciones en tiempo real para respuestas a comentarios y nuevos "likes".
- Función de búsqueda avanzada con filtros por etiqueta, categoría y rango de fechas.
- Sistema de seguimiento entre usuarios ("follows") para ver las publicaciones de los perfiles seguidos.
- Moderación de contenido asistida, con la posibilidad de reportar publicaciones y comentarios inapropiados.
- Ampliación del módulo de seguimiento de glucosa con exportación de datos y generación de informes periódicos.
- Perfil de usuario enriquecido con historial de actividad y estadísticas de participación detalladas.

---

## 4.2 Diagramas solicitados

### Diagrama de la base de datos (sección 3.3)

```
┌──────────────────────────────┐     ┌──────────────────────────────────┐
│           USERS              │     │             POSTS                │
├──────────────────────────────┤     ├──────────────────────────────────┤
│ id              SERIAL PK    │◄────│ user_id         INTEGER FK       │
│ username        VARCHAR UNIQ │     │ id              SERIAL PK        │
│ email           VARCHAR UNIQ │     │ title           VARCHAR(255)     │
│ password        VARCHAR      │     │ content         TEXT             │
│ full_name       VARCHAR      │     │ category        VARCHAR(50)      │
│ diabetes_type   VARCHAR      │     │ tags            VARCHAR[]        │
│ diagnosis_date  DATE         │     │ view_count      INTEGER          │
│ bio             TEXT         │     │ is_pinned       BOOLEAN          │
│ avatar_url      VARCHAR      │     │ is_closed       BOOLEAN          │
│ role            VARCHAR      │     │ is_deleted      BOOLEAN          │
│ is_active       BOOLEAN      │     │ deleted_by      INTEGER FK→USERS │
│ is_verified     BOOLEAN      │     │ created_at      TIMESTAMP        │
│ glucose_enabled BOOLEAN      │     │ updated_at      TIMESTAMP        │
│ last_login      TIMESTAMP    │     └───────────────┬──────────────────┘
│ created_at      TIMESTAMP    │                     │
│ updated_at      TIMESTAMP    │     ┌───────────────▼──────────────────┐
└──────────────┬───────────────┘     │           COMMENTS               │
               │                     ├──────────────────────────────────┤
               │              ┌──────│ post_id         INTEGER FK       │
               │              │      │ id              SERIAL PK        │
               ├──────────────┼──────│ user_id         INTEGER FK       │
               │              │      │ parent_comment_id INTEGER FK(self)│
               │              │      │ content         TEXT             │
               │              │      │ is_edited       BOOLEAN          │
               │              │      │ created_at      TIMESTAMP        │
               │              │      │ updated_at      TIMESTAMP        │
               │              │      └──────────────────────────────────┘
               │
               │    ┌─────────────────────────────────────────────┐
               │    │                 LIKES                        │
               │    ├─────────────────────────────────────────────┤
               └────│ user_id      INTEGER FK → USERS             │
                    │ id           SERIAL PK                       │
                    │ post_id      INTEGER FK → POSTS (nullable)   │
                    │ comment_id   INTEGER FK → COMMENTS (nullable)│
                    │ created_at   TIMESTAMP                       │
                    │                                              │
                    │ CHECK: (post_id IS NOT NULL)                 │
                    │     XOR (comment_id IS NOT NULL)             │
                    │ UNIQUE (user_id, post_id)                    │
                    │ UNIQUE (user_id, comment_id)                 │
                    └─────────────────────────────────────────────┘

┌─────────────────────────────────┐
│            FOLLOWS              │
├─────────────────────────────────┤
│ id           SERIAL PK          │
│ follower_id  INTEGER FK → USERS │
│ following_id INTEGER FK → USERS │
│ created_at   TIMESTAMP          │
│ UNIQUE (follower_id, following_id) │
└─────────────────────────────────┘
```

**Relaciones:**
- Un usuario puede tener muchas publicaciones (1:N).
- Un usuario puede tener muchos comentarios (1:N).
- Una publicación puede tener muchos comentarios (1:N).
- Un comentario puede tener muchos comentarios hijo, autorreferencia (1:N).
- Un usuario puede dar muchos "likes" (1:N); cada "like" pertenece exclusivamente a una publicación o a un comentario.
- Un usuario puede seguir a muchos usuarios (N:M mediante la tabla FOLLOWS).

---

### Esquema general de la arquitectura (sección 3.3)

```
  CLIENTE (navegador web / móvil)
            │
            │  HTTPS
            ▼
  ┌─────────────────────┐
  │   NETLIFY  (CDN)    │
  │   frontend/dist/    │
  │   Vue 3  SPA        │
  │   Bootstrap 5       │
  │   Axios             │
  └──────────┬──────────┘
             │  HTTP/JSON + Authorization: Bearer <JWT>
             ▼
  ┌─────────────────────────────────────────┐
  │              RENDER                     │
  │            Node.js 18                   │
  │            Express 4                   │
  │                                         │
  │  /api/*  →  Routes                      │
  │               │                         │
  │          Middlewares                    │
  │    (autenticación JWT, roles,           │
  │     rate-limit, CORS, Helmet)           │
  │               │                         │
  │          Controllers                    │
  │  (auth, posts, comments, likes,         │
  │   users, admin)                         │
  │               │                         │
  │            Models                       │
  │       (SQL directo con pg)              │
  └──────────────┬──────────────────────────┘
                 │  SSL / TCP 5432
                 ▼
  ┌─────────────────────┐
  │    NEON             │
  │  PostgreSQL 16      │
  │  serverless         │
  │  5 tablas           │
  └─────────────────────┘

  ┌─────────────────────┐
  │   UPTIMEROBOT       │
  │  ping /api/health   │
  │  cada 5 minutos     │
  │  → mantiene Render  │
  │    activo           │
  └─────────────────────┘
```

---

### Diagrama de Gantt — Planificación temporal (sección 3.3)

```
Sección                        S1    S2    S3    S4    S5    S6    S7    S8
─────────────────────────────────────────────────────────────────────────────
1. Estructuración  (4 h)      ████
2. Base de datos   (6 h)           ████████
3. Backend        (13 h)                 ██████████████████████
4. Frontend       (13 h)                           ████████████████████████
5. Despliegue      (2 h)                                              ████
6. Ajustes finales (2 h)                                                  ████
─────────────────────────────────────────────────────────────────────────────
Total: 40 h          (Sx = sesión de trabajo de ~5 h)
```

| Sección | Descripción | Horas | % |
|---------|-------------|-------|---|
| 1 | Estructuración y configuración | 4 h | 10 % |
| 2 | Base de datos | 6 h | 15 % |
| 3 | Backend | 13 h | 32,5 % |
| 4 | Frontend | 13 h | 32,5 % |
| 5 | Despliegue | 2 h | 5 % |
| 6 | Ajustes finales | 2 h | 5 % |
| **Total** | | **40 h** | **100 %** |

---

## 4.3 Notas

- Las subsecciones **"Casos de uso e historias de usuario"** y **"Mockups i prototipos iniciales"** al final de la sección 2.2 del documento base aparecen sin contenido desarrollado. Los casos de uso y las historias de usuario se han redactado en la sección 4.1 del presente documento. Para los "mockups" y capturas de pantalla, el autor indicó que los insertará directamente en el documento.
- Las subsecciones **"Pruebas"** de las secciones 4.1, 4.2, 4.3 y 4.4 del documento base incluyen la indicación de que el autor añadirá capturas de pantalla propias. Se recomienda acompañar cada captura con un párrafo breve que describa qué aspecto o flujo se está validando.
- La sección **3.3** indica que se incluirá un diagrama de la base de datos y un esquema general de la arquitectura web. Ambos se han representado en formato ASCII en la sección 4.2 del presente documento; pueden transcribirse al DOCX como texto con fuente monoespaciada, o bien reproducirse como imagen elaborada con una herramienta de diagramación.
- El documento original contiene algunas líneas redactadas en catalán en los títulos del índice ("Índex", "Diagrama de Gantt per a visualitzar..."). Se recomienda revisar la coherencia idiomática y unificar todo el documento en castellano si esa es la lengua de presentación.
- En la portada del documento base, el campo **"Módulo Optativo"** de la tabla de módulos implicados no especifica el nombre del módulo. Se recomienda completarlo.
- El documento base menciona en la sección 1.1 que el frontend está desarrollado con la **Composition API**, pero en la implementación real se utilizó la **Options API**. Se recomienda corregir este dato en el documento final.
