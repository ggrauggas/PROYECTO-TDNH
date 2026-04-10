-- Este script se ejecuta automáticamente la primera vez que se inicia el contenedor de PostgreSQL
-- Solo se ejecuta si la base de datos está vacía

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos inicializada correctamente';
END $$;