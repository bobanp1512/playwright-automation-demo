import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import * as testData from '../data/test-data.json';

test.describe('Shopping Cart Flow', () => {
    // Use the saved session
    test.use({ storageState: 'playwright/.auth/user.json' });

    test('full path: add items and verify in cart', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        // 1. Inventory
        await page.goto('https://www.saucedemo.com/inventory.html', {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        // await inventoryPage.addItemToCart('Sauce Labs Backpack');
        await inventoryPage.addItemToCart(testData.products.backpack);
        await page.click('.shopping_cart_link');

        // 2. Cart
        // await cartPage.verifyItemIsPresent('Sauce Labs Backpack'); -old
        await cartPage.verifyItemIsPresent(testData.products.backpack); //- new from test-data.json
        await cartPage.proceedToCheckout();

        // 3. Checkout Information
        // await checkoutPage.fillInformation('John', 'Doe', '12345'); -old
        await checkoutPage.fillInformation(
            testData.customerInfo.firstName,         
            testData.customerInfo.lastName,     //- new from test-data.json
            testData.customerInfo.zipCode
        )

        // 4. Final Review
        await checkoutPage.completeOrder();

        // 5. Success Check
        await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    }); // <--- This closes the 'test' block
}); // <--- This closes the 'describe' block