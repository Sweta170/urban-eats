-- Urban Eats QA: SQL Database Validation Examples
-- 
-- The project uses MongoDB, but these equivalent SQL queries demonstrate
-- the required SQL data validation skills requested in the QA Job Description.

-- 1. Validate User Creation (After Registration flow)
-- Verify that the recently registered QA user exists in the DB.
SELECT id, name, email, role, created_at 
FROM users 
WHERE email = 'qa@tester.com';

-- 2. Validate Order Placement (After Checkout flow)
-- Ensure an order was properly linked to a user.
SELECT o.order_id, u.name, o.total_amount, o.status, o.created_at
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE u.email = 'qa@tester.com'
ORDER BY o.created_at DESC
LIMIT 1;

-- 3. Validate Cart Logic / Pricing
-- Check if total amount calculation matches sum of individual items.
SELECT cart_id, SUM(price * quantity) as calculated_total
FROM cart_items
WHERE cart_id = 1001
GROUP BY cart_id;

-- 4. Validate Restaurant Fetching (API response match)
-- Ensure all listed restaurants are marked as 'active' status.
SELECT restaurant_name, rating, is_active
FROM restaurants
WHERE is_active = true
ORDER BY rating DESC;

-- 5. Track Defects via SQL (mock defect tracking query)
-- Retrieve all P1 (Priority 1) bugs assigned to the Automation team.
SELECT ticket_id, summary, status, priority, assignee 
FROM jira_tickets
WHERE project = 'URBAN_EATS' 
  AND status != 'Closed'
  AND priority = 'P1'
  AND assignee = 'qa_intern';
