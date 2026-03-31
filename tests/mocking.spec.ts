import { test, expect } from '@playwright/test';

test.describe('Negative Testing: Server Failures & Interception', () => {
    // 1. DISABLE SERVICE WORKERS & CACHE
    test.use({ 
        storageState: 'playwright/.auth/user.json',
        offline: false,
        // This is the key: service workers can bypass standard routing
        serviceWorkers: 'block' 
    });

    test('should display tampered price using foolproof injection', async ({ context, page }) => {
        // 2. Clear cache for this context to force a fresh network fetch
        await context.clearCookies(); 

        await context.route('**/*.{html,js,json}*', async (route) => {
            const response = await route.fetch();
            let body = await response.text();

            // Use a regex to replace the price globally in the source code
            if (body.includes('29.99')) {
                const modifiedBody = body.replace(/29\.99/g, '0.01');
                await route.fulfill({
                    response,
                    body: modifiedBody,
                    headers: {
                        ...response.headers(),
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Expires': '0'
                    }
                });
            } else {
                await route.continue();
            }
        });

        // 3. Force a hard reload navigation
        await page.goto('https://www.saucedemo.com/inventory.html', { waitUntil: 'networkidle' });

        const firstPrice = page.locator('[data-test="inventory-item-price"]').first();
        
        // Assert on the tampered value
        await expect(firstPrice).toHaveText('$0.01', { timeout: 15000 });
    });

    test('should handle API failure on the inventory page', async ({ page }) => {
        // Simple mock for failure
        await page.route('**/inventory.html*', route => route.abort('failed'));
        
        try {
            await page.goto('https://www.saucedemo.com/inventory.html');
        } catch (e) {
            // Expected to fail navigation
        }
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

