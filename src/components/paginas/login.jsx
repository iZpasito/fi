import { useContext, useState} from 'react';
import AuthContext from '../context/authContext';

const Login = () => {
  const {loginUser } = useContext(AuthContext);
	const [credentials, setCredentials] = useState({
    username:"",
    password:""
  })

 const handleChange = (e) =>{
   setCredentials(prev=>({...prev, [e.target.name]: e.target.value}))
 }
 const handleLogin = async (e) => {
   e.preventDefault()
   try{
     await loginUser(credentials)
   }catch(err){
     console.log("ERROR")
   }
 };
  return (
      <div className="h-screen relative flex flex-col justify-center min-w-367 w-auto shadow-mt overflow-hidden bg-cover bg-[url(/src/assets/campus1.png)]">
        <div className="w-full p-8 m-auto shadow-2xl shadow-black-500 md:shadow-2xl md:shadow-black-500  rounded-md  mx-auto  lg:max-w-xl ">
        <h1 className="text-3xl font-semibold text-center text-blue-600">
            Iniciar Sesion
          </h1>
          <form className="mt-6 bg-green-560" onSubmit={handleLogin} >
            <div className="mb-2">
              <label htmlFor="email" className="block text-xl font-semibold text-gray-800">
                Correo
              </label>
              <input
                type="email"
                name="username"
                onChange={handleChange}
                placeholder='...@alu.ucm.cl'
                className="text-xl block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-blue-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="block text-xl font-semibold text-gray-800">
                Contraseña
              </label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                placeholder='Contraseña'
                className="text-xl block w-full px-4 py-2 mt-2 text-black-700 bg-white border rounded-md focus:border-blue-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
              />
            </div>
            <div className="mt-6">
              <button type="submit" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 text-xl rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-700">
                Acceder
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  export default Login;