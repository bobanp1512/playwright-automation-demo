import { type Locator, type Page, expect } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly navHome: Locator;
  readonly profileIcon: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    // Locators for elements visible ONLY after login
    this.navHome = page.locator('#global-nav');
    this.profileIcon = page.locator('.global-nav__me-photo');
    this.searchInput = page.locator('.search-global-typeahead__input');
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.page.keyboard.press('Enter');
  }
}