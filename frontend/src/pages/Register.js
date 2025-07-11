import { useState } from 'react';
import axios from '../services/api';
import Header from '../components/Layout/Header';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', { username, email, full_name: fullName, password });
      setError('');
      setSuccess('Регистрация успешна! Вы можете войти.');
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка регистрации');
      setSuccess('');
    }
  };

  return (
    <div>
      <Header />
      <main>
        <h2>Регистрация</h2>
        {error && <div className="alert error" aria-live="assertive">{error}</div>}
        {success && <div className="alert success" aria-live="assertive">{success}</div>}
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Логин:</label>
          <input
            type="text"
            id="username"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            aria-required="true"
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-required="true"
          />
          <label htmlFor="fullName">Полное имя:</label>
          <input
            type="text"
            id="fullName"
            placeholder="Полное имя"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            aria-required="true"
          />
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
          />
          <button type="submit">Зарегистрироваться</button>
        </form>
      </main>
    </div>
  );
};

export default Register;