import React from 'react';
import FileItem from './FileActions';

const FileList = ({ files, onFileChange }) => {
  return (
    <ul className="file-list">
      {files.map((file) => (
        <FileItem 
          key={file.id} 
          file={file} 
          onFileChange={onFileChange}
        />
      ))}
    </ul>
  );
};

export default FileList;