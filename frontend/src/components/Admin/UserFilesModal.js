import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Table, Button, message } from 'antd';
import api from '../../services/api';

const UserFilesModal = ({ userId, visible, onClose }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserFiles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/storage/admin/files/${userId}/`);
      setFiles(response.data.files);
    } catch (error) {
      message.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (visible) {
      fetchUserFiles();
    }
  }, [visible, fetchUserFiles]);

  const handleShare = async (fileId) => {
    try {
      const response = await api.post(`/api/storage/admin/share/${fileId}/`);
      navigator.clipboard.writeText(response.data.share_link);
      message.success('Share link copied to clipboard!');
    } catch (error) {
      message.error('Failed to generate share link');
    }
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'original_name',
      key: 'name',
    },
    {
      title: 'Size',
      dataIndex: 'file_size',
      key: 'size',
      render: size => `${(size / 1024).toFixed(2)} KB`,
    },
    {
      title: 'Upload Date',
      dataIndex: 'upload_date',
      key: 'upload_date',
      render: date => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => handleShare(record.id)}
        >
          Get Share Link
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={`Files for User ${userId}`}
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      destroyOnClose
    >
      <Table
        columns={columns}
        dataSource={files}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Modal>
  );
};

export default UserFilesModal;