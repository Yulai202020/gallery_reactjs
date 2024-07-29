import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function Add() {
    const [link, setLink] = useState<string>();
    const [alt, setAlt] = useState<string>();
    const [height, setHeight] = useState<string>();
    const [width, setWidth] = useState<string>();
    const [response, setResponse] = useState<string>('');  
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
          const res = await fetch('/api/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ link, alt, width, height }),
          });

          console.log('Response status:', res.status); // Debugging log
          if (!res.ok) {
            throw new Error(`Server responded with status ${res.status}`);
          }

          const data = await res.json();
          console.log('Response data:', data); // Debugging log
          setResponse(data.response);

          // Redirect after successful submission
          navigate('/');
        } catch (error) {
          console.error('Error sending message:', error);
          setResponse('Error sending message');
        }
    };

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
