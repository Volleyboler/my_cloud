import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import Header from '../components/Layout/Header';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/users');
        setUsers(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <Header />
      <main>
        <h2>Административная панель</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Логин</th>
              <th>Полное имя</th>
              <th>Email</th>
              <th>Администратор</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.is_admin ? 'Да' : 'Нет'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AdminPanel;