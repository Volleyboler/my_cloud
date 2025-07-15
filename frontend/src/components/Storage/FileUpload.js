import React, { useState } from 'react';
import axios from '../../services/api';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('comment', comment);

    try {
      const response = await axios.post('/api/storage/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} required />
      <textarea placeholder="Комментарий" value={comment} onChange={handleCommentChange} />
      <button type="submit">Загрузить файл</button>
    </form>
  );
};

export default FileUpload;