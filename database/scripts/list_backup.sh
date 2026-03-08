#!/bin/bash
# Script para listar los backups disponibles

echo "📋 Backups disponibles:"
echo "================================"

if [ ! -d "database/backups" ]; then
    echo "No existe la carpeta de backups"
    exit 0
fi

BACKUPS=$(ls -la database/backups/*.sql 2>/dev/null)
if [ -z "$BACKUPS" ]; then
    echo "No hay backups disponibles"
else
    ls -lh database/backups/*.sql | awk '{print $9 " (" $5 ")"}'
fi

echo "================================"