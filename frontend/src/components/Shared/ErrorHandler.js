import React from 'react';
import { useRouteError } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../Layout/Header';

const ErrorHandler = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  let errorMessage = 'Произошла непредвиденная ошибка';
  let errorStatus = null;

  if (error.status) {
    errorStatus = error.status;
    switch (error.status) {
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
        errorMessage = error.data?.message || error.message || errorMessage;
    }
  }

  const handleGoBack = () => navigate(-1);
  const handleGoHome = () => navigate(isAuthenticated ? '/storage' : '/');

  return (
    <div className="error-page">
      <Header />
      <main>
        <div className="error-container">
          {errorStatus && <h1 className="error-status">{errorStatus}</h1>}
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