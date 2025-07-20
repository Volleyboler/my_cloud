import React, { useEffect, useState, useCallback } from 'react';
import axios from '../services/api';
import FileUpload from '../components/Storage/FileUpload';
import FileList from '../components/Storage/FileList';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/AuthSlice';

const Storage = () => {
  const [files, setFiles] = useState([]);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('user');
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchFiles = useCallback(async () => {
    try {
      const url = userId && user?.is_admin 
        ? `/api/storage/get-files/?user=${userId}`
        : '/api/storage/get-files/';
      const response = await axios.get(url);
      setFiles(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [userId, user?.is_admin]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const goToAdminPanel = () => {
    navigate('/admin');
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>
          {userId && user?.is_admin 
            ? `Хранилище пользователя ${user}` 
            : 'Ваше хранилище'}
        </h2>
        <button onClick={handleLogout} className="logout-btn">Выход</button>
      </div>
      
      {user?.is_admin && (
        <div className="storage-actions">
          <button onClick={goToAdminPanel}>Вернуться в админку</button>
        </div>
      )}
      
      <FileUpload onUploadSuccess={fetchFiles} />
      <FileList files={files} onFileChange={fetchFiles} />
    </div>
  );
};

export default Storage;