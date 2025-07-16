import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectUserInfo } from "../../user/userSlice";

const Protected = ({ children }) => {
    const user = useSelector(selectUserInfo);
    if (!user) {
        return <Navigate to={'/login'} replace={true}></Navigate>;
    }
    return children;
}

export default Protected;