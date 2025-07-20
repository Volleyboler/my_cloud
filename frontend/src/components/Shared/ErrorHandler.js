import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../Layout/Header';

const ErrorHandler = ({ error }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const errorStatus = error?.status || 500;
  let errorMessage = error?.data?.message || 'Произошла непредвиденная ошибка';

  switch (errorStatus) {
    case 403:
      errorMessage = 'Доступ запрещен. У вас нет прав для просмотра этой страницы.';
      break;
    case 404:
      errorMessage = 'Страница не найдена. Проверьте URL и попробуйте снова.';
      break;
    case 500:
      errorMessage = 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.';
      break;
    default:
      break;
  }

  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate(isAuthenticated ? '/storage' : '/');

  return (
    <div className="error-page">
      <Header />
      <main>
        <div className="error-container">
          <h1 className="error-status">{errorStatus}</h1>
          <h2 className="error-message">{errorMessage}</h2>
          <div className="error-actions">
            <button onClick={handleGoBack}>Назад</button>
            <button onClick={handleGoHome}>На главную</button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ErrorHandler;