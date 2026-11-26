# goodthings Storefront

React and Vite storefront for the goodthings MERN shopping cart project. It displays products from the Express API, with search, category filters, and a shopping bag.

## Run the frontend

From this folder:

```bash
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000/api` by default. To use a different API host, create `.env` in this folder:

```env
VITE_API_URL=https://your-api-host/api
```

If the backend is unreachable, the storefront falls back to a sample catalog and stores the demo cart in this browser. Demo cart changes are not saved to MongoDB.

For full stack installation, MongoDB setup, API routes, and CRUD details, see the [project README](../README.md).
