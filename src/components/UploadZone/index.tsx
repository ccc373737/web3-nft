import React, { useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const UploadZone = ( onFileUploaded : any)  => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback((acceptedFiles: MediaSource[]) => {
    const file = acceptedFiles[0];
     
    const fileUrl = URL.createObjectURL(file);
    
    setSelectedFileUrl(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded]);

  const { getRootProps, getInputProps } = useDropzone({
    //onDrop, 
    accept: {
        "image/*": [".jpeg", ".png"],
      }
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} accept='image/*' />

      { selectedFileUrl 
        ? <img src={selectedFileUrl} alt="Point thumbnail"/>
        : (
          <p>
            <CloudUploadIcon />
            NFT image
          </p>
        )
      }
    </div>
  );
}

export default UploadZone;