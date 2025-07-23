import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import UserFilesModal from './UserFilesModal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (user?.is_admin) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/accounts/users/');
      setUsers(response.data);
    } catch (error) {
      message.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/api/accounts/users/${userId}/`);
      setUsers(users.filter(u => u.id !== userId));
      message.success('User deleted successfully');
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const toggleAdminStatus = async (userId, isAdmin) => {
    try {
      await api.patch(`/api/accounts/users/${userId}/status/`, { 
        is_admin: !isAdmin 
      });
      setUsers(users.map(u => 
        u.id === userId ? { ...u, is_admin: !isAdmin } : u
      ));
      message.success('Admin status updated');
    } catch (error) {
      message.error('Failed to update admin status');
    }
  };

  const goToUserStorage = (userId) => {
    navigate(`/storage?user=${userId}`);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Admin',
      key: 'is_admin',
      render: (_, record) => (
        <input 
          type="checkbox" 
          checked={record.is_admin} 
          onChange={() => toggleAdminStatus(record.id, record.is_admin)}
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            onClick={() => goToUserStorage(record.id)}
          >
            Open Storage
          </Button>
          <Button 
            danger 
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this user?')) {
                handleDelete(record.id);
              }
            }}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-user-list">
      <h2>User Management</h2>
      <Table 
        columns={columns} 
        dataSource={users} 
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <UserFilesModal
        userId={selectedUserId}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
};

export default UserList;