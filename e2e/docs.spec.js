import { expect, test } from '@playwright/test'

const pages = [
  ['overview', 'What KalaSetu does'],
  ['participants', 'Who can use it'],
  ['accounts', 'Accounts, access, and records'],
  ['kendra', 'Kendra operators'],
  ['buyers', 'Buyers and evaluators'],
  ['product-to-sale', 'From making a product to selling it'],
  ['publication', 'What happens after publication'],
  ['offers', 'How to compare offers'],
  ['collection', 'Collection, inspection, and payout'],
  ['after-payment', 'After the artisan is paid'],
]

test('docs topics have separate URLs, local credited photos, and responsive navigation', async ({ page }) => {
  await page.goto('/#docs')
  const article = page.getByRole('article')
  const sidebar = page.getByRole('navigation', { name: 'Documentation topics' })
  const siteNav = page.getByRole('navigation', { name: 'Main navigation' })
  await expect(article.getByRole('heading', { level: 1 })).toHaveText(pages[0][1])

  for (const [index, [slug, title]] of pages.entries()) {
    const link = sidebar.locator('a[href="#docs/' + slug + '"]')
    if (!(await link.isVisible())) {
      await link.locator('xpath=ancestor::details/summary').click()
    }
    await link.click()
    await expect(page).toHaveURL(new RegExp('#docs/' + slug + '$'))
    await expect(link).toHaveAttribute('aria-current', 'page')
    await expect(siteNav.getByRole('link', { name: 'Docs' })).toHaveAttribute('aria-current', 'page')
    await expect(article.getByRole('heading', { level: 1 })).toHaveText(title)
    await expect(article.locator('.docs-section')).toHaveCount(3)
    const image = article.getByRole('img')
    await expect(image).toHaveAttribute('alt', /\S/)
    await expect.poll(() => image.evaluate(element => element.naturalWidth)).toBeGreaterThan(0)
    expect(new URL(await image.getAttribute('src'), page.url()).origin).toBe(new URL(page.url()).origin)
    await expect(article.locator('figcaption a').first()).toHaveAttribute('href', /^https:\/\/commons\.wikimedia\.org\/wiki\/File:/)
    await expect(article.locator('figcaption a')).toHaveCount(2)
    if (index > 0) await expect(article.locator('[rel="prev"]')).toHaveAttribute('href', '#docs/' + pages[index - 1][0])
  }

  await page.reload()
  await expect(article.getByRole('heading', { level: 1 })).toHaveText('After the artisan is paid')
  await expect(article.locator('figcaption')).toContainText('Archival photo')
  await page.setViewportSize({ width: 320, height: 740 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
  await article.getByRole('link', { name: /Previous/ }).click()
  await expect(article.getByRole('heading', { level: 1 })).toHaveText('Collection, inspection, and payout')
  await page.goBack()
  await expect(article.getByRole('heading', { level: 1 })).toHaveText('After the artisan is paid')
  await page.goto('/#docs/missing')
  await expect(article.getByRole('heading', { level: 1 })).toHaveText('Documentation page not found')
  await article.getByRole('link', { name: 'Back to documentation' }).click()
  await expect(article.getByRole('heading', { level: 1 })).toHaveText('What KalaSetu does')
})
