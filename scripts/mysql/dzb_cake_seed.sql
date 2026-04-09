-- Données d'exemple — import manuel ou : npm run db:seed
-- Source canonique : database/seed_demo.sql

USE dzb_cake;

INSERT IGNORE INTO categories (id, name_fr, name_en, name_kr) VALUES
  ('cat_wedding', 'Mariage', 'Wedding', 'Ubukwe'),
  ('cat_birthday', 'Anniversaire', 'Birthday', 'Isabukuru'),
  ('cat_pastry', 'Pâtisserie', 'Pastry', 'Ibikozwe'),
  ('cat_custom', 'Personnalisé', 'Custom', 'Vyihariye');

INSERT IGNORE INTO cakes (id, category_id, name_fr, name_en, name_kr, description_fr, description_en, description_kr, price, image_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'cat_wedding',
   'Gâteau trois étages vanille', 'Three-tier vanilla cake', 'Igikombe c''inyanya eshatu',
   'Vanille, crème légère, décoration florale.', 'Vanilla, light cream, floral decoration.', 'Vanille, cream.',
   850000.00,
   'https://images.unsplash.com/photo-1535254973040-607b474cb80d?auto=format&fit=crop&q=80&w=800'),
  ('22222222-2222-2222-2222-222222222222', 'cat_birthday',
   'Layer cake chocolat', 'Chocolate layer cake', 'Igikombe c''shokola',
   'Génoise chocolat, ganache.', 'Chocolate sponge, ganache.', 'Shokola, ganache.',
   120000.00,
   'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800');

INSERT IGNORE INTO inventory_items (id, name_fr, name_en, name_kr, quantity_label, status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Farine', 'Flour', 'Ifu', '12 kg', 'ok'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Sucre', 'Sugar', 'Isukari', '5 kg', 'low');
