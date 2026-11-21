import React, { useState } from 'react'
import { artisan, buyers, operator, payout } from './purchase.js'
import { allocateStock, inspectedPayout, markPaid, recordCollection, recordInspection, resaleChannel, scheduleCollection, updateOrder } from './fulfilment.js'

const dateFormat = new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeZone: 'UTC' })

function OrderCard({ order, product, role, update, money }) {
  const [feedback, setFeedback] = useState(null)
  const { inspection, allocation } = order
  const isBuyer = order.buyerId === role
  const amount = inspection ? inspectedPayout(order) : payout(order)
  const payoutStatus = !inspection ? 'Estimated' : order.paid ? 'Paid (simulated)' : amount > 0 ? 'Payment pending' : 'No payout due'

  function change(action, message) {
    try {
      update(state => updateOrder(state, order.id, role, action))
      setFeedback({ message })
    } catch (error) {
      setFeedback({ error: true, message: error.message })
    }
  }

  function schedule(event) {
    event.preventDefault()
    const date = new FormData(event.currentTarget).get('collectionDate')
    change(current => scheduleCollection(current, date), 'Collection scheduled.')
  }

  function inspect(event) {
    event.preventDefault()
    const fields = new FormData(event.currentTarget)
    change(current => recordInspection(current, Number(fields.get('accepted')), fields.get('reason')), 'Inspection recorded.')
  }

  return (
    <article className="card order" aria-label={'Order for ' + product.name}>
      <div className="card-top">
        <h3>{product.name}</h3>
        <span className="badge">{inspection ? 'Inspected' : order.collected ? 'Collected' : order.collectionDate ? 'Collection scheduled' : 'Awaiting collection schedule'}</span>
      </div>
      <p className="order-reference">Order {order.id}</p>
      <p>{artisan.name} · {buyers.find(buyer => buyer.id === order.buyerId).name}</p>
      <dl className="terms">
        <div><dt>Ordered</dt><dd>{order.quantity} pieces</dd></div>
        <div><dt>Agreed price</dt><dd>{money(order.unitPrice)} per piece</dd></div>
        <div><dt>{inspection ? 'Adjusted deduction' : 'Agreed deduction'}</dt><dd>{money(inspection ? inspection.accepted * order.unitPrice - amount : order.deduction)}</dd></div>
        <div><dt>{inspection ? 'Inspected payout' : 'Estimated payout'}</dt><dd>{money(amount)}</dd></div>
        <div><dt>Payout status</dt><dd>{payoutStatus}</dd></div>
      </dl>
      {order.collectionDate && <p>Collection at {operator.centre} on {dateFormat.format(new Date(order.collectionDate))}.</p>}
      {inspection && (
        <>
          <p>Inspection: {inspection.accepted} accepted, {inspection.rejected} rejected.</p>
          {inspection.rejected > 0 && <p>Rejection reason: {inspection.reason}. Rejected pieces are held for return.</p>}
        </>
      )}
      {feedback && <p className={'feedback' + (feedback.error ? ' error' : '')} role={feedback.error ? 'alert' : 'status'}>{feedback.message}</p>}
      {isBuyer && (
        <>
          {!order.collectionDate && (
            <form className="form" onSubmit={schedule}>
              <label>Collection date<input name="collectionDate" type="date" required /></label>
              <button type="submit">Schedule collection at Kendra</button>
            </form>
          )}
          {order.collectionDate && !order.collected && <button onClick={() => change(recordCollection, 'Collection recorded.')}>Mark collected</button>}
          {order.collected && !inspection && (
            <form className="form" onSubmit={inspect}>
              <label>Accepted pieces<input name="accepted" type="number" min="0" max={order.quantity} step="1" defaultValue={order.quantity} required /></label>
              <label>Reason if any pieces are rejected<input name="reason" maxLength={160} /></label>
              <button type="submit">Record inspection</button>
            </form>
          )}
          {inspection && amount > 0 && !order.paid && <button onClick={() => change(markPaid, 'Simulated payment recorded.')}>Mark payout paid</button>}
          {inspection?.accepted > 0 && (
            <div className="resale">
              <h4>Resale stock</h4>
              {allocation ? <p>{allocation.quantity} pieces allocated to {allocation.channel}.</p> : (
                <>
                  <p>{inspection.accepted} unallocated pieces · {resaleChannel}</p>
                  {order.paid || amount === 0 ?
                    <button onClick={() => change(allocateStock, 'Stock allocated.')}>Allocate to exhibition</button> :
                    <p>Record the payout before allocating stock.</p>}
                </>
              )}
            </div>
          )}
        </>
      )}
    </article>
  )
}

export default function Orders({ state, role, update, money }) {
  const showAll = role === 'artisan' || role === 'operator'
  const orders = state.orders.filter(order => showAll || order.buyerId === role)
  return (
    <section aria-labelledby="orders">
      <h2 className="section-title" id="orders">Purchase orders</h2>
      {orders.length === 0 ? <p>Orders appear here after the artisan accepts an offer.</p> : (
        <div className="order-list">
          {orders.map(order => (
            <OrderCard key={role + ':' + order.id} order={order}
              product={state.products.find(product => product.id === order.productId)} role={role} update={update} money={money} />
          ))}
        </div>
      )}
    </section>
  )
}
