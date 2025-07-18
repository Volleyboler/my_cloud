import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { loginSuccess } from '../store/AuthSlice';
import Header from '../components/Layout/Header';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    full_name: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await api.post('/api/accounts/register/', formData);
      
      dispatch(loginSuccess({
        user: response.data.user,
        isAuthenticated: true
      }));
      
      navigate(response.data.user.is_admin ? '/admin' : '/storage');
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ non_field_errors: ['Ошибка соединения с сервером'] });
      }
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Header />
      <main>
        <h2>Регистрация</h2>
        
        {errors.non_field_errors && (
          <div className="alert error">{errors.non_field_errors}</div>
        )}

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
            {errors.username && <div className="field-error">{errors.username}</div>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label>Полное имя:</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            {errors.full_name && <div className="field-error">{errors.full_name}</div>}
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
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Register;