import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('Choose File');
    const navigate = useNavigate();

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!file) return;

        const token = localStorage.getItem('token');
        console.log(file)
        fetch('/api/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/octet-stream',
            },
            body: file,
        })
        .then(response => {
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return Promise.reject('Token expired');
            }

            return response.json().then(result => {
                if (response.ok) {
                    navigate('/');
                } else {
                    console.error('File upload failed:', result.message);
                }
            });
        })
        .catch(error => {
            console.error('Error during file upload:', error);
        });
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div>
                    <input type="file" onChange={onChange} />
                    <label htmlFor="file">{fileName}</label>
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default FileUpload;
