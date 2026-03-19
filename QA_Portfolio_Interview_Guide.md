# 🚀 Urban Eats QA Automation Portfolio & Interview Guide

This document transforms the "Urban Eats" full-stack MERN application into a professional Software Testing/QA Automation showcase. It is tailored for QA Engineer and Test Automation Intern roles.

---

## 1. 🧪 Manual Testing & Test Cases

### Login Module
| Test Case ID | Description | Preconditions | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-LOG-01 | Verify successful login with valid credentials | User account must exist | 1. Navigate to `/login` <br>2. Enter valid email & password <br>3. Click "Sign In" | User is redirected to Dashboard and JWT is stored. | [Placeholder] | Untested |
| TC-LOG-02 | Verify login failure with invalid email | None | 1. Enter non-existent email <br>2. Enter valid format password <br>3. Click "Sign In" | Display error: "Invalid credentials." Dashboard is not accessed. | [Placeholder] | Untested |
| TC-LOG-03 | Verify password masking on input | None | 1. Type password in the password field | Password characters are masked (e.g., `••••••`). | [Placeholder] | Untested |

### Signup Module
| Test Case ID | Description | Preconditions | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-REG-01 | Verify successful signup with new email | Email is not in DB | 1. Navigate to `/register`<br>2. Fill all valid details<br>3. Click "Sign Up" | User account created, DB updated, diverted to login. | [Placeholder] | Untested |
| TC-REG-02 | Verify signup fails with existing email | Email already exists in DB | 1. Navigate to `/register`<br>2. Fill form using an existing email<br>3. Click "Sign Up" | Display error: "User already exists." No duplicate DB entry. | [Placeholder] | Untested |

### Cart & Menu Module
| Test Case ID | Description | Preconditions | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-CRT-01 | Verify adding food to cart | Logged in user | 1. Go to Menu<br>2. Click "Add to Cart" on a food item | Cart counter increases by 1. Item appears in Cart summary. | [Placeholder] | Untested |
| TC-CRT-02 | Verify removing food from cart | Cart has >=1 item | 1. Open Cart<br>2. Click "Remove" / "Trash" icon | Item is removed, Cart total price updates correctly. | [Placeholder] | Untested |
| TC-CRT-03 | Verify quantity increment/decrement | Cart has an item | 1. Open Cart<br>2. Click "+" then "-" | Quantity and Subtotal update instantly. | [Placeholder] | Untested |

### Payment (Stripe Integration)
| Test Case ID | Description | Preconditions | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-PAY-01 | Verify Stripe Checkout redirection | Cart has items | 1. Open Cart<br>2. Click "Checkout" | Redirects to Stripe hosted checkout page with correct total amount in INR/USD. | [Placeholder] | Untested |
| TC-PAY-02 | Verify successful payment | On Stripe Page | 1. Enter valid Test Card details<br>2. Click "Pay" | Redirects back to `/order-success`, DB order status updates to 'Paid'. | [Placeholder] | Untested |
| TC-PAY-03 | Verify canceled payment handling | On Stripe Page | 1. Click 'Back' or 'Cancel' | Redirects to order tracking page. Status remains 'Unpaid'. | [Placeholder] | Untested |

### Order Tracking (Socket.io)
| Test Case ID | Description | Preconditions | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-ORD-01 | Verify real-time status update to "Preparing" | Order placed successfully | 1. Keep tracking page open<br>2. Admin changes status to "Preparing" | User's screen automatically updates status to "Preparing" without manual refresh. | [Placeholder] | Untested |
| TC-ORD-02 | Verify real-time status update to "Delivered" | Status is "Out for Delivery" | 1. Admin assigns "Delivered" state | Tracking visually updates to Delivered, progress bar reaches 100%. | [Placeholder] | Untested |

### Admin Dashboard
| Test Case ID | Description | Preconditions | Steps | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|
| TC-ADM-01 | Verify Admin route protection | Logged in as normal user | 1. Manually type URL `/admin/dashboard` | Access denied. Redirected to Home or "Unauthorized" page. | [Placeholder] | Untested |
| TC-ADM-02 | Verify Admin can view all orders | Logged in as Admin | 1. Click "Orders" tab in sidebar | Table renders displaying all users' orders with pagination/sorting. | [Placeholder] | Untested |

