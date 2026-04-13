-- Migración 003: Campo glucose_enabled en users
-- Fecha: 2026-04-13

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS glucose_enabled BOOLEAN DEFAULT false;
