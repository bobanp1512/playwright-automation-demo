import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import users from '../data/users.json'; // Import your JSON list

users.forEach((user) => {
  test(`Login Flow: ${user.description}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(user.username, user.password);

    if (user.username === 'standard_user') {
      // Logic for successful login
      await expect(page).toHaveURL(/.*inventory.html/);
      await homePage.isLoaded();
    } else {
      // Logic for failed/locked login
      await expect(loginPage.errorMessage).toBeVisible();
      await expect(loginPage.errorMessage).toContainText('Sorry, this user has been locked out');
    }
  });
}); 