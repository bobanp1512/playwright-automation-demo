import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import usersData from '../data/users.json';
import 'dotenv/config';

for (const user of usersData) {
  test.describe(`Login Flow: ${user.description}`, () => {
    
    // THE FIX: If it's NOT the standard_user, clear the session
    if (user.username !== 'standard_user') {
      test.use({ storageState: { cookies: [], origins: [] } }); 
    }

    test(`Execution`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const homePage = new HomePage(page);

      if (user.username === 'standard_user') {
        // Success Case: Uses the storageState automatically
        await page.goto('https://www.saucedemo.com/inventory.html');
        await homePage.isLoaded();
        await expect(page).toHaveURL(/.*inventory.html/);
      } 
      else {
        // Locked Out Case: Starts with a blank slate thanks to test.use
        await loginPage.goto();
        
        const passwordToUse = user.password === 'SAUCE_PASSWORD_KEY' 
          ? process.env.SAUCE_PASSWORD 
          : user.password;

        await loginPage.login(user.username, passwordToUse as string);
        await expect(loginPage.errorMessage).toBeVisible();
      }
    });
  });
}