// import { test, expect } from '@playwright/test';

// test.describe('Network Interception & Error Handling', () => {

//     test('should show error UI when API returns a 500 error', async ({ page }) => {
//         // 1. Start the "Interception" BEFORE navigating
//         // We tell Playwright: "If you see any URL ending in /inventory, stop it!"
//         await page.route('**/inventory.html', async route => {
//             await route.fulfill({
//                 status: 500,
//                 contentType: 'text/plain',
//                 body: 'Internal Server Error - Simulated Crash'
//             });
//         });

//         // 2. Now navigate to the site
//         await page.goto('https://www.saucedemo.com/');

//         // 3. Perform Login
//         await page.locator('[data-test="username"]').fill('standard_user');
//         await page.locator('[data-test="password"]').fill('secret_sauce');
//         await page.locator('[data-test="login-button"]').click();

//         // 4. Assert how the UI behaves
//         // Note: On SauceDemo, if the page crashes, it might just fail to load items.
//         // In a real app, you'd check for an "Oops, something went wrong" message.
//         console.log('Intercepted the request and forced a 500 error!');
//     });
// });


import { test, expect } from '@playwright/test';

test.describe('Negative Testing: Server Failures', () => {

    // We use the session you already created and verified in GitHub!
    test.use({ storageState: 'playwright/.auth/user.json' });

    test('should handle API failure on the inventory page', async ({ page }) => {

        

        // 1. SET THE TRAP: Intercept the network BEFORE moving


        // This tells Playwright to "hijack" any call to the inventory logic
        // await page.route('**/inventory.html', async route => {
        //     await route.fulfill({
        //         status: 500,
        //         contentType: 'text/plain',
        //         body: 'Internal Server Error'
        //     });
        // });

        test('should display tampered price using a global interceptor', async ({ page }) => {
            // 1. Intercept the main page request
            await page.route('**/inventory.html', async route => {
                const response = await route.fetch(); // Get the REAL page first
                let body = await response.text();

                // 2. Use a Regex or Replace to swap the price in the HTML code
                // We find the first instance of $29.99 and change it to $0.01
                body = body.replace('$29.99', '$0.01');

                await route.fulfill({
                    response,
                    body
                });
            });

            // 3. Now navigate - the browser will receive your modified HTML
            await page.goto('https://www.saucedemo.com/inventory.html');

            const firstPrice = page.locator('.inventory_item_price').first();
            await expect(firstPrice).toHaveText('$0.01');

            console.log('Success! We tampered with the HTML stream.');
        });

        // 2. ACTION: Go to the page
        await page.goto('https://www.saucedemo.com/inventory.html');

        // 3. ASSERT: Check that the UI isn't showing products
        // On SauceDemo, a 500 error here usually prevents the inventory list from rendering
        const inventoryList = page.locator('.inventory_list');
        await expect(inventoryList).not.toBeVisible();

        console.log('Test Passed: App handled the 500 error gracefully (or at least didn\'t show data).');
    });











    // test('should display tampered price for the backpack', async ({ page }) => {
    //     // 1. Intercept the network request for the inventory page
    //     await page.route('**/inventory.html', async route => {
    //         // Fetch the real response from the actual server
    //         const response = await route.fetch();
    //         let body = await response.text();

    //         // 2. Modify the "Live" data: Replace $29.99 with $0.01
    //         // This is like a "Find and Replace" happening in mid-air
    //         body = body.replace('$29.99', '$0.01');

    //         // 3. Send the modified version to the browser
    //         await route.fulfill({
    //             response,
    //             body
    //         });
    //     });

    //     // 4. Action: Go to the page (using your storage session)
    //     await page.goto('https://www.saucedemo.com/inventory.html');

    //     // 5. Assertion: Check if our "fake" price is showing
    //     const firstPrice = page.locator('.inventory_item_price').first();
    //     await expect(firstPrice).toHaveText('$0.01');

    //     console.log('Success! We just discounted the backpack to a penny via network mocking.');
    // });


    test('should display tampered price using a global interceptor', async ({ page }) => {
        // 1. We use a wildcard '**/*' to catch ALL network traffic
        await page.route('**/*', async route => {
            const response = await route.fetch();
            const contentType = response.headers()['content-type'] || '';

            // 2. Only try to replace text in HTML or JavaScript files
            if (contentType.includes('text/html') || contentType.includes('javascript')) {
                let body = await response.text();
                if (body.includes('$29.99')) {
                    console.log('Target found! Changing price...');
                    body = body.replace(/\$29\.99/g, '$0.01'); // Using /g to replace ALL instances
                    await route.fulfill({ response, body });
                } else {
                    await route.continue();
                }
            } else {
                await route.continue();
            }
        });

        await page.goto('https://www.saucedemo.com/inventory.html');

        const firstPrice = page.locator('.inventory_item_price').first();
        await expect(firstPrice).toHaveText('$0.01');

        console.log('Success! We caught the price in the network stream.');
    });


});