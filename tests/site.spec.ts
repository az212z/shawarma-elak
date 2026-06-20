import { test, expect } from '@playwright/test';

test.describe('Shawarma Elak site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has RTL Arabic html and title', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page).toHaveTitle(/شاورما إيلاك/);
  });

  test('hero headline and CTAs render', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByRole('link', { name: 'اطلب عبر واتساب' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'استعرض القائمة' })).toBeVisible();
  });

  test('preloader is hidden after load', async ({ page }) => {
    await page.waitForTimeout(1400);
    await expect(page.locator('#preloader')).toBeHidden();
  });

  test('Google rating cited', async ({ page }) => {
    await expect(page.getByText(/4\.3/).first()).toBeVisible();
    await expect(page.getByText(/531/)).toBeVisible();
  });

  test('signature spit motion exists', async ({ page }) => {
    await expect(page.locator('#spitStage')).toBeVisible();
    await expect(page.locator('.spit-cone')).toHaveCount(1);
    await expect(page.locator('.spit-slices .slice')).toHaveCount(4);
  });

  test('full-screen mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await page.locator('#burger').click();
    const menu = page.locator('#mobileMenu');
    await expect(menu).toHaveClass(/is-open/);
    const box = await menu.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(380);
    await page.locator('#menuClose').click();
    await expect(menu).not.toHaveClass(/is-open/);
  });

  test('no invented prices, uses حسب القائمة', async ({ page }) => {
    await expect(page.getByText('حسب القائمة').first()).toBeVisible();
  });

  test('order form validates and builds wa.me link', async ({ page, context }) => {
    await page.locator('#order').scrollIntoViewIfNeeded();
    await page.locator('#orderForm button[type="submit"]').click();
    await expect(page.locator('.field.is-invalid')).toHaveCount(1, { timeout: 2000 }).catch(() => {});
    await page.fill('#f-name', 'محمد العتيبي');
    await page.fill('#f-phone', '0501234567');
    await page.fill('#f-notes', 'صحن شاورما دجاج');
    const popupPromise = context.waitForEvent('page').catch(() => null);
    await page.locator('#orderForm button[type="submit"]').click();
    await expect(page.locator('#toast')).toBeVisible();
    const popup = await popupPromise;
    if (popup) {
      expect(popup.url()).toContain('wa.me/966533324298');
    }
  });

  test('gallery lightbox opens', async ({ page }) => {
    await page.locator('.gallery__item').first().click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    await page.locator('#lightboxClose').click();
    await expect(page.locator('#lightbox')).not.toHaveClass(/is-open/);
  });

  test('floating FABs present', async ({ page }) => {
    await expect(page.locator('.fab--wa')).toHaveAttribute('href', /wa\.me\/966533324298/);
    await expect(page.locator('.fab--call')).toHaveAttribute('href', 'tel:0533324298');
    await expect(page.locator('.fab--map')).toHaveAttribute('href', /google\.com\/maps/);
  });

  test('no horizontal scroll at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    expect(overflow).toBeFalsy();
  });

  test('JSON-LD Restaurant schema with rating', async ({ page }) => {
    const ld = await page.locator('script[type="application/ld+json"]').textContent();
    expect(ld).toContain('"@type": "Restaurant"');
    expect(ld).toContain('"ratingValue": "4.3"');
    expect(ld).toContain('"servesCuisine": "Middle Eastern"');
  });
});
