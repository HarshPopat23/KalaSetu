import React, { useEffect, useRef } from 'react'
import { Guides } from './Access.jsx'
import { groups, topics } from './docs/topics.js'
import { photos } from './docs/photos.js'
import { useLocale } from './locale.jsx'

const listingSteps = [
  'Choose one product and define the unit you are selling. Keep the materials, size, colour, and finish consistent across the batch.',
  'Check each piece for damage or variation. Count the sale-ready units and set aside any pieces that still need work.',
  'Add materials, time, packaging and expected transport costs. Use the result and your desired margin to set an asking price per piece.',
  'Photograph one representative piece in daylight against a plain background. Make the whole piece visible and show scale where possible.',
  'Select the artisan profile in Listing. Enter the product name, craft category, quantity and price, and optionally add a photo. Save the draft.',
  'Review the saved details with the artisan, then publish. Open Demo as a buyer to confirm the published photo, quantity, and asking price.',
  'As the artisan, compare offers by quantity, unit price, deductions and total payout. Accept the offer you want before its deadline.',
  'Pack the reserved quantity, label it with the order ID, and follow the collection instructions. Save the handover receipt and review the inspection result.',
  'Check the final payout and print the payment acknowledgement when payment is recorded. Any rejected pieces stay held for return in the demo.',
]

const demoSteps = [
  'Start as Kendra operator. Select Meera Rabari or register a sample artisan with consent. You can print the registration slip.',
  'For the seeded walkthrough, publish Handwoven baskets from the operator workspace. To try your own product, create and publish it in Listing, then return here.',
  'As Buyer 1, offer ₹320 per basket for 5 pieces with a ₹50 deduction. As Buyer 2, offer ₹330 each for 10 with a ₹110 deduction.',
  'Switch to Artisan and compare the offers. Accept Buyer 1 for a ₹1,550 estimated payout. The order reserves five pieces, leaving seven available.',
  'Switch to Buyer 1, schedule collection, and mark the order collected. Inspect three pieces as accepted and give a reason for rejecting two. The inspected payout is ₹930.',
  'Mark the payout paid and allocate the three accepted pieces to the exhibition. Use the order buttons to print the inspection or payment record.',
  'Switch back to Artisan to see payment status. Reload to verify your saved records or use Reset demo to restore the seed data.',
]

export function Instructions({ variant }) {
  const { t } = useLocale()
  const demo = variant === 'demo'
  return (
    <section className="card instructions">
      <h2>{t(demo ? 'Demo walkthrough' : 'From making a product to selling it')}</h2>
      <ol>{(demo ? demoSteps : listingSteps).map(step => <li key={step}>{t(step)}</li>)}</ol>
    </section>
  )
}

const topicRoute = slug => '#docs/' + slug
const slugs = groups.flatMap(([, entries]) => entries)

function TopicPhoto({ photo }) {
  const { language, t } = useLocale()
  const [licenseName, licenseUrl] = photo.license
  return (
    <figure className="docs-photo">
      <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} />
      <figcaption lang="en">
        {photo.caption}{' '}
        <a href={photo.source}>{photo.author}</a>{' · '}
        <a href={licenseUrl}>{licenseName}</a>{' · '}
        <span lang={language}>{t('Resized for KalaSetu')}</span>
      </figcaption>
    </figure>
  )
}

export default function Documentation({ topicSlug, print }) {
  const { t } = useLocale()
  const heading = useRef(null)
  const slug = topicSlug || 'overview'
  const index = slugs.indexOf(slug)
  const topic = index >= 0 ? topics[slug] : undefined
  const previous = slugs[index - 1]
  const next = index >= 0 ? slugs[index + 1] : undefined

  useEffect(() => {
    heading.current?.focus()
  }, [slug])

  return (
    <div className="docs-layout">
      <aside className="docs-sidebar">
        <nav aria-label={t('Documentation topics')}>
          <a className="docs-sidebar-title" href="#docs">{t('KalaSetu documentation')}</a>
          {groups.map(([label, entries]) => (
            <details key={label} open={entries.includes(slug)}>
              <summary>{t(label)}</summary>
              <ul>
                {entries.map(id => (
                  <li key={id}>
                    <a href={topicRoute(id)} aria-current={id === slug ? 'page' : undefined}>{t(topics[id].title)}</a>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </nav>
      </aside>
      <article className="docs-article" aria-labelledby="docs-topic-title">
        <h1 id="docs-topic-title" tabIndex={-1} ref={heading}>{t(topic?.title ?? 'Documentation page not found')}</h1>
        {topic ? (
          <>
            <p className="docs-intro" lang="en">{topic.intro}</p>
            <TopicPhoto photo={photos[topic.photo]} />
            {topic.sections.map(([title, body]) => (
              <section className="docs-section" key={title} lang="en">
                <h2>{title}</h2>
                <p>{body}</p>
              </section>
            ))}
            {topic.action && <p><a href={topic.action[0]}>{t(topic.action[1])}</a></p>}
            {slug === 'product-to-sale' && <Guides print={print} />}
            <nav className="docs-pagination" aria-label={t('Adjacent documentation pages')}>
              {previous && <a href={topicRoute(previous)} rel="prev">{t('Previous')}: {t(topics[previous].title)}</a>}
              {next && <a href={topicRoute(next)} rel="next">{t('Next')}: {t(topics[next].title)}</a>}
            </nav>
          </>
        ) : <p><a href="#docs">{t('Back to documentation')}</a></p>}
      </article>
    </div>
  )
}
