import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/authContext";
import { useContext } from "react";

const PrivateRoute = ({ children, roles }) => {
  const {user} = useContext(AuthContext)  
  if (!user) {
      return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.is_staff)) {
      return <Navigate to="/" />;
    }

    return children;
  };

export default PrivateRoute;