import React, { useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import SignUp from './SignUp';
import { useSelector } from 'react-redux';
import { selectIsFetchingLoggedInUser, selectUserInfo } from '../../user/userSlice';
import Login from './Login';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
    const [authMethod, setAuthMethod] = useState('login');
    const location = useLocation();
    const user = useSelector(selectUserInfo);
    const isFetchingLoggedInUser = useSelector(selectIsFetchingLoggedInUser);

    if (user) return <Navigate to={location?.state?.from?.pathname || '/'} replace={true} />;

    if (isFetchingLoggedInUser) {
        return (    
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-900 to-gray-800">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"
                />
            </div>
        );
    }

    return (
        <>
            {authMethod === 'login' ? <Login setAuthMethod={setAuthMethod} /> : <SignUp setAuthMethod={setAuthMethod} />}
        </>
    )
}

export default Auth
