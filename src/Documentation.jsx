import React from 'react'
import { useLocale } from './locale.jsx'

const sections = [
  ['What KalaSetu does', 'KalaSetu demonstrates assisted purchasing for rural crafts. It connects the person making the product, a Kendra operator who helps prepare the listing, and simulated public-sector buyers who make purchase offers. A buyer can later allocate inspected stock to the example exhibition.'],
  ['Who can use it', 'Individual artisans, family workshops, and craft groups can use the artisan journey to prepare products and review offers. A group should agree who represents it, who owns the stock, and how proceeds are shared before listing.'],
  ['Kendra operators', 'An operator can register a sample artisan with consent, select their profile, check product details with them, and print records. The operator helps enter the information. The artisan decides whether to accept an offer.'],
  ['Buyers and evaluators', 'The two demo buyers represent a district office and a craft emporium. Each can make offers and manage its own orders. A visitor or evaluator can switch between roles to see how the same transaction appears to each participant.'],
  ['Accounts, access, and records', 'The application is a college prototype. Profiles, listings, photographs, orders, and payment status are stored in the current browser. Role switching simulates different participants. A real service would need verified identities, authorization, shared storage, procurement rules, and payment integration.'],
  ['What happens after publication', 'Buyers can see published listings and propose a quantity, unit price, and deduction. Compare offers using the quantity and net payout as well as the unit price. New offers expire after seven days. Acceptance creates a purchase order and reserves the offered quantity, leaving the rest available.'],
  ['How to compare offers', 'Net payout equals quantity × unit price minus the deduction. For example, 5 baskets at ₹320 with a ₹50 deduction yield ₹1,550. If two buyers request different quantities, compare the net amount per unit as well as total payout. A higher total may simply mean the buyer wants more pieces.'],
  ['Collection, inspection, and payout', 'The buyer schedules collection and records handover at the Kendra. During inspection the buyer records how many pieces were accepted and explains any rejection. The payout is based on accepted pieces minus a proportional share of the deduction. Rejected items remain held for return and cannot be allocated to resale.'],
  ['After the artisan is paid', 'The buyer marks payment as recorded in the demo. The artisan and operator can view its status and print the acknowledgement. The buyer allocates accepted units to the exhibition. The artisan payout is tracked independently of later resale.'],
]

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

export default function Documentation() {
  const { t } = useLocale()
  return (
    <section className="documentation">
      <h1>{t('KalaSetu documentation')}</h1>
      {sections.map(([title, body]) => (
        <section key={title}>
          <h2>{t(title)}</h2>
          <p>{t(body)}</p>
        </section>
      ))}
      <Instructions />
    </section>
  )
}
