// app/upload/Form.tsx
'use client';

import { useState } from 'react';

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('File upload failed');
            }

            const result = await response.json();
            alert(`File uploaded successfully: ${result.publicUrl}`);
            console.log('File uploaded:', result);
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file');
        }
    }

    return (
        <form onSubmit={handleSubmit}
        className='space-y-4'>
            <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                        setFile(files[0]);
                    }
                }}
            />
            <button type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded">Upload</button>
        </form>
    );
}