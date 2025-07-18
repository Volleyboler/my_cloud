import React from 'react';
import axios from '../../services/api';

const FileItem = ({ file, onFileChange }) => {
  const handleAction = async (action, data = null) => {
    try {
      let response;
      switch (action) {
        case 'download':
          response = await axios.get(`/api/storage/download/${file.id}`, { 
            responseType: 'blob' 
          });
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', file.original_name);
          document.body.appendChild(link);
          link.click();
          break;
        
        case 'delete':
          await axios.delete(`/api/storage/delete/${file.id}`);
          onFileChange();
          break;
          
        case 'rename':
          await axios.patch(`/api/storage/rename/${file.id}`, { 
            newName: data 
          });
          onFileChange();
          break;
          
        case 'comment':
          await axios.patch(`/api/storage/comment/${file.id}`, { 
            newComment: data 
          });
          onFileChange();
          break;
          
        case 'share':
          response = await axios.post(`/api/storage/share/${file.id}`);
          navigator.clipboard.writeText(response.data.share_link);
          alert('Ссылка скопирована в буфер обмена');
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.error || 'Произошла ошибка');
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
        <button onClick={() => handleAction('download')}>Скачать</button>
        <button onClick={() => handleAction('rename', prompt('Новое имя файла:', file.original_name))}>
          Переименовать
        </button>
        <button onClick={() => handleAction('comment', prompt('Новый комментарий:', file.comment || ''))}>
          Изменить комментарий
        </button>
        <button onClick={() => handleAction('share')}>Поделиться</button>
        <button className="delete" onClick={() => handleAction('delete')}>Удалить</button>
      </div>
    </li>
  );
};

export default FileItem;