export function createOrder(orderData) {
    return new Promise(async (resolve) => {
        const response = await fetch('http://localhost:3000/orders',
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(orderData)
            }
        )
        const data = await response.json();
        resolve({ data })
    })
}