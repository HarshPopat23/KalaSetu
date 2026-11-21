import { ownerOf } from './access.js'
import { useLocale } from './locale.jsx'
import React, { useState } from 'react'
import { buyers, operator, payout } from './purchase.js'
import { allocateStock, inspectedPayout, markPaid, recordCollection, recordInspection, resaleChannel, scheduleCollection, updateOrder } from './fulfilment.js'

function OrderCard({ order, product, artisan, role, update, money, print }) {
  const { language, t } = useLocale()
  const dateFormat = new Intl.DateTimeFormat(language + '-IN', { dateStyle: 'medium', timeZone: 'UTC' })
  const [feedback, setFeedback] = useState(null)
  const { inspection, allocation } = order
  const isBuyer = order.buyerId === role
  const amount = inspection ? inspectedPayout(order) : payout(order)
  const payoutStatus = !inspection ? 'Estimated' : order.paid ? 'Paid (simulated)' : amount > 0 ? 'Payment pending' : 'No payout due'

  const date = order.collectionDate ? dateFormat.format(new Date(order.collectionDate)) : ''
  const buyer = t(buyers.find(item => item.id === order.buyerId).name)
  const orderRows = [
    ['Order ID', order.id], ['Product name', t(product.name)], ['Artisan name', artisan.name],
    ['Buyer', buyer], ['Ordered', order.quantity], ['Payout status', t(payoutStatus)],
  ]
  if (date) orderRows.push(['Collection date', date], ['Collection centre', t(operator.centre)])
  if (inspection) {
    orderRows.push(['Accepted pieces', inspection.accepted], ['Rejected pieces', inspection.rejected])
    if (inspection.rejected > 0) orderRows.push(['Rejection reason', inspection.reason])
  }

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
    <article className="card order" aria-label={t('Order for {name}', { name: t(product.name) })}>
      <div className="card-top">
        <h3>{t(product.name)}</h3>
        <span className="badge">{t(inspection ? 'Inspected' : order.collected ? 'Collected' : order.collectionDate ? 'Collection scheduled' : 'Awaiting collection schedule')}</span>
      </div>
      <p className="order-reference">{t('Order')} {order.id}</p>
      <p>{artisan.name} · {buyer}</p>
      <dl className="terms">
        <div><dt>{t('Ordered')}</dt><dd>{t('{count} pieces', { count: order.quantity })}</dd></div>
        <div><dt>{t('Agreed price')}</dt><dd>{money(order.unitPrice)} {t('per piece')}</dd></div>
        <div><dt>{t(inspection ? 'Adjusted deduction' : 'Agreed deduction')}</dt><dd>{money(inspection ? inspection.accepted * order.unitPrice - amount : order.deduction)}</dd></div>
        <div><dt>{t(inspection ? 'Inspected payout' : 'Estimated payout')}</dt><dd>{money(amount)}</dd></div>
        <div><dt>{t('Payout status')}</dt><dd>{t(payoutStatus)}</dd></div>
      </dl>
      {order.collectionDate && <p>{t('Collection at {centre} on {date}.', { centre: t(operator.centre), date })}</p>}
      {inspection && (
        <>
          <p>{t('Inspection: {accepted} accepted, {rejected} rejected.', inspection)}</p>
          {inspection.rejected > 0 && <p>{t('Rejection reason: {reason}. Rejected pieces are held for return.', inspection)}</p>}
        </>
      )}
      <div className="access-actions">
        <button className="secondary" onClick={() => print({
          title: 'Purchase order', rows: [...orderRows, ['Agreed price', money(order.unitPrice)], ['Agreed deduction', money(order.deduction)]],
        })}>{t('Print purchase order')}</button>
        {date && <button className="secondary" onClick={() => print({
          title: 'Packing checklist', rows: orderRows,
          steps: [
            'Count the pieces against the order.',
            'Wrap the pieces and label the parcel with the order ID.',
            'Bring the parcel to the collection centre on the scheduled date.',
          ],
        })}>{t('Print packing checklist')}</button>}
        {inspection && <button className="secondary" onClick={() => print({
          title: 'Inspection record', rows: orderRows,
        })}>{t('Print inspection record')}</button>}
        {order.collected && <button className="secondary" onClick={() => print({ title: 'Handover receipt', rows: orderRows })}>{t('Print handover receipt')}</button>}
        {order.paid && <button className="secondary" onClick={() => print({
          title: 'Payment acknowledgement', rows: [...orderRows, ['Inspected payout', money(amount)]],
        })}>{t('Print payment acknowledgement')}</button>}
      </div>
      {feedback && <p className={'feedback' + (feedback.error ? ' error' : '')} role={feedback.error ? 'alert' : 'status'}>{t(feedback.message)}</p>}
      {isBuyer && (
        <>
          {!order.collectionDate && (
            <form className="form" onSubmit={schedule}>
              <label>{t('Collection date')}<input name="collectionDate" type="date" required /></label>
              <button type="submit">{t('Schedule collection at Kendra')}</button>
            </form>
          )}
          {order.collectionDate && !order.collected && <button onClick={() => change(recordCollection, 'Collection recorded.')}>{t('Mark collected')}</button>}
          {order.collected && !inspection && (
            <form className="form" onSubmit={inspect}>
              <label>{t('Accepted pieces')}<input name="accepted" type="number" min="0" max={order.quantity} step="1" defaultValue={order.quantity} required /></label>
              <label>{t('Reason if any pieces are rejected')}<input name="reason" maxLength={160} /></label>
              <button type="submit">{t('Record inspection')}</button>
            </form>
          )}
          {inspection && amount > 0 && !order.paid && <button onClick={() => change(markPaid, 'Simulated payment recorded.')}>{t('Mark payout paid')}</button>}
          {inspection?.accepted > 0 && (
            <div className="resale">
              <h4>{t('Resale stock')}</h4>
              {allocation ? <p>{t('{count} pieces allocated to {channel}.', { count: allocation.quantity, channel: t(allocation.channel) })}</p> : (
                <>
                  <p>{t('{count} unallocated pieces · {channel}', { count: inspection.accepted, channel: t(resaleChannel) })}</p>
                  {order.paid || amount === 0 ?
                    <button onClick={() => change(allocateStock, 'Stock allocated.')}>{t('Allocate to exhibition')}</button> :
                    <p>{t('Record the payout before allocating stock.')}</p>}
                </>
              )}
            </div>
          )}
        </>
      )}
    </article>
  )
}

export default function Orders({ state, role, update, money, active, print }) {
  const { t } = useLocale()
  const orders = state.orders.flatMap(order => {
    const product = state.products.find(item => item.id === order.productId)
    if (!product) return []
    const artisan = ownerOf(state, product)
    if (role === 'operator' || (role === 'artisan' ? artisan?.id === active.id : order.buyerId === role)) {
      return [{ order, product, artisan }]
    }
    return []
  })
  return (
    <section aria-labelledby="orders">
      <h2 className="section-title" id="orders">{t('Purchase orders')}</h2>
      {orders.length === 0 ? <p>{t('Orders appear here after the artisan accepts an offer.')}</p> : (
        <div className="order-list">
          {orders.map(({ order, product, artisan }) => (
            <OrderCard key={role + ':' + order.id} order={order}
              product={product} artisan={artisan} role={role} update={update} money={money} print={print} />
          ))}
        </div>
      )}
    </section>
  )
}
