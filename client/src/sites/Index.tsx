import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../style.css';
import Cookies from 'js-cookie';

import React from 'react';

function Index() {
  const [BackendData, setBackendData] = useState<any[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const server_path = localStorage.getItem('server_path');

  useEffect(() => {
    if (token) {
      Cookies.set('token', token, { expires: 1 / 24 });
    }
  }, [token]);


  const sendDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonId = Number(event.currentTarget.id)

    try {
      const response = await fetch(server_path + '/api/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, "id": buttonId }),
      });

      // reload
      window.location.reload();
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  const sendData = async (): Promise<any[]> => {
    try {
      const response = await fetch(server_path + '/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return [];
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await sendData();
      setBackendData(data);
    };

    fetchData();
  }, [navigate]);

  return (
    <>
      <div className="gallery">
        {BackendData.map((item, index) => (
          <div className="gallery-item" key={index}>
            <img
              src={server_path+"/api/image/"+item["id"]}
              alt={item["alt"]}
              className="figure-img img-fluid"
            />
            <figcaption className="figure-caption">{item["subject"]}</figcaption>
            <button onClick={sendDelete} id={item["id"]}>delete</button>
          </div>
        ))}
      </div>
      <a href="/upload">Upload</a>
      <br />
      <a href="/logout">Logout</a>
    </>
  );
}

export default Index;
