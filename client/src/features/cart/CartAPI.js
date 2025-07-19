export async function addToCart(item, userId) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/cart`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(item)
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function fetchItemsByUserId() {
    const response = await fetch(`${import.meta.env.VITE_HOST}/cart`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function updateCart(update) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/cart/${update.id}`, {
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

export async function deleteItemFromCart(itemId) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/cart/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function resetCart() {
    const items = await fetchItemsByUserId();
    for (let item of items) {
        await deleteItemFromCart(item.id);
    }
    return { status: "Cart reset successfully" };
}
