-- Comptes personnel (connexion tableau de bord)

CREATE TABLE IF NOT EXISTS staff_users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
  UNIQUE KEY uq_staff_users_email (email)
) ENGINE=InnoDB;
