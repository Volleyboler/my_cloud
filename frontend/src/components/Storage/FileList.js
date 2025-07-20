import React from 'react';
import FileItem from './FileActions';

const FileList = ({ files, onFileChange, isAdminView = false }) => {
  return (
    <ul className="file-list">
      {files.map((file) => (
        <FileItem 
          key={file.id} 
          file={file} 
          onFileChange={onFileChange}
          isAdminView={isAdminView}
        />
      ))}
    </ul>
  );
};

export default FileList;