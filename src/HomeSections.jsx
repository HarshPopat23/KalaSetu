import React from 'react'
import { photos } from './docs/photos.js'
import { useLocale } from './locale.jsx'
import { buyers, seed } from './purchase.js'
import './home-sections.css'

const audience = [
  ['For artisans', 'Bring a product sample, photos, a count of ready stock, and an asking price. Use the listing to make those details clear before reviewing offers.'],
  ['For Kendra operators', 'Help makers register a sample profile with consent, enter their listing details, and check the draft together before publishing.'],
  ['For buyers', 'Browse published listings, make an offer with clear terms, and record collection, inspection, and payout for accepted orders.'],
]

const workflow = [
  ['Prepare the product', 'Decide what counts as one sellable unit. Inspect the batch, photograph a representative piece in daylight, and separate ready stock from items still in production.'],
  ['Publish a listing', 'Select the artisan profile, enter the product name, category, quantity, and price per piece, then add a photo. Review the saved draft before publishing it.'],
  ['Compare purchase offers', 'Check each buyer’s requested quantity, unit price, and deductions. Accept the offer you want before its deadline. The accepted quantity is reserved for collection.'],
  ['Complete the order', 'The buyer schedules collection and records how many pieces pass inspection. The demo tracks the resulting payout separately from stock allocated to resale.'],
]

const resources = [
  ['Prepare a craft for sale', 'Plan a batch, price it, and take a useful product photo.', '#docs/product-to-sale'],
  ['Find a centre', 'Search for demo centres and open external map and directory links.', '#locator'],
  ['Create a listing', 'Save a draft, add a product photo, and publish from the listing workspace.', '#listing'],
  ['Try the purchase demo', 'Switch between artisan, operator, and buyer roles to complete an order.', '#demo'],
  ['Compare offers', 'See how quantity and deductions change what the artisan would receive.', '#docs/offers'],
  ['Track inspection and payout', 'Follow handover, accepted quantities, and the simulated payment record.', '#docs/collection'],
]

const crafts = [
  ['Bandhani textiles', photos.bandhani, 'Describe the fabric, dimensions, colour, and pattern. Mention any variation between pieces so the buyer can judge the batch from the listing.'],
  ['Handmade pottery', photos.potter, 'Photograph the shape and finish, include dimensions, and check every piece for chips or cracks before counting the stock available.'],
  ['Terracotta lamps', photos.lamps, 'Say whether the price is per lamp or per set. Record how many sets are ready and pack fragile pieces individually for collection.'],
]

const questions = [
  ['Is KalaSetu a live government scheme?', 'KalaSetu is an independent college prototype. The buyer roles, purchase orders, and payouts represent a simulated process.'],
  ['What should I take to a Kendra?', 'For the demo journey, prepare sample product details, a photo if available, the quantity ready, and the asking price. Check a real centre’s address, hours, and available services before travelling.'],
  ['What happens if some pieces fail inspection?', 'The buyer records the accepted count and explains the rejected quantity. The demo holds rejected pieces for return and calculates the payout from accepted pieces, with the deduction adjusted proportionally.'],
  ['Where are my listings saved?', 'Demo profiles, listings, photos, offers, and orders are stored in the current browser. A different device or private session has its own data. Reset demo restores the seeded example.'],
]

function Photo({ photo }) {
  const { t } = useLocale()
  return (
    <figure className="home-content-photo">
      <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" />
      <figcaption lang="en">
        <a href={photo.source}>{photo.author}</a> · <a href={photo.license[1]}>{photo.license[0]}</a> · {t('Resized for KalaSetu')}
      </figcaption>
    </figure>
  )
}

export default function HomeSections() {
  const { t } = useLocale()
  const metrics = [
    [seed.products.length, 'Sample product listings', 'Explore the seeded catalogue, including a draft ready to publish.', photos.bandhani],
    [buyers.length, 'Simulated buyers', 'Try competing purchase offers from the district office and craft emporium.', photos.bhujodi],
    [audience.length, 'Participant roles', 'See how a single purchase looks to the artisan, centre operator, and buyer.', photos.potter],
  ]

  return (
    <div className="home-content">
      <section className="home-band" aria-labelledby="home-impact">
        <h2 id="home-impact">{t('KalaSetu at a glance')}</h2>
        <p lang="en">Explore the sample records and roles available in the prototype.</p>
        <div className="home-impact-grid">
          {metrics.map(([count, title, description, photo]) => (
            <article className="home-impact-card" key={title}>
              <div>
                <strong className="home-impact-number">{count}</strong>
                <h3>{t(title)}</h3>
                <p lang="en">{description}</p>
              </div>
              <Photo photo={photo} />
            </article>
          ))}
        </div>
      </section>

      <section className="home-band home-about" aria-labelledby="home-about">
        <div>
          <h2 id="home-about">{t('About KalaSetu')}</h2>
          <p lang="en">A maker may have finished stock and a price in mind but still need help preparing a listing and tracking what a buyer agreed to purchase. KalaSetu explores how a Kendra-assisted workflow could help makers with those steps.</p>
          <p lang="en">The prototype follows one craft batch from the workshop through listing, offers, collection, and quality inspection. Each participant can see the records they need, including the order reference and the amount the artisan would receive after inspection.</p>
          <a className="home-content-link" href="#docs/overview">{t('Read the documentation')}</a>
        </div>
        <Photo photo={photos.bhujodi} />
      </section>

      <section className="home-band" aria-labelledby="home-for-whom">
        <h2 id="home-for-whom">{t('Who KalaSetu is for')}</h2>
        <div className="home-three-grid">
          {audience.map(([title, body]) => (
            <article className="home-text-card" key={title}>
              <h3>{t(title)}</h3>
              <p lang="en">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-band home-workflow" aria-labelledby="home-workflow">
        <h2 id="home-workflow">{t('From workshop to payout')}</h2>
        <ol>
          {workflow.map(([title, body]) => (
            <li key={title}>
              <h3>{t(title)}</h3>
              <p lang="en">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-band home-resources" aria-labelledby="home-resources">
        <div>
          <h2 id="home-resources">{t('Guides and tools')}</h2>
          <p lang="en">Go directly to the step you need. Start with a guide, prepare a listing, or try the whole purchase journey with sample data.</p>
        </div>
        <div className="home-resource-grid">
          {resources.map(([title, body, href]) => (
            <a className="home-resource-card" key={href} href={href}>
              <strong>{t(title)}</strong>
              <span lang="en">{body}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="home-band" aria-labelledby="home-crafts">
        <h2 id="home-crafts">{t('From the craft workshop')}</h2>
        <p lang="en">Examples of the details that help a buyer understand what is being offered.</p>
        <div className="home-three-grid">
          {crafts.map(([title, photo, body]) => (
            <article className="home-story-card" key={title}>
              <Photo photo={photo} />
              <div>
                <h3>{t(title)}</h3>
                <p lang="en">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="home-band home-faq" aria-labelledby="home-faq">
        <h2 id="home-faq">{t('Frequently asked questions')}</h2>
        {questions.map(([question, answer]) => (
          <details key={question}>
            <summary>{t(question)}</summary>
            <p lang="en">{answer}</p>
          </details>
        ))}
      </section>

      <section className="home-band home-project" aria-labelledby="home-project">
        <h2 id="home-project">{t('Explore the project')}</h2>
        <div className="home-three-grid">
          <article className="home-text-card">
            <h3>{t('Documentation')}</h3>
            <p lang="en">Read the full guide to roles, offers, inspection, and resale.</p>
            <a href="#docs">{t('Browse the guides')}</a>
          </article>
          <article className="home-text-card">
            <h3>{t('Interactive demo')}</h3>
            <p lang="en">See how a sample order and its records change as each participant completes their part.</p>
            <a href="#demo">{t('Try a sample order')}</a>
          </article>
          <article className="home-text-card">
            <h3>GitHub</h3>
            <p lang="en">Browse the implementation, follow changes, or share feedback through GitHub issues.</p>
            <a href="https://github.com/HarshPopat23/KalaSetu">{t('View the source code')}</a>
          </article>
        </div>
      </section>
    </div>
  )
}
