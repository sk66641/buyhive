export function fetchUserOrders(userId) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/orders/user`, {
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

export function updateUser(update) {
    return new Promise(async (resolve, reject) => {
        try {
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
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    });
}

export function fetchLoggedInUser() {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Fetching logged in user");
            const response = await fetch(`${import.meta.env.VITE_HOST}/users`, {
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

export function addAddress(address) {
    return new Promise(async (resolve, reject) => {
        try {
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
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    });
}

export function fetchAddresses() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/addresses`, {
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

export function updateAddress(address) {
    return new Promise(async (resolve, reject) => {
        try {
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
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    });
}

export function deleteAddress(addressId) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/addresses/${addressId}`, {
                method: 'DELETE',
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