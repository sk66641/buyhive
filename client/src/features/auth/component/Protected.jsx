import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { selectUserInfo } from "../../user/userSlice";

const Protected = ({ children }) => {
    const user = useSelector(selectUserInfo);
    const location = useLocation();
    if (!user) {
        return <Navigate to="/auth" state={{ from: location }} replace={true} />;
    }
    return children;
}

export default Protected;