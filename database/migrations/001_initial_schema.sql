-- Migration 001 — schéma applicatif (base = DATABASE_NAME, ex. dzb_cake)
-- Tables idempotentes : safe si relancé sans enregistrement dans schema_migrations

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(64) NOT NULL PRIMARY KEY,
  name_fr VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_kr VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS cakes (
  id CHAR(36) NOT NULL PRIMARY KEY,
  category_id VARCHAR(64) NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_kr VARCHAR(255) NOT NULL,
  description_fr TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_kr TEXT NOT NULL,
  price DECIMAL(14, 2) NOT NULL,
  image_url TEXT NOT NULL,
  CONSTRAINT fk_cakes_category FOREIGN KEY (category_id) REFERENCES categories (id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) NOT NULL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(64) NOT NULL,
  total DECIMAL(14, 2) NOT NULL,
  status ENUM('pending', 'preparing', 'ready', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at DATETIME(3) NOT NULL,
  delivery_date DATE NULL,
  items JSON NOT NULL,
  INDEX idx_orders_created (created_at),
  INDEX idx_orders_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory_items (
  id CHAR(36) NOT NULL PRIMARY KEY,
  name_fr VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_kr VARCHAR(255) NOT NULL,
  quantity_label VARCHAR(64) NOT NULL,
  status ENUM('ok', 'low') NOT NULL DEFAULT 'ok'
) ENGINE=InnoDB;
