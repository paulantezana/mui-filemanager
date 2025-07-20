import { useRef } from "react";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Button } from "@mui/material";

const UploadButton = ({
  onFileChange,
  acceptPairs = [],
  multiple = true,
}) => {
  const fileRef = useRef();

  const extensions = acceptPairs.map(([ext]) => ext.toLowerCase());
  const mimeTypes = acceptPairs.map(([_, mime]) => mime.toLowerCase());

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    fileRef.current.value = null;

    if (
      acceptPairs.length &&
      !files.every(f =>
        mimeTypes.includes(f.type.toLowerCase()) ||
        extensions.includes('.' + f.name.split('.').pop().toLowerCase())
      )
    ) {
      alert(`Archivos inválidos. Se permiten: ${extensions.join(', ')}`);
      return;
    }

    onFileChange(files);
  };

  return (
    <Button component="label" variant="contained" size="small" startIcon={<FileUploadIcon />}>
      Subir Archivo{multiple ? 's' : ''}
      <input
        type="file"
        hidden
        ref={fileRef}
        onChange={handleChange}
        multiple={multiple}
        accept={extensions.join(',') || undefined}
      />
    </Button>
  );
}

export default UploadButton;