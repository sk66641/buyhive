import { setUserInfo } from "../user/userSlice";

export async function createUser(userData, dispatch) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/auth/signup`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    const data = await response.json();
    dispatch(setUserInfo(data));
    return data;
}

export async function checkUser(loginInfo, dispatch) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(loginInfo)
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    const data = await response.json();
    dispatch(setUserInfo(data));
    return data;
}

export async function signOut() {
    const response = await fetch(`${import.meta.env.VITE_HOST}/auth/logout`, {
        credentials: 'include',
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function resetPasswordRequest(email) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/auth/reset-password-request`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ email })
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}

export async function resetPassword(email, token, password) {
    const response = await fetch(`${import.meta.env.VITE_HOST}/auth/reset-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({ email, token, password })
    });
    if (!response.ok) {
        const err = await response.json();
        throw err;
    }
    return await response.json();
}
