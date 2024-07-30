import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

function Add() {
    const [link, setLink] = useState<string>();
    const [alt, setAlt] = useState<string>();
    const [height, setHeight] = useState<string>();
    const [width, setWidth] = useState<string>();

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const checkToken = async () => {
      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.status == 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }
    };

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();

      const response = await fetch('/api/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, link, alt, width, height }),
      });

      if (response.status == 403) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      navigate('/');
    };


    useEffect(() => {
      checkToken();
    });

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="link">Link</label>
                <input type="text" className="form-control" name="link" placeholder="Enter link" onChange={(e) => setLink(e.target.value)} />
            </div>

            <div className="mb-3">
                <label htmlFor="alt">Name</label>
                <input type="text" className="form-control" name="alt" placeholder="Enter alt" onChange={(e) => setAlt(e.target.value)} />
            </div>

            <div className="mb-3">
                <label htmlFor="width">Width</label>
                <input type="text" className="form-control" name="width" placeholder="Enter width" onChange={(e) => setWidth(e.target.value)} />
            </div>

            <div className="mb-3">
                <label htmlFor="height">Height</label>
                <input type="text" className="form-control" name="height" placeholder="Enter height" onChange={(e) => setHeight(e.target.value)} />
            </div>
            
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>
        </>
    );
}

export default Add;
