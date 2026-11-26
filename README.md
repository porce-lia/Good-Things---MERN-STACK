# goodthings — MERN Shopping Cart

A full stack shopping cart lab project with an editorial storefront, searchable product catalog, category filters, and a persistent shopping cart.

## Tech stack

- **Frontend:** React 19, Vite, CSS
- **Backend:** Node.js, Express 5
- **Database:** MongoDB with Mongoose

## Features

- Responsive storefront with product images, search, and category filters
- Add products to the cart, change quantities, remove items, and clear the cart
- Product REST API with create, read, update, and delete operations
- MongoDB models for products and cart items
- Demo catalog and browser-saved demo cart when the backend is unavailable
- Sample catalog seeding that adds or updates examples without deleting other products or the cart

## Requirements

- Node.js 20.19+ or 22.12+
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

### 1. Configure MongoDB

In a terminal, go to `backend` and copy `.env.example` to `.env`:

```bash
cd backend
copy .env.example .env
```

On macOS/Linux, use `cp .env.example .env`. Edit `.env` and set `MONGO_URI` to your MongoDB URL. The example uses a local MongoDB database named `goodthings`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/goodthings
```

For Atlas, replace the local URL with your Atlas connection string. Keep the real `.env` file private; it is git-ignored.

### 2. Install backend dependencies and seed sample products

```bash
cd backend
npm install
npm run seed
```

The seed command inserts or updates the sample products by name. It does not clear the database or cart.

### 3. Start the backend

In the `backend` folder:

```bash
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health` for its status. MongoDB must be running for the backend to start.

### 4. Start the frontend

Open a second terminal:

```bash
cd mern-project
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

If the API is hosted elsewhere, create `mern-project/.env` and set:

```env
VITE_API_URL=https://your-api-host/api
```

The frontend defaults to `http://localhost:5000/api`.

## API routes

### Products

| Method | Route | Operation |
|---|---|---|
| GET | `/api/products` | List products |
| GET | `/api/products/:id` | Read one product |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/:id` | Update a product |
| DELETE | `/api/products/:id` | Delete a product and remove it from carts |

### Cart

| Method | Route | Operation |
|---|---|---|
| GET | `/api/cart` | Read the cart |
| POST | `/api/cart/add` | Add a product or increase its quantity |
| PUT | `/api/cart/:productId` | Set product quantity |
| DELETE | `/api/cart/:productId` | Remove a product |
| DELETE | `/api/cart` | Clear the cart |

`GET /api/health` reports API and database status.

## CRUD status and limitations

All four product CRUD operations are implemented in the backend REST API. The storefront itself is a shopping UI; it does not include an admin screen for creating, editing, or deleting products. Those operations can be called through the API.

The current cart model stores one shared cart, without user accounts or per-user carts. Checkout is a UI placeholder; a payment provider and order workflow have not been integrated.

## MongoDB status

The project is configured to use MongoDB via `MONGO_URI`. On the last local connection attempt, MongoDB at `127.0.0.1:27017` refused the connection, so the backend could not start. Start MongoDB or set a working Atlas URL in `backend/.env`, then run `npm run seed` and `npm run dev` from `backend`.

When the API cannot be reached, the frontend displays the demo products and saves the demo cart in browser `localStorage`. Demo data is not written to MongoDB.
