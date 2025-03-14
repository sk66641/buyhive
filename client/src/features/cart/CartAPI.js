export function addToCart(item, userId) {
    return new Promise(async (resolve, reject) => {
        //TODO: we will not hard-code server URL here
        const duplicateResponse = await fetch(`http://localhost:3000/carts?id=${item.id}`);
        const duplicateData = await duplicateResponse.json();
        const isDuplicate = duplicateData.some((item) => item.user.id === userId)
        // some returns boolean values if it exists
        if (!isDuplicate) {
            const response = await fetch('http://localhost:3000/carts',
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
        const response = await fetch('http://localhost:3000/carts?user.id=' + userId)
        const data = await response.json();
        resolve({ data })
    })
}

export function updateCart(update) {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        // console.log(userData)
        const response = await fetch('http://localhost:3000/carts/' + update.id,
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
        const response = await fetch('http://localhost:3000/carts/' + itemId,
            {
                method: 'DELETE',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(itemId)
            }
        )
        const data = await response.json();
        // console.log("createUser", data)
        resolve({ data: { id: itemId } })
    })
}