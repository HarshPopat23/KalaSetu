import React, { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Locale, languages, useLocale } from './locale.jsx'
import { AssistedProfile, Locator, PrintDocument } from './Access.jsx'
import { ownerOf, profiles, registerArtisan } from './access.js'
import { createRoot } from 'react-dom/client'
import { acceptOffer, buyers, createDraft, inventory, isOfferExpired, offerValidityDays, operator, payout, publishProduct, seed, submitOffer } from './purchase.js'
import { restoreOrders } from './fulfilment.js'
import Orders from './Orders.jsx'
import HomeHero from './HomeHero.jsx'
import Documentation, { Instructions } from './Documentation.jsx'
import { preparePhoto } from './photo.js'
import './style.css'

const pages = [['docs', 'Docs'], ['locator', 'Find Center'], ['demo', 'Demo'], ['listing', 'Listing']]
const currentPage = () => location.hash.slice(1)

const storageKey = 'kalasetu-purchase-v1'
const roles = [
  { id: 'operator', label: 'Kendra operator', name: operator.name, designation: 'CSC VLE Operator' },
  ...buyers.map((buyer, index) => ({ id: buyer.id, label: index === 0 ? 'Buyer 1' : 'Buyer 2', name: buyer.name, designation: index === 0 ? 'District Handicrafts Office' : 'State Craft Emporium' })),
  { id: 'artisan', label: 'Artisan', designation: 'Master Craftsperson' },
]

