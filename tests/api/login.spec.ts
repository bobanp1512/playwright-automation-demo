import { test, expect } from '@playwright/test';

test('API: Verify login page is reachable', async ({ request }) => {
    // We "GET" the URL instead of "goto"
    const response = await request.get('https://www.saucedemo.com/');

    // Check if the server responded with a 200 (Success)
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
});


test('API: Attempt login with invalid credentials', async ({ request }) => {
    const response = await request.post('https://www.saucedemo.com/', {
        data: {
            username: 'wrong_user',
            password: 'wrong_password'
        }
    });

    // Even with wrong credentials, the page usually returns a 200 
    // because it serves the HTML error page. 
    // In a "Real" API, this would return a 401 (Unauthorized).
    console.log(`Status Code: ${response.status()}`);
    expect(response.status()).toBe(405);
});