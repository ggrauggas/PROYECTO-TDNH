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
   git clone https://github.com/tuusuario/PROYECTO-TDNH.git
   cd tu-diabetes-nuestra-historia

## Esquema de la base de datos
   ```bash
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │   posts     │       │  comments   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id          │───────│ userId      │       │ userId      │
│ username    │       │ id          │───────│ postId      │
│ email       │       │ title       │       │ content     │
│ password    │       │ content     │       │ createdAt   │
│ role        │       │ createdAt   │       └─────────────┘
│ isBanned    │       │ updatedAt   │
│ createdAt   │       └─────────────┘
│ updatedAt   │
└─────────────┘
       │
       │
       │
┌──────▼──────┐       ┌─────────────┐       ┌─────────────┐
│   likes     │       │   foods     │       │    faqs     │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ userId      │       │ id          │       │ id          │
│ postId      │       │ name        │       │ question    │
│ createdAt   │       │ description │       │ answer      │
└─────────────┘       │ category    │       │ order       │
                      │ imageUrl    │       │ createdAt   │
                      │ createdAt   │       └─────────────┘
                      └─────────────┘
