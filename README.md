# 🍫 CocoaCraft — Homemade Chocolate & Nuts Store

A modern, responsive **full-stack MERN e-commerce application** for a premium homemade
chocolate, dry-fruits, nuts and gift-box brand. Includes a full customer storefront, a
**dummy payment gateway** (UPI / Net Banking / Cards / Wallet), and a secure **admin panel**.

> **Note:** The payment gateway is fully **simulated** — no real payment provider is
> integrated and no money is ever charged.

---

## ✨ Tech Stack

| Layer      | Technology                                   |
|------------|----------------------------------------------|
| Frontend   | React 18 (Vite) + Tailwind CSS + React Router|
| Backend    | Node.js + Express (ES modules)               |
| Database   | MongoDB + Mongoose                           |
| Auth       | JWT (Bearer tokens) + bcrypt                 |
| Payments   | Dummy simulator (UPI, Net Banking, Cards, Wallet) |

---

## 📁 Project Structure

```
Nutch_Choclate_app/
├── backend/
│   ├── config/          # DB connection
│   ├── controllers/     # Route handlers (auth, product, order, payment, admin...)
│   ├── middleware/       # auth, error handling, validation, file upload
│   ├── models/          # Mongoose schemas (User, Product, Order, Payment, Category)
│   ├── routes/          # Express routers
│   ├── utils/           # token, helpers, DB seed script
│   ├── uploads/         # uploaded product images (served statically)
│   ├── .env.example     # environment template
│   └── server.js        # app entry point
│
└── frontend/
    ├── src/
    │   ├── api/          # axios instance
    │   ├── components/    # Navbar, Footer, ProductCard, Rating, Loader...
    │   ├── context/      # Auth, Cart, Wishlist, Theme providers
    │   ├── pages/        # customer pages
    │   │   └── admin/     # admin panel pages
    │   ├── utils/        # formatters
    │   ├── App.jsx       # routes
    │   └── main.jsx      # entry
    ├── tailwind.config.js
    └── vite.config.js    # proxies /api to backend
```

---

## ✅ Prerequisites

This project needs the following installed (they are **not** currently on this machine):

1. **Node.js 18+** — https://nodejs.org/en/download  (includes npm)
2. **MongoDB** — either:
   - Local server (MongoDB Community Server), or
   - A free **MongoDB Atlas** cloud cluster (recommended, no install) — https://www.mongodb.com/atlas

Verify after installing:

```bash
node --version
npm --version
```

---

## 🚀 Getting Started

### 1. Backend

```bash
cd backend
npm install

# create your env file from the template
cp .env.example .env        # Windows PowerShell: Copy-Item .env.example .env
# then edit .env and set MONGO_URI + JWT_SECRET
```

Seed the database with sample products, categories, an admin, and a demo customer:

```bash
npm run seed
```

Start the API server:

```bash
npm run dev     # development (auto-reload via nodemon)
# or
npm start       # production
```

API runs at **http://localhost:5000** (health check: `GET /api/health`).

### 2. Frontend

In a **second terminal**:

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**. Vite proxies `/api` and `/uploads` to the backend,
so no CORS setup is needed in development.

---

## 🔑 Demo Credentials (created by `npm run seed`)

| Role     | Email                     | Password      |
|----------|---------------------------|---------------|
| Admin    | admin@cocoacraft.com      | Admin@123     |
| Customer | customer@cocoacraft.com   | Customer@123  |

The admin panel is available at **/admin** (visible in the account menu when logged in as admin).

---

## 💳 Dummy Payment Gateway

At checkout you're taken to **CocoaPay**, a simulated gateway supporting:

- **UPI** — enter any UPI ID (`name@bank`)
- **Net Banking** — pick a bank (SBI, HDFC, ICICI, Axis, PNB)
- **Credit / Debit Card** — 16-digit number, MM/YY expiry, 3-digit CVV, holder name
- **Wallet** — PhonePe, Google Pay, Paytm

