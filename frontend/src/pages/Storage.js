import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from '../services/api';
import FileUpload from '../components/Storage/FileUpload';
import FileList from '../components/Storage/FileList';

const Storage = () => {
  const [files, setFiles] = useState([]);
  
  const fetchFiles = async () => {
    try {
      const response = await axios.get('/api/storage/get-files/');
      setFiles(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>Ваше хранилище</h2>
      <FileUpload onUploadSuccess={fetchFiles} />
      <FileList files={files} onFileChange={fetchFiles} />
    </div>
  );
};

export default Storage;