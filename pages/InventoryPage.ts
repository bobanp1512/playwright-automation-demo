import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  // A dynamic function that finds a button based on the product name
  async addItemToCart(productName: string) {
    // We look for the inventory item container that has our text, then find its button
    const productContainer = this.page.locator('.inventory_item', { hasText: productName });
    await productContainer.getByRole('button', { name: 'Add to cart' }).click();
  }
}