On "Pay", the app shows a **3-second loading animation**, then:
- marks the order **Paid**, generates an **Order ID** + **Transaction ID**,
- decrements product stock, saves a `Payment` record,
- sends a **mock confirmation email** (logged to the backend console),
- and redirects to the **Order Success** page.

---

## 🎟️ Coupon Codes

Try these at checkout: **`SWEET10`** (10% off), **`COCOA20`** (20% off), **`FESTIVE25`** (25% off).

Pricing rules: 5% GST, ₹49 delivery (**free above ₹999**). All totals are computed
server-side so the client cannot tamper with prices.

---

## 🧩 Features

**Customer:** landing page & hero, categories, search / filter / sort / pagination,
product details with gallery & reviews, cart, checkout, dummy payment, order success,
registration / login / forgot-password, profile, my orders, order details, invoice
(print/PDF), wishlist, recently-viewed, related products, dark mode, fully responsive.

**Admin:** secure admin login, dashboard (orders / customers / revenue / stock + low-stock
alerts), product management (create/edit/delete, image upload, stock & price, featured
flag), order management (status pipeline), customer management (search + order history).

---

## 🔌 API Overview

| Method | Endpoint                          | Access   | Purpose                        |
|--------|-----------------------------------|----------|--------------------------------|
| POST   | `/api/auth/register`              | Public   | Register                       |
| POST   | `/api/auth/login`                 | Public   | Login                          |
| POST   | `/api/auth/forgot-password`       | Public   | Request reset token (mock)     |
| POST   | `/api/auth/reset-password`        | Public   | Reset password                 |
| GET    | `/api/products`                   | Public   | List (search/filter/sort/page) |
| GET    | `/api/products/featured`          | Public   | Featured products              |
| GET    | `/api/products/:id`               | Public   | Product details                |
| GET    | `/api/products/:id/related`       | Public   | Related products               |
| POST   | `/api/products/:id/reviews`       | Private  | Add review                     |
| POST   | `/api/products`                   | Admin    | Create product (multipart)     |
| PUT    | `/api/products/:id`               | Admin    | Update product                 |
| DELETE | `/api/products/:id`               | Admin    | Delete product                 |
| GET    | `/api/categories`                 | Public   | List categories                |
| POST   | `/api/orders/preview`             | Private  | Price preview + coupon         |
| POST   | `/api/orders`                     | Private  | Create order                   |
| GET    | `/api/orders/my`                  | Private  | My orders                      |
| GET    | `/api/orders/:id`                 | Private  | Order details                  |
| PUT    | `/api/orders/:id/cancel`          | Private  | Cancel order                   |
| POST   | `/api/payments/process`           | Private  | Simulate payment               |
| GET    | `/api/admin/stats`                | Admin    | Dashboard stats                |
| GET    | `/api/admin/orders`               | Admin    | All orders                     |
| PUT    | `/api/admin/orders/:id/status`    | Admin    | Update order status            |
| GET    | `/api/admin/customers`            | Admin    | List/search customers          |
| GET    | `/api/admin/customers/:id/orders` | Admin    | Customer order history         |
| GET    | `/api/users/profile`              | Private  | Profile                        |
| PUT    | `/api/users/profile`              | Private  | Update profile                 |
| GET/POST | `/api/users/wishlist[/:id]`     | Private  | Wishlist                       |

---

## 🎨 Theme

Premium handmade-chocolate palette: **Chocolate Brown** `#5D4037`, **Cream** `#FFF8E1`,
**Gold** `#C9A227`, White — with rounded cards, smooth animations, and light/dark mode.

---

## 📝 Notes

- Product images use Unsplash URLs in the seed data and support admin uploads (stored in
  `backend/uploads/`).
- Emails and invoices are **mocked** (console log + browser print) — swap in nodemailer /
  a PDF library for production.
- Change `JWT_SECRET` and the admin password before any real deployment.
