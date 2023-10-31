import Agendar from "./components/paginas/PagAgendar";
import AdmAgendar from "./components/paginas/AdmAgendar";
import Login from "./components/paginas/login";
import AdmInformes from "./components/paginas/AdmInformes";
import { useContext } from "react";
import {AuthContext} from './components/context/authContext';
import PageError from "./components/paginas/page-error"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";



function App() {
  const { infoUser } = useContext(AuthContext)
  const ProtectedRoute = ({ children, roles }) => {
    if (!infoUser) {
      return <Navigate to="/login" replace={true} />;
    }

    if (roles && !roles.includes()) {
      return <Navigate to="/" replace={true} />;
    }

    return children;
  };

  const router = createBrowserRouter([
    //Rutas protegidas por acceso
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Agendar/>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/admin/agendar",
          element: (<ProtectedRoute ><AdmAgendar /></ProtectedRoute>),
          errorElement: <PageError/>
        },
        {
          path: "/admin/informes",
          element: (<ProtectedRoute ><AdmInformes/></ProtectedRoute>),
          errorElement: <PageError/>
        },
        {
          path: "/user/agendar",
          element: (<ProtectedRoute ><Agendar /></ProtectedRoute>),
          errorElement: <PageError/>
        },
      ]
    },
      {
        path: "/login",
        element: <Login/>,
      }
    ]);
    return (
      <div>
        <RouterProvider router={router} />
      </div>
    );
  }


export default App;
