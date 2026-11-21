import React, { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Locale, languages, useLocale } from './locale.jsx'
import { AssistedProfile, Guides, Locator, PrintDocument } from './Access.jsx'
import { ownerOf, profiles, registerArtisan } from './access.js'
import { createRoot } from 'react-dom/client'
import { acceptOffer, buyers, createDraft, inventory, isOfferExpired, offerValidityDays, operator, payout, publishProduct, seed, submitOffer } from './purchase.js'
import { restoreOrders } from './fulfilment.js'
import Orders from './Orders.jsx'
import Documentation, { Instructions } from './Documentation.jsx'
import { preparePhoto } from './photo.js'
import './style.css'

const pages = [['docs', 'Docs'], ['locator', 'Find Center'], ['demo', 'Demo'], ['listing', 'Listing']]
const currentPage = () => location.hash.slice(1)

const storageKey = 'kalasetu-purchase-v1'
const roles = [
  { id: 'operator', label: 'Kendra operator', name: operator.name },
  ...buyers.map((buyer, index) => ({ id: buyer.id, label: index === 0 ? 'Buyer 1' : 'Buyer 2', name: buyer.name })),
  { id: 'artisan', label: 'Artisan' },
]

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey))
    if (Array.isArray(saved?.products) && Array.isArray(saved?.offers)) return restoreOrders(saved)
  } catch {
    // The demo can still run when browser storage is unavailable.
  }
  return seed
}

function ProductCard({ product, state, children, money }) {
  const { t } = useLocale()
  const { available, reserved, purchased, rejected } = inventory(state, product)
  return (
    <article className="card">
      <div className="card-top"><span>{t(product.category)}</span><span className="badge">{t(product.status)}</span></div>
      {product.photo && <img className="product-photo" src={product.photo} alt={product.name} />}
      <h3>{t(product.name)}</h3>
      <p>{money(product.askingPrice)} {t('per piece')}</p>
      <dl className="stock">
        <div><dt>{t('Available')}</dt><dd>{available}</dd></div>
        <div><dt>{t('Reserved')}</dt><dd>{reserved}</dd></div>
        {purchased > 0 && <div><dt>{t('Purchased')}</dt><dd>{purchased}</dd></div>}
        {rejected > 0 && <div><dt>{t('Held for return')}</dt><dd>{rejected}</dd></div>}
      </dl>
      {children}
    </article>
  )
}

