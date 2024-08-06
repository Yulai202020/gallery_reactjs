import React, { useState, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const FileUpload: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    var [subject, setSubject] = useState<string>("");
    var [alt, setAlt] = useState<string>("");

    const navigate = useNavigate();
    const server_path = localStorage.getItem('server_path');

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!fileInputRef.current || !fileInputRef.current.files || fileInputRef.current.files.length === 0) {
            console.error('No file selected');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInputRef.current.files[0]); // Use append method to add the file itself
        formData.append('subject', subject);
        formData.append('alt', alt);

        const response = await fetch(server_path + '/api/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (response.status === 403) {
            Cookies.remove("token");
            navigate('/login');
            return Promise.reject('Token expired');
        }

        const responseServer = await response.json();
        console.log(responseServer); // Handle the response from the server as needed
        navigate('/');
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Input image file</label>
                    <input className="form-control" type="file" id="formFile" />
                </div>

                <div className="mb-3">
                    <label htmlFor="alt">Alt</label>
                    <input type="text" className="form-control" id="alt" placeholder="text"
                    onChange={(e) => setAlt(e.target.value)} />
                </div>

                <div className="mb-3">
                    <label htmlFor="subject">Subject</label>
                    <input type="text" className="form-control" id="subject" placeholder="text"
                    onChange={(e) => setSubject(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-primary">Upload</button>
            </form>
        </div>
    );
};

export default FileUpload;
