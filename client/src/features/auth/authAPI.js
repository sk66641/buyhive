export function createUser(userData) {
    return new Promise(async (resolve) => {
        //TODO: we will not hard-code server URL here
        // console.log(userData)
        const response = await fetch(`${import.meta.env.VITE_HOST}/users`,
            {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(userData)
            }
        )
        const data = await response.json();
        // console.log("createUser", data)
        resolve({ data })
    })
}
export function checkUser(loginInfo) {
    return new Promise(async (resolve, reject) => {
        const email = loginInfo.email;
        const password = loginInfo.password;
        //TODO: we will not hard-code server URL here
        // console.log(userData)
        const response = await fetch(`${import.meta.env.VITE_HOST}/users?email=` + email)
        const data = await response.json();
        if (data.length) {
            if (password === data[0].password) {
                resolve({ data: data[0] })
            }
            else {
                reject({ message: 'wrong credentials' })
            }
        }
        else {
            reject({ message: 'user not found' })
        }
        // console.log("createUser", data)
        // resolve({ data })
    })
}
export function signOut(userId) {
    return new Promise(async (resolve) => {
        resolve({ data: "success" });
    })
}