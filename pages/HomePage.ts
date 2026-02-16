import { type Locator, type Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly navHome: Locator;
  readonly inventoryList: Locator; // Added this
  readonly shoppingCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navHome = page.locator('.app_logo'); 
    this.inventoryList = page.locator('.inventory_list'); // Now matches the top
    this.shoppingCart = page.locator('.shopping_cart_link');
  }

  // Changed searchFor to isLoaded because Saucedemo doesn't have a search bar
  async isLoaded() {
    await expect(this.navHome).toBeVisible();
    await expect(this.inventoryList).toBeVisible();
  }
}