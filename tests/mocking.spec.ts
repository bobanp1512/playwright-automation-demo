import { test, expect } from '@playwright/test';

test.describe('Negative Testing: Server Failures & Interception', () => {
    // Apply storage state for the whole group
    test.use({ storageState: 'playwright/.auth/user.json' });

    test('should display tampered price using foolproof injection', async ({ context, page }) => {
        // 1. SET THE TRAP AT THE CONTEXT LEVEL
        // This survives redirects, reloads, and "soft" navigations
        await context.route('**/*.{html,js,json}*', async (route) => {
            const response = await route.fetch();
            let body = await response.text();

            if (body.includes('$29.99')) {
                // Modify the source code directly before the browser even sees it
                body = body.replace(/\$29\.99/g, '$0.01');
                await route.fulfill({
                    response,
                    body,
                    headers: {
                        ...response.headers(),
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache'
                    }
                });
            } else {
                await route.continue();
            }
        });

        // 2. Navigate to the base inventory page
        await page.goto('https://www.saucedemo.com/inventory.html');

        // 3. Assertion
        const firstPrice = page.locator('[data-test="inventory-item-price"]').first();

        // We use a slightly longer timeout because of the redirect logic on SauceDemo
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

