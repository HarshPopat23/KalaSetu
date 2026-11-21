import assert from 'node:assert/strict'
import test from 'node:test'
import { acceptOffer, inventory, seed, submitOffer } from '../src/purchase.js'
import { allocateStock, inspectedPayout, markPaid, recordCollection, recordInspection, resaleChannel, restoreOrders, scheduleCollection, updateOrder } from '../src/fulfilment.js'

const offer = { id: 'offer-1', productId: 'bandhani', buyerId: 'buyer-1', quantity: 5, unitPrice: 45000, deduction: 10001 }
const accepted = acceptOffer(submitOffer(seed, offer), offer.id)
const [order] = accepted.orders
const today = new Date(2030, 0, 1)

function collectedOrder() {
  return recordCollection(scheduleCollection(order, '2030-01-02', today))
}

test('acceptance creates one order and legacy accepted offers restore once', () => {
  assert.equal(accepted.orders.length, 1)
  assert.deepEqual(order, offer)
  const legacy = { products: accepted.products, offers: accepted.offers }
  const restored = restoreOrders(legacy)
  assert.deepEqual(restored.orders, [order])
  assert.equal(restoreOrders(restored), restored)
  assert.throws(() => acceptOffer(accepted, offer.id), /pending/)
  assert.equal(restoreOrders(submitOffer({ ...legacy, offers: [] }, offer)).orders.length, 0)
})

test('only the owning buyer can advance an order in collection and inspection sequence', () => {
  assert.throws(() => updateOrder(accepted, offer.id, 'buyer-2', recordCollection), /buyer/)
  assert.throws(() => recordCollection(order), /scheduled/)
  assert.throws(() => scheduleCollection(order, '2029-12-31', today), /future/)
  assert.throws(() => scheduleCollection(order, '2030-02-30', today), /valid/)
  const scheduled = scheduleCollection(order, '2030-01-01', today)
  assert.throws(() => scheduleCollection(scheduled, '2030-01-02', today), /already/)
  assert.throws(() => recordInspection(scheduled, 5, ''), /Collect/)
  assert.throws(() => recordCollection(collectedOrder()), /pending/)
  assert.throws(() => recordInspection(collectedOrder(), 6, ''), /quantity/)
  assert.throws(() => recordInspection(collectedOrder(), 3, ' '), /Explain/)
})

test('partial inspection prorates money, preserves stock, and allocates accepted units exactly once', () => {
  const inspected = recordInspection(collectedOrder(), 3, 'Damaged stitching')
  assert.equal(inspectedPayout(inspected), 128999)
  const product = accepted.products[0]
  const state = updateOrder(accepted, order.id, order.buyerId, () => inspected)
  assert.deepEqual(inventory(state, product), { available: 25, reserved: 0, purchased: 3, rejected: 2 })
  assert.throws(() => markPaid(order), /unpaid/)
  assert.throws(() => allocateStock(inspected), /settled/)
  assert.throws(() => recordInspection(inspected, 5, ''), /first/)
  const paid = markPaid(inspected)
  assert.throws(() => markPaid(paid), /unpaid/)
  const allocated = allocateStock(paid)
  assert.deepEqual(allocated.allocation, { channel: resaleChannel, quantity: 3 })
  assert.throws(() => allocateStock(allocated), /unallocated/)
})

test('full rejection has no payout or resale stock and full approval pays the agreed amount', () => {
  const rejected = recordInspection(collectedOrder(), 0, 'All damaged')
  assert.equal(inspectedPayout(rejected), 0)
  assert.throws(() => markPaid(rejected), /positive/)
  assert.throws(() => allocateStock(rejected), /accepted/)
  assert.equal(inspectedPayout(recordInspection(collectedOrder(), 5, '')), 214999)
})
