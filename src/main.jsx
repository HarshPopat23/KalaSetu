import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { acceptOffer, artisan, buyers, createDraft, inventory, operator, payout, publishProduct, seed, submitOffer } from './purchase.js'
import { restoreOrders } from './fulfilment.js'
import Orders from './Orders.jsx'
import './style.css'

const storageKey = 'kalasetu-purchase-v1'
const moneyFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
const money = paise => moneyFormat.format(paise / 100)
const roles = [
  { id: 'operator', label: 'Kendra operator', name: operator.name },
  ...buyers.map((buyer, index) => ({ id: buyer.id, label: 'Buyer ' + (index + 1), name: buyer.name })),
  { id: 'artisan', label: 'Artisan', name: artisan.name },
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

function ProductCard({ product, state, children }) {
  const { available, reserved, purchased, rejected } = inventory(state, product)
  return (
    <article className="card">
      <div className="card-top"><span>{product.category}</span><span className="badge">{product.status}</span></div>
      <h3>{product.name}</h3>
      <p>{money(product.askingPrice)} per piece</p>
      <dl className="stock">
        <div><dt>Available</dt><dd>{available}</dd></div>
        <div><dt>Reserved</dt><dd>{reserved}</dd></div>
        {purchased > 0 && <div><dt>Purchased</dt><dd>{purchased}</dd></div>}
        {rejected > 0 && <div><dt>Held for return</dt><dd>{rejected}</dd></div>}
      </dl>
      {children}
    </article>
  )
}

function ListingForm({ onSubmit }) {
  return (
    <form className="form" onSubmit={onSubmit}>
      <label>Product name<input name="name" required maxLength={80} /></label>
      <label>Craft category<input name="category" required maxLength={50} /></label>
      <label>Quantity<input name="stock" type="number" min="1" step="1" required /></label>
      <label>Asking price per piece (₹)<input name="askingPrice" type="number" min="0.01" step="0.01" required /></label>
      <button type="submit">Save draft</button>
    </form>
  )
}

function OfferForm({ product, available, onSubmit }) {
  return (
    <form className="form offer-form" onSubmit={onSubmit}>
      <h4>Offer for {product.name}</h4>
      <label>Offer quantity<input name="quantity" type="number" min="1" max={available} step="1" required /></label>
      <label>Offer price per piece (₹)<input name="unitPrice" type="number" min="0.01" step="0.01" defaultValue={product.askingPrice / 100} required /></label>
      <label>Total deduction (₹)<input name="deduction" type="number" min="0" step="0.01" defaultValue="0" required /></label>
      <button type="submit">Send offer</button>
    </form>
  )
}

function OfferTable({ offers, available, onAccept }) {
  return (
    <div className="offer-list">
      {offers.map(offer => {
        const status = offer.status === 'accepted' ? 'Accepted' : offer.quantity > available ? 'Insufficient stock' : 'Pending'
        return (
          <article key={offer.id} className="offer">
            <div className="card-top"><strong>{buyers.find(buyer => buyer.id === offer.buyerId).name}</strong><span className="badge">{status}</span></div>
            <dl className="terms">
              <div><dt>Pieces</dt><dd>{offer.quantity}</dd></div>
              <div><dt>Per piece</dt><dd>{money(offer.unitPrice)}</dd></div>
              <div><dt>Deduction</dt><dd>{money(offer.deduction)}</dd></div>
              <div><dt>Artisan receives</dt><dd>{money(payout(offer))}</dd></div>
            </dl>
            {onAccept && status === 'Pending' && <button onClick={() => onAccept(offer.id)}>Accept offer</button>}
          </article>
        )
      })}
    </div>
  )
}

function App() {
  const [state, setState] = useState(loadState)
  const [role, setRole] = useState('operator')
  const [feedback, setFeedback] = useState(null)
  const [offerProduct, setOfferProduct] = useState(null)
  const current = roles.find(item => item.id === role)
  const isOperator = role === 'operator'
  const isArtisan = role === 'artisan'
  const products = state.products.filter(product => isOperator || product.status === 'published')

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
      setFeedback({ text: saved ? message : message + ' Browser storage is unavailable. Changes last until reload.' })
    } catch (error) {
      setFeedback({ error: true, text: error.message })
      return false
    }
    return true
  }

  function saveDraft(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    const product = {
      id: crypto.randomUUID(),
      name: fields.get('name'),
      category: fields.get('category'),
      stock: Number(fields.get('stock')),
      askingPrice: Math.round(Number(fields.get('askingPrice')) * 100),
    }
    if (update(currentState => createDraft(currentState, product), 'Draft saved for ' + artisan.name + '.')) {
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
    if (update(currentState => submitOffer(currentState, offer), 'Offer sent to ' + artisan.name + '.')) {
      setOfferProduct(null)
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="brand"><span aria-hidden="true">K</span> KalaSetu</div>
        <span className="badge">College demo · Simulated purchases</span>
      </header>
      <main>
        <section className="intro" aria-labelledby="title">
          <h1 id="title">Rural craft purchasing</h1>
          <p>Publish a craft listing at the Kendra, send offers as a buyer, and review them as the artisan.</p>
          <nav aria-label="Demo role" className="roles">
            {roles.map(item => (
              <button key={item.id} aria-pressed={role === item.id} onClick={() => {
                setRole(item.id)
                setFeedback(null)
                setOfferProduct(null)
              }}>{item.label}</button>
            ))}
          </nav>
        </section>
        <section aria-labelledby="workspace">
          <div className="workspace">
            <div>
              <h2 id="workspace">{current.label} workspace</h2>
              <p>{current.name}{isOperator ? ' · ' + operator.centre : isArtisan ? ' · ' + artisan.location : ''}</p>
            </div>
            <button className="secondary reset" onClick={() => {
              if (window.confirm('Reset all listings, offers, and orders to the demo defaults?')) {
                update(() => seed, 'Demo reset.')
                setOfferProduct(null)
              }
            }}>Reset demo</button>
          </div>
          {feedback && <p className={'feedback' + (feedback.error ? ' error' : '')} role={feedback.error ? 'alert' : 'status'}>{feedback.text}</p>}
          {isOperator && (
            <details>
              <summary>Create a listing for {artisan.name}</summary>
              <ListingForm onSubmit={saveDraft} />
            </details>
          )}
          <h2 className="section-title">{isArtisan ? 'Listings and offer comparison' : 'Product listings'}</h2>
          <div className={isArtisan ? 'products artisan-products' : 'products'}>
            {products.map(product => {
              const { available } = inventory(state, product)
              const offers = state.offers.filter(offer => offer.productId === product.id && (isArtisan || offer.buyerId === role))
              return (
                <ProductCard key={product.id} product={product} state={state}>
                  {isOperator && product.status === 'draft' && (
                    <button onClick={() => update(currentState => publishProduct(currentState, product.id), 'Published ' + product.name + '.')}>Publish listing</button>
                  )}
                  {!isOperator && !isArtisan && (
                    <>
                      {available > 0 && <button className="secondary" aria-expanded={offerProduct === product.id}
                        onClick={() => setOfferProduct(offerProduct === product.id ? null : product.id)}>
                        {offerProduct === product.id ? 'Cancel offer form' : 'Make an offer'}
                      </button>}
                      {offerProduct === product.id && <OfferForm product={product} available={available} onSubmit={event => sendOffer(event, product.id)} />}
                    </>
                  )}
                  {offers.length > 0 && <OfferTable offers={offers} available={available}
                    onAccept={isArtisan ? id => update(currentState => acceptOffer(currentState, id), 'Offer accepted. Purchase order created and stock reserved.') : undefined} />}
                  {isArtisan && offers.length === 0 && <p>No offers yet.</p>}
                </ProductCard>
              )
            })}
          </div>
        </section>
        <Orders state={state} role={role} money={money} update={change => {
          const saved = commit(change(state))
          setFeedback(saved ? null : { text: 'Browser storage is unavailable. Changes last until reload.' })
        }} />
      </main>
      <footer>Demo listings, offers, and orders are saved in this browser.</footer>
    </>
  )
}

createRoot(document.getElementById('root')).render(<App />)
