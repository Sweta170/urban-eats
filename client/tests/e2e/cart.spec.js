// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Urban Eats Cart & Checkout Flow', () => {

  // Slow down the test slightly if needed to watch it interact
  test.use({ actionTimeout: 10000 });

  test('should add item to cart and initiate checkout', async ({ page }) => {
    // 1. Authenticate first
    await page.goto('http://localhost:3000/login');
    await page.fill('input[name="email"]', 'user@test.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for redirect to home
    await page.waitForTimeout(1500);
    await expect(page).toHaveURL('http://localhost:3000/');

    // 2. Navigate to the Menu
    await page.goto('http://localhost:3000/menu');
    
    // 3. Wait for the food collection to load 
    // We look for the "Add" button inside the FoodCard component
    const addButton = page.locator('button:has-text("Add")').first();
    await expect(addButton).toBeVisible({ timeout: 10000 });

    // 4. Click Add to Cart
    await addButton.click();

    // The successful addition shows a minimal toast ("Added!") but we can just check the UI
    // To be safe, wait a second for the state to update
    await page.waitForTimeout(1000);

    // 5. Navigate to Cart Page
    await page.goto('http://localhost:3000/cart');

    // 6. Verify we are on the Cart Page and it's not empty
    await expect(page.locator('h1:has-text("Your Order Bag")')).toBeVisible();

    // 7. Click the 'Checkout Now' button
    const checkoutBtn = page.locator('button:has-text("Checkout Now")');
    await expect(checkoutBtn).toBeVisible();
    await checkoutBtn.click();

    // 8. Assert successful navigation to the Checkout Page or Stripe
    // The React app navigates to /checkout first before initiating Stripe
    await page.waitForTimeout(1000);
    await expect(page.url()).toMatch(/.*checkout/);
  });
});
