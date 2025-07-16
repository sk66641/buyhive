export function createOrder(orderData) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/orders`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(orderData)
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

export function fetchAllOrders(sort, pagination) {
    let queryString = '';
    for (let key in sort) {
        queryString += `${key}=${sort[key]}&`;
    }
    for (let key in pagination) {
        queryString += `${key}=${pagination[key]}&`;
    }
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/orders?` + queryString, {
                credentials: 'include',
            });
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data: { orders: data, totalOrders: data.items } });
        } catch (error) {
            reject(error);
        }
    });
}

export function updateOrder(order) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/orders/` + order.id, {
                method: 'PATCH',
                credentials: 'include',
                body: JSON.stringify(order),
                headers: { 'content-type': 'application/json' },
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
