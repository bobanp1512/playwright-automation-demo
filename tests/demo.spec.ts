import { test, expect } from '@playwright/test';

test('Verify LinkedIn Login Page Loads', async ({ page }) => {
  // Go to the page
  await page.goto('https://www.linkedin.com/login');

  // Verify the "Sign in" header is visible
  const header = page.locator('h1');
  await expect(header).toContainText('Sign in');
  
  // Verify the email input is there
  await expect(page.locator('#username')).toBeVisible();
});