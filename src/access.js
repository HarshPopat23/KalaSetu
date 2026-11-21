import { artisan } from './purchase.js'

export function profiles(state) {
  return state.artisans ?? [artisan]
}

export function ownerOf(state, product) {
  return profiles(state).find(profile => profile.id === (product.artisanId ?? artisan.id))
}

export function registerArtisan(state, { id, name, location, language, consent }) {
  if (!consent || !name.trim() || !location.trim() || !['en', 'hi', 'gu'].includes(language)) {
    throw new Error('Enter the artisan name and locality, choose a language, and confirm consent.')
  }
  return { ...state, artisans: [...profiles(state), { id, name: name.trim(), location: location.trim(), language }] }
}

export function mapSearch(locality, centreType) {
  const query = centreType + ' near ' + locality.trim() + ', India'
  return 'https://www.google.com/maps/search/?' + new URLSearchParams({ api: '1', query })
}

export function mapDirections(destination) {
  return 'https://www.google.com/maps/dir/?' + new URLSearchParams({ api: '1', destination: destination.trim() })
}
