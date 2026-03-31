import { test, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import * as testData from '../data/test-data.json';

test.describe('Checkout Negative Scenarios', () => {
    test('should show error when Postal Code is missing', async ({ page }) => {
        const inventoryPage = new InventoryPage(page);
        const cartPage = new CartPage(page);
        const checkoutPage = new CheckoutPage(page);

        await inventoryPage.goto();
        await inventoryPage.addItemToCart('Sauce Labs Backpack');
        await inventoryPage.goToCart();
        
        await cartPage.checkout();

        // Fill only First and Last name, leave Zip empty
        await checkoutPage.fillInformation(
            testData.customerInfo.firstName,         
            testData.customerInfo.lastName,     //- new from test-data.json
            ''
        )

        // Assert the specific error message
        const error = await checkoutPage.getErrorText();
        expect(error).toContain('Error: Postal Code is required');
    });
});