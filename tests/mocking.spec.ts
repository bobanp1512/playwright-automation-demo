import { test, expect } from '@playwright/test';

test.describe('Negative Testing: Server Failures & Interception', () => {
    test.use({ storageState: 'playwright/.auth/user.json' });

    test('should display tampered price using network fulfillment', async ({ page }) => {
        // 1. Intercept the HTML request itself
        await page.route('**/inventory.html*', async (route) => {
            const response = await route.fetch();
            let body = await response.text();
            
            // 2. Surgical string replacement in the HTML source
            // This replaces the actual price in the raw HTML before the browser renders it
            const modifiedBody = body.replace('$29.99', '$0.01');
            
            await route.fulfill({
                response,
                body: modifiedBody,
            });
        });

        // 3. Navigate
        await page.goto('https://www.saucedemo.com/inventory.html');

        // 4. Assertion - The browser now thinks the server sent $0.01
        const firstPrice = page.locator('[data-test="inventory-item-price"]').first();
        await expect(firstPrice).toHaveText('$0.01');
    });

    test('should handle API failure (Simulated Server Error)', async ({ page }) => {
        // Simulate a 500 Internal Server Error
        await page.route('**/inventory.html*', route => {
            route.fulfill({
                status: 500,
                contentType: 'text/plain',
                body: 'Server Error'
            });
        });

        await page.goto('https://www.saucedemo.com/inventory.html');
        
        // Assert that the inventory list is NOT present
        const inventoryList = page.locator('[data-test="inventory-container"]');
        await expect(inventoryList).not.toBeVisible();
    });
});






//----------------------------------------

// test.describe('Negative Testing: Server Failures & Interception', () => {
//     test.use({
//         storageState: 'playwright/.auth/user.json',
//         serviceWorkers: 'block'
//     });

//     test('should display tampered price using foolproof injection', async ({ page }) => {
//         // 1. Inject a script that runs BEFORE the page scripts
//         // This monitors the DOM and changes the price the second it appears
//         await page.addInitScript(() => {
//             const observer = new MutationObserver((mutations) => {
//                 for (const mutation of mutations) {
//                     mutation.addedNodes.forEach((node) => {
//                         if (node instanceof HTMLElement) {
//                             const prices = node.querySelectorAll('[data-test="inventory-item-price"]');
//                             prices.forEach(p => {
//                                 if (p.textContent?.includes('29.99')) {
//                                     p.textContent = '$0.01';
//                                 }
//                             });
//                         }
//                     });
//                 }
//             });
//             observer.observe(document.documentElement, { childList: true, subtree: true });
//         });

//         // 2. Direct navigation
//         await page.goto('https://www.saucedemo.com/inventory.html');

//         // 3. Assertion
//         const firstPrice = page.locator('[data-test="inventory-item-price"]').first();
//         await expect(firstPrice).toHaveText('$0.01', { timeout: 15000 });
//     });

//     test('should handle API failure on the inventory page', async ({ page }) => {
//         await page.route('**/inventory.html*', route => route.abort('failed'));
//         try {
//             await page.goto('https://www.saucedemo.com/inventory.html');
//         } catch (e) { /* expected */ }
//         await expect(page.locator('.inventory_list')).not.toBeVisible();
//     });
// });


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

