import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUserInfo } from "../../user/userSlice";

const ProtectedAdmin = ({ children }) => {
    const user = useSelector(selectUserInfo);
    if (!user) {
        return <Navigate to={'/auth'} replace={true}></Navigate>;
    }
    if (user && user.role === 'user') {
        return <Navigate to={'/'} replace={true}></Navigate>;
    }
    return children;
}

export default ProtectedAdmin;