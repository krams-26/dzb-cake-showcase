/**
 * Catalogue figé pour le déploiement Vercel sans base MySQL externe.
 * Même forme que l’API Express (camelCase).
 */
export const CATEGORIES = [
  { id: 'cat_wedding', nameFr: 'Mariage', nameEn: 'Wedding', nameKr: 'Ubukwe' },
  { id: 'cat_birthday', nameFr: 'Anniversaire', nameEn: 'Birthday', nameKr: 'Isabukuru' },
  { id: 'cat_pastry', nameFr: 'Pâtisserie', nameEn: 'Pastry', nameKr: 'Ibikozwe' },
  { id: 'cat_custom', nameFr: 'Personnalisé', nameEn: 'Custom', nameKr: 'Vyihariye' },
]

const IMG_WEDDING =
  'https://images.unsplash.com/photo-1535254973040-607b474cb80d?auto=format&fit=crop&q=85&w=800&fm=webp'
const IMG_CHOC =
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=85&w=800&fm=webp'
const IMG_FRUIT =
  'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&q=85&w=800&fm=webp'

export const CAKES = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    categoryId: 'cat_wedding',
    nameFr: 'Gâteau trois étages vanille',
    nameEn: 'Three-tier vanilla cake',
    nameKr: "Igikombe c'inyanya eshatu",
    descriptionFr: 'Vanille, crème légère, décoration florale.',
    descriptionEn: 'Vanilla, light cream, floral decoration.',
    descriptionKr: 'Vanille, cream.',
    price: 850000,
    imageUrl: IMG_WEDDING,
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    categoryId: 'cat_birthday',
    nameFr: 'Layer cake chocolat',
    nameEn: 'Chocolate layer cake',
    nameKr: "Igikombe c'shokola",
    descriptionFr: 'Génoise chocolat, ganache.',
    descriptionEn: 'Chocolate sponge, ganache.',
    descriptionKr: 'Shokola, ganache.',
    price: 120000,
    imageUrl: IMG_CHOC,
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    categoryId: 'cat_pastry',
    nameFr: 'Tarte aux fruits rouges',
    nameEn: 'Red berry tart',
    nameKr: 'Tarte',
    descriptionFr: 'Pâte sablée, crème et fruits frais.',
    descriptionEn: 'Shortcrust, cream and fresh fruit.',
    descriptionKr: 'Ifarishi.',
    price: 45000,
    imageUrl: IMG_FRUIT,
  },
]

export const INVENTORY_ITEMS = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    nameFr: 'Farine',
    nameEn: 'Flour',
    nameKr: 'Ifu',
    quantityLabel: '12 kg',
    status: 'ok',
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    nameFr: 'Sucre',
    nameEn: 'Sugar',
    nameKr: 'Isukari',
    quantityLabel: '5 kg',
    status: 'low',
  },
]
