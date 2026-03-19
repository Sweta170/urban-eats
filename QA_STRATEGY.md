# 🎯 QA Strategy & Test Plan
**Project:** Urban Eats (Food Delivery MERN + React Native App)
**Author:** QA Automation Engineer (Intern Applicant)

This document outlines the testing methodologies, manual test cases, API automation strategy, and defect tracking processes for the Urban Eats platform, aligning with best practices in the SDLC and STLC.

---

## 1. 🔄 SDLC & Agile Integration
- **Requirements Analysis**: Analyzing user stories for features (e.g., "As a user, I want to add food to my cart so I can checkout").
- **Agile Ceremonies**: Actively participating in Daily Stand-ups, Sprint Planning, and Retrospectives to align testing efforts with development sprints.
- **Defect Tracking (Jira/Trello)**: All identified bugs are logged with steps to reproduce, severity, environment details, and screenshots for rapid resolution.

## 2. 🧪 Test Execution Plan
Testing covers both the **Web Client (React)** and the **Mobile Client (React Native)**.

### a) Smoke & Sanity Testing
- **Goal**: Ensure core server connections and essential UI loads correctly after deployment.
- **Scope**: Home Page load, Login API response, Menu fetching.

### b) Functional & Exploratory Testing
| Test Case ID | Module | Title | Steps | Expected Result |
|--------------|--------|-------|-------|-----------------|
| `TC-AUTH-01` | Auth | User Login | 1. Enter valid email/pwd<br>2. Click Login | Redirects to Dashboard, JWT stored |
| `TC-AUTH-02` | Auth | Invalid Login | 1. Enter invalid email<br>2. Click Login | Shows "Invalid credentials" error |
| `TC-CART-01` | Cart | Add to cart | 1. Open food item<br>2. Click 'Add' | Cart icon updates count |

### c) Regression Testing
Before any major release, previous test cases around the Cart and Checkout flows are re-executed to ensure new code hasn't broken existing functionality.

## 3. 🌐 API Testing (Postman)
REST APIs form the backbone of this platform. API testing validates proper response codes, JSON data structures, and auth tokens.
- **Tools**: Postman, Axios Interceptors (for frontend).
- **Core Tests**:
  - `POST /api/auth/login` -> Validate `200 OK` and presence of JWT token.
  - `GET /api/restaurants` -> Validate `200 OK` and ensure response is an array of objects.

> *Note: A Postman Collection (`food-delivery-api.postman_collection.json`) is included in the repository for automated execution of these requests.*

## 4. 🗄️ Database Validations
Data integrity is critical. Though the project uses MongoDB (NoSQL), the underlying validation principles map directly to SQL validation tasks.

**Verification Example (Concept vs SQL Equivalent):**
- **Goal**: Verify a user's registration was saved.
- **Mongoose**: `User.findOne({ email: 'test@test.com' })`
- **SQL Equivalent**: `SELECT * FROM users WHERE email = 'test@test.com';`

## 5. 🎨 UI/UX Validation (Figma Alignment)
- Compare implemented Application UI against the provided Figma designs.
- Validate component margins, color hex codes, and typography.
- Ensure cross-device responsiveness (Web vs Mobile viewports).

## 6. 🤖 Automation Pipeline Readiness (Future Scope)
To further eliminate manual regression testing:
1. **End-to-End (E2E) Automation**: Implement Playwright for the React Web client to automate the `Login -> Add to Cart -> Checkout` flow.
2. **Mobile Automation**: Implement basic Appium scripts for React Native regression testing.
