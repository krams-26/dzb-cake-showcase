-- Rôle du personnel : admin (gestion complète) ou staff (accès standard tableau de bord)

ALTER TABLE staff_users
  ADD COLUMN role VARCHAR(32) NOT NULL DEFAULT 'staff'
  COMMENT 'admin | staff'
  AFTER password_hash;
