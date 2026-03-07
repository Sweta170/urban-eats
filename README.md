# Food Delivery MERN App (QA Target)

## How to Run

### Backend
1. Go to `server` folder
2. Run `npm install`
3. Set up MongoDB (local or Atlas)
4. Create a `.env` file with:
   - `MONGO_URI=<your_mongo_connection_string>`
   - `JWT_SECRET=<your_jwt_secret>`
5. Run `npm start`

### Frontend
1. Go to `client` folder
2. Run `npm install`
3. Run `npm start`

## API List

| Feature      | Method | Endpoint              |
|--------------|--------|-----------------------|
| Signup       | POST   | /api/auth/register    |
| Login        | POST   | /api/auth/login       |
| Get food     | GET    | /api/food             |
| Add to cart  | POST   | /api/cart             |
| Place order  | POST   | /api/order            |
| Get orders   | GET    | /api/order            |

- All responses are JSON
- Use proper HTTP status codes
- JWT required for protected routes

---
This app is for QA testing. No payment, admin, or test code included.
