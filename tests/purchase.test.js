import assert from 'node:assert/strict'
import test from 'node:test'
import { acceptOffer, buyers, createDraft, inventory, payout, publishProduct, seed, submitOffer } from '../src/purchase.js'

const first = { id: 'first', buyerId: buyers[0].id, productId: 'baskets', quantity: 5, unitPrice: 32000, deduction: 0 }
const second = { ...first, id: 'second', buyerId: buyers[1].id, quantity: 10, unitPrice: 33000, deduction: 11000 }

test('a Kendra draft can be published before receiving buyer offers', () => {
  assert.throws(() => submitOffer(seed, first), /published/)
  const drafted = createDraft(seed, { id: 'new', name: ' Clay pots ', category: ' Pottery ', stock: 8, askingPrice: 15000 })
  assert.equal(drafted.products.at(-1).name, 'Clay pots')
  assert.equal(drafted.products.at(-1).status, 'draft')
  assert.equal(publishProduct(drafted, 'new').products.at(-1).status, 'published')
  assert.throws(() => createDraft(seed, { name: ' ', category: 'Pottery', stock: 8, askingPrice: 15000 }), /product name/)
})

test('competing offers show net payout and acceptance reserves only the offered quantity', () => {
  const published = publishProduct(seed, 'baskets')
  const withOffers = submitOffer(submitOffer(published, first), second)
  const baskets = published.products.find(item => item.id === 'baskets')
  assert.equal(payout(second), 319000)
  assert.deepEqual(inventory(withOffers, baskets), { available: 12, reserved: 0, purchased: 0, rejected: 0 })
  const accepted = acceptOffer(withOffers, first.id)
  assert.deepEqual(inventory(accepted, baskets), { available: 7, reserved: 5, purchased: 0, rejected: 0 })
  assert.throws(() => acceptOffer(accepted, first.id), /pending/)
  assert.throws(() => acceptOffer(accepted, second.id), /remaining stock/)
  const remainder = { ...second, id: 'remaining', quantity: 7 }
  const soldOut = acceptOffer(submitOffer(accepted, remainder), remainder.id)
  assert.deepEqual(inventory(soldOut, baskets), { available: 0, reserved: 12, purchased: 0, rejected: 0 })
  assert.deepEqual(inventory(soldOut, published.products[0]), { available: 30, reserved: 0, purchased: 0, rejected: 0 })
})

test('offer validation rejects quantities, price, deductions, and buyers outside the allowed values', () => {
  const published = publishProduct(seed, 'baskets')
  for (const quantity of [0, -1, 1.5, 13]) {
    assert.throws(() => submitOffer(published, { ...first, quantity }), /quantity/)
  }
  for (const changes of [{ unitPrice: Infinity }, { unitPrice: 0 }, { deduction: -1 }, { deduction: 160000 }]) {
    assert.throws(() => submitOffer(published, { ...first, ...changes }), /deduction/)
  }
  assert.throws(() => submitOffer(published, { ...first, buyerId: 'unknown' }), /buyer/)
})
