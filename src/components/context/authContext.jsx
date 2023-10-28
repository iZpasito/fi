import { createContext, useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(
    () => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(
    () => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null
  );
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const loginUser = async (credentials) => {
    try {
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
        navigate('/agendar');
      } else {
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/');
  };

  const updateToken = async () => {
    try {
      const response = await fetch('https://apiv2-espaciosucm.onrender.com/api/v2/login/user/refresh-token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'refresh': authTokens?.refresh })
      });

      if (response.status === 200) {
        const data = await response.json();
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
      } else {
        logoutUser();
      }
      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error updating token:', error);
    }
  };

  useEffect(() => {
    if (authTokens) {
      updateToken();
    } else {
      setLoading(false);
    }
  }, [authTokens]);

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const fourMinutes = 1000 * 60 * 4;
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);

    return () => clearInterval(interval);
  }, [authTokens, loading]);

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    errors,
    openDialog,
    setOpenDialog
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
