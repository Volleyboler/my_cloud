import React, { useEffect, useState } from 'react';
import axios from '../../services/api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/accounts/users/');
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.is_admin) {
      fetchUsers();
    }
  }, [user]);

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/accounts/users/${userId}/`);
      setUsers(users.filter(u => u.id !== userId));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleAdminStatus = async (userId, isAdmin) => {
    try {
      await axios.patch(`/api/accounts/users/${userId}/status/`, { is_admin: !isAdmin });
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_admin: !isAdmin } : u
      ));
    } catch (error) {
      console.error(error);
    }
  };

  const goToUserStorage = (userId) => {
    navigate(`/storage?user=${userId}`);
  };

  return (
    <div>
      <h2>Список пользователей</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Логин</th>
            <th>Полное имя</th>
            <th>Email</th>
            <th>Админ</th>
            <th>Действия</th>
            <th>Хранилище</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>
                <input 
                  type="checkbox" 
                  checked={user.is_admin} 
                  onChange={() => toggleAdminStatus(user.id, user.is_admin)}
                />
              </td>
              <td>
                <button onClick={() => handleDelete(user.id)}>Удалить</button>
              </td>
              <td>
                <button onClick={() => goToUserStorage(user.id)}>Открыть</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;