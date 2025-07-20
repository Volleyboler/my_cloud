import React from 'react';
import UserList from '../components/Admin/UserList';
import { useDispatch } from 'react-redux';
import { logout } from '../store/AuthSlice';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Административная панель</h2>
        <button onClick={handleLogout} className="logout-btn">Выход</button>
      </div>
      <main>
        <UserList />
      </main>
    </div>
  );
};

export default AdminPanel;