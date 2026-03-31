import { test, expect } from '@playwright/test';

test.describe('Negative Testing: Server Failures & Interception', () => {

    // Use the auth session to skip login
    test.use({ storageState: 'playwright/.auth/user.json' });

    /**
     * TEST 1: SIMULATED SERVER CRASH (500 ERROR)
     * This proves the UI doesn't crash if the server fails.
     */
    test('should handle API failure on the inventory page', async ({ page }) => {
        // 1. SET THE TRAP: Intercept the main page and force a 500
        await page.route(/\/inventory\.html/, async route => {
            await route.fulfill({
                status: 500,
                contentType: 'text/plain',
                body: 'Internal Server Error - Simulated Crash'
            });
        });

        // 2. ACTION: Attempt to go to the page
        await page.goto('https://www.saucedemo.com/inventory.html');

        // 3. ASSERT: The inventory list should NOT be visible
        const inventoryList = page.locator('.inventory_list');
        await expect(inventoryList).not.toBeVisible();

        console.log('Test Passed: App handled the 500 error gracefully.');
    });

    /**
     * TEST 2: PRICE TAMPERING (INTERCEPTION)
     * This demonstrates how to modify live data in transit.
     */
    test('should display tampered price using a global interceptor', async ({ page }) => {
        // 1. Intercept the network traffic for the inventory page
        await page.route(/\/inventory\.html/, async route => {
            const response = await route.fetch();
            let body = await response.text();

            // 2. Perform "Surgery" on the HTML: Replace the price
            // We use a global regex to catch all instances
            const modifiedBody = body.replace(/\$29\.99/g, '$0.01');

            // 3. Fulfill with modified body and no-cache headers for CI stability
            await route.fulfill({
                response,
                body: modifiedBody,
                headers: {
                    ...response.headers(),
                    'cache-control': 'no-cache',
                    'pragma': 'no-cache'
                }
            });
        });

        // 4. ACTION: Navigate with a small wait to ensure interceptor is ready
        await page.goto('https://www.saucedemo.com/inventory.html', { 
            waitUntil: 'networkidle' 
        });

        // 5. ASSERT: Check that the first item (Backpack) is now a penny
        const firstPrice = page.locator('.inventory_item_price').first();
        await expect(firstPrice).toHaveText('$0.01');

        console.log('Success! Price modified in the network stream.');
    });

});