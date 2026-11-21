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
