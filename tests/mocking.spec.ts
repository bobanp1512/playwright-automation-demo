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
        // 1. We use CONTEXT.route instead of PAGE.route
        // This ensures the interceptor is active for the entire browser session
        await context.route('**/inventory.html*', async route => {
            const response = await route.fetch();
            const body = await response.text();
            
            // 2. Use a robust replace for the price
            const modifiedBody = body.replace(/\$29\.99/g, '$0.01');

            await route.fulfill({
                response,
                body: modifiedBody,
                headers: {
                    ...response.headers(),
                    'Content-Type': 'text/html',
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache'
                }
            });
        });

        // 3. Navigate and wait for the network to be completely quiet
        await page.goto('https://www.saucedemo.com/inventory.html', { 
            waitUntil: 'networkidle' 
        });

        // 4. Verification
        const firstPrice = page.locator('.inventory_item_price').first();
        await expect(firstPrice).toHaveText('$0.01');
    });
});