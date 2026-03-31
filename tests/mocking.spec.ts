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



    test('DEBUG: What is the actual HTML on the page?', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/inventory.html');
    
    // Let's grab the HTML of the first inventory item
    const firstItemHtml = await page.locator('.inventory_item').first().innerHTML();
    
    // This will print to your GitHub Actions console
    console.log('--- START DEBUG HTML ---');
    console.log(firstItemHtml);
    console.log('--- END DEBUG HTML ---');

    // This test is meant to fail, we just want the log
    expect(firstItemHtml).toContain('$0.01'); 
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