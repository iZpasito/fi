import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext({});

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(
    () => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  );
  const [user, setUser] = useState(
    () => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null
  );
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loginUser = async (credentials) => {
    try {
      const response = await axios.post('https://apiv2-espaciosucm.onrender.com/api/v2/login/', credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
        navigate('/user/agendar');
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
    navigate('/login');
  };

  const updateToken = async () => {
    try {
      if (!authTokens || !authTokens.refresh) {
        logoutUser(); // Cerrar la sesión si no hay token de actualización
        return;
      }
  
      const response = await axios.post(
        'https://apiv2-espaciosucm.onrender.com/api/v2/login/user/refresh-token/',
        { refresh: authTokens.refresh },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 200) {
        const data = response.data;
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
      } else {
        throw new Error('Failed to update token');
      }
  
      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error updating token:', error);
      logoutUser(); // Cerrar la sesión en caso de error al actualizar el token
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
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};

