import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectUserInfo } from "../../user/userSlice";

const ProtectedAdmin = ({ children }) => {
    const user = useSelector(selectUserInfo);
    const location = useLocation();

    if (!user) {
        return <Navigate to={'/auth'} state={{ from: location }} replace={true} ></Navigate >;
    }
    if (user && user.role === 'user') {
        return <Navigate to={'/'} state={{ from: location }} replace={true}></Navigate>;
    }
    return children;
}

export default ProtectedAdmin;