# KalaSetu

A React college prototype for Kendra-assisted craft listings and simulated government purchase offers. Listings, offers, and inventory stay in the current browser. Use a single demo tab for the walkthrough.

## Run locally

Use Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Run `npm test` for purchase rules and `npm run build` to build the static site.

## Try the purchase loop

1. Open **Kendra operator** and publish the draft **Handwoven baskets**. The operator can also create a draft for the seeded artisan, Meera Rabari.
2. Open **Buyer 1** and offer to buy 5 baskets at ₹320 each, with ₹0 deduction.
3. Open **Buyer 2** and offer to buy 10 baskets at ₹330 each, with ₹110 deduction.
4. Open **Artisan** and compare the two offers. Accept Buyer 1's offer. The listing now shows 7 available and 5 reserved. Buyer 2's offer exceeds remaining stock.
5. Reload and switch back to **Artisan** to see the saved state. Use **Reset demo** to restore the original seed.

Purchase acceptance reserves stock in this prototype. The people, organizations, and offers are demo records.

## Fulfil an order and record payout

1. Accept a buyer's offer as the **Artisan**. KalaSetu creates a purchase order automatically. Existing accepted offers saved by the earlier demo also appear as orders.
2. Switch to the buyer whose offer was accepted. In **Purchase orders**, choose a collection date at the Kendra and select **Mark collected** after the simulated handover.
3. Record the number of pieces that pass inspection. Give a reason for any rejected pieces, which remain held for return.
4. Check the final payout. It equals the value of the accepted pieces minus their proportional share of the agreed deduction, rounded to the nearest paise. Mark the payout paid to record the simulated payment.
5. Allocate the accepted pieces to the **KalaSetu Craft Exhibition**. The artisan and operator can view order progress and payout status. The buyer sees resale allocation.

## Rural access

- **Find a Kendra** accepts a village, district, or PIN code. Open a Google Maps search or the CSC locator. After choosing a centre, enter its name and address to open directions. Centre results and directions need internet access. Ask the centre about its services before travelling.
- **Kendra operator** can register an artisan using sample details and the artisan's consent. Select that profile before creating a listing. Switch to **Artisan** to see that profile's published listings, offers, and orders. Profiles and the selected profile are saved in the current browser. Earlier demo listings still belong to Meera Rabari.
- **Language** switches the interface and guides between English, Hindi, and Gujarati and saves the selection. The preferred language on a profile is recorded on the registration slip. The operator can change the interface language independently.
- **Step-by-step guides** covers the visit checklist and instructions for the artisan, operator, and buyer. Print the visit checklist, registration slip, published listing confirmation, purchase order, packing checklist once scheduled, handover receipt after collection, inspection record, or payment acknowledgement after simulated payment. Use the browser print dialog to print or save a PDF.

## Verify the demo in a clean browser

```sh
npm ci
npx playwright install chromium
npm run test:e2e
```

The Playwright suite opens fresh Chromium contexts against the production build. It covers role switching, reload persistence, partial orders, expired offers, rejected quantities, locator links, narrow layouts, and cancelling or confirming **Reset demo**. Locator tests check the link destinations and encoded inputs the app controls. The browser clock advances in the expiry test so there is no wait.

New offers expire seven days after sending. Expired offers remain visible in history and cannot create an order or reserve stock. Accepted orders and offers saved before deadlines were introduced retain their original behaviour.

## Navbar

- **Docs** explains the participants, purchase workflow, pricing, and steps from making a craft to receiving a payout.
- **Find Center** uses interactive OpenStreetMap tiles with zoom, drag, and markers. The three bundled centre cards describe sample localities. Use the external directory to find real centres and confirm their addresses and hours. Live tiles require internet access.
- **Demo** contains role switching, the existing seeded workspace and order flow, and a numeric walkthrough.
- **Listing** contains the artisan profile selector, draft form, publication controls, and listing guide. JPEG, PNG, or WebP photos up to 5 MB are resized before being saved in browser storage. Photos are available to demo roles in the same browser.
