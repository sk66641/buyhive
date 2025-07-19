import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectUserInfo } from "../../user/userSlice";
import { selectIsFetchingLoggedInUser } from "../../user/userSlice";
import { motion } from "framer-motion";

const ProtectedAdmin = ({ children }) => {
    const user = useSelector(selectUserInfo);
    const location = useLocation();
    const isFetchingLoggedInUser = useSelector(selectIsFetchingLoggedInUser);

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

    if (!user) {
        return <Navigate to={'/auth'} state={{ from: location }} replace={true} ></Navigate >;
    }
    if (user && user.role === 'user') {
        return <Navigate to={'/'} state={{ from: location }} replace={true}></Navigate>;
    }
    return children;
}

export default ProtectedAdmin;