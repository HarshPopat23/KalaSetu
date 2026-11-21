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
