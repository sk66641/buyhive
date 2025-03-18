export function fetchLoggedInUserOrders(userId) {
    return new Promise(async (resolve) => {
        const response = await fetch('http://localhost:3000/orders?user.id=' + userId)
        const data = await response.json();
        // console.log("createUser", data)
        resolve({ data })
    })
}
export function updateUser(update) {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        // console.log(update)
        // console.log(update,update.id)
        const response = await fetch('http://localhost:3000/users/' + update.id,
            {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(update)
            }
        )
        const data = await response.json();
        // console.log(data)
        // console.log("createUser", data)
        resolve({ data })
    })
}

export function fetchLoggedInUser(userId) {
    return new Promise(async (resolve) => {
        const response = await fetch('http://localhost:3000/users/' + userId)
        const data = await response.json()
        resolve({ data })
    }
    );
}
