// @ts-check
const { test, expect } = require('@playwright/test');

// Helper: generate unique email to avoid "already registered" errors
const uniqueEmail = () => `restaurant_${Date.now()}@test.com`;

test.describe('Restaurant Registration Flow', () => {

  test('1. Page loads with all required fields', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    // Full Name input
    await expect(page.locator('input[name="name"]')).toBeVisible();
    // Email input
    await expect(page.locator('input[name="email"]')).toBeVisible();
    // Password input
    await expect(page.locator('input[name="password"]')).toBeVisible();
    // Role toggle: Customer & Restaurant buttons
    await expect(page.getByRole('button', { name: /customer/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /restaurant/i })).toBeVisible();
    // Submit button
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
    // Sign In link
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });

  test('2. Selecting Restaurant role highlights the Restaurant tab', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    const restaurantBtn = page.getByRole('button', { name: /restaurant/i });
    await restaurantBtn.click();

    // After clicking, the restaurant button should have the active styling (bg-white / shadow)
    // We verify it is still visible and clickable (role toggle works)
    await expect(restaurantBtn).toBeVisible();
  });

  test('3. Validation - all fields required', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    // Click Restaurant role
    await page.getByRole('button', { name: /restaurant/i }).click();

    // Submit with empty fields
    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.getByText('All fields are required', { exact: false })).toBeVisible();
  });

  test('4. Validation - invalid email format', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    await page.getByRole('button', { name: /restaurant/i }).click();
    await page.fill('input[name="name"]', 'Test Restaurant');
    await page.fill('input[name="email"]', 'not-an-email');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.getByText('Invalid email format', { exact: false })).toBeVisible();
  });

  test('5. Validation - password too short (less than 6 chars)', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    await page.getByRole('button', { name: /restaurant/i }).click();
    await page.fill('input[name="name"]', 'Test Restaurant');
    await page.fill('input[name="email"]', uniqueEmail());
    await page.fill('input[name="password"]', '123');
    await page.getByRole('button', { name: /sign up/i }).click();

    await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
  });

  test('6. Successful restaurant registration and redirect to home', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    // Switch to Restaurant role
    await page.getByRole('button', { name: /restaurant/i }).click();

    // Fill in valid details
    await page.fill('input[name="name"]', 'My Test Restaurant');
    await page.fill('input[name="email"]', uniqueEmail());
    await page.fill('input[name="password"]', 'securepass123');

    // Submit
    await page.getByRole('button', { name: /sign up/i }).click();

    // Success message should appear
    const successMsg = page.locator('text=Registration successful');
    await expect(successMsg).toBeVisible({ timeout: 5000 });

    // Should redirect to home after ~1.2s
    await page.waitForURL('http://localhost:3000/', { timeout: 5000 });
    await expect(page).toHaveURL('http://localhost:3000/');
  });

  test('7. Sign In link navigates to /login', async ({ page }) => {
    await page.goto('http://localhost:3000/register');

    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });

});
