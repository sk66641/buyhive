export function fetchAllProducts() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/products`,{
                credentials: 'include',
            });
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    });
}

export function fetchProductsById(id) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/products/${id}`,{
                credentials: 'include',
            });
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    });
}

export function fetchProductsByFilters(filter, sort, pagination) {
    let queryString = '';
    for (let key in filter) {
        const categoryValues = filter[key];
        if (categoryValues.length > 0) {
            queryString += `${key}=${categoryValues}&`;
        }
    }
    for (let key in sort) {
        queryString += `${key}=${sort[key]}&`;
    }
    for (let key in pagination) {
        queryString += `${key}=${pagination[key]}&`;
    }

    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/products?` + queryString, {
                credentials: 'include',
            });
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data: { products: data, totalItems: data.items } });
        } catch (error) {
            reject(error);
        }
    });
}
