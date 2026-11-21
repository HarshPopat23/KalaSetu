import React, { useEffect, useState } from 'react'
import { photos } from './docs/photos.js'
import { useLocale } from './locale.jsx'
import portrait from './images/modi-portrait.webp'

const slides = [photos.potter, photos.bandhani, photos.lamps]
const interval = 6000
const motionQuery = '(prefers-reduced-motion: reduce)'
const portraitSource = 'https://commons.wikimedia.org/wiki/File:Official_Photograph_of_Prime_Minister_Narendra_Modi_Portrait.png'
const portraitLicense = 'https://data.gov.in/sites/default/files/Gazette_Notification_OGDL.pdf'

export default function HomeHero() {
  const { t } = useLocale()
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia(motionQuery).matches)

  useEffect(() => {
    const media = window.matchMedia(motionQuery)
    const onChange = event => setReducedMotion(event.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (paused || reducedMotion) return
    const timer = window.setTimeout(() => setSlide((slide + 1) % slides.length), interval)
    return () => window.clearTimeout(timer)
  }, [paused, reducedMotion, slide])

  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-photos" aria-hidden="true">
          {slides.map((photo, index) => (
            <img key={photo.src} className={index === slide ? 'is-active' : undefined}
              src={photo.src} alt="" decoding="async" />
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
        <div className="home-hero-controls">
          {!reducedMotion && (
            <button type="button" onClick={() => setPaused(!paused)}>
              {t(paused ? 'Play background photos' : 'Pause background photos')}
            </button>
          )}
          <button type="button" onClick={() => setSlide((slide + 1) % slides.length)}>
            {t('Next background photo')}
          </button>
        </div>
      </section>
      <details className="home-hero-credits">
        <summary>{t('Photo credits')}</summary>
        <ul>
          {slides.map(photo => (
            <li key={photo.src}><a href={photo.source}>{photo.author}</a> · <a href={photo.license[1]}>{photo.license[0]}</a></li>
          ))}
          <li>{t('Portrait of Narendra Modi')} · <a href={portraitSource}>Prime Minister’s Office, Government of India</a> · <a href={portraitLicense}>GODL India</a> · WebP</li>
        </ul>
      </details>
    </>
  )
}
