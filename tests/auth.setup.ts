import { test as setup, expect } from '@playwright/test';
import 'dotenv/config';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  console.log('Password loaded:', process.env.SAUCE_PASSWORD ? 'YES' : 'NO');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill(process.env.SAUCE_PASSWORD as string);
  await page.locator('[data-test="login-button"]').click();

  await expect(page).toHaveURL(/.*inventory.html/);

  // End goal: Save the cookies/storage to a file
  await page.context().storageState({ path: authFile });
});