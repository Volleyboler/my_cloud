import React from 'react';
import UserList from '../components/Admin/UserList';
import Header from '../components/Layout/Header';

const AdminPanel = () => {
  return (
    <div>
      <Header />
      <main>
        <UserList />
      </main>
    </div>
  );
};

export default AdminPanel;