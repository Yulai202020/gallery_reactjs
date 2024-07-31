import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import FileUpload from "./sites/FileUpload";
import Add from "./sites/Add";
import Login from "./sites/Login";
import Index from "./sites/Index";
import Logout from "./sites/Logout";
import Register from "./sites/Register";
import PageNotFound from "./sites/PageNotFound";

import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

function App() {
    return (
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<PrivateRoute><Index/></PrivateRoute>}/>
            <Route path="/upload" element={<PrivateRoute><FileUpload/></PrivateRoute>}/>
            <Route path="/add" element={<PrivateRoute><Add/></PrivateRoute>}/>
            <Route path="/logout" element={<PrivateRoute><Logout/></PrivateRoute>}/>

            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>

            <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </BrowserRouter>
    );
}

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps): JSX.Element => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;
