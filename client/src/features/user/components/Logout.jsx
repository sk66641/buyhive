import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUser, signOutAsync } from '../../auth/authSlice'
import { Navigate } from 'react-router-dom';

const Logout = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectLoggedInUser);
    useEffect(() => {
        dispatch(signOutAsync(user.id));
    }, [dispatch, user])

    return (
        <>
            {!user && <Navigate to={'/login'} replace={true}></Navigate>}
        </>
    )
}

export default Logout
