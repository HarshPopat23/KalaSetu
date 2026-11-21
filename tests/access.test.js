import assert from 'node:assert/strict'
import test from 'node:test'
import { mapDirections, mapSearch, ownerOf, profiles, registerArtisan } from '../src/access.js'
import { messages } from '../src/messages.js'
import { artisan, seed } from '../src/purchase.js'

test('assisted registration keeps the seeded artisan and assigns listed work to its owner', () => {
  const entered = { id: 'test', name: ' Reva ', location: ' Mandvi ', language: 'gu', consent: true }
  assert.throws(() => registerArtisan(seed, { ...entered, consent: false }), /consent/)
  assert.throws(() => registerArtisan(seed, { ...entered, name: ' ' }), /name/)
  const state = registerArtisan(seed, entered)
  assert.equal(profiles(state).length, 2)
  assert.equal(ownerOf(state, seed.products[0]), artisan)
  assert.deepEqual(ownerOf(state, { artisanId: 'test' }), { id: 'test', name: 'Reva', location: 'Mandvi', language: 'gu' })
  assert.equal(profiles(seed).length, 1)
})

test('map links safely encode locality and address into their intended parameters', () => {
  const search = new URL(mapSearch(' ભુજ & 370001 ', 'Common Service Centre'))
  assert.equal(search.origin, 'https://www.google.com')
  assert.equal(search.pathname, '/maps/search/')
  assert.equal(search.searchParams.get('api'), '1')
  assert.equal(search.searchParams.get('query'), 'Common Service Centre near ભુજ & 370001, India')
  const directions = new URL(mapDirections('CSC, Station Road #2'))
  assert.equal(directions.pathname, '/maps/dir/')
  assert.equal(directions.searchParams.get('destination'), 'CSC, Station Road #2')
  assert.equal(directions.hash, '')
})

test('translation entries provide both languages and preserve interpolation tokens', () => {
  const tokens = value => [...value.matchAll(/\{(\w+)\}/g)].map(match => match[1]).sort()
  for (const [key, { hi, gu }] of Object.entries(messages)) {
    assert.ok(hi && gu, key)
    assert.deepEqual(tokens(hi), tokens(key), key)
    assert.deepEqual(tokens(gu), tokens(key), key)
  }
})
