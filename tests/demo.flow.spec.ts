import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage'; // Import the new page

test('End-to-End Navigation Test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  // 1. Start at Login
  await loginPage.goto();
  await loginPage.login('your-email@example.com', 'your-password');

  // 2. Transition to Home Page logic
  // Note: Since we don't have a real login, we can just verify the 
  // page tries to redirect or check for home elements
  await expect(page).toHaveURL(/.*feed/); 
  await expect(homePage.navHome).toBeVisible();
  
  // 3. Perform an action on the Home Page
  await homePage.searchFor('QA Automation Engineer');
});