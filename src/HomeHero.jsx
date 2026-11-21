import React, { useEffect, useState } from 'react'
import { photos } from './docs/photos.js'
import { useLocale } from './locale.jsx'
import portrait from './images/modi-portrait.webp'

const slides = [photos.potter, photos.bandhani, photos.lamps]
const interval = 2000
const motionQuery = '(prefers-reduced-motion: reduce)'

export default function HomeHero() {
  const { t } = useLocale()
  const [slide, setSlide] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia(motionQuery).matches)

  useEffect(() => {
    const media = window.matchMedia(motionQuery)
    const onChange = event => setReducedMotion(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const timer = window.setTimeout(() => setSlide(prev => (prev + 1) % slides.length), interval)
    return () => window.clearTimeout(timer)
  }, [reducedMotion, slide])

  return (
    <section className="home-hero" aria-labelledby="home-title">
      <div className="home-hero-photos" aria-hidden="true">
        {slides.map((photo, index) => (
          <img
            key={photo.src}
            className={index === slide ? 'is-active' : undefined}
            src={photo.src}
            alt=""
            decoding="async"
          />
        ))}
      </div>
      <div className="home-hero-copy">
        <h1 id="home-title">KalaSetu</h1>
        <p className="home-hero-lead">{t('A path from the workshop to the buyer')}</p>
        <p>{t('Prepare a craft listing with Kendra assistance, compare purchase offers, and follow the order through collection, inspection, and payout.')}</p>
        <p className="home-hero-note">{t('Independent college prototype. Government participation and payments are simulated.')}</p>
        <div className="home-hero-actions">
          <a href="#demo">{t('Open the demo')}</a>
          <a href="#docs">{t('Read the documentation')}</a>
        </div>
      </div>
      <figure className="home-hero-portrait">
        <img src={portrait} width={337} height={398} alt={t('Portrait of Narendra Modi')} />
      </figure>
    </section>
  )
}
