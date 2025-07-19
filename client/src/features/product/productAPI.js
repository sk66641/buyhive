export async function fetchAllProducts() {
    const response = await fetch(`${import.meta.env.VITE_HOST}/products`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function fetchProductsById(id) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/products/${id}`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function fetchProductsByFilters(filter, sort, pagination) {
    const params = new URLSearchParams();
    for (let key in filter) {
        const values = filter[key];
        if (values.length > 0) {
            params.append(key, values);
        }
    }
    for (let key in sort) {
        params.append(key, sort[key]);
    }
    for (let key in pagination) {
        params.append(key, pagination[key]);
    }

    const response = await fetch(`${import.meta.env.VITE_HOST}/products?${params.toString()}`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    const data = await response.json();
    return {
        products: data,
        totalItems: data.items
    };
}

export async function updateProduct(update) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/products/${update.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(update)
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function createProduct(product) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/products`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(product)
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}
