export async function createOrder(orderData) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
    });

    if (!response.ok) {
        const err = await response.json();
        throw err;
    }

    return await response.json();
}

export async function fetchAllOrders(sort, pagination) {
    const queryParams = new URLSearchParams({
        ...sort,
        ...pagination
    }).toString();

    const response = await fetch(`${import.meta.env.VITE_HOST}/orders?${queryParams}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const err = await response.json();
        throw err;
    }

    const data = await response.json();
    return {
        orders: data.data,
        totalOrders: data.items
    };
}

export async function updateOrder(order) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/orders/${order.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    });

    if (!response.ok) {
        const err = await response.json();
        throw err;
    }

    return await response.json();
}
