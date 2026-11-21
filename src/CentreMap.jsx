import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { mapDirections } from './access.js'
import { useLocale } from './locale.jsx'

const centres = [
  { id: 'bhuj', locality: 'Bhuj', district: 'Kutch', pin: '370001', point: [23.25, 69.67], services: 'Assisted registration, listing review, and demo collection.' },
  { id: 'mandvi', locality: 'Mandvi', district: 'Kutch', pin: '370465', point: [22.83, 69.35], services: 'Product photography guidance and listing assistance.' },
  { id: 'patan', locality: 'Patan', district: 'Patan', pin: '384265', point: [23.85, 72.13], services: 'Assisted registration, pricing guidance, and printouts.' },
]

export default function CentreMap({ query }) {
  const { language, t } = useLocale()
  const host = useRef(null)
  const map = useRef(null)
  const [selectedId, setSelectedId] = useState('')
  const [tileError, setTileError] = useState(false)
  const matches = centres.filter(centre =>
    [centre.locality, centre.district, centre.pin].join(' ').toLowerCase().includes(query.trim().toLowerCase()))
  const selected = matches.find(centre => centre.id === selectedId)

  useEffect(() => {
    const instance = L.map(host.current, { scrollWheelZoom: false, zoomAnimation: false }).setView([23.4, 70.7], 7)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).on('tileerror', () => setTileError(true)).addTo(instance)
    map.current = instance
    return () => instance.remove()
  }, [])

  useEffect(() => {
    const instance = map.current
    const markers = L.layerGroup().addTo(instance)
    for (const centre of matches) {
      const marker = L.marker(centre.point, {
        title: centre.locality, alt: centre.locality,
        icon: L.divIcon({ className: 'centre-pin', iconSize: [24, 24], iconAnchor: [12, 12] }),
      }).addTo(markers)
      const label = document.createElement('strong')
      label.textContent = centre.locality + ' · ' + t('Demo centre')
      marker.bindTooltip(label)
      marker.on('click', () => setSelectedId(centre.id))
    }
    if (matches.length) instance.fitBounds(matches.map(centre => centre.point), { padding: [28, 28], maxZoom: 12 })
    return () => markers.remove()
  }, [query, language])

  useEffect(() => {
    if (selected) map.current.setView(selected.point, 12)
  }, [selected])

  return (
    <>
      <p>{t('Sample centres are marked at locality level. Confirm real addresses and hours through the external directory.')}</p>
      <div className="centre-map" ref={host} aria-label={t('Interactive centre map')} />
      {tileError && <p>{t('Map tiles are unavailable. Centre pins, cards and directions links are still available.')}</p>}
      <div className="centre-results">
        {!matches.length && <p>{t('No sample centres match. Use the external search for more locations.')}</p>}
        {matches.map(centre => (
          <article className="card" key={centre.id}>
            <h3>{centre.locality} · {t('Demo centre')}</h3>
            <p>{centre.district}, Gujarat {centre.pin}</p>
            <p>{t(centre.services)}</p>
            <p>{t('Hours and contact details: confirm with the actual centre.')}</p>
            <div className="access-actions">
              <button type="button" className="secondary" aria-pressed={centre.id === selectedId} onClick={() => setSelectedId(centre.id)}>{t('Show on map')}</button>
              <a target="_blank" rel="noopener noreferrer" href={mapDirections(centre.locality + ', Gujarat ' + centre.pin)}>{t('Directions to locality')}</a>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
