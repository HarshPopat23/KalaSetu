export const resaleChannel = 'KalaSetu Craft Exhibition'

export function createOrder(offer) {
  const { id, productId, buyerId, quantity, unitPrice, deduction } = offer
  return { id, productId, buyerId, quantity, unitPrice, deduction }
}

export function restoreOrders(state) {
  if (Array.isArray(state.orders)) return state
  return { ...state, orders: state.offers.filter(offer => offer.status === 'accepted').map(createOrder) }
}

export function inspectedPayout(order) {
  const accepted = BigInt(order.inspection.accepted)
  const quantity = BigInt(order.quantity)
  // Round the pro-rata deduction to the nearest paise, with ties rounded up.
  const deduction = (BigInt(order.deduction) * accepted * 2n + quantity) / (quantity * 2n)
  return Number(accepted * BigInt(order.unitPrice) - deduction)
}

export function scheduleCollection(order, date, now = new Date()) {
  if (order.collectionDate) throw new Error('Collection is already scheduled.')
  const parsed = new Date(date + 'T00:00:00Z')
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(parsed.getTime()) ||
      parsed.toISOString().slice(0, 10) !== date) {
    throw new Error('Choose a valid collection date.')
  }
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  if (date < today) throw new Error('Choose today or a future date for collection.')
  return { ...order, collectionDate: date }
}

export function recordCollection(order) {
  if (!order.collectionDate || order.collected) throw new Error('Collection must be scheduled and pending.')
  return { ...order, collected: true }
}

export function recordInspection(order, accepted, reason) {
  if (!order.collected || order.inspection) throw new Error('Collect the order before recording its first inspection.')
  if (!Number.isSafeInteger(accepted) || accepted < 0 || accepted > order.quantity) {
    throw new Error('Enter an accepted quantity within the order size.')
  }
  const rejected = order.quantity - accepted
  const note = reason.trim()
  if (rejected > 0 && !note) throw new Error('Explain why the remaining pieces were rejected.')
  return { ...order, inspection: { accepted, rejected, reason: rejected > 0 ? note : '' } }
}

export function markPaid(order) {
  if (!order.inspection || order.paid || inspectedPayout(order) <= 0) {
    throw new Error('Only a positive, unpaid inspection payout can be recorded.')
  }
  return { ...order, paid: true }
}

export function allocateStock(order) {
  if (!order.inspection?.accepted || order.allocation || (!order.paid && inspectedPayout(order) > 0)) {
    throw new Error('Only unallocated, accepted stock with a settled payout can be allocated.')
  }
  return { ...order, allocation: { channel: resaleChannel, quantity: order.inspection.accepted } }
}

export function updateOrder(state, orderId, buyerId, change) {
  const order = state.orders?.find(item => item.id === orderId)
  if (!order || order.buyerId !== buyerId) throw new Error('Choose an order for this buyer.')
  const updated = change(order)
  return { ...state, orders: state.orders.map(item => item.id === orderId ? updated : item) }
}
