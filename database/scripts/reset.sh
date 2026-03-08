#!/bin/bash
# Script para resetear completamente la base de datos

echo "⚠️  ATENCIÓN: Esto eliminará TODOS los datos de la base de datos"
read -p "¿Estás seguro? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]
then
    exit 1
fi

echo "🔄 Reseteando base de datos..."

# Detener los contenedores
docker-compose down

# Eliminar el volumen de la base de datos
docker volume rm proyecto-tdnh_postgres_data

# Levantar de nuevo
docker-compose up -d

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a que la base de datos esté lista..."
sleep 10

# Ejecutar migraciones y seeders
docker-compose exec backend npm run db:setup

echo "✅ Base de datos reseteada completamente"