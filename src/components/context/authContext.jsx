import React, { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {
  let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
  let [user, setUser] = useState(()=> localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null)
  let [infoUser, setinfoUser] = useState(null);

  //const [loading, setLoading] = useState(true);


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
      } else {
        alert('Invalid username or password');
      }
  };

  const dataUser = async (authTokens) => {
      const response = await fetch('https://apiv2-espaciosucm.onrender.com/api/v2/login/user/details/', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${authTokens?.access}`
        }
      });
      let data = await response.json()
      if (response.status === 200) {
        setinfoUser(data); // Almacena los datos del usuario en el estado userData
        } else {
        //alert('Invalid GET');
        //console.log('Respuesta no válida');
      }
  };



  let updateToken = async (authTokens)=> {
    let response = await fetch('https://apiv2-espaciosucm.onrender.com/api/v2/login/user/refresh-token/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization': `Bearer ${authTokens?.access}`
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
};
  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    setinfoUser(null);
    setRol('');
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  
  

useEffect(()=> {
  let fourMinutes = 1000 * 60 * 4
  let interval =  setInterval(()=> {
      if(authTokens){
          updateToken(authTokens)
      }
  }, fourMinutes)
  return ()=> clearInterval(interval)
 
}, [authTokens])

dataUser(authTokens)

let contextData = {
  user: user,
  authTokens:authTokens,
  loginUser:loginUser,
  logoutUser:logoutUser,
  infoUser: infoUser,
  dataUser: dataUser,
}

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
