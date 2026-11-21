import { expect, test } from '@playwright/test'

test('home craft photos advance while the portrait and explanation stay in place', async ({ page }) => {
  await page.clock.install()
  await page.goto('/')
  const banner = page.getByRole('region', { name: 'KalaSetu', exact: true })
  const active = banner.locator('.home-hero-photos img.is-active')
  const portrait = banner.getByRole('img', { name: 'Portrait of Narendra Modi' })
  const originalPortrait = await portrait.getAttribute('src')
  await expect(portrait).toBeVisible()
  await expect.poll(() => portrait.evaluate(image => image.naturalWidth)).toBeGreaterThan(0)
  await expect(banner.getByText(/Government participation and payments are simulated/)).toBeVisible()
  const initial = await active.getAttribute('src')
  await page.clock.runFor(6100)
  await expect(active).not.toHaveAttribute('src', initial)

  await banner.getByRole('button', { name: 'Pause background photos' }).click()
  const paused = await active.getAttribute('src')
  await page.clock.fastForward(12000)
  await expect(active).toHaveAttribute('src', paused)
  await banner.getByRole('button', { name: 'Next background photo' }).click()
  await expect(active).not.toHaveAttribute('src', paused)
  await banner.getByRole('button', { name: 'Play background photos' }).click()
  const resumed = await active.getAttribute('src')
  await page.clock.runFor(6100)
  await expect(active).not.toHaveAttribute('src', resumed)
  await expect(portrait).toHaveAttribute('src', originalPortrait)

  await page.getByText('Photo credits', { exact: true }).click()
  await expect(page.getByRole('link', { name: 'GODL India' })).toBeVisible()
  await banner.getByRole('link', { name: 'Read the documentation' }).click()
  await expect(page.getByRole('heading', { name: 'What KalaSetu does', level: 1 })).toBeVisible()
})

test('home banner fits mobile and honors reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.clock.install()
  await page.goto('/')
  const active = page.locator('.home-hero-photos img.is-active')
  const initial = await active.getAttribute('src')
  await page.clock.fastForward(18000)
  await expect(active).toHaveAttribute('src', initial)
  await expect(page.getByRole('button', { name: 'Pause background photos' })).toHaveCount(0)
  await page.getByRole('button', { name: 'Next background photo' }).click()
  await expect(active).not.toHaveAttribute('src', initial)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)
  await page.getByRole('link', { name: 'Open the demo', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Demo', exact: true })).toBeVisible()
})

test('homepage explains the project below the hero and links to resources on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const content = page.locator('.home-content')
  const hero = page.getByRole('region', { name: 'KalaSetu', exact: true })
  const headings = [
    'KalaSetu at a glance', 'About KalaSetu', 'Who KalaSetu is for',
    'From workshop to payout', 'Guides and tools', 'From the craft workshop',
    'Frequently asked questions', 'Explore the project',
  ]
  for (const name of headings) {
    await expect(content.getByRole('heading', { name, exact: true })).toBeVisible()
  }
  const heroBox = await hero.boundingBox()
  expect((await content.boundingBox()).y).toBeGreaterThan(heroBox.y + heroBox.height)
  const impact = content.getByRole('region', { name: 'KalaSetu at a glance' })
  await expect(impact.getByRole('article')).toHaveCount(3)
  await expect(impact.locator('.home-impact-number')).toHaveText(['3', '2', '3'])

  const gallery = content.getByRole('region', { name: 'From the craft workshop' })
  for (const photo of await gallery.getByRole('img').all()) {
    await photo.scrollIntoViewIfNeeded()
    await expect.poll(() => photo.evaluate(image => image.naturalWidth)).toBeGreaterThan(0)
  }
  await expect(gallery.locator('figcaption')).toHaveCount(3)

  const faq = content.getByRole('region', { name: 'Frequently asked questions' })
  await faq.getByText('Where are my listings saved?', { exact: true }).click()
  await expect(faq.getByText(/stored in the current browser/)).toBeVisible()
  await expect(content.getByRole('link', { name: 'View the source code' }))
    .toHaveAttribute('href', 'https://github.com/HarshPopat23/KalaSetu')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320)

  const guides = content.getByRole('region', { name: 'Guides and tools' })
  await expect(guides.getByRole('link')).toHaveCount(6)
  await guides.getByRole('link', { name: /Prepare a craft for sale/ }).click()
  await expect(page.getByRole('heading', { name: 'From making a product to selling it', level: 1 })).toBeVisible()
  await page.goBack()
  await guides.getByRole('link', { name: /Create a listing/ }).click()
  await expect(page.getByRole('heading', { name: 'List your product', level: 1 })).toBeVisible()
  await expect(content).toHaveCount(0)
})
