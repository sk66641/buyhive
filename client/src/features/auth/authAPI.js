import { setUserInfo } from "../user/userSlice";

export function createUser(userData, dispatch) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/auth/signup`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(userData)
                }
            )
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            dispatch(setUserInfo(data));
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export function checkUser(loginInfo, dispatch) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(loginInfo)
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            dispatch(setUserInfo(data));
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export function signOut() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/auth/logout`, {
                credentials: 'include',
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export function resetPasswordRequest(email) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/auth/reset-password-request`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ email })
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}

export function resetPassword(email, token, password) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_HOST}/auth/reset-password`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify({ email, token, password })
            })
            if (!response.ok) {
                const err = await response.json();
                throw err;
            }
            const data = await response.json();
            resolve({ data });
        } catch (error) {
            reject(error);
        }
    })
}