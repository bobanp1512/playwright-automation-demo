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

    test('should display tampered price using a global interceptor', async ({ page }) => {
        // 1. Trap the request with a Regex that ignores query params or trailing slashes
        await page.route(/.*inventory\.html.*/, async (route) => {
            const response = await route.fetch();
            const body = await response.text();

            // 2. Surgical replacement of the price in the raw HTML string
            const modifiedBody = body.replace(/\$29\.99/g, '$0.01');

            await route.fulfill({
                response,
                contentType: 'text/html',
                body: modifiedBody,
                headers: {
                    ...response.headers(),
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        });

        // 3. Force a hard navigation and wait for the network to be completely silent
        await page.goto('https://www.saucedemo.com/inventory.html', {
            waitUntil: 'networkidle'
        });

        // 4. Use a flexible assertion that retries for up to 10 seconds
        const firstPrice = page.locator('.inventory_item_price').first();
        await expect(firstPrice).toHaveText('$0.01', { timeout: 10000 });
    });


});