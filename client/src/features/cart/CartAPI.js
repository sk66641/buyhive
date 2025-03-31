export function addToCart(item, userId) {
    return new Promise(async (resolve, reject) => {
        //TODO: we will not hard-code server URL here
        // const duplicateResponse = await fetch(`${import.meta.env.VITE_HOST}/cart?id=${item.id}`);
        // const duplicateData = await duplicateResponse.json();
        // const isDuplicate = duplicateData.some((item) => item.user.id === userId)
        // some returns boolean values if it exists
        // if (!isDuplicate) {
        if (true) {
            const response = await fetch(`${import.meta.env.VITE_HOST}/cart`,
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(item)
                }
            )
            const data = await response.json();
            // console.log("createUser", data)
            resolve({ data })
        }
        else {
            reject({ message: "Item already in cart" })
        }
    })
}

export function fetchItemsByUserId(userId) {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        const response = await fetch(`${import.meta.env.VITE_HOST}/cart?user=` + userId)
        const data = await response.json();
        resolve({ data })
    })
}

export function updateCart(update) {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        // console.log(userData)
        const response = await fetch(`${import.meta.env.VITE_HOST}/cart/` + update.id,
            {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(update)
            }
        )
        const data = await response.json();
        // console.log("createUser", data)
        resolve({ data })
    })
}

export function deleteItemFromCart(itemId) {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        // console.log(userData)
        const response = await fetch(`${import.meta.env.VITE_HOST}/cart/` + itemId,
            {
                method: 'DELETE',
            }
        )
        const data = await response.json();
        // console.log("createUser", data)
        resolve({ data: { id: itemId } })
    })
}

export function resetCart(userId) {
    return new Promise(async (resolve) => {
        const response = await fetchItemsByUserId(userId);
        const items = response.data;
        for (let item of items) {
            await deleteItemFromCart(item.id);
        }
        resolve({ data: { status: "successfully deleted" } });
    })
}
