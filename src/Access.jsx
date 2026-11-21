import React, { useState } from 'react'
import { mapDirections, mapSearch } from './access.js'
import CentreMap from './CentreMap.jsx'
import { languages, useLocale } from './locale.jsx'

export function Locator() {
  const { t } = useLocale()
  const [locality, setLocality] = useState('')
  const [destination, setDestination] = useState('')
  return (
    <section id="locator" aria-labelledby="locator-title" className="access-section">
      <h2 id="locator-title">{t('Find a Kendra')}</h2>
      <p>{t('Search by village, district, or PIN code. Confirm the centre address, hours, and available services before visiting.')}</p>
      <div className="card locator">
        <label>{t('Village, district, or PIN code')}<input value={locality} maxLength={120} onChange={event => setLocality(event.target.value)} /></label>
        <CentreMap query={locality} />
        {locality.trim() && <div className="access-actions">
          <a href={mapSearch(locality, 'Jan Suvidha Kendra')} target="_blank" rel="noopener noreferrer">{t('Search Jan Suvidha Kendra on Google Maps')}</a>
          <a href={mapSearch(locality, 'Common Service Centre')} target="_blank" rel="noopener noreferrer">{t('Search Common Service Centres on Google Maps')}</a>
        </div>}
        <a href="https://locator.csccloud.in/" target="_blank" rel="noopener noreferrer">{t('Open CSC locator')}</a>
        <label>{t('Selected centre name and address')}<input value={destination} maxLength={180} onChange={event => setDestination(event.target.value)} /></label>
        {destination.trim() && <a href={mapDirections(destination)} target="_blank" rel="noopener noreferrer">{t('Get directions on Google Maps')}</a>}
        <p>{t('Map results and the CSC directory are external. Ask the centre which services it provides.')}</p>
      </div>
    </section>
  )
}

export function AssistedProfile({ people, active, onSelect, onRegister, onPrint, operatorView }) {
  const { language, t } = useLocale()
  function register(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const values = Object.fromEntries(fields)
    if (onRegister({ ...values, id: crypto.randomUUID(), consent: fields.has('consent') })) event.currentTarget.reset()
  }
  return (
    <section className="card profile" aria-label={t('Artisan profile')}>
      <div className="access-actions">
        <label>{t('Artisan profile')}
          <select value={active.id} onChange={event => onSelect(event.target.value)}>
            {people.map(profile => <option value={profile.id} key={profile.id}>{profile.name} · {profile.location}</option>)}
          </select>
        </label>
        <button className="secondary" onClick={onPrint}>{t('Print registration slip')}</button>
      </div>
      {operatorView && (
        <details>
          <summary>{t('Register an artisan at the Kendra')}</summary>
          <p>{t('Use sample details for this college demo.')}</p>
          <form className="form" onSubmit={register}>
            <label>{t('Artisan name')}<input name="name" maxLength={80} required /></label>
            <label>{t('Village or locality')}<input name="location" maxLength={100} required /></label>
            <label>{t('Preferred language')}
              <select name="language" defaultValue={language} key={language}>
                {Object.entries(languages).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
            </label>
            <label className="consent"><input type="checkbox" name="consent" required />{t('The artisan agrees to register this sample profile.')}</label>
            <button type="submit">{t('Register artisan')}</button>
          </form>
        </details>
      )}
    </section>
  )
}

const guides = [
  ['Before you visit', [
    'Find a centre and confirm the address and services.',
    'Bring a sample or clear photos, the quantity ready, and your asking price.',
  ]],
  ['Artisan guide', [
    'Ask the Kendra operator to register your sample profile and prepare a listing.',
    'Review the price and stock with the operator before the listing is published.',
    'Open your artisan profile to compare offers and track collection and payout.',
  ]],
  ['Kendra operator guide', [
    'Ask permission, register the artisan, and print the registration slip.',
    'Select the artisan profile, save a draft, and review the details together.',
    'Publish the listing after the artisan confirms the price and quantity.',
  ]],
  ['Buyer guide', [
    'Choose a published listing and send an offer with quantity, price, and deduction.',
    'Once the artisan accepts, schedule collection and record the inspection.',
    'Record the simulated payment and allocate accepted stock to the exhibition.',
  ]],
]

export function Guides({ print }) {
  const { t } = useLocale()
  return (
    <section id="guides" aria-labelledby="guides-title" className="access-section">
      <h2 id="guides-title">{t('Step-by-step guides')}</h2>
      {guides.map(([title, steps]) => (
        <details key={title}>
          <summary>{t(title)}</summary>
          <ol>{steps.map(step => <li key={step}>{t(step)}</li>)}</ol>
          {title === 'Before you visit' && <button className="secondary" onClick={() => print({ title, steps })}>{t('Print visit checklist')}</button>}
        </details>
      ))}
    </section>
  )
}

export function PrintDocument({ doc }) {
  const { t } = useLocale()
  if (!doc) return null
  return (
    <section id="print-document">
      <p>KalaSetu · {t('Sample · College project')}</p>
      <h1>{t(doc.title)}</h1>
      {doc.steps && <ol>{doc.steps.map(step => <li key={step}>{t(step)}</li>)}</ol>}
      {doc.rows && <dl>{doc.rows.map(([label, value]) => <div key={label}><dt>{t(label)}</dt><dd>{value}</dd></div>)}</dl>}
    </section>
  )
}
