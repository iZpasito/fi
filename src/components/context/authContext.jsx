import { createContext, useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(
    () => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [user, setUser] = useState(
    () => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
    const [userData, setUserData] = useState(null);


  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (credentials) => {
      const response = await fetch('https://apiv2-espaciosucm.onrender.com/api/v2/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      if (response.status === 200) {
        const data = await response.json();
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
        //localStorage.setItem('refreshToken', data.refresh);
        navigate('/user/agendar');
      } else {
        alert('Invalid username or password');
        setErrors(data)
      }
  };


  const dataUser = async () => {
      const response = await fetch('https://apiv2-espaciosucm.onrender.com/api/v2/login/user/details/', {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'Content-type': 'application/json',
          'Authorization': `Bearer "${authTokens}"`
        }
      });
      if (response.status === 200) {
        const data = await response.json();
        setUserData(data); // Almacena los datos del usuario en el estado userData
        console.log('Datos del usuario:', data);
      } else {
        alert('Invalid GET');
        console.log('Respuesta no válida');
      }
  };
  

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    setUserData(null)
    localStorage.removeItem('authTokens');

    navigate('/login');
  };

  const updateToken = async () => {
    console.log("update token")
    const response = await fetch('https://apiv2-espaciosucm.onrender.com/api/v2/login/user/refresh-token/', {
      // const response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 'refresh': authTokens?.refresh })
    })
    const data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwt_decode(data.access));
      localStorage.setItem('authTokens', JSON.stringify(data));
    } else {
      logoutUser()
    }
    if (loading){
      setLoading(false)
    }
  }

  useEffect(() => {

    if (loading) {
      updateToken()
    }

    const fourMinutes = 1000 * 60 * 4

    const interval = setInterval(() => {
      if (authTokens) {
        updateToken()
      }
    }, fourMinutes)

    return () => clearInterval(interval)

  }, [authTokens, loading])

  

  const contextData = {
    authTokens: authTokens,
    loginUser: loginUser,
    logoutUser: logoutUser,
    dataUser: dataUser,
    errors,
    openDialog,
    setOpenDialog,
    userData
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
