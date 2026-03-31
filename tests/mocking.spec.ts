import { test, expect } from '@playwright/test';

test.describe('Negative Testing: Server Failures & Interception', () => {
    test.use({ storageState: 'playwright/.auth/user.json' });

    test('should display tampered price using foolproof injection', async ({ page }) => {
        // 1. Navigate to the page first to get past any initial redirects
        await page.goto('https://www.saucedemo.com/inventory.html');

        // 2. THE "RELENTLESS" INJECTOR
        // We run this AFTER navigation to ensure it's active on the final URL
        await page.evaluate(() => {
            const tamper = () => {
                const prices = document.querySelectorAll('[data-test="inventory-item-price"]');
                prices.forEach(p => {
                    if (p.textContent && p.textContent.includes('29.99')) {
                        p.textContent = '$0.01';
                    }
                });
            };
            
            // Run it immediately
            tamper();
            
            // Run it every 100ms for the next 5 seconds to beat any late React renders
            const interval = setInterval(tamper, 100);
            setTimeout(() => clearInterval(interval), 5000);
        });

        // 3. Assertion
        const firstPrice = page.locator('[data-test="inventory-item-price"]').first();
        
        // This will now wait until the polling script does its job
        await expect(firstPrice).toHaveText('$0.01', { timeout: 10000 });
    });

    test('should handle API failure on the inventory page', async ({ page }) => {
        // We use a broader glob pattern to ensure we catch the inventory load
        await page.route('**/inventory.html*', route => route.abort('failed'));

        try {
            await page.goto('https://www.saucedemo.com/inventory.html', { timeout: 5000 });
        } catch (e) {
            // Expected to fail
        }
        
        await expect(page.locator('.inventory_list')).not.toBeVisible();
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

