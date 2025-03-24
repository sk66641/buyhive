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


export function fetchAllOrders(sort, pagination) {
    // console.log("fetchProductsByFilters", filter)
    // filter = {"category":["smartphone","laptops"]}
    // sort ={_sort: "price", _order: "desc/asc"}
    // pagination = {_page: 1, _per_page:10}
    // TODO : on server we will support multi values
    let queryString = '';
    // for (let key in filter) {
    //     const categoryValues = filter[key];
    //     if (categoryValues.length > 0) {
    //         const lastCategoryValue = categoryValues[categoryValues.length - 1];
    //         queryString += `${key}=${lastCategoryValue}&`
    //         console.log("filter query", { queryString });
    //     }
    // }
    for (let key in sort) {
        queryString += `${key}=${sort[key]}&`
        // console.log("sort query", { queryString });
    }
    for (let key in pagination) {
        queryString += `${key}=${pagination[key]}&`;
        // console.log("pagination query", { pagination })
    }
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        const response = await fetch('http://localhost:3000/orders?' + queryString)
        const data = await response.json()
        resolve({ data: { orders: data, totalOrders: data.items } })
        // resolve({ data });
    }
    );
}

export function updateOrder(order) {
    return new Promise(async (resolve) => {
        const response = await fetch('http://localhost:3000/orders/' + order.id, {
            method: 'PATCH',
            body: JSON.stringify(order),
            headers: { 'content-type': 'application/json' },
        });
        const data = await response.json();
        resolve({ data });
    });
}