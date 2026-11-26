const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const request = async (path, options = {}) => {
    let response;
    try {
        response = await fetch(`${API}${path}`, options);
    } catch {
        throw new Error("Cannot reach the store API. Start the backend and check its connection.");
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
    return data;
};

// PRODUCT APIs

export const getProducts = async () => {
    return request("/products");
};

export const getProduct = async (id) => {
    return request(`/products/${id}`);
};

export const addProduct = async (product) => {
    return request("/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
};

export const updateProduct = async (id, product) => {
    return request(`/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
};

export const deleteProduct = async (id) => {
    return request(`/products/${id}`, {
        method: "DELETE"
    });
};


// CART APIs

export const getCart = async () => {
    return request("/cart");
};

export const addToCart = async (productId) => {
    return request("/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId })
    });
};

export const updateCartQuantity = async (id, quantity) => {
    return request(`/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity })
    });
};

export const removeFromCart = async (id) => {
    return request(`/cart/${id}`, {
        method: "DELETE"
    });
};

export const clearCart = async () => {
    return request("/cart", {
        method: "DELETE"
    });
};
