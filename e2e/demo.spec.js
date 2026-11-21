import { expect, test } from '@playwright/test'

function role(page, name) {
  return page.getByRole('button', { name, exact: true }).click()
}

function listing(page, name) {
  return page.locator('.products article.card').filter({
    has: page.getByRole('heading', { name, exact: true }),
  })
}

async function offer(page, name, quantity, unitPrice, deduction) {
  const product = listing(page, name)
  await product.getByRole('button', { name: 'Make an offer' }).click()
  await product.getByLabel('Offer quantity').fill(String(quantity))
  await product.getByLabel('Offer price per piece (₹)').fill(String(unitPrice))
  await product.getByLabel('Total deduction (₹)').fill(String(deduction))
  await product.getByRole('button', { name: 'Send offer' }).click()
  await expect(page.getByRole('status')).toContainText('Offer sent')
}

test('a clean session switches roles, keeps a partial order on reload, records a rejection and resets', async ({ page }) => {
  await page.goto('/')
  const baskets = listing(page, 'Handwoven baskets')
  const order = page.getByRole('article', { name: 'Order for Handwoven baskets' })
  await expect(page.getByRole('heading', { name: 'Kendra operator workspace' })).toBeVisible()
  await expect(page.locator('.products article.card')).toHaveCount(3)
  await expect(baskets).toContainText('draft')

  await role(page, 'Buyer 1')
  await expect(baskets).toHaveCount(0)
  await role(page, 'Kendra operator')
  await baskets.getByRole('button', { name: 'Publish listing' }).click()
  await role(page, 'Buyer 1')
  await offer(page, 'Handwoven baskets', 5, 320, 50)
  await role(page, 'Buyer 2')
  await offer(page, 'Handwoven baskets', 10, 330, 110)
  await expect(baskets.getByText('District Handicrafts Office')).toHaveCount(0)
  await role(page, 'Artisan')
  await expect(baskets).toContainText('₹1,550')
  await expect(baskets).toContainText('₹3,190')
  await baskets.locator('article.offer').filter({ hasText: 'District Handicrafts Office' })
    .getByRole('button', { name: 'Accept offer' }).click()
  await expect(baskets).toContainText(/Available\s*7\s*Reserved\s*5/)
  await expect(baskets).toContainText('Insufficient stock')
  await expect(order).toHaveCount(1)

  await page.reload()
  await role(page, 'Buyer 2')
  await expect(order).toHaveCount(0)
  await role(page, 'Buyer 1')
  await expect(order).toContainText('₹1,550')
  const collectionDate = new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10)
  await order.getByLabel('Collection date').fill(collectionDate)
  await order.getByRole('button', { name: 'Schedule collection at Kendra' }).click()
  await order.getByRole('button', { name: 'Mark collected' }).click()
  await order.getByLabel('Accepted pieces').fill('3')
  await order.getByRole('button', { name: 'Record inspection' }).click()
  await expect(order.getByRole('alert')).toContainText('Explain why')
  await order.getByLabel('Reason if any pieces are rejected').fill('Damaged rim')
  await order.getByRole('button', { name: 'Record inspection' }).click()
  await expect(order).toContainText('3 accepted, 2 rejected')
  await expect(order).toContainText('Damaged rim')
  await expect(order).toContainText('₹930')
  await expect(baskets).toContainText(/Available\s*7\s*Reserved\s*0\s*Purchased\s*3\s*Held for return\s*2/)

  await role(page, 'Kendra operator')
  await page.getByText('Register an artisan at the Kendra', { exact: true }).click()
  await page.getByLabel('Artisan name', { exact: true }).fill('Reva Demo')
  await page.getByLabel('Village or locality', { exact: true }).fill('Mandvi')
  await page.getByRole('checkbox').check()
  await role(page, 'Register artisan')
  await expect(page.getByRole('combobox', { name: 'Artisan profile' })).toContainText('Reva Demo')

  page.once('dialog', dialog => dialog.dismiss())
  await role(page, 'Reset demo')
  await expect(order).toBeVisible()
  page.once('dialog', dialog => dialog.accept())
  await role(page, 'Reset demo')
  await expect(order).toHaveCount(0)
  await expect(baskets).toContainText('draft')
  await expect(baskets).toContainText(/Available\s*12\s*Reserved\s*0/)
  await page.reload()
  await expect(page.getByRole('combobox', { name: 'Artisan profile' })).not.toContainText('Reva Demo')
  await expect(baskets).toContainText('draft')
  await role(page, 'Artisan')
  await expect(page.locator('article.offer')).toHaveCount(0)
  await expect(order).toHaveCount(0)
})

test('a pending offer expires in an open page and stays in history after reload', async ({ page }) => {
  await page.clock.install({ time: new Date('2030-10-10T09:00:00Z') })
  await page.goto('/')
  await role(page, 'Buyer 1')
  await offer(page, 'Bandhani dupattas', 5, 450, 0)
  await role(page, 'Artisan')
  const product = listing(page, 'Bandhani dupattas')
  await expect(product.getByRole('button', { name: 'Accept offer' })).toBeVisible()
  await page.clock.fastForward(7 * 86400000 + 1000)
  await expect(product.getByText('Expired', { exact: true })).toBeVisible()
  await expect(product.getByRole('button', { name: 'Accept offer' })).toHaveCount(0)
  await expect(product).toContainText(/Available\s*30\s*Reserved\s*0/)
  await page.reload()
  await role(page, 'Artisan')
  await expect(product.getByText('Expired', { exact: true })).toBeVisible()
  await expect(page.getByRole('article', { name: 'Order for Bandhani dupattas' })).toHaveCount(0)
})

test('locator links preserve address characters and fit a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.goto('/')
  await page.getByRole('link', { name: 'Find a Kendra' }).click()
  await expect(page).toHaveURL(/#locator$/)
  await page.getByLabel('Village, district, or PIN code').fill('ભુજ & 370001')
  for (const [name, query] of [
    ['Search Jan Suvidha Kendra on Google Maps', 'Jan Suvidha Kendra near ભુજ & 370001, India'],
    ['Search Common Service Centres on Google Maps', 'Common Service Centre near ભુજ & 370001, India'],
  ]) {
    const link = page.getByRole('link', { name, exact: true })
    const url = new URL(await link.getAttribute('href'))
    expect(url.origin + url.pathname).toBe('https://www.google.com/maps/search/')
    expect(url.searchParams.get('api')).toBe('1')
    expect(url.searchParams.get('query')).toBe(query)
    await expect(link).toHaveAttribute('target', '_blank')
  }
  await expect(page.getByRole('link', { name: 'Open CSC locator' })).toHaveAttribute('href', 'https://locator.csccloud.in/')
  await page.getByLabel('Selected centre name and address').fill('CSC #1, Station Road')
  const directions = new URL(await page.getByRole('link', { name: 'Get directions on Google Maps' }).getAttribute('href'))
  expect(directions.origin + directions.pathname).toBe('https://www.google.com/maps/dir/')
  expect(directions.searchParams.get('api')).toBe('1')
  expect(directions.searchParams.get('destination')).toBe('CSC #1, Station Road')

  await page.getByRole('combobox', { name: 'Language' }).selectOption('gu')
  await expect(page.getByRole('heading', { name: 'નજીકનું કેન્દ્ર શોધો' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'gu')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('lang', 'gu')
})
