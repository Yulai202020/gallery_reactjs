import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import '../style.css';

type ImageData = {
  link: string;
  alt: string;
  width?: number;
  height?: number;
};

function Index() {
  const [BackendData, setBackendData] = useState<ImageData[]>([]);
  const navigate = useNavigate();

  const sendData = async (): Promise<any> => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.status === 403) {
        console.log(response.status);
        localStorage.removeItem('token');
        navigate('/login');
        return; // Stop further execution if response is not ok
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
          <div key={index} className="gallery-item">
            <img
              src={item.link}
              alt={item.alt}
              width={item.width}
              height={item.height}
              className="figure-img img-fluid"
            />
            <figcaption className="figure-caption">{item.alt}</figcaption>
          </div>
        ))}
      </div>
      <a href="/add">Add</a>
      <br />
      <a href="/logout">Logout</a>
    </>
  );
}

export default Index;
