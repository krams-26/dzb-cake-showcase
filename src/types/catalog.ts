export interface CakeItem {
  id: string
  categoryId: string
  nameFr: string
  nameEn: string
  nameKr: string
  descriptionFr: string
  descriptionEn: string
  descriptionKr: string
  price: number
  imageUrl: string
}

export interface Category {
  id: string
  nameFr: string
  nameEn: string
  nameKr: string
}

export interface OrderRow {
  id: string
  customerName: string
  customerPhone: string
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  createdAt: string
  deliveryDate?: string
  items: string
}

/** Table `inventory_items` dans MySQL `dzb_cake` (voir scripts/mysql/dzb_cake_schema.sql). */
export interface InventoryItem {
  id: string
  nameFr: string
  nameEn: string
  nameKr: string
  quantityLabel: string
  status: 'ok' | 'low'
}
