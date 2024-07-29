import React from "react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    fetch("/api/images")
    .then(response => response.json())
    .then(data => {
      setBackendData(data);
    });
  }, []);

  return (
    <>
    <div className="gallery">
    {BackendData.map((item) => (
        <div className="gallery-item">
          <img src={item.link} alt={item.alt} width={item.width} height={item.height} className="figure-img img-fluid"/>
          <figcaption className="figure-caption">{item.alt}</figcaption>
        </div>
    ))}
    </div>
    <a href="/add">Add</a>
    <br/>
    <a href="/logout">Logout</a>
    </>
  );
}

export default Index;
