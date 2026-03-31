import { test, expect } from '@playwright/test';

test.describe('Negative Testing: Server Failures & Interception', () => {

    test.use({ storageState: 'playwright/.auth/user.json' });

    test('should handle API failure on the inventory page', async ({ page }) => {
        // Use a wildcard to ensure we catch it regardless of the base URL
        await page.route('**/inventory.html*', async route => {
            await route.fulfill({
                status: 500,
                contentType: 'text/plain',
                body: 'Internal Server Error'
            });
        });

        await page.goto('https://www.saucedemo.com/inventory.html');
        await expect(page.locator('.inventory_list')).not.toBeVisible();
    });

    test('should display tampered price using a global interceptor', async ({ context, page }) => {
        // 1. Set the interceptor at the CONTEXT level
        await context.route('**/inventory.html*', async route => {
            const response = await route.fetch();
            const body = await response.text();
            const modifiedBody = body.replace(/\$29\.99/g, '$0.01');

            await route.fulfill({
                response,
                body: modifiedBody,
                headers: {
                    ...response.headers(),
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                }
            });
        });

        // 2. Navigate
        await page.goto('https://www.saucedemo.com/inventory.html', {
            waitUntil: 'commit' // 'commit' is the earliest point we can start asserting
        });

        // 3. THE "SENIOR" MOVE: Use an auto-retrying assertion
        // This replaces the hard sleep. Playwright will re-run this check 
        // every 100ms until it passes or hits the 5-second timeout.
        const firstPrice = page.locator('.inventory_item_price').first();

        await expect(firstPrice).toHaveText('$0.01', { timeout: 7000 });

        console.log('Success! Dynamic assertion caught the mocked price.');
    });
});