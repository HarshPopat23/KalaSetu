import { createOrder, restoreOrders } from './fulfilment.js'

export const artisan = { id: 'artisan-1', name: 'Meera Rabari', location: 'Bhuj, Kutch' }
export const operator = { id: 'operator-1', name: 'Kiran Patel', centre: 'Bhuj Jan Suvidha Kendra' }
export const buyers = [
  { id: 'buyer-1', name: 'District Handicrafts Office' },
  { id: 'buyer-2', name: 'State Craft Emporium' },
]

export const seed = {
  products: [
    { id: 'bandhani', name: 'Bandhani dupattas', category: 'Textiles', stock: 30, askingPrice: 45000, status: 'published' },
    { id: 'embroidery', name: 'Embroidered pouches', category: 'Embroidery', stock: 18, askingPrice: 32000, status: 'published' },
    { id: 'baskets', name: 'Handwoven baskets', category: 'Basketry', stock: 12, askingPrice: 28000, status: 'draft' },
  ],
  offers: [],
  orders: [],
}

export function payout(offer) {
  return offer.quantity * offer.unitPrice - offer.deduction
}

export function inventory(state, product) {
  let available = product.stock
  let reserved = 0
  let purchased = 0
  let rejected = 0
  for (const order of restoreOrders(state).orders) {
    if (order.productId !== product.id) continue
    available -= order.quantity
    if (order.inspection) {
      purchased += order.inspection.accepted
      rejected += order.inspection.rejected
    } else {
      reserved += order.quantity
    }
  }
  return { available, reserved, purchased, rejected }
}

export function createDraft(state, product) {
  const name = product.name.trim()
  const category = product.category.trim()
  if (!name || !category || !Number.isSafeInteger(product.stock) || product.stock < 1 ||
      !Number.isSafeInteger(product.askingPrice) || product.askingPrice < 1 ||
      !Number.isSafeInteger(product.askingPrice * product.stock)) {
    throw new Error('Enter a product name, craft category, positive whole quantity, and valid price.')
  }
  return { ...state, products: [...state.products, { ...product, name, category, status: 'draft' }] }
}

export function publishProduct(state, productId) {
  const product = state.products.find(item => item.id === productId)
  if (product?.status !== 'draft') throw new Error('Choose a draft to publish.')
  return {
    ...state,
    products: state.products.map(item => item.id === productId ? { ...item, status: 'published' } : item),
  }
}

export const offerValidityDays = 7
const millisecondsPerDay = 86_400_000

export function isOfferExpired(offer, now = Date.now()) {
  return offer.status === 'pending' && Number.isFinite(offer.expiresAt) && now >= offer.expiresAt
}

export function submitOffer(state, offer, now = Date.now()) {
  const product = state.products.find(item => item.id === offer.productId)
  if (product?.status !== 'published') throw new Error('Choose a published product.')
  if (!buyers.some(buyer => buyer.id === offer.buyerId)) throw new Error('Choose a demo buyer.')
  if (!Number.isSafeInteger(offer.quantity) || offer.quantity < 1 ||
      offer.quantity > inventory(state, product).available) {
    throw new Error('Enter a whole quantity within the available stock.')
  }
  const gross = offer.quantity * offer.unitPrice
  if (!Number.isSafeInteger(offer.unitPrice) || offer.unitPrice < 1 ||
      !Number.isSafeInteger(gross) || !Number.isSafeInteger(offer.deduction) ||
      offer.deduction < 0 || offer.deduction >= gross) {
    throw new Error('Enter a valid unit price and a deduction smaller than the gross amount.')
  }
  const expiresAt = now + offerValidityDays * millisecondsPerDay
  return { ...state, offers: [...state.offers, { ...offer, status: 'pending', expiresAt }] }
}

export function acceptOffer(state, offerId, now = Date.now()) {
  const offer = state.offers.find(item => item.id === offerId)
  if (offer?.status !== 'pending') throw new Error('Only pending offers can be accepted.')
  if (isOfferExpired(offer, now)) throw new Error('This offer has expired.')
  const product = state.products.find(item => item.id === offer.productId)
  if (!product || offer.quantity > inventory(state, product).available) {
    throw new Error('The offer exceeds the remaining stock.')
  }
  return {
    ...state,
    offers: state.offers.map(item => item.id === offerId ? { ...item, status: 'accepted' } : item),
    orders: [...restoreOrders(state).orders, createOrder(offer)],
  }
}
