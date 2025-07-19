export async function fetchUserOrders(userId) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/orders/user`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function updateUser(update) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/users`, {
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

export async function fetchLoggedInUser() {
    const response = await fetch(`${import.meta.env.VITE_HOST}/users`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function addAddress(address) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/addresses/add`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(address)
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function fetchAddresses() {
    const response = await fetch(`${import.meta.env.VITE_HOST}/addresses`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function updateAddress(address) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/addresses/update`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(address)
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function deleteAddress(addressId) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/addresses/${addressId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}