function GovEmblem() {
  return (
    <svg className="gov-emblem-svg" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" aria-label="National Emblem of India">
      <g fill="currentColor">
        {/* Ashoka Lion Capital stylized emblem */}
        <circle cx="50" cy="22" r="14" opacity="0.9" />
        <circle cx="28" cy="26" r="12" opacity="0.8" />
        <circle cx="72" cy="26" r="12" opacity="0.8" />
        {/* Central Crown & Mane */}
        <path d="M42 22 L58 22 L56 46 L44 46 Z" />
        <path d="M26 26 L38 28 L36 46 L24 44 Z" />
        <path d="M74 26 L62 28 L64 46 L76 44 Z" />
        {/* Abacus Base Platform */}
        <rect x="18" y="48" width="64" height="6" rx="2" />
        {/* Ashoka Chakra Wheel */}
        <circle cx="50" cy="66" r="12" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="50" cy="66" r="2.5" />
        <line x1="50" y1="54" x2="50" y2="78" stroke="currentColor" strokeWidth="1.2" />
        <line x1="38" y1="66" x2="62" y2="66" stroke="currentColor" strokeWidth="1.2" />
        <line x1="41.5" y1="57.5" x2="58.5" y2="74.5" stroke="currentColor" strokeWidth="1.2" />
        <line x1="41.5" y1="74.5" x2="58.5" y2="57.5" stroke="currentColor" strokeWidth="1.2" />
        {/* Galloping Horse and Bull flanking */}
        <path d="M24 64 Q28 60 33 66 Q29 70 24 64 Z" />
        <path d="M76 64 Q72 60 67 66 Q71 70 76 64 Z" />
        {/* Base Lotus Pedestal */}
        <path d="M12 80 C 25 76, 75 76, 88 80 L 84 88 C 70 85, 30 85, 16 88 Z" />
        <rect x="22" y="90" width="56" height="5" rx="1.5" />
        {/* Satyameva Jayate Banner text */}
        <text x="50" y="108" fontSize="9" textAnchor="middle" fontWeight="bold" fontFamily="serif" letterSpacing="1">सत्यमेव जयते</text>
      </g>
    </svg>
  )
}

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
      <div className="card-top">
        <span>{t(product.category)}</span>
        <span className="badge">{t(product.status)}</span>
      </div>
      {product.photo && <img className="product-photo" src={product.photo} alt={product.name} />}
      <h3>{t(product.name)}</h3>
      <p><strong>{money(product.askingPrice)}</strong> {t('per piece')}</p>
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
      <label>{t('Product name')}<input name="name" required maxLength={80} placeholder="e.g. Handwoven wicker baskets" /></label>
      <label>{t('Craft category')}<input name="category" required maxLength={50} placeholder="e.g. Cane and Bamboo Craft" /></label>
      <label>{t('Quantity')}<input name="stock" type="number" min="1" step="1" required placeholder="e.g. 12" /></label>
      <label>{t('Asking price per piece (₹)')}<input name="askingPrice" type="number" min="0.01" step="0.01" required placeholder="e.g. 350.00" /></label>
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
            <div className="card-top">
              <strong>{t(buyers.find(buyer => buyer.id === offer.buyerId).name)}</strong>
              <span className="badge">{t(status)}</span>
            </div>
            <dl className="terms">
              <div><dt>{t('Pieces')}</dt><dd>{offer.quantity}</dd></div>
              <div><dt>{t('Per piece')}</dt><dd>{money(offer.unitPrice)}</dd></div>
              <div><dt>{t('Deduction')}</dt><dd>{money(offer.deduction)}</dd></div>
              <div><dt>{t('Artisan receives')}</dt><dd>{money(payout(offer))}</dd></div>
            </dl>
            {Number.isFinite(offer.expiresAt) && offer.status === 'pending' && (
              <p style={{ margin: '0.4rem 0', fontSize: '0.84rem', color: '#64748b' }}>
                {t('Offer deadline: {date}', { date: dateFormat.format(offer.expiresAt) })}
              </p>
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
  const [route, setRoute] = useState(currentPage)
  const page = route.startsWith('docs/') ? 'docs' : route
  const topicSlug = page === 'docs' ? route.slice('docs/'.length) : ''
  const [fontScale, setFontScale] = useState('md')
  const [contrastMode, setContrastMode] = useState(false)

  useEffect(() => {
    document.body.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg')
    document.body.classList.add(`font-scale-${fontScale}`)
  }, [fontScale])

  useEffect(() => {
    if (contrastMode) {
      document.body.classList.add('high-contrast')
    } else {
      document.body.classList.remove('high-contrast')
    }
  }, [contrastMode])

  useEffect(() => {
    const navigate = () => {
      setRoute(currentPage())
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
      <a href="#main-content" className="skip-link" onClick={event => {
        event.preventDefault()
        document.getElementById('main-content')?.focus()
      }}>{t('Skip to main content')}</a>
      
      {/* Official Tricolor National Ribbon */}
      <div className="gov-flag-strip">
        <div className="band-saffron"></div>
        <div className="band-white"></div>
        <div className="band-green"></div>
      </div>

      {/* Top Utility & Accessibility Bar */}
      <div className="gov-utility-strip">
        <div className="gov-utility-container">
          <div className="gov-utility-left">
            <div className="gov-emblem-text">
              <span className="gov-title-hi">भारत सरकार</span>
              <span className="gov-sep">|</span>
              <span>Government of India</span>
              <span className="gov-sep">·</span>
              <span>Ministry of Textiles & MSME</span>
            </div>
          </div>
          <div className="gov-utility-right">
            <div className="gov-access-tools" aria-label="Accessibility controls">
              <button type="button" className={`gov-tool-btn ${fontScale === 'sm' ? 'active' : ''}`} onClick={() => setFontScale('sm')} title="Small text">A-</button>
              <button type="button" className={`gov-tool-btn ${fontScale === 'md' ? 'active' : ''}`} onClick={() => setFontScale('md')} title="Default text">A</button>
              <button type="button" className={`gov-tool-btn ${fontScale === 'lg' ? 'active' : ''}`} onClick={() => setFontScale('lg')} title="Large text">A+</button>
              <button type="button" className={`gov-tool-btn ${contrastMode ? 'active' : ''}`} onClick={() => setContrastMode(!contrastMode)} title="Toggle High Contrast">
                {contrastMode ? 'Normal' : 'High Contrast'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="app-shell">
        {/* Main Masthead Header */}
        <header className="site-header">
          <div className="brand-wrapper">
            <GovEmblem />
            <a href="#" className="brand">
              <span aria-hidden="true">K</span>
              <div className="brand-text-group">
                <span className="brand-title-hi">कला सेतु</span>
                <span className="brand-title-en">KalaSetu National Portal</span>
                <span className="brand-tagline">Rural Handicraft & CSC Kendra Public Procurement System</span>
              </div>
            </a>
          </div>

          <div className="header-partner-badges">
            <div className="gov-badge-item">
              <span className="gov-badge-icon">🇮🇳</span>
              <span>Digital India</span>
            </div>
            <div className="gov-badge-item">
              <span className="gov-badge-icon">🏢</span>
              <span>CSC Digital Seva</span>
            </div>
            <div className="gov-badge-item">
              <span className="gov-badge-icon">🏛️</span>
              <span>GeM Procurement</span>
            </div>
          </div>

          <div className="access-actions">
            <span className="badge">{t('College demo · Simulated purchases')}</span>
            <label>{t('Language')}
              <select value={language} onChange={event => { setLanguage(event.target.value); setFeedback(null) }}>
                {Object.entries(languages).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
            </label>
          </div>
        </header>

        {/* Primary Navigation Bar */}
        <div className="gov-nav-bar">
          <div className="gov-nav-container">
            <nav className="primary-nav" aria-label={t('Main navigation')}>
              {pages.map(([id, label]) => (
                <a key={id} href={'#' + id} aria-current={page === id ? 'page' : undefined}>
                  {id === 'docs' && '📜 '}
                  {id === 'locator' && '📍 '}
                  {id === 'demo' && '🏛️ '}
                  {id === 'listing' && '📦 '}
                  {t(label)}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Official Notifications Ticker */}
        <div className="gov-ticker-strip">
          <div className="gov-ticker-container">
            <span className="gov-ticker-badge">सूचना / NOTICE</span>
            <span className="gov-ticker-content">
              CSC Kendra assisted registration & public sector procurement simulation active under KalaSetu Model · Direct Benefit Transfer (DBT) verification enabled.
            </span>
          </div>
        </div>

        <main id="main-content" tabIndex={-1}>
          {!pages.some(([id]) => id === page) && <HomeHero />}

          {page === 'docs' && <Documentation topicSlug={topicSlug} print={print} />}
          {page === 'locator' && <Locator />}
          {isListing && (
            <section className="access-section">
              <h1>{t('List your product')}</h1>
              <Instructions />
            </section>
          )}

          {page === 'demo' && (
            <section className="intro">
              <div style={{ display: 'inline-block', marginBottom: '0.4rem' }}>
                <span className="badge">Simulated E-Governance Workspace</span>
              </div>
              <h1>{t('Demo')}</h1>
              <Instructions variant="demo" />
              <nav aria-label={t('Demo role')} className="roles">
                {roles.map(item => (
                  <button key={item.id} aria-pressed={role === item.id} onClick={() => {
                    setRole(item.id)
                    setFeedback(null)
                    setOfferProduct(null)
                  }}>
                    {item.id === 'operator' && '👨‍💼 '}
                    {item.id.startsWith('buyer') && '🏢 '}
                    {item.id === 'artisan' && '👩‍🎨 '}
                    {t(item.label)}
                  </button>
                ))}
              </nav>
            </section>
          )}

          {(isListing || page === 'demo') && (
            <section className="access-section" aria-labelledby="workspace">
              <div className="workspace">
                <div>
                  <h2 id="workspace">{isListing ? t('Listing workspace') : t('{role} workspace', { role: t(current.label) })}</h2>
                  <p>{isListing || isArtisan ? active.name + ' · ' + active.location : t(current.name) + (isOperator ? ' · ' + t(operator.centre) : '')}</p>
                </div>
                {!isListing && (
                  <button className="secondary reset" onClick={() => {
                    if (window.confirm(t('Reset all profiles, listings, offers, and orders to the demo defaults?'))) {
                      update(() => seed, 'Demo reset.')
                      setOfferProduct(null)
                    }
                  }}>
                    🔄 {t('Reset demo')}
                  </button>
                )}
              </div>

              {feedback && <p className={'feedback' + (feedback.error ? ' error' : '')} role={feedback.error ? 'alert' : 'status'}>{feedback.text}</p>}

              {(isListing || isOperator || isArtisan) && (
                <AssistedProfile
                  people={people}
                  active={active}
                  operatorView={isListing || isOperator}
                  onSelect={id => {
                    update(currentState => ({ ...currentState, activeArtisanId: id }), 'Artisan profile selected.')
                  }}
                  onRegister={values => update(currentState => ({
                    ...registerArtisan(currentState, values), activeArtisanId: values.id,
                  }), 'Artisan registered. You can now create a listing.')}
                  onPrint={() => print({
                    title: 'Registration slip', rows: [
                      ['Artisan ID', active.id], ['Artisan name', active.name], ['Village or locality', active.location],
                      ['Preferred language', languages[active.language ?? 'en']],
                    ]
                  })}
                />
              )}

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
                      {(isListing || isOperator) && product.status === 'published' && (
                        <button className="secondary" onClick={() => print({
                          title: 'Listing confirmation', rows: [
                            ['Listing ID', product.id], ['Product name', t(product.name)], ['Artisan name', active.name],
                            ['Quantity', product.stock], ['Asking price per piece (₹)', money(product.askingPrice)],
                          ],
                        })}>{t('Print listing confirmation')}</button>
                      )}
                      {!isListing && !isOperator && !isArtisan && (
                        <>
                          {available > 0 && (
                            <button className="secondary" aria-expanded={offerProduct === product.id}
                              onClick={() => setOfferProduct(offerProduct === product.id ? null : product.id)}>
                              {t(offerProduct === product.id ? 'Cancel offer form' : 'Make an offer')}
                            </button>
                          )}
                          {offerProduct === product.id && <OfferForm product={product} available={available} onSubmit={event => sendOffer(event, product.id)} />}
                        </>
                      )}
                      {offers.length > 0 && (
                        <OfferTable money={money} offers={offers} available={available}
                          onAccept={isArtisan ? id => update(currentState => acceptOffer(currentState, id), 'Offer accepted. Purchase order created and stock reserved.') : undefined} />
                      )}
                      {!isListing && isArtisan && offers.length === 0 && <p>{t('No offers yet.')}</p>}
                    </ProductCard>
                  )
                })}
              </div>
            </section>
          )}

          {page === 'demo' && (
            <Orders
              state={state}
              role={role}
              money={money}
              active={active}
              print={print}
              update={change => {
                const saved = commit(change(state))
                setFeedback(saved ? null : { text: t('Browser storage is unavailable. Changes last until reload.') })
              }}
            />
          )}
        </main>

        {/* Official Indian Government Footer */}
        <footer className="gov-footer">
          <div className="gov-footer-container">
            <div className="gov-footer-grid">
              <div className="gov-footer-col">
                <h4>कला सेतु | KalaSetu</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  A Digital India and CSC Kendra assisted procurement portal bridging rural craftspeople and public institutions for transparent, zero-intermediary handicraft commerce.
                </p>
              </div>
              <div className="gov-footer-col">
                <h4>Government Portals</h4>
                <ul className="gov-footer-links">
                  <li><a href="https://india.gov.in" target="_blank" rel="noopener noreferrer">National Portal of India</a></li>
                  <li><a href="https://gem.gov.in" target="_blank" rel="noopener noreferrer">Government e-Marketplace (GeM)</a></li>
                  <li><a href="https://digitalindia.gov.in" target="_blank" rel="noopener noreferrer">Digital India Portal</a></li>
                  <li><a href="https://csc.gov.in" target="_blank" rel="noopener noreferrer">CSC e-Governance Services</a></li>
                </ul>
              </div>
              <div className="gov-footer-col">
                <h4>Artisan Welfare & Schemes</h4>
                <ul className="gov-footer-links">
                  <li><a href="https://pmvishwakarma.gov.in" target="_blank" rel="noopener noreferrer">PM Vishwakarma Yojana</a></li>
                  <li><a href="https://odop.org.in" target="_blank" rel="noopener noreferrer">One District One Product (ODOP)</a></li>
                  <li><a href="https://texmin.nic.in" target="_blank" rel="noopener noreferrer">Ministry of Textiles</a></li>
                  <li><a href="https://msme.gov.in" target="_blank" rel="noopener noreferrer">Ministry of MSME</a></li>
                </ul>
              </div>
              <div className="gov-footer-col">
                <h4>Compliance & Standards</h4>
                <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  Designed in adherence to Guidelines for Indian Government Websites (GIGW 3.0) and WCAG 2.1 AA accessibility standards.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ background: '#1e293b', color: '#38bdf8', borderColor: '#334155' }}>GIGW 3.0</span>
                  <span className="badge" style={{ background: '#1e293b', color: '#4ade80', borderColor: '#334155' }}>WCAG 2.1 AA</span>
                </div>
              </div>
            </div>

            <div className="gov-footer-bottom">
              <div>
                <span>{t('Demo listings, offers, and orders are saved in this browser.')}</span>
                <span style={{ margin: '0 0.5rem' }}>|</span>
                <span>Website Content Managed by KalaSetu E-Governance Initiative.</span>
              </div>
              <div className="gov-nic-badge">
                <span>Hosted by National Informatics Centre (NIC)</span>
              </div>
            </div>
          </div>
        </footer>
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

  return (
    <Locale.Provider value={language}>
      <App setLanguage={setLanguage} />
    </Locale.Provider>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
