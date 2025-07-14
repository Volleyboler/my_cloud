import React, { useState } from 'react';
import axios from '../services/api';
import Header from '../components/Layout/Header';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); // Изменено на объект
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requestData = { username, email, full_name: fullName, password };
    console.log('Sending ', requestData); // Для отладки

    try {
      const response = await axios.post('/api/register', requestData);
      setErrors({}); // Очищаем ошибки
      setSuccess('Регистрация успешна! Вы можете войти.');
    } catch (err) {
      setSuccess('');
      if (err.response && err.response.data) {
        setErrors(err.response.data); // Устанавливаем ошибки из ответа
      } else {
        setErrors({ non_field_errors: ['Ошибка регистрации'] }); // Общая ошибка
      }
      console.error('Registration failed:', err.response?.data); // Для отладки
    }
  };

  return (
    <div>
      <Header />
      <main>
        <h2>Регистрация</h2>
        {success && <div className="alert success">{success}</div>}
        {Object.keys(errors).length > 0 && (
          <div className="alert error">
            <ul>
              {Object.entries(errors).map(([key, value]) => (
                <li key={key}>
                  {Array.isArray(value) ? value.join(', ') : value}
                </li>
              ))}
            </ul>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <div className="field-error">{Array.isArray(errors.username) ? errors.username.join(', ') : errors.username}</div>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <div className="field-error">{Array.isArray(errors.email) ? errors.email.join(', ') : errors.email}</div>}
          <input
            type="text"
            placeholder="Полное имя"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          {errors.full_name && <div className="field-error">{Array.isArray(errors.full_name) ? errors.full_name.join(', ') : errors.full_name}</div>}
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <div className="field-error">{Array.isArray(errors.password) ? errors.password.join(', ') : errors.password}</div>}
          <button type="submit">Зарегистрироваться</button>
        </form>
      </main>
    </div>
  );
};

export default Register;