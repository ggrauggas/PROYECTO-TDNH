#!/bin/bash
# Script para hacer backup de la base de datos

BACKUP_DIR="./database/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/tudiabetes_$TIMESTAMP.sql"

mkdir -p $BACKUP_DIR

echo "📦 Creando backup de la base de datos..."
docker-compose exec -T database pg_dump -U tudiabetes_user tudiabetes > $BACKUP_FILE

echo "✅ Backup creado: $BACKUP_FILE"