---

## 2. 🗺️ High-Level Test Scenarios
- **Scenario 1:** Validate the Complete User Journey (Register -> Login -> Add Food -> Pay -> Track). *(End-to-End)*
- **Scenario 2:** Validate the Admin Workflow (Login as Admin -> View New Orders -> Change Status to Delivered). *(Functional)*
- **Scenario 3:** Validate system behavior under network failure during Checkout. *(Negative Testing)*
- **Scenario 4:** Validate cross-platform consistency (Action performed on React Native mobile app instantly reflects on Web via WebSockets). *(Integration)*

---

## 3. 🐛 Bug Reporting (Jira Style)

Here are 5 realistic bugs that typically happen during the SDLC of a MERN app, recorded professionally:

**BUG-101: Cart total goes negative when decrementing quickly**
- **Title**: Cart Subtotal displays negative value when spamming decrement ('-') button.
- **Steps to Reproduce**: 1. Add item to cart. 2. Rapidly double-click the '-' button.
- **Expected Result**: Quantity stops at 1 (or 0 and removes item).
- **Actual Result**: Quantity reaches -1, and Subtotal updates to a negative currency amount.
- **Severity**: High (Financial calculation error)
- **Priority**: High 
- **Status**: Open

**BUG-102: Missing empty state UI for Cart**
- **Title**: Cart dropdown renders as tiny empty white box when no items are present.
- **Steps to Reproduce**: 1. Login with new account. 2. Click Cart Icon.
- **Expected Result**: Should say "Your cart is empty. Browse food!".
- **Actual Result**: A blank white square renders.
- **Severity**: Low (UI/UX)
- **Priority**: Medium
- **Status**: In Progress

**BUG-103: Password reset email lacking HTTPS in link**
- **Title**: Forgot password reset link uses HTTP instead of HTTPS in production env.
- **Steps to Reproduce**: 1. Request password reset. 2. Inspect received email body.
- **Expected Result**: Link should be `https://urbaneats...`
- **Actual Result**: Link is `http://urbaneats...`
- **Severity**: Medium (Security risk)
- **Priority**: High
- **Status**: Open

**BUG-104: Stripe checkout fails if user has ad-blocker**
- **Title**: Stripe script blocked by uBlock Origin leading to silent checkout failure.
- **Steps to Reproduce**: 1. Enable aggressive ad-block. 2. Click Checkout.
- **Expected Result**: Should show a friendly error: "Please disable ad-block to proceed to checkout."
- **Actual Result**: Nothing happens, console throws `Stripe is not defined`.
- **Severity**: High
- **Priority**: Medium
- **Status**: Open

**BUG-105: Socket.io disconnects after 30 mins idle**
- **Title**: Live order tracking stops receiving updates if phone is locked for >30 mins.
- **Steps to Reproduce**: 1. Place order. 2. Lock phone for 35 mins. 3. Unlock phone. 4. Admin updates status.
- **Expected Result**: Frontend reconnects socket and fetches latest status.
- **Actual Result**: Frontend stays on old status until manual app restart. 
- **Severity**: Medium
- **Priority**: Low
- **Status**: Open

---

## 4. 🌐 API Testing (Postman Strategy)
Key REST Endpoints identified:

1. **POST `/api/auth/register`**
   - **Body**: `{ "name":"Test", "email":"test@qa.com", "password":"123" }`
   - **Expected**: `201 Created`. Test checks if `token` is returned.
2. **POST `/api/auth/login`**
   - **Body**: `{ "email":"test@qa.com", "password":"123" }`
   - **Expected**: `200 OK`. Extraction logic runs `pm.environment.set("jwt", pm.response.json().token)`.
3. **GET `/api/restaurants`**
   - **Headers**: `Authorization: Bearer {{jwt}}`
   - **Expected**: `200 OK`. Test checks `pm.expect(response.data).to.be.an('array')`.
4. **POST `/api/payment/create-checkout-session`**
   - **Body**: `{ "orderId": "65bc123..." }`
   - **Expected**: `200 OK`. Test checks response for Stripe `url` string.

---

## 5. 🤖 Automation Scripts (Playwright)
*Demonstrating modern E2E Automation capabilities using Playwright (Node.js).*

```javascript
// login-checkout.spec.js
const { test, expect } = require('@playwright/test');

test.describe('E2E Urban Eats Checkout Flow', () => {

  test('User can login, add to cart, and reach checkout', async ({ page }) => {
    // 1. Auth & Login
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'qa@test.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for Dashboard to load
    await expect(page).toHaveURL(/.*dashboard/);

    // 2. Add to Cart
    // Using a specific data-testid is a QA best practice
    await page.locator('[data-testid="food-item-pizza"]').locator('button:has-text("Add")').click();
    
    // Assert Cart updated
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('1');

    // 3. Navigate to Cart & Checkout
    await page.click('[data-testid="cart-icon"]');
    await page.click('button:has-text("Checkout securely")');

    // Assert Redirection to Stripe
    await expect(page).toHaveURL(/.*checkout.stripe.com/);
  });

});
```

---

## 6. 🗄️ SQL Data Validation 
*(Note: MERN uses MongoDB, but these equivalent SQL queries demonstrate relational database validation skills required in the industry).*

**Validate User Creation:**
```sql
SELECT id, name, email, created_at 
FROM users 
WHERE email = 'qa@tester.com';
```

**Validate Order Pricing Integrity:**
```sql
SELECT o.order_id, u.name, o.total_amount, o.status 
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.status = 'Paid' AND o.created_at >= CURRENT_DATE;
```

**Validate Cart Totals Match Sum of Items:**
```sql
SELECT cart_id, SUM(price * quantity) as expected_total
FROM cart_items
WHERE cart_id = 992
GROUP BY cart_id;
```

---

## 7. 🗣️ Interview Ready Script (How to Explain Your Project)

**Interviewer:** *"Can you walk me through your testing approach on the Urban Eats project?"*

**You:** 
"Absolutely! Since I built Urban Eats from the ground up—handling the frontend, mobile app, and backend—I was naturally forced into a rigorous 'shift-left' testing methodology. 

For **Manual Testing**, I created a Test Plan covering over 15 distinct functional test cases, prioritizing boundary value analysis on cart logic and exploratory testing on the Socket.io real-time tracking flow to ensure state consistency across the Web and Mobile apps.

For **API Testing**, I used Postman. I created a robust Collection covering Auth, Orders, and Checkout processes, where I implemented pre-request scripts and automated assertions (validating HTTP 200s, array structures, and JWT persistence).

For **Test Automation**, I implemented **Playwright**. I wrote E2E scripts that automate the critical path—logging in, selecting a restaurant, adding food to the cart, and asserting that the app correctly redirects the user to the Stripe Checkout domain. This ensured that no regressions broke our core revenue-generating feature during development.

Whenever I encountered an issue, like a UI mismatch or a race condition in the Cart, I treated it as a formal defect. I logged it strictly with 'steps to reproduce', 'expected vs actual behavior', and 'severity prioritization', just like I would in a professional Jira workspace."

---

## 8. 🚀 Next Steps / QA Improvements
To prove continuous improvement, these are the immediate next steps to level up the QA profile of this repository:

1. **Implement CI/CD (GitHub Actions)**: Create a `.github/workflows/playwright.yml` file to automatically run the E2E tests in a headless browser on every Pull Request to the `main` branch.
2. **Cross-Browser Testing**: Expand the Playwright configuration to execute tests simultaneously across Chromium, Firefox, and WebKit (Safari).
3. **Automated API Testing in CI**: Use **Newman** (the Postman CLI) to run the Postman API Collection directly inside the GitHub Actions pipeline to instantly catch broken endpoints.
4. **Data Seeders for Test Environments**: Create automated `npm run db:seed:qa` scripts to cleanly spawn Test Users and Dummy Restaurants before the test suite kicks off, ensuring a pristine and predictable Test Environment state.
