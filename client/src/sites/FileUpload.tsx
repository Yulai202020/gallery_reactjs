// FileUpload.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState('Choose File');
    const [uploadedFile, setUploadedFile] = useState<{ fileName: string; filePath: string } | null>(null);

    const onChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileName(selectedFile.name);
        }
    };

    const onSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post<{ fileName: string; filePath: string }>(
                'http://localhost:5000/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const { fileName, filePath } = res.data;
            setUploadedFile({ fileName, filePath });
        } catch (err) {
            console.error(err);
        }
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
        {uploadedFile && (
            <div>
                <h3>{uploadedFile.fileName}</h3>
                <img src={`http://localhost:5000${uploadedFile.filePath}`} alt={uploadedFile.fileName} />
            </div>
        )}
    </div>
    );
};

export default FileUpload;
