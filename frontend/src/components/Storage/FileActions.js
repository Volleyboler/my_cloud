import React from 'react';
import axios from 'axios';

const FileItem = ({ file }) => {
  const downloadFile = async () => {
    try {
      const response = await axios.get(`/api/storage/download/${file.id}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.original_name);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteFile = async () => {
    try {
      await axios.delete(`/api/storage/delete/${file.id}`);
      alert('Файл удален');
    } catch (error) {
      console.error(error);
    }
  };

  const renameFile = async (newName) => {
    try {
      await axios.patch(`/api/storage/rename/${file.id}`, { newName });
      alert('Файл переименован');
    } catch (error) {
      console.error(error);
    }
  };

  const changeComment = async (newComment) => {
    try {
      await axios.patch(`/api/storage/comment/${file.id}`, { newComment });
      alert('Комментарий изменен');
    } catch (error) {
      console.error(error);
    }
  };

  const shareFile = async () => {
    try {
      const response = await axios.post(`/api/storage/share/${file.id}`);
      alert(`Ссылка для скачивания: ${response.data.share_link}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li>
      <p>Имя файла: {file.original_name}</p>
      <p>Комментарий: {file.comment}</p>
      <p>Размер: {file.file_size} байт</p>
      <p>Дата загрузки: {new Date(file.upload_date).toLocaleString()}</p>
      <p>Дата последнего скачивания: {file.last_download_date ? new Date(file.last_download_date).toLocaleString() : 'Не скачивался'}</p>
      <button onClick={downloadFile}>Скачать</button>
      <button onClick={() => renameFile(prompt('Введите новое имя файла'))}>Переименовать</button>
      <button onClick={() => changeComment(prompt('Введите новый комментарий'))}>Изменить комментарий</button>
      <button onClick={deleteFile}>Удалить</button>
      <button onClick={shareFile}>Поделиться</button>
    </li>
  );
};

export default FileItem;