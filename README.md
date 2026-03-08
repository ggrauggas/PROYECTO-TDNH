# TU diabetes NUESTRA historia

Plataforma web tipo foro para ayudar a personas con diabetes tipo 1, donde los usuarios pueden compartir experiencias, hacer preguntas y recibir ayuda de otros usuarios.

## Tecnologías

- **Frontend**: Vue.js 3, Bootstrap, SCSS
- **Backend**: Node.js, Express
- **Base de datos**: PostgreSQL
- **Contenedores**: Docker, Docker Compose
- **Autenticación**: JWT

## Requisitos previos

- Docker y Docker Compose instalados
- Git
- Node.js 18+ (opcional, para desarrollo local)

## Instalación y configuración

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tuusuario/tu-diabetes-nuestra-historia.git
   cd tu-diabetes-nuestra-historia

## Esquema de la base de datos
   ```bash
    ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
    │    users    │       │    posts    │       │  comments   │
    ├─────────────┤       ├─────────────┤       ├─────────────┤
    │ id          │◄──────┤ user_id     │       │ id          │
    │ username    │       │ id          │       │ content     │
    │ email       │       │ title       │       │ user_id     │◄────┐
    │ password    │       │ content     │       │ post_id     │     │
    │ created_at  │       │ created_at  │       │ created_at  │     │
    │ updated_at  │       │ updated_at  │       │ updated_at  │     │
    └─────────────┘       └─────────────┘       └─────────────┘     │
            │                    │                    │             │
            │                    │                    │             │
            │    ┌─────────────┐ │                    │             │
            │    │    likes    │ │                    │             │
            │    ├─────────────┤ │                    │             │
            └────┤ user_id     │ │                    │             │
                 │ post_id     │◄┘                    │             │
                 │ comment_id  │──────────────────────┘             │
                 │ created_at  │                                    │
                 └─────────────┘                                    │
                                                                    │
                                                      ┌─────────────┴─────┐
                                                      │   replies (self   │
                                                      │   reference)      │
                                                      ├───────────────────┤
                                                      │ comment_id        │
                                                      │ parent_comment_id │
                                                      └───────────────────┘