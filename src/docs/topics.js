export const groups = [
  ['Getting started', ['overview', 'participants', 'accounts']],
  ['Using KalaSetu', ['kendra', 'buyers', 'product-to-sale']],
  ['Orders and payment', ['publication', 'offers', 'collection', 'after-payment']],
]

export const topics = {
  overview: {
    title: 'What KalaSetu does', photo: 'bandhani',
    intro: 'KalaSetu is a college prototype for Kendra-assisted purchasing of rural crafts. It follows a batch of goods from the artisan’s workshop to a buyer, then tracks what happens to the stock after acceptance.',
    sections: [
      ['The problem it illustrates', 'An artisan may have finished work and a price in mind, but need help describing the batch, reaching buyers, and retaining a record of what was agreed. KalaSetu gives the artisan, operator, and buyer a shared vocabulary for those steps: draft, published listing, offer, order, inspection, and payout.'],
      ['Follow a single batch', 'Start with 12 baskets. Publishing makes them visible to buyers. Accepting an offer for five reserves five and leaves seven available. If only three pass inspection, the buyer records two held for return and can allocate only the three accepted baskets to resale.'],
      ['What you can try', 'Use Listing to prepare a draft, Find Center to explore sample localities, and Demo to act as each participant. Government buyers, Kendra participation, and payments in the application are simulated. The photographs provide editorial context and do not imply endorsement or affiliation.'],
    ],
    action: ['#demo', 'Open the demo'],
  },
  participants: {
    title: 'Who can use it', photo: 'potter',
    intro: 'The demo can represent an individual maker, a family workshop, or a craft group through an artisan profile. Operators, buyers, and evaluators each have a separate part in the workflow.',
    sections: [
      ['Artisans and workshop representatives', 'A potter can list a batch of finished lamps. A textile workshop might list matching pieces. A group can pick one representative to enter the listing after agreeing on ownership, batch capacity, and how payment is shared. Each listing has one selected artisan profile.'],
      ['Assistance and decision-making', 'An operator can type information, review the photo, and print a registration slip. The artisan reviews the description, quantity, and price and decides which purchase offer to accept. The operator role can help with records while the Artisan workspace exposes the offer decision.'],
      ['Practice without submitting personal data', 'Students, trainers, and evaluators can switch between the seeded roles in one browser. Use the existing sample artisan or create a fictional profile. Keep identification numbers, bank details, and personal paperwork out of the demo.'],
    ],
  },
  accounts: {
    title: 'Accounts, access, and records', photo: 'bandhani',
    intro: 'The app saves profiles, images, listings, offers, and order status in browser storage. The currently selected demo role changes the view. Role selection is part of the simulation.',
    sections: [
      ['Which records you can see', 'The operator and artisan can select a profile and see the corresponding listings. Buyers can browse published listings and manage orders assigned to their own buyer role. The order reference links the offer, collection, inspection, and payment records.'],
      ['Refresh, another device, and reset', 'Refreshing on the same browser preserves saved records. Another browser or private session starts with its own data. Reset demo restores the seed and removes the locally added records for this demo, while the browser’s language preference is managed separately.'],
      ['What a real rollout would require', 'A production service would need verified accounts, authorization, secure shared storage, audit records, agreed participation from Kendras and buyers, and payment reconciliation. Printouts in this prototype document demo actions and have no payment or procurement effect.'],
    ],
  },
  kendra: {
    title: 'Kendra operators', photo: 'bhujodi',
    intro: 'The operator helps turn what the maker brings into a listing that a buyer can understand. A sample centre pin is a starting point for exploring the demo.',
    sections: [
      ['Before the visit', 'Use Find Center to search by locality or PIN code. The bundled pins are examples. Confirm the address, hours, and services with a real centre before travelling. Bring a sample or photo, the count available now, and the asking price per piece.'],
      ['Register, select, and review', 'Ask for consent and create the sample profile in Demo or Listing. Select the right profile before creating the draft. Read back the product name, category, quantity, unit price, and photo. Check that a buyer could tell what one unit includes.'],
      ['Publish and support collection', 'Publish only after the artisan has reviewed the draft. Print the listing confirmation where useful, and keep the order reference handy for pickup. The buyer records collection and inspection. The operator can help the artisan interpret the resulting documents and status.'],
    ],
    action: ['#locator', 'Find Center'],
  },
  buyers: {
    title: 'Buyers and evaluators', photo: 'exhibition',
    intro: 'The demo represents two potential buyers, a district handicrafts office and a craft emporium. Their offers, collection actions, and payment records are simulated.',
    sections: [
      ['Prepare a purchase offer', 'Review the photo and the quantities shown as available. Enter the amount you want to reserve, the price per piece, and any fixed deduction in rupees. The net payout is displayed so the artisan can compare terms with another buyer’s offer.'],
      ['Manage the order you win', 'After acceptance, return to the same buyer role to schedule collection and record handover. Inspect the pieces and give a reason for any rejected quantity. Mark the payout recorded and allocate eligible stock after settlement.'],
      ['Run an evaluation', 'Publish the seeded baskets, send one offer as each buyer, and accept one as the artisan. Switch to the other buyer to verify that the winning order is absent there, then switch back to the winning buyer and complete inspection. Historical exhibition photos are included for context without implying involvement in KalaSetu.'],
    ],
    action: ['#demo', 'Open the demo'],
  },
  'product-to-sale': {
    title: 'From making a product to selling it', photo: 'lamps',
    intro: 'Use this checklist to prepare a batch before entering it in Listing. The smallest useful listing specifies a consistent sale unit, a quantity that is ready now, and a price per unit.',
    sections: [
      ['Prepare and photograph the batch', 'Decide whether one unit is a single piece, a pair, or a set. Check dimensions, finish, defects, and packaging. Photograph a representative piece in daylight and avoid showing materials, packaging, or sets that the buyer will not receive. The form accepts JPEG, PNG, or WebP up to 5 MB.'],
      ['Set a price and publish', 'Add materials, labour, overhead, and packaging, then divide across sale-ready units. For example, ₹1,800 in costs across 12 pieces is ₹150 per piece before margin. Add the margin and enter the asking price per piece. Select the profile, fill in the form, preview the photo, and save the draft. Review it before publishing.'],
      ['Review offers and finish the sale', 'Open Demo as the artisan to compare offers and accept one before expiry. Pack the accepted order quantity and label it with the order reference. After handover and inspection, check the accepted count and payout. Print the acknowledgement once the simulated payment is recorded.'],
    ],
    action: ['#listing', 'Listing'],
  },
  publication: {
    title: 'What happens after publication', photo: 'bhujodi',
    intro: 'Publication moves the listing from the operator’s draft view into the buyer catalogue. The asking price and available stock give buyers a basis for making an offer.',
    sections: [
      ['Show a listing to buyers', 'In Listing, select the artisan profile, confirm the draft, and click Publish listing. Switch to a buyer in Demo and check the product name, photo, and asking price. Buyers cannot offer on unpublished drafts.'],
      ['From pending offers to a reservation', 'An offer proposes a quantity, a price per piece, and a total deduction. Several offers can be pending at once. Inventory changes at acceptance, and the selected quantity is reserved by an order. Offers above the remaining stock cannot be accepted.'],
      ['Handle expiry and availability', 'New pending offers expire after seven days. Expiry keeps the offer visible as history without reserving any stock. When two pending offers overlap, accept only the quantities that make sense for the batch and check the remaining available count.'],
    ],
  },
  offers: {
    title: 'How to compare offers', photo: 'lamps',
    intro: 'Compare the amount you would actually receive and how much stock you would commit. A larger offer may pay more in total simply because it requests more pieces.',
    sections: [
      ['Calculate the net amount', 'Multiply the quantity by the offered unit price, then subtract the deduction. Five baskets at ₹320 with a ₹50 deduction pay ₹1,550, or ₹310 per basket. Ten at ₹330 with a ₹110 deduction pay ₹3,190, or ₹319 per basket.'],
      ['Consider the stock commitment', 'The second offer yields more per piece but commits twice as many pieces. From 12 pieces, accepting the first leaves seven. The second then exceeds the remaining stock. Pending offers never guarantee inventory.'],
      ['Check the effect of inspection', 'The offer amount is an estimate before inspection. If only three of the five baskets pass, the deduction is prorated to ₹30. Three at ₹320 minus ₹30 produces a ₹930 inspected payout.'],
    ],
  },
  collection: {
    title: 'Collection, inspection, and payout', photo: 'potter',
    intro: 'An accepted offer becomes a purchase order. Collection confirms the handover. Inspection records which pieces count toward the amount due.',
    sections: [
      ['Prepare for handover', 'The buyer schedules collection at the demo Kendra. Use the packing checklist and verify the order reference and quantity. The buyer marks the order collected and can print a handover receipt.'],
      ['Inspect and document the result', 'Enter the count accepted. The app derives the rejected count from the order quantity. Enter a reason for any rejection. Accepted units contribute to payout; rejected pieces stay held for return and cannot enter the exhibition allocation.'],
      ['Verify the amount and status', 'The final amount is the accepted value minus the proportional share of the agreed deduction, rounded to the nearest paise. The buyer marks the payment recorded, and the artisan or operator can view payment status and print the acknowledgement. A fully rejected batch has no payout.'],
    ],
  },
  'after-payment': {
    title: 'After the artisan is paid', photo: 'craft-fair',
    intro: 'The buyer can allocate eligible purchased stock to the example exhibition after settling the simulated payout. This stage tracks where the stock goes after the artisan’s sale.',
    sections: [
      ['Allocate only eligible pieces', 'Open the order in the winning buyer workspace and check the accepted inspection quantity. Once payment is settled, allocate the accepted units to the KalaSetu Craft Exhibition. The recorded allocation cannot be repeated.'],
      ['Separate procurement and resale', 'The artisan sale refers to the settled order with the buyer. Whether a piece later sells or remains at an exhibition does not change the payout already recorded in the demo. Rejected stock stays separate from resale.'],
      ['Keep the records together', 'Retain the order reference, inspection record, and payment acknowledgement for the demo walkthrough. The archival fair image illustrates a craft exhibition in India. The exhibition in KalaSetu and its allocation records are examples within the prototype.'],
    ],
  },
}
