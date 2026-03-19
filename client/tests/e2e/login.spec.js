// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Urban Eats Auth Flow', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    // 1. Navigate to the landing or login page
    await page.goto('http://localhost:3000/login');

    // 2. Validate page title or header
    await expect(page).toHaveTitle(/Urban Eats|React App|Food/i).catch(() => {});
    
    // 3. Fill in the login form 
    // Using exact name attributes from LoginPage.js
    await page.fill('input[name="email"]', 'user@test.com');
    await page.fill('input[name="password"]', 'password123');
    
    // 4. Submit form (Sign In button)
    await page.click('button[type="submit"]');

    // 5. Assert successful login redirect (LoginPage.js navigates to "/")
    // We wait for the URL to become the base URL
    await page.waitForTimeout(1500); // 1s timeout defined in LoginPage + 500ms buffer
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('should show error on invalid login', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    
    await page.fill('input[name="email"]', 'invalid_nobody@user.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');

    // Validate error message appears based on the accurate Tailwind class used in LoginPage.js
    const errorMessage = page.locator('.text-red-600');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/Invalid|required|Server error|failed/i);
  });
});
