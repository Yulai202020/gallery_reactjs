import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../style.css';

import React from 'react';

function Index() {
  const [BackendData, setBackendData] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const sendDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonId = Number(event.currentTarget.id)

    try {
      const response = await fetch('/api/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, "filename": BackendData[buttonId] }),
      });

      // reload
      window.location.reload();
    } catch (error) {
      console.error('Network Error:', error);
    }
  };

  const sendData = async (): Promise<any> => {
    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Fetch error:', error);
      return error;
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
          <div className="gallery-item">
            <img
              src={item}
              className="figure-img img-fluid"
            />
            <figcaption className="figure-caption">test name</figcaption>
            <button onClick={sendDelete} id={index.toString()}>delete</button>
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
