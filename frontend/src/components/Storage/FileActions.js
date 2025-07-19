import React, { useState } from 'react';
import axios from '../../services/api';

const FileItem = ({ file, onFileChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async (action, data = null) => {
    setIsLoading(true);
    try {
      switch (action) {
        case 'download':
          const downloadResponse = await axios.get(`/api/storage/download/${file.id}/`, {
            responseType: 'blob'
          });
          const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.original_name);
          document.body.appendChild(link);
          link.click();
          link.remove();
          break;

        case 'delete':
          await axios.delete(`/api/storage/delete/${file.id}/`);
          onFileChange();
          break;

        case 'rename':
          if (!data) return;
          await axios.patch(`/api/storage/rename/${file.id}/`, { newName: data });
          onFileChange();
          break;

        case 'comment':
          if (!data) return;
          await axios.patch(`/api/storage/comment/${file.id}/`, { newComment: data });
          onFileChange();
          break;

        case 'share':
          const shareResponse = await axios.post(`/api/storage/share/${file.id}/`);
          await navigator.clipboard.writeText(shareResponse.data.share_link);
          alert('Ссылка скопирована в буфер обмена');
          break;

        default:
          break;
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.error || 'Произошла ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <li className="file-item">
      <div className="file-info">
        <h3>{file.original_name}</h3>
        <p>Размер: {(file.file_size / 1024).toFixed(2)} KB</p>
        <p>Загружен: {new Date(file.upload_date).toLocaleString()}</p>
        {file.comment && <p>Комментарий: {file.comment}</p>}
      </div>
      <div className="file-actions">
        <button 
          onClick={() => handleAction('download')} 
          disabled={isLoading}
        >
          {isLoading ? 'Загрузка...' : 'Скачать'}
        </button>
        <button 
          onClick={() => {
            const newName = prompt('Новое имя файла:', file.original_name);
            if (newName) handleAction('rename', newName);
          }}
          disabled={isLoading}
        >
          Переименовать
        </button>
        <button 
          onClick={() => {
            const newComment = prompt('Новый комментарий:', file.comment || '');
            if (newComment !== null) handleAction('comment', newComment);
          }}
          disabled={isLoading}
        >
          Изменить комментарий
        </button>
        <button 
          onClick={() => handleAction('share')}
          disabled={isLoading}
        >
          Поделиться
        </button>
        <button 
          className="delete" 
          onClick={() => {
            if (window.confirm('Вы уверены, что хотите удалить этот файл?')) {
              handleAction('delete');
            }
          }}
          disabled={isLoading}
        >
          Удалить
        </button>
      </div>
    </li>
  );
};

export default FileItem;