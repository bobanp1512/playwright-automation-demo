import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage'; 

test('End-to-End Navigation Test', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  // 1. Start at Login
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  // 2. Transition to Home Page logic
  await expect(page).toHaveURL(/.*inventory.html/); // Updated for Saucedemo URL
  await homePage.isLoaded(); 
  
  // 3. Action Step (Optional)
  // Since we removed searchFor, we can just log a message or delete this section.
  console.log("Successfully reached the inventory page!");
});