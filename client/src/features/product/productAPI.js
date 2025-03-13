export function fetchAllProducts() {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        const response = await fetch('http://localhost:3000/products')
        const data = await response.json();
        resolve({ data })
    })
}
export function fetchProductsByFilters(filter, sort, pagination) {
    // console.log("fetchProductsByFilters", filter)
    // filter = {"category":["smartphone","laptops"]}
    // sort ={_sort: "price", _order: "desc/asc"}
    // pagination = {_page: 1, _per_page:10}
    // TODO : on server we will support multi values
    let queryString = '';
    for (let key in filter) {
        const categoryValues = filter[key];
        if (categoryValues.length > 0) {
            const lastCategoryValue = categoryValues[categoryValues.length - 1];
            queryString += `${key}=${lastCategoryValue}&`
            console.log("filter query", { queryString });
        }
    }
    for (let key in sort) {
        queryString += `${key}=${sort[key]}&`
        console.log("sort query", { queryString });
    }
    for (let key in pagination) {
        queryString += `${key}=${pagination[key]}&`;
        console.log("pagination query", { pagination })
    }

    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        const response = await fetch('http://localhost:3000/products?' + queryString)
        const data = await response.json()
        resolve({ data: { products: data, totalItems: data.items } })
        // resolve({ data });
    }
    );
}