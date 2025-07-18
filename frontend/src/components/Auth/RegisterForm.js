import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/api';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const { username, email, password } = formData;


    if (!/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(username)) {
      newErrors.username = 'Логин должен начинаться с буквы, содержать только латинские буквы и цифры (4-20 символов)';
    }


    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Введите корректный email';
    }


    if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну цифру';
    } else if (!/[!@#$%^&*()\-_=+[\]{};:'",.<>/?]/.test(password)) {
      newErrors.password = 'Пароль должен содержать хотя бы один специальный символ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await axios.post('/api/accounts/register/', formData);
      navigate('/login', { state: { registrationSuccess: true } });
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        setErrors({ nonField: 'Ошибка соединения с сервером' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <div className="form-group">
        <label>Логин</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.username && <span className="error-text">{errors.username}</span>}
      </div>

      <div className="form-group">
        <label>Полное имя</label>
        <input
          type="text"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.full_name && <span className="error-text">{errors.full_name}</span>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Пароль</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      {errors.nonField && <div className="error-message">{errors.nonField}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
      </button>
    </form>
  );
};

export default RegisterForm;