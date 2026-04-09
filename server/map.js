export function rowCategory(r) {
  return {
    id: r.id,
    nameFr: r.name_fr,
    nameEn: r.name_en,
    nameKr: r.name_kr,
  }
}

export function rowCake(r) {
  return {
    id: r.id,
    categoryId: r.category_id,
    nameFr: r.name_fr,
    nameEn: r.name_en,
    nameKr: r.name_kr,
    descriptionFr: r.description_fr,
    descriptionEn: r.description_en,
    descriptionKr: r.description_kr,
    price: Number(r.price),
    imageUrl: r.image_url,
  }
}

export function rowOrder(r) {
  return {
    id: r.id,
    customerName: r.customer_name,
    customerPhone: r.customer_phone,
    total: Number(r.total),
    status: r.status,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
    deliveryDate: r.delivery_date
      ? r.delivery_date instanceof Date
        ? r.delivery_date.toISOString().slice(0, 10)
        : String(r.delivery_date).slice(0, 10)
      : undefined,
    items: typeof r.items === 'string' ? r.items : JSON.stringify(r.items),
  }
}

export function rowInventory(r) {
  return {
    id: r.id,
    nameFr: r.name_fr,
    nameEn: r.name_en,
    nameKr: r.name_kr,
    quantityLabel: r.quantity_label,
    status: r.status,
  }
}
