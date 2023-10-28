import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/context/authContext";
import Agendar from "./components/paginas/PagAgendar";
import AdmAgendar from "./components/paginas/AdmAgendar";
import Login from "./components/paginas/login";
import PrivateRoute from "./components/utils/privateRoute";
import AdmInformes from "./components/paginas/AdmInformes";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
          <Route path="/login" element={<Login/>} />
            <Route path="/" element={<Login/>} />
            <Route
              path="/admin/agendar" 
              element={
                <PrivateRoute>
                  <AdmAgendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/informes"
              element={
                <PrivateRoute>
                  <AdmInformes />
                </PrivateRoute>
              }
            />
            <Route
              path="/user/agendar"
              element={
                <PrivateRoute>
                  <Agendar />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
