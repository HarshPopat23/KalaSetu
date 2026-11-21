import React, { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { Locale, languages, useLocale } from './locale.jsx'
import { AssistedProfile, Guides, Locator, PrintDocument } from './Access.jsx'
import { ownerOf, profiles, registerArtisan } from './access.js'
import { createRoot } from 'react-dom/client'
import { acceptOffer, buyers, createDraft, inventory, operator, payout, publishProduct, seed, submitOffer } from './purchase.js'
import { restoreOrders } from './fulfilment.js'
import Orders from './Orders.jsx'
import './style.css'

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
  return (
    <form className="form" onSubmit={onSubmit}>
      <label>{t('Product name')}<input name="name" required maxLength={80} /></label>
      <label>{t('Craft category')}<input name="category" required maxLength={50} /></label>
      <label>{t('Quantity')}<input name="stock" type="number" min="1" step="1" required /></label>
      <label>{t('Asking price per piece (₹)')}<input name="askingPrice" type="number" min="0.01" step="0.01" required /></label>
      <button type="submit">{t('Save draft')}</button>
    </form>
  )
}

function OfferForm({ product, available, onSubmit }) {
  const { t } = useLocale()
  return (
    <form className="form offer-form" onSubmit={onSubmit}>
      <h4>{t('Offer for {name}', { name: t(product.name) })}</h4>
      <label>{t('Offer quantity')}<input name="quantity" type="number" min="1" max={available} step="1" required /></label>
      <label>{t('Offer price per piece (₹)')}<input name="unitPrice" type="number" min="0.01" step="0.01" defaultValue={product.askingPrice / 100} required /></label>
      <label>{t('Total deduction (₹)')}<input name="deduction" type="number" min="0" step="0.01" defaultValue="0" required /></label>
      <button type="submit">{t('Send offer')}</button>
    </form>
  )
}

function OfferTable({ offers, available, onAccept, money }) {
  const { t } = useLocale()
  return (
    <div className="offer-list">
      {offers.map(offer => {
        const status = offer.status === 'accepted' ? 'Accepted' : offer.quantity > available ? 'Insufficient stock' : 'Pending'
        return (
          <article key={offer.id} className="offer">
            <div className="card-top"><strong>{t(buyers.find(buyer => buyer.id === offer.buyerId).name)}</strong><span className="badge">{t(status)}</span></div>
            <dl className="terms">
              <div><dt>{t('Pieces')}</dt><dd>{offer.quantity}</dd></div>
              <div><dt>{t('Per piece')}</dt><dd>{money(offer.unitPrice)}</dd></div>
              <div><dt>{t('Deduction')}</dt><dd>{money(offer.deduction)}</dd></div>
              <div><dt>{t('Artisan receives')}</dt><dd>{money(payout(offer))}</dd></div>
            </dl>
            {onAccept && status === 'Pending' && <button onClick={() => onAccept(offer.id)}>{t('Accept offer')}</button>}
          </article>
        )
      })}
    </div>
  )
}

function App({ setLanguage }) {
  const { language, t } = useLocale()
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
  const products = state.products.filter(product => (isOperator || product.status === 'published') &&
    (!(isOperator || isArtisan) || ownerOf(state, product)?.id === active.id))

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

  function saveDraft(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const product = {
      id: crypto.randomUUID(),
      artisanId: active.id,
      name: fields.get('name'),
      category: fields.get('category'),
      stock: Number(fields.get('stock')),
      askingPrice: Math.round(Number(fields.get('askingPrice')) * 100),
    }
    if (update(currentState => createDraft(currentState, product), t('Draft saved for {name}.', { name: active.name }))) {
      event.currentTarget.reset()
    }
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
          <div className="brand"><span aria-hidden="true">K</span> KalaSetu</div>
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
          <section className="intro" aria-labelledby="title">
            <h1 id="title">{t('Rural craft purchasing')}</h1>
            <p>{t('Publish a craft listing at the Kendra, send offers as a buyer, and review them as the artisan.')}</p>
            <nav className="access-actions" aria-label={t('Access resources')}>
              <a href="#locator">{t('Find a Kendra')}</a>
              <a href="#guides">{t('Step-by-step guides')}</a>
            </nav>
            <nav aria-label={t('Demo role')} className="roles">
              {roles.map(item => (
                <button key={item.id} aria-pressed={role === item.id} onClick={() => {
                  setRole(item.id)
                  setFeedback(null)
                  setOfferProduct(null)
                }}>{t(item.label)}</button>
              ))}
            </nav>
          </section>
          <section aria-labelledby="workspace">
            <div className="workspace">
              <div>
                <h2 id="workspace">{t('{role} workspace', { role: t(current.label) })}</h2>
                <p>{isArtisan ? active.name + ' · ' + active.location : t(current.name) + (isOperator ? ' · ' + t(operator.centre) : '')}</p>
              </div>
              <button className="secondary reset" onClick={() => {
                if (window.confirm(t('Reset all profiles, listings, offers, and orders to the demo defaults?'))) {
                  update(() => seed, 'Demo reset.')
                  setOfferProduct(null)
                }
              }}>{t('Reset demo')}</button>
            </div>
            {feedback && <p className={'feedback' + (feedback.error ? ' error' : '')} role={feedback.error ? 'alert' : 'status'}>{feedback.text}</p>}
            {(isOperator || isArtisan) && <AssistedProfile people={people} active={active} operatorView={isOperator}
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
            {isOperator && (
              <details>
                <summary>{t('Create a listing for {name}', { name: active.name })}</summary>
                <ListingForm onSubmit={saveDraft} />
              </details>
            )}
            <h2 className="section-title">{t(isArtisan ? 'Listings and offer comparison' : 'Product listings')}</h2>
            {products.length === 0 && <p>{t('No listings yet.')}</p>}
            <div className={isArtisan ? 'products artisan-products' : 'products'}>
              {products.map(product => {
                const { available } = inventory(state, product)
                const offers = state.offers.filter(offer => offer.productId === product.id && (isArtisan || offer.buyerId === role))
                return (
                  <ProductCard key={product.id} product={product} state={state} money={money}>
                    {isOperator && product.status === 'draft' && (
                      <button onClick={() => update(currentState => publishProduct(currentState, product.id), t('Published {name}.', { name: t(product.name) }))}>{t('Publish listing')}</button>
                    )}
                    {isOperator && product.status === 'published' && <button className="secondary" onClick={() => print({
                      title: 'Listing confirmation', rows: [
                        ['Listing ID', product.id], ['Product name', t(product.name)], ['Artisan name', active.name],
                        ['Quantity', product.stock], ['Asking price per piece (₹)', money(product.askingPrice)],
                      ],
                    })}>{t('Print listing confirmation')}</button>}
                    {!isOperator && !isArtisan && (
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
                    {isArtisan && offers.length === 0 && <p>{t('No offers yet.')}</p>}
                  </ProductCard>
                )
              })}
            </div>
          </section>
          <Orders state={state} role={role} money={money} active={active} print={print} update={change => {
            const saved = commit(change(state))
            setFeedback(saved ? null : { text: t('Browser storage is unavailable. Changes last until reload.') })
          }} />
          <Locator />
          <Guides print={print} />
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
