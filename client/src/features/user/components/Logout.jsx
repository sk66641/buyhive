import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  signOutAsync } from '../../auth/authSlice'
import { Navigate } from 'react-router-dom';
import { selectUserInfo } from '../userSlice';

const Logout = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    useEffect(() => {
        dispatch(signOutAsync());
    }, [dispatch])

    return (
        <>
            {!user && <Navigate to={'/login'} replace={true}></Navigate>}
        </>
    )
}

export default Logout
