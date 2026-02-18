import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import users from '../data/users.json'; 
import 'dotenv/config'; // 1. This loads your .env file variables

users.forEach((user) => {
  test(`Login Flow: ${user.description}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();

    // 2. Logic to pick the real secret
    // If the JSON says "SAUCE_PASSWORD_KEY", we grab the value from our .env file
    const actualPassword = user.password === 'SAUCE_PASSWORD_KEY' 
      ? process.env.SAUCE_PASSWORD 
      : user.password;

    // 3. Pass the real password to the login method
    await loginPage.login(user.username, actualPassword as string);

    if (user.username === 'standard_user') {
      await expect(page).toHaveURL(/.*inventory.html/);
      await homePage.isLoaded();
    } else {
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Epic sadface: Sorry, this user has been locked out.');
    }
  });
});