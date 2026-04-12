-- Migración 002: Soft delete en posts
-- Fecha: 2026-04-12

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(10) DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_posts_is_deleted ON posts(is_deleted);
