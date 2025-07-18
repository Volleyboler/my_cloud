import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { loginSuccess } from '../store/AuthSlice';
import Header from '../components/Layout/Header';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/accounts/login/', formData);
      
      dispatch(loginSuccess({
        user: response.data.user,
        isAuthenticated: true
      }));
      
      navigate(response.data.user.is_admin ? '/admin' : '/storage');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка входа');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header />
      <main>
        <h2>Вход</h2>
        {error && <div className="alert error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Логин:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Пароль:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Login;