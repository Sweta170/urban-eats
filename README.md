# 🍔 Urban Eats — Food Delivery MERN App

A full-stack food delivery web application built with the **MERN stack** (MongoDB, Express, React, Node.js). It supports customer ordering, restaurant management, admin control, real-time order tracking, payments, and more.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, React Router, Context API, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose ODM) |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **Real-time** | Socket.IO |
| **Payments** | Stripe |
| **Email** | Nodemailer |
| **Styling** | CSS Modules / Custom CSS |

---

## ✨ Features

### 👤 Customer
- Register / Login with JWT-based authentication
- Browse food menu with category filtering
- View detailed food/restaurant pages
- Add items to cart and place orders
- Checkout with **Stripe payment integration**
- Apply **coupon codes / promo codes** at checkout
- Real-time **order tracking** via Socket.IO
- View order history
- Save favourite restaurants/foods
- Write reviews
- Manage profile & change password
- Forgot / Reset password via email (Nodemailer)

### 🍽️ Restaurant Dashboard
- Manage restaurant listings and menu items
- View and process incoming orders

### 🛡️ Admin Dashboard
- Full control over users, restaurants, food items, categories
- Manage coupons and promo codes
- Analytics and platform overview
- Role-based access control (admin / restaurant / customer)

---

## 📁 Project Structure

```
food-delivery-mern/
├── client/                  # React frontend
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── context/         # React Context (auth, cart, etc.)
│       ├── pages/           # Page-level components
│       └── utils/           # Axios instance, helpers
│
└── server/                  # Express backend
    ├── controllers/         # Route handler logic
    ├── middleware/          # Auth, admin, role middleware
    ├── models/              # Mongoose schemas
    ├── routes/              # API route definitions
    ├── seed/                # Database seed scripts
    └── server.js            # Entry point
```

---

## 🗂️ API Reference

| Feature | Method | Endpoint |
|---|---|---|
| Register | POST | `/api/auth/register` |
| Login | POST | `/api/auth/login` |
| Forgot Password | POST | `/api/auth/forgot-password` |
| Reset Password | POST | `/api/auth/reset-password` |
| Get Foods | GET | `/api/food` |
| Get Categories | GET | `/api/category` |
| Get Restaurants | GET | `/api/restaurant` |
| Cart Operations | GET/POST/DELETE | `/api/cart` |
| Place Order | POST | `/api/order` |
| Get Orders | GET | `/api/order` |
| Reviews | GET/POST | `/api/review` |
| Favourites | GET/POST | `/api/favorite` |
| Validate Coupon | POST | `/api/coupons/validate` |
| Stripe Checkout | POST | `/api/payment/create-checkout-session` |
| Verify Payment | POST | `/api/payment/verify` |

> 🔒 Protected routes require a `Bearer <token>` in the `Authorization` header.

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v14+
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/atlas))
- [Stripe Account](https://stripe.com/) (for payments)

---

### 🖥️ Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
PORT=5000
```

Start the server:

```bash
npm start
```

The server will run on `http://localhost:5000`.

---

### 🌐 Frontend Setup

```bash
cd client
npm install
npm start
```

The React app will run on `http://localhost:3000`.

---

### 🌱 Seed the Database (Optional)

To populate the database with sample food items and coupons:

```bash
# From the server/ directory
node seedFoods.js
node seedCoupons.js
```

---

## 🔐 User Roles

| Role | Access |
|---|---|
| `customer` | Browse, order, review, manage profile |
| `restaurant` | Manage menu & orders for their restaurant |
| `admin` | Full platform access |

To promote a user to admin, run:

```bash
# From the server/ directory
node makeAdmin.js
```

---

## 📄 License

This project was developed as a **Final Year Project**. All rights reserved.
