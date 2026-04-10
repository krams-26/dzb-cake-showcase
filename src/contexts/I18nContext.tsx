import React, { createContext, useContext, useState, ReactNode } from 'react'

export type Language = 'fr' | 'en' | 'kr'

interface Translations {
  [key: string]: {
    [L in Language]: string
  }
}

export const translations: Translations = {
  'nav.home': { fr: 'Accueil', en: 'Home', kr: 'Umuhango' },
  'nav.menu': { fr: 'Menu', en: 'Menu', kr: 'Urutonde' },
  'nav.cakes': { fr: 'Nos Gâteaux', en: 'Our Cakes', kr: 'Ibikozwe' },
  'nav.dashboard': { fr: 'Tableau de bord', en: 'Dashboard', kr: 'Ahashikirizwa' },
  'nav.login': { fr: 'Connexion', en: 'Login', kr: 'Injira' },
  'nav.staffLogin': { fr: 'Espace équipe', en: 'Staff login', kr: 'Abakozi' },
  'nav.logout': { fr: 'Déconnexion', en: 'Logout', kr: 'Sohoka' },
  'staff.roleAdmin': { fr: 'Administrateur', en: 'Administrator', kr: 'Umuyobozi' },
  'staff.roleStaff': { fr: 'Équipe', en: 'Staff', kr: 'Umukozi' },
  'login.title': { fr: 'Connexion personnel', en: 'Staff sign in', kr: 'Kwinjira abakozi' },
  'login.email': { fr: 'E-mail', en: 'Email', kr: 'Imeri' },
  'login.password': { fr: 'Mot de passe', en: 'Password', kr: 'Ijambo ry\'ibanga' },
  'login.submit': { fr: 'Se connecter', en: 'Sign in', kr: 'Injira' },
  'login.pending': { fr: 'Connexion…', en: 'Signing in…', kr: 'Uri kwinjira…' },
  'login.error': { fr: 'Connexion impossible', en: 'Could not sign in', kr: 'Ntibishobotse kwinjira' },
  'hero.title': {
    fr: 'DzB Cake - Le goût de Bujumbura',
    en: 'DzB Cake - The Taste of Bujumbura',
    kr: 'DzB Cake - Akaranga k\'i Bujumbura',
  },
  'hero.subtitle': {
    fr: 'Des gâteaux d\'exception pour tous vos moments précieux.',
    en: 'Exceptional cakes for all your precious moments.',
    kr: 'Ibisuguti vy\'akarorero mu bihe vyanyu vyose.',
  },
  'hero.cta': { fr: 'Commander maintenant', en: 'Order Now', kr: 'Tumako ubu' },
  'hero.location': { fr: 'Bujumbura', en: 'Bujumbura', kr: 'Bujumbura' },
  'categories.title': { fr: 'Nos Catégories', en: 'Our Categories', kr: 'Imice yacu' },
  'categories.seeMore': { fr: 'Voir plus', en: 'See more', kr: 'Raba ibindi' },
  'about.title': {
    fr: 'L\'Art de la Pâtisserie à Bujumbura',
    en: 'The Art of Pastry in Bujumbura',
    kr: 'Ubushobozi bwo gukora ibisuguti i Bujumbura',
  },
  'about.quote': {
    fr: 'Chez DzB Cake, nous croyons que chaque gâteau raconte une histoire. Notre mission est de rendre vos célébrations inoubliables grâce à des créations uniques, faites avec passion au cœur de Bujumbura.',
    en: 'At DzB Cake, we believe every cake tells a story. Our mission is to make your celebrations unforgettable with unique creations, made with passion in the heart of Bujumbura.',
    kr: 'Kuri DzB Cake, twizera ko igisuguti cose gifise inkuru. Intumbero yacu ni ukugira ibirori vyanyu bitazibagirana.',
  },
  'about.bullet1': { fr: 'Ingrédients frais et locaux', en: 'Fresh, local ingredients', kr: 'Ibikoresho bishasha kandi biva hafi' },
  'about.bullet2': {
    fr: 'Designs personnalisés selon vos envies',
    en: 'Custom designs to match your vision',
    kr: 'Imiterere yo guhitamo ukunda',
  },
  'about.bullet3': {
    fr: 'Livraison rapide dans tout Bujumbura',
    en: 'Fast delivery across Bujumbura',
    kr: 'Kohereza vuba muri Bujumbura yose',
  },
  'about.cta': { fr: 'Notre Histoire', en: 'Our Story', kr: 'Inkuru yacu' },
  'about.artisan': { fr: 'Artisanal', en: 'Handcrafted', kr: 'Akazi k\'ubwenge' },
  'cakes.subtitle': {
    fr: 'Découvrez nos délices sucrés pour toutes vos occasions.',
    en: 'Discover our sweet treats for every occasion.',
    kr: 'Menya ibisuguti vyacu ku bihe vyose.',
  },
  'cakes.searchPlaceholder': { fr: 'Rechercher un gâteau...', en: 'Search for a cake...', kr: 'Shakisha igisuguti...' },
  'cakes.all': { fr: 'Tous', en: 'All', kr: 'Byose' },
  'cakes.order': { fr: 'Commander', en: 'Order', kr: 'Tumako' },
  'cakes.emptyTitle': { fr: 'Aucun gâteau trouvé', en: 'No cakes found', kr: 'Nta bisuguti bibonetse' },
  'cakes.emptyDesc': {
    fr: 'Essayez de modifier vos filtres ou votre recherche.',
    en: 'Try changing your filters or search.',
    kr: 'Gerageza guhindura uko urondera.',
  },
  'cakes.showAll': { fr: 'Tout afficher', en: 'Show all', kr: 'Erekana byose' },
  'order.title': { fr: 'Commander', en: 'Place order', kr: 'Tumako' },
  'order.name': { fr: 'Nom complet', en: 'Full name', kr: 'Izina ryuzuye' },
  'order.phone': { fr: 'Téléphone', en: 'Phone', kr: 'Telefone' },
  'order.qty': { fr: 'Quantité', en: 'Quantity', kr: 'Umubare' },
  'order.date': { fr: 'Date de livraison souhaitée', en: 'Preferred delivery date', kr: 'Itariki yo kohereza' },
  'order.note': { fr: 'Note (optionnel)', en: 'Note (optional)', kr: 'Ikindi (si ngombwa)' },
  'order.submit': { fr: 'Envoyer la commande', en: 'Submit order', kr: 'Ohereza' },
  'order.cancel': { fr: 'Annuler', en: 'Cancel', kr: 'Hagarika' },
  'order.success': { fr: 'Commande enregistrée !', en: 'Order placed!', kr: 'Itumwa ryanditswe!' },
  'order.error': { fr: 'Impossible d\'envoyer la commande', en: 'Could not place order', kr: 'Ntibishobotse kohereza' },
  'order.confirmedTitle': { fr: 'Merci pour votre commande !', en: 'Thank you for your order!', kr: 'Murakoze ku mutumwa!' },
  'order.confirmedBody': {
    fr: 'Nous vous contacterons bientôt pour confirmer la livraison.',
    en: 'We will contact you soon to confirm delivery.',
    kr: 'Tuzobabona vuba kugira tuboneye kohereza.',
  },
  'order.backCatalog': { fr: 'Retour au catalogue', en: 'Back to catalog', kr: 'Subira ku bisuguti' },
  'order.backHome': { fr: 'Accueil', en: 'Home', kr: 'Ahabanza' },
  'cake.notFound': { fr: 'Gâteau introuvable', en: 'Cake not found', kr: 'Nta suguti ribonetse' },
  'cake.backToCatalog': { fr: 'Retour aux gâteaux', en: 'Back to cakes', kr: 'Subira ku bisuguti' },
  'cake.viewDetail': { fr: 'Voir la fiche', en: 'View details', kr: 'Raba birambuye' },
  'dashboard.inventoryFallback': {
    fr: 'Données inventaire via l’API (connecté en tant qu’équipe).',
    en: 'Inventory data from the API (signed in as staff).',
    kr: 'Amakuru ya stock biva kuri API (winjiye nk’umukozi).',
  },
  'dashboard.desc': { fr: 'Gérez DzB Cake au quotidien.', en: 'Run DzB Cake day to day.', kr: 'Genzura DzB Cake buri munsi.' },
  'dashboard.newCake': { fr: 'Nouveau gâteau', en: 'New cake', kr: 'Igipya c\'isuguti' },
  'dashboard.revenue': { fr: 'Revenu total', en: 'Total revenue', kr: 'Amafaranga yose' },
  'dashboard.revenueTrend': { fr: 'vs mois dernier', en: 'vs last month', kr: 'kuruta ukwezi kwaheruka' },
  'dashboard.pendingOrders': { fr: 'Commandes en cours', en: 'Active orders', kr: 'Ibipfunyitse' },
  'dashboard.cakeCount': { fr: 'Total gâteaux', en: 'Total cakes', kr: 'Umubare w\'ibisuguti' },
  'dashboard.tab.overview': { fr: 'Aperçu', en: 'Overview', kr: 'Incamake' },
  'dashboard.tab.orders': { fr: 'Commandes', en: 'Orders', kr: 'Amatumwa' },
  'dashboard.tab.inventory': { fr: 'Inventaire / Marché', en: 'Inventory / Market', kr: 'Ibintu / isoko' },
  'dashboard.tab.catalog': { fr: 'Catalogue gâteaux', en: 'Cake catalog', kr: 'Urutonde rw\'ibisuguti' },
  'dashboard.urgent': { fr: 'Urgent', en: 'Urgent', kr: 'Byihutirwa' },
  'dashboard.urgentCount': {
    fr: '{n} commande(s) attendent votre attention.',
    en: '{n} order(s) need your attention.',
    kr: 'Amatumwa {n} akeneye kwitaho.',
  },
  'dashboard.viewOrders': { fr: 'Voir les commandes', en: 'View orders', kr: 'Raba amatumwa' },
  'dashboard.marketTitle': { fr: 'Le marché du jour', en: 'Today\'s market', kr: 'Isoko ry\'uyu musi' },
  'dashboard.marketDesc': {
    fr: 'Suivez vos ingrédients et le stock de la maison.',
    en: 'Track ingredients and in-house stock.',
    kr: 'Kurikirana ibikoresho n\'ibisigaye.',
  },
  'dashboard.manageMarket': { fr: 'Gérer le marché', en: 'Manage market', kr: 'Genzura isoko' },
  'dashboard.statusUpdated': { fr: 'Statut mis à jour', en: 'Status updated', kr: 'Imiterere yahindutse' },
  'dashboard.col.client': { fr: 'Client', en: 'Customer', kr: 'Umukiriya' },
  'dashboard.col.total': { fr: 'Total', en: 'Total', kr: 'Igiteranyo' },
  'dashboard.col.status': { fr: 'Statut', en: 'Status', kr: 'Imiterere' },
  'dashboard.col.date': { fr: 'Date', en: 'Date', kr: 'Itariki' },
  'dashboard.status.pending': { fr: 'En attente', en: 'Pending', kr: 'Bitegereje' },
  'dashboard.status.preparing': { fr: 'Préparation', en: 'Preparing', kr: 'Bitegurwa' },
  'dashboard.status.ready': { fr: 'Prêt', en: 'Ready', kr: 'Biteguye' },
  'dashboard.status.delivered': { fr: 'Livré', en: 'Delivered', kr: 'Byarungitswe' },
  'dashboard.status.cancelled': { fr: 'Annulé', en: 'Cancelled', kr: 'Byahagaritswe' },
  'dashboard.action.prepare': { fr: 'Préparer', en: 'Prepare', kr: 'Tezura' },
  'dashboard.action.ready': { fr: 'Prêt', en: 'Mark ready', kr: 'Tunganya' },
  'dashboard.ordersEmptyTitle': { fr: 'Aucune commande', en: 'No orders yet', kr: 'Nta matumwa' },
  'dashboard.ordersEmptyDesc': {
    fr: 'Les commandes apparaîtront ici dès qu\'un client passera une commande.',
    en: 'Orders will show here when customers place them.',
    kr: 'Amatumwa azohagarara hano igihe abakiriya batumye.',
  },
  'dashboard.inventoryTitle': { fr: 'Inventaire (aperçu)', en: 'Inventory (preview)', kr: 'Ibintu (incamake)' },
  'dashboard.inventoryDesc': {
    fr: 'Suivi des ingrédients (table MySQL `inventory_items`, réservé au personnel).',
    en: 'Ingredient tracking (MySQL `inventory_items` table, staff only).',
    kr: 'Gukurikirana ibikoresho (MySQL, abakozi gusa).',
  },
  'dashboard.chart.title': { fr: 'Commandes (7 jours)', en: 'Orders (7 days)', kr: 'Amatumwa (imisi 7)' },
  'dashboard.chart.empty': { fr: 'Pas encore assez de données', en: 'Not enough data yet', kr: 'Nta makuru ahagije' },
  'dashboard.editCake': { fr: 'Modifier', en: 'Edit', kr: 'Guhindura' },
  'dashboard.deleteCake': { fr: 'Supprimer', en: 'Delete', kr: 'Gusiba' },
  'dashboard.cakeSaved': { fr: 'Gâteau enregistré', en: 'Cake saved', kr: 'Isuguti ryabitswe' },
  'dashboard.cakeDeleted': { fr: 'Gâteau supprimé', en: 'Cake deleted', kr: 'Isuguti ryasibwe' },
  'dashboard.sidebar.quick': { fr: 'Raccourcis', en: 'Shortcuts', kr: 'Inzira ngufi' },
  'dashboard.sidebar.ordersHint': {
    fr: 'Utilisez l’onglet Commandes dans le tableau de bord',
    en: 'Use the Orders tab in the dashboard',
    kr: 'Koresha urupapuro rw\'amatumwa',
  },
  'footer.contact': { fr: 'Contact', en: 'Contact', kr: 'Twandikire' },
  'footer.phone': { fr: '+257 69 00 00 00', en: '+257 69 00 00 00', kr: '+257 69 00 00 00' },
  'footer.email': { fr: 'contact@dzbcake.bi', en: 'contact@dzbcake.bi', kr: 'contact@dzbcake.bi' },
  'footer.addressLine1': { fr: 'Bujumbura, Burundi', en: 'Bujumbura, Burundi', kr: 'Bujumbura, Burundi' },
  'footer.addressLine2': {
    fr: 'Kamenge, 15e Avenue',
    en: 'Kamenge, 15th Avenue',
    kr: 'Kamenge, 15e Avenue',
  },
  'footer.newsletter': { fr: 'Newsletter', en: 'Newsletter', kr: 'Amakuru' },
  'footer.newsletterDesc': {
    fr: 'Restez informé de nos nouvelles créations et offres spéciales.',
    en: 'Hear about new creations and special offers.',
    kr: 'Menya ibipya n\'ingorane nziza.',
  },
  'footer.emailPlaceholder': { fr: 'Votre email', en: 'Your email', kr: 'Imeri yawe' },
  'footer.subscribe': { fr: 'S\'inscrire', en: 'Subscribe', kr: 'Iyandikishe' },
  'footer.subscribeSuccess': {
    fr: 'Merci ! Vous êtes inscrit à la newsletter.',
    en: 'Thanks! You are subscribed to our newsletter.',
    kr: 'Murakoze! Wanditswe ku makuru.',
  },
  'footer.subscribeInvalid': {
    fr: 'Veuillez entrer une adresse e-mail valide.',
    en: 'Please enter a valid email address.',
    kr: 'Andika imeri yemewe.',
  },
  'footer.credit': { fr: 'Made By Krams', en: 'Made By Krams', kr: 'Made By Krams' },
  'footer.rights': {
    fr: 'Tous droits réservés.',
    en: 'All rights reserved.',
    kr: 'Uburenganzira bwose burabitswe.',
  },
  'loading.app': { fr: 'Chargement de DzB Cake...', en: 'Loading DzB Cake...', kr: 'Gupakira DzB Cake...' },
  'dashboard.cakeForm.titleNew': { fr: 'Nouveau gâteau', en: 'New cake', kr: 'Isuguti nshasha' },
  'dashboard.cakeForm.titleEdit': { fr: 'Modifier le gâteau', en: 'Edit cake', kr: 'Guhindura isuguti' },
  'dashboard.cakeForm.category': { fr: 'Catégorie', en: 'Category', kr: 'Icyiciro' },
  'dashboard.cakeForm.nameFr': { fr: 'Nom (FR)', en: 'Name (FR)', kr: 'Izina (FR)' },
  'dashboard.cakeForm.nameEn': { fr: 'Nom (EN)', en: 'Name (EN)', kr: 'Izina (EN)' },
  'dashboard.cakeForm.nameKr': { fr: 'Nom (KR)', en: 'Name (KR)', kr: 'Izina (KR)' },
  'dashboard.cakeForm.descFr': { fr: 'Description (FR)', en: 'Description (FR)', kr: 'Ibisobanuro (FR)' },
  'dashboard.cakeForm.descEn': { fr: 'Description (EN)', en: 'Description (EN)', kr: 'Ibisobanuro (EN)' },
  'dashboard.cakeForm.descKr': { fr: 'Description (KR)', en: 'Description (KR)', kr: 'Ibisobanuro (KR)' },
  'dashboard.cakeForm.price': { fr: 'Prix (BIF)', en: 'Price (BIF)', kr: 'Igiciro (BIF)' },
  'dashboard.cakeForm.imageUrl': { fr: 'URL image', en: 'Image URL', kr: 'URL y\'ishusho' },
  'dashboard.cakeForm.save': { fr: 'Enregistrer', en: 'Save', kr: 'Bika' },
  'dashboard.cakeForm.cancel': { fr: 'Fermer', en: 'Close', kr: 'Funga' },
  'dashboard.inventory.col.item': { fr: 'Article', en: 'Item', kr: 'Ikintu' },
  'dashboard.inventory.col.qty': { fr: 'Stock', en: 'Stock', kr: 'Umubare' },
  'dashboard.inventory.col.status': { fr: 'État', en: 'Status', kr: 'Imiterere' },
  'dashboard.inv.ok': { fr: 'Disponible', en: 'In stock', kr: 'Bihari' },
  'dashboard.inv.low': { fr: 'Stock bas', en: 'Low stock', kr: 'Bike' },
  'inv.flour': { fr: 'Farine', en: 'Flour', kr: 'Ifu' },
  'inv.flour.qty': { fr: '12 kg', en: '12 kg', kr: '12 kg' },
  'inv.butter': { fr: 'Beurre', en: 'Butter', kr: 'Amavuta' },
  'inv.butter.qty': { fr: '8 kg', en: '8 kg', kr: '8 kg' },
  'inv.sugar': { fr: 'Sucre', en: 'Sugar', kr: 'Isukari' },
  'inv.sugar.qty': { fr: '5 kg', en: '5 kg', kr: '5 kg' },
  'inv.chocolate': { fr: 'Chocolat', en: 'Chocolate', kr: 'Shokola' },
  'inv.chocolate.qty': { fr: '3 kg', en: '3 kg', kr: '3 kg' },
  'dashboard.confirmDelete': {
    fr: 'Supprimer ce gâteau ?',
    en: 'Delete this cake?',
    kr: 'Gusiba iryo suguti?',
  },
  'lang.fr': { fr: 'Français', en: 'French', kr: 'Igifaransa' },
  'lang.en': { fr: 'Anglais', en: 'English', kr: 'Icongereza' },
  'lang.kr': { fr: 'Kirundi', en: 'Kirundi', kr: 'Ikirundi' },
}

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr')

  const t = (key: string): string => {
    return translations[key]?.[language] || key
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}
