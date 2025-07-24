## Features (Expanded)

### User Features
- **Authentication:** Sign up, login, logout, password reset (email-based).
- **Profile Management:** View and update profile details, manage multiple addresses.
- **Product Browsing:** Filter and sort products by brand, category, price, and rating.
- **Product Details:** View detailed product info, images, highlights, reviews, and ratings.
- **Cart:** Add, update, and remove products from the cart.
- **Checkout:** Place orders with address selection and payment (Stripe or cash).
- **Order History:** View all past orders, including order status and payment status.
- **Dark Mode:** Toggle between light and dark themes.
- **Notifications:** Real-time toast notifications for actions and errors.

### Admin Features
- **Product Management:** Add, edit, and delete products (with support for images, highlights, colors, sizes, and stock).
- **Order Management:** View all orders, update order status (pending, placed, dispatched, delivered, received, cancelled), and payment status.
- **Brand & Category Management:** Add and manage brands and categories.
- **Admin-Only Routes:** Protected admin dashboard and forms.

---

## API Endpoints (Backend)

### Auth
- `POST /auth/signup` — Register a new user
- `POST /auth/login` — Login
- `GET /auth/logout` — Logout
- `POST /auth/reset-password-request` — Request password reset
- `POST /auth/reset-password` — Reset password

### User
- `GET /users` — Get logged-in user info
- `PATCH /users` — Update user info

### Address
- `POST /address/add` — Add address
- `GET /address` — Get all addresses for user
- `PATCH /address/update` — Update address
- `DELETE /address/:id` — Delete address

### Products
- `POST /products` — Add product (admin only)
- `GET /products` — List products (with filters)
- `GET /products/:id` — Get product details
- `PATCH /products/:id` — Update product (admin only)

### Brands & Categories
- `GET /brands` — List brands
- `POST /brands` — Add brand (admin only)
- `GET /categories` — List categories
- `POST /categories` — Add category (admin only)

### Cart
- `POST /cart` — Add to cart
- `GET /cart` — Get cart for user
- `DELETE /cart/:id` — Remove item from cart
- `PATCH /cart/:id` — Update cart item

### Orders
- `POST /orders` — Place order
- `GET /orders/user` — Get orders for logged-in user
- `GET /orders` — Get all orders (admin only)
- `PATCH /orders/:id` — Update order (admin only)
- `DELETE /orders/:id` — Delete order

### Stripe Integration
- `POST /create-payment-intent` — Create Stripe payment intent (protected)
- `POST /webhook` — Stripe webhook for payment status updates

---

## Demo Data

- The frontend includes a `data.json` file with sample products for local development and testing.
- You can run a mock API using `npm run json` in the `client` directory.

---

## Running the Project

### 1. Backend

```bash
cd server
npm install
# Create .env as described
npm start
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

- The frontend will be available at `http://localhost:5173` (default Vite port).
- The backend runs on `http://localhost:3000` (default Express port).

---

## Environment Variables

**Backend (`server/.env`):**
```
MONGO_DB=mongodb://localhost:27017/buyhive
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

**Frontend (`client/.env`):**
```
VITE_HOST=http://localhost:3000
```