function ListingForm({ onSubmit }) {
  const { t } = useLocale()
  const [photo, setPhoto] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [loading, setLoading] = useState(false)

  async function choosePhoto(event) {
    const input = event.currentTarget
    const [file] = input.files
    setPhoto('')
    setPhotoError('')
    if (!file) return
    setLoading(true)
    try {
      setPhoto(await preparePhoto(file))
    } catch (error) {
      setPhotoError(error.message)
      input.value = ''
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="form" onSubmit={event => {
      if (onSubmit(event, photo)) {
        event.currentTarget.reset()
        setPhoto('')
        setPhotoError('')
      }
    }}>
      <label>{t('Product name')}<input name="name" required maxLength={80} /></label>
      <label>{t('Craft category')}<input name="category" required maxLength={50} /></label>
      <label>{t('Quantity')}<input name="stock" type="number" min="1" step="1" required /></label>
      <label>{t('Asking price per piece (₹)')}<input name="askingPrice" type="number" min="0.01" step="0.01" required /></label>
      <label>{t('Product photo (optional)')}
        <input type="file" accept="image/jpeg,image/png,image/webp" onChange={choosePhoto} disabled={loading} />
      </label>
      {photo && <img className="product-photo preview-photo" src={photo} alt={t('Product photo preview')} />}
      {photoError && <p className="feedback error" role="alert">{t(photoError)}</p>}
      <button type="submit" disabled={loading}>{t('Save draft')}</button>
    </form>
  )
}

function OfferForm({ product, available, onSubmit }) {
  const { t } = useLocale()
  return (
    <form className="form offer-form" onSubmit={onSubmit}>
      <h4>{t('Offer for {name}', { name: t(product.name) })}</h4>
      <p>{t('Offers expire {days} days after sending.', { days: offerValidityDays })}</p>
      <label>{t('Offer quantity')}<input name="quantity" type="number" min="1" max={available} step="1" required /></label>
      <label>{t('Offer price per piece (₹)')}<input name="unitPrice" type="number" min="0.01" step="0.01" defaultValue={product.askingPrice / 100} required /></label>
      <label>{t('Total deduction (₹)')}<input name="deduction" type="number" min="0" step="0.01" defaultValue="0" required /></label>
      <button type="submit">{t('Send offer')}</button>
    </form>
  )
}

function OfferTable({ offers, available, onAccept, money }) {
  const { language, t } = useLocale()
  const [, refreshStatus] = useState(0)
  const now = Date.now()
  const nextExpiry = offers.reduce((earliest, offer) =>
    offer.status === 'pending' && offer.expiresAt > now ? Math.min(earliest, offer.expiresAt) : earliest, Infinity)

  useEffect(() => {
    if (!Number.isFinite(nextExpiry)) return
    const delay = Math.max(0, nextExpiry - Date.now())
    const timer = setTimeout(() => refreshStatus(count => count + 1), Math.min(delay, 2_147_483_647))
    return () => clearTimeout(timer)
  }, [nextExpiry, now])

  const dateFormat = new Intl.DateTimeFormat(language + '-IN', { dateStyle: 'medium', timeStyle: 'short' })
  return (
    <div className="offer-list">
      {offers.map(offer => {
        let status = 'Pending'
        if (offer.status === 'accepted') status = 'Accepted'
        else if (isOfferExpired(offer, now)) status = 'Expired'
        else if (offer.quantity > available) status = 'Insufficient stock'
        return (
          <article key={offer.id} className="offer">
            <div className="card-top"><strong>{t(buyers.find(buyer => buyer.id === offer.buyerId).name)}</strong><span className="badge">{t(status)}</span></div>
            <dl className="terms">
              <div><dt>{t('Pieces')}</dt><dd>{offer.quantity}</dd></div>
              <div><dt>{t('Per piece')}</dt><dd>{money(offer.unitPrice)}</dd></div>
              <div><dt>{t('Deduction')}</dt><dd>{money(offer.deduction)}</dd></div>
              <div><dt>{t('Artisan receives')}</dt><dd>{money(payout(offer))}</dd></div>
            </dl>
            {Number.isFinite(offer.expiresAt) && offer.status === 'pending' && (
              <p>{t('Offer deadline: {date}', { date: dateFormat.format(offer.expiresAt) })}</p>
            )}
            {onAccept && status === 'Pending' && <button onClick={() => onAccept(offer.id)}>{t('Accept offer')}</button>}
          </article>
        )
      })}
    </div>
  )
}

function App({ setLanguage }) {
  const { language, t } = useLocale()
  const [page, setPage] = useState(currentPage)
  useEffect(() => {
    const navigate = () => {
      setPage(currentPage())
      setFeedback(null)
      setOfferProduct(null)
    }
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])
  const [state, setState] = useState(loadState)
  const [role, setRole] = useState('operator')
  const [feedback, setFeedback] = useState(null)
  const [offerProduct, setOfferProduct] = useState(null)
  const [doc, setDoc] = useState(null)
  useEffect(() => {
    const clearDocument = () => setDoc(null)
    window.addEventListener('afterprint', clearDocument)
    return () => window.removeEventListener('afterprint', clearDocument)
  }, [])
  const people = profiles(state)
  const active = people.find(person => person.id === state.activeArtisanId) ?? people[0]
  const moneyFormat = new Intl.NumberFormat(language + '-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
  const money = paise => moneyFormat.format(paise / 100)
  function print(document) {
    flushSync(() => setDoc(document))
    window.print()
  }
  const current = roles.find(item => item.id === role)
  const isOperator = role === 'operator'
  const isArtisan = role === 'artisan'
  const isListing = page === 'listing'
  const products = state.products.filter(product =>
    isListing || isOperator || isArtisan
      ? ownerOf(state, product)?.id === active.id && (isListing || isOperator || product.status === 'published')
      : product.status === 'published')

  function commit(next) {
    setState(next)
    try {
      localStorage.setItem(storageKey, JSON.stringify(next))
      return true
    } catch {
      return false
    }
  }

  function update(change, message) {
    try {
      const saved = commit(change(state))
      setFeedback({ text: saved ? t(message) : t(message) + ' ' + t('Browser storage is unavailable. Changes last until reload.') })
    } catch (error) {
      setFeedback({ error: true, text: t(error.message) })
      return false
    }
    return true
  }

  function saveDraft(event, photo) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const product = {
      id: crypto.randomUUID(),
      artisanId: active.id,
      ...(photo && { photo }),
      name: fields.get('name'),
      category: fields.get('category'),
      stock: Number(fields.get('stock')),
      askingPrice: Math.round(Number(fields.get('askingPrice')) * 100),
    }
    return update(currentState => createDraft(currentState, product), t('Draft saved for {name}.', { name: active.name }))
  }

  function sendOffer(event, productId) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const offer = {
      id: crypto.randomUUID(),
      productId,
      buyerId: role,
      quantity: Number(fields.get('quantity')),
      unitPrice: Math.round(Number(fields.get('unitPrice')) * 100),
      deduction: Math.round(Number(fields.get('deduction')) * 100),
    }
    if (update(currentState => submitOffer(currentState, offer), t('Offer sent to {name}.', { name: ownerOf(state, state.products.find(product => product.id === productId)).name }))) {
      setOfferProduct(null)
    }
  }

  return (
    <>
      <div className="app-shell">
        <header className="site-header">
          <a href="#" className="brand"><span aria-hidden="true">K</span> KalaSetu</a>
          <nav className="primary-nav" aria-label={t('Main navigation')}>
            {pages.map(([id, label]) => <a key={id} href={'#' + id} aria-current={page === id ? 'page' : undefined}>{t(label)}</a>)}
          </nav>
          <div className="access-actions">
            <span className="badge">{t('College demo · Simulated purchases')}</span>
            <label>{t('Language')}
              <select value={language} onChange={event => { setLanguage(event.target.value); setFeedback(null) }}>
                {Object.entries(languages).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
            </label>
          </div>
        </header>
        <main>
          {!pages.some(([id]) => id === page) && <section className="intro">
            <h1>{t('Rural craft purchasing')}</h1>
            <p>{t('Publish a craft listing at the Kendra, send offers as a buyer, and review them as the artisan.')}</p>
            <div className="access-actions">
              <a href="#docs">{t('Read the documentation')}</a>
              <a href="#demo">{t('Open the demo')}</a>
            </div>
          </section>}
          {page === 'docs' && <><Documentation /><Guides print={print} /></>}
          {page === 'locator' && <Locator />}
          {isListing && <section className="access-section">
            <h1>{t('List your product')}</h1>
            <Instructions />
          </section>}
          {page === 'demo' && <section className="intro">
            <h1>{t('Demo')}</h1>
            <Instructions variant="demo" />
            <nav aria-label={t('Demo role')} className="roles">
              {roles.map(item => (
                <button key={item.id} aria-pressed={role === item.id} onClick={() => {
                  setRole(item.id)
                  setFeedback(null)
                  setOfferProduct(null)
                }}>{t(item.label)}</button>
              ))}
            </nav>
          </section>}
          {(isListing || page === 'demo') && <section className="access-section" aria-labelledby="workspace">
            <div className="workspace">
              <div>
                <h2 id="workspace">{isListing ? t('Listing workspace') : t('{role} workspace', { role: t(current.label) })}</h2>
                <p>{isListing || isArtisan ? active.name + ' · ' + active.location : t(current.name) + (isOperator ? ' · ' + t(operator.centre) : '')}</p>
              </div>
              {!isListing && <button className="secondary reset" onClick={() => {
                if (window.confirm(t('Reset all profiles, listings, offers, and orders to the demo defaults?'))) {
                  update(() => seed, 'Demo reset.')
                  setOfferProduct(null)
                }
              }}>{t('Reset demo')}</button>}
            </div>
            {feedback && <p className={'feedback' + (feedback.error ? ' error' : '')} role={feedback.error ? 'alert' : 'status'}>{feedback.text}</p>}
            {(isListing || isOperator || isArtisan) && <AssistedProfile people={people} active={active} operatorView={isListing || isOperator}
              onSelect={id => {
                update(currentState => ({ ...currentState, activeArtisanId: id }), 'Artisan profile selected.')
              }}
              onRegister={values => update(currentState => ({
                ...registerArtisan(currentState, values), activeArtisanId: values.id,
              }), 'Artisan registered. You can now create a listing.')}
              onPrint={() => print({ title: 'Registration slip', rows: [
                ['Artisan ID', active.id], ['Artisan name', active.name], ['Village or locality', active.location],
                ['Preferred language', languages[active.language ?? 'en']],
              ] })} />}
            {isListing && (
              <details open>
                <summary>{t('Create a listing for {name}', { name: active.name })}</summary>
                <ListingForm key={active.id} onSubmit={saveDraft} />
              </details>
            )}
            <h2 className="section-title">{t(!isListing && isArtisan ? 'Listings and offer comparison' : 'Product listings')}</h2>
            {products.length === 0 && <p>{t('No listings yet.')}</p>}
            <div className={!isListing && isArtisan ? 'products artisan-products' : 'products'}>
              {products.map(product => {
                const { available } = inventory(state, product)
                const offers = isListing ? [] : state.offers.filter(offer => offer.productId === product.id && (isArtisan || offer.buyerId === role))
                return (
                  <ProductCard key={product.id} product={product} state={state} money={money}>
                    {(isListing || isOperator) && product.status === 'draft' && (
                      <button onClick={() => update(currentState => publishProduct(currentState, product.id), t('Published {name}.', { name: t(product.name) }))}>{t('Publish listing')}</button>
                    )}
                    {(isListing || isOperator) && product.status === 'published' && <button className="secondary" onClick={() => print({
                      title: 'Listing confirmation', rows: [
                        ['Listing ID', product.id], ['Product name', t(product.name)], ['Artisan name', active.name],
                        ['Quantity', product.stock], ['Asking price per piece (₹)', money(product.askingPrice)],
                      ],
                    })}>{t('Print listing confirmation')}</button>}
                    {!isListing && !isOperator && !isArtisan && (
                      <>
                        {available > 0 && <button className="secondary" aria-expanded={offerProduct === product.id}
                          onClick={() => setOfferProduct(offerProduct === product.id ? null : product.id)}>
                          {t(offerProduct === product.id ? 'Cancel offer form' : 'Make an offer')}
                        </button>}
                        {offerProduct === product.id && <OfferForm product={product} available={available} onSubmit={event => sendOffer(event, product.id)} />}
                      </>
                    )}
                    {offers.length > 0 && <OfferTable money={money} offers={offers} available={available}
                      onAccept={isArtisan ? id => update(currentState => acceptOffer(currentState, id), 'Offer accepted. Purchase order created and stock reserved.') : undefined} />}
                    {!isListing && isArtisan && offers.length === 0 && <p>{t('No offers yet.')}</p>}
                  </ProductCard>
                )
              })}
            </div>
          </section>}
          {page === 'demo' && <Orders state={state} role={role} money={money} active={active} print={print} update={change => {
            const saved = commit(change(state))
            setFeedback(saved ? null : { text: t('Browser storage is unavailable. Changes last until reload.') })
          }} />}
        </main>
        <footer>{t('Demo listings, offers, and orders are saved in this browser.')}</footer>
      </div>
      <PrintDocument doc={doc} />
    </>
  )
}

function Root() {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('kalasetu-language')
      return Object.hasOwn(languages, saved) ? saved : 'en'
    } catch {
      return 'en'
    }
  })
  useEffect(() => {
    document.documentElement.lang = language
    try {
      localStorage.setItem('kalasetu-language', language)
    } catch {
      // The language still applies to this session.
    }
  }, [language])
  return <Locale.Provider value={language}><App setLanguage={setLanguage} /></Locale.Provider>
}

createRoot(document.getElementById('root')).render(<Root />)
