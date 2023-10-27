import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.is_staff)) {
      return <Navigate to="/" />;
    }

    return children;
  };

export default PrivateRoute;