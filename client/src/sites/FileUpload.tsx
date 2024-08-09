import React, { useState, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const FileUpload: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [subject, setSubject] = useState<string>("");
    const [alt, setAlt] = useState<string>("");
    const [label, setLabel] = useState<string | null>(null);

    const navigate = useNavigate();
    const server_path = localStorage.getItem('server_path');

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!fileInputRef.current || !fileInputRef.current.files || fileInputRef.current.files.length === 0) {
            console.error('No file selected');
            setLabel('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('file', fileInputRef.current.files[0]);
        formData.append('subject', subject);
        formData.append('alt', alt);

        try {
            const response = await fetch(server_path + "/api/upload", {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (response.status === 403) {
                Cookies.remove("token");
                navigate('/login');
                return Promise.reject('Token expired');
            } else if (response.status === 404) {
                setLabel("No file uploaded.");
            } else if (response.status === 402) {
                setLabel("File already exists.");
            } else if (response.ok) {
                navigate("/");
            } else {
                const data = await response.json();
                setLabel(data.message || 'Upload failed.');
            }
        } catch (error) {
            console.error('Error:', error);
            setLabel('An error occurred during upload.');
        }
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="mb-3">
                    <label htmlFor="formFile" className="form-label">Input image file</label>
                    <input className="form-control" type="file" id="formFile" ref={fileInputRef} />
                </div>

                <div className="mb-3">
                    <label htmlFor="alt">Alt</label>
                    <input
                        type="text"
                        className="form-control"
                        id="alt"
                        placeholder="text"
                        value={alt}
                        onChange={(e) => setAlt(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="subject">Subject</label>
                    <input
                        type="text"
                        className="form-control"
                        id="subject"
                        placeholder="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                    />
                </div>

                {label && (
                    <div className="mb-3">
                        <label style={{ color: 'red' }}>{label}</label>
                    </div>
                )}

                <button type="submit" className="btn btn-primary">Upload</button>
            </form>
        </div>
    );
};

export default FileUpload;
