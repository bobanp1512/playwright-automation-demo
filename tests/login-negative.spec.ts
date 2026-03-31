import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import * as testData from '../data/test-data.json';
// const testData = require('../data/test-data.json');

test.describe('Login Negative Scenarios', () => {

  test('should show error message for locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('https://www.saucedemo.com/');

    // // Use the data from the JSON file instead of typing the string
    // await loginPage.login(testData.users.lockedOut.username, testData.users.lockedOut.password);

    // Pulling both username and the locked out user from JSON
    await loginPage.login(
        testData.users.lockedOut.username, 
        testData.users.lockedOut.password
    );

    const errorLocator = page.locator('[data-test="error"]');
    await expect(errorLocator).toContainText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('should show error for invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto('https://www.saucedemo.com/');


    //  // Use the data from the JSON file instead of typing the string
    // await loginPage.login(testData.users.invalid.username, testData.users.invalid.password);

    // Pulling both username and the wrong password from JSON
    await loginPage.login(
      testData.users.invalid.username,
      testData.users.invalid.password
    );

    const errorLocator = page.locator('[data-test="error"]');
    await expect(errorLocator).toContainText('Username and password do not match any user in this service');
  });
});