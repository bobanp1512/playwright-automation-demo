import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.cartItems = page.locator('.cart_item');
  }

  async verifyItemIsPresent(productName: string) {
    // This ensures the specific product name is visible in the list
    const item = this.cartItems.filter({ hasText: productName });
    await expect(item).toBeVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }


  // Inside your CartPage class
  async checkout() {
    await this.page.click('[data-test="checkout"]');
  }
}