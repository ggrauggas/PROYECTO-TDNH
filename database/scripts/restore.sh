#!/bin/bash
# Script para restaurar la base de datos desde un backup

if [ -z "$1" ]; then
  echo "❌ Uso: ./database/scripts/restore.sh <archivo_backup.sql>"
  exit 1
fi

BACKUP_FILE=$1

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ El archivo $BACKUP_FILE no existe"
  exit 1
fi

echo "🔄 Restaurando base de datos desde $BACKUP_FILE..."
cat $BACKUP_FILE | docker-compose exec -T database psql -U tudiabetes_user -d tudiabetes

echo "✅ Base de datos restaurada"