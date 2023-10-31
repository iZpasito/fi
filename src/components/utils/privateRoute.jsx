import { Route, redirect } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/authContext'


const PrivateRoute = ({ children, roles }) => {
  const { infoUser} = useContext(AuthContext); // Asegúrate de usar el contexto adecuado
  if (!infoUser) {
    // Si no se tiene información del usuario, redirige a la página de inicio de sesión
    return redirect("/login");
  }

  if (roles && !roles.some(infoUser.includes(rol))) {
    return redirect("/user/agendar");
  }

  return children;
};

export default PrivateRoute;