import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage'; // Import the Page Object

test('Professional Login Test using POM', async ({ page }) => {
  const loginPage = new LoginPage(page);

  // Use the method from our Page Object
  await loginPage.goto();

  // Instead of locator('#username'), we use the property from the class
  await expect(loginPage.usernameInput).toBeVisible();
  
  // You can perform actions through the POM methods
  await loginPage.login('test-user@email.com', 'FakePassword123');

  // Verify errors if they exist
  // await expect(loginPage.errorMessage).toBeVisible();
});