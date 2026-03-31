import { test, expect } from '@playwright/test';

test.describe('Negative Testing: Server Failures & Interception', () => {

    test.use({ storageState: 'playwright/.auth/user.json' });

    test('should display tampered price using foolproof injection', async ({ page }) => {
        // 1. This script runs in the browser BEFORE the page even loads
        await page.addInitScript(() => {
            // We use a MutationObserver because SauceDemo loads data dynamically
            const observer = new MutationObserver(() => {
                // We use the exact selector and data-test attribute we saw in your logs
                const priceElements = document.querySelectorAll('.inventory_item_price');
                priceElements.forEach(el => {
                    if (el.textContent && el.textContent.includes('$29.99')) {
                        el.textContent = '$0.01';
                    }
                });
            });

            // Start observing the body for changes
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
        });

        // 2. Navigate
        await page.goto('https://www.saucedemo.com/inventory.html', { waitUntil: 'domcontentloaded' });

        // 3. Assertion: Wait for our injected change to be visible
        const firstPrice = page.locator('[data-test="inventory-item-price"]').first();
        await expect(firstPrice).toHaveText('$0.01', { timeout: 15000 });
    });

    test('should handle API failure on the inventory page', async ({ page }) => {
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


    // test('should display tampered price using injection', async ({ page }) => {
    //     // 1. Inject a script that runs BEFORE the page scripts
    //     // This is much faster than network mocking for static text
    //     await page.addInitScript(() => {
    //         // We create an observer to watch for the price element to appear
    //         const observer = new MutationObserver(() => {
    //             const priceElement = document.querySelector('.inventory_item_price');
    //             if (priceElement && priceElement.textContent === '$29.99') {
    //                 priceElement.textContent = '$0.01';
    //             }
    //         });

    //         // Start watching the document
    //         observer.observe(document.documentElement, {
    //             childList: true,
    //             subtree: true
    //         });
    //     });

    //     // 2. Navigate normally
    //     await page.goto('https://www.saucedemo.com/inventory.html');

    //     // 3. Assert
    //     const firstPrice = page.locator('.inventory_item_price').first();
    //     await expect(firstPrice).toHaveText('$0.01', { timeout: 15000 });
    // });

});