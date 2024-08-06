// src/sites/Logout.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove("token");
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;
