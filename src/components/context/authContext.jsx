import React, { createContext, useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext({});

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
  let [userData, setUserData] = useState(null);

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
      let data = await response.json();
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwt_decode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
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
          'Authorization': 'Bearer' + String(authTokens.access)
        }
      });
      let data = await response.json()
      if (response.status === 200) {
        setUserData(data); // Almacena los datos del usuario en el estado userData
        console.log('Datos del usuario:', data);
      } else {
        alert('Invalid GET');
        console.log('Respuesta no válida');
      }
  };

console.log(authTokens);

  let updateToken = async ()=> {
    let response = await fetch('https://apiv2-espaciosucm.onrender.com/api/v2/login/user/refresh-token/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization': 'Bearer ' + String(authTokens?.access)
        },
        body:JSON.stringify({'refresh':authTokens?.refresh})
    })

    let data = await response.json()
    if (response.status === 200){
        setAuthTokens(data)
        setUser(jwt_decode(data.access))
        localStorage.setItem('authTokens', JSON.stringify(data))
    }else{
        logoutUser()
    }

    if(loading){
        setLoading(false)
    }
}




  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    setUserData(null)
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  let contextData = {
    user:user,
    authTokens:authTokens,
    loginUser:loginUser,
    logoutUser:logoutUser,
    dataUser: dataUser,
}
useEffect(()=> {

  if(loading){
      updateToken()
  }

  let fourMinutes = 1000 * 60 * 4


  let interval =  setInterval(()=> {
      if(authTokens){
          updateToken()
      }
  }, fourMinutes)
  return ()=> clearInterval(interval)

}, [authTokens, loading])

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
