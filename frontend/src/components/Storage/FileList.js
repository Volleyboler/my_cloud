import React from 'react';
import FileItem from './FileActions';

const FileList = ({ files }) => {
  return (
    <ul>
      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </ul>
  );
};

export default FileList;