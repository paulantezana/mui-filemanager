import { useState } from "react";
import ToggleViewMode from "./ToggleViewMode";
import UploadButton from "./UploadButton";
import UploadConfirm from "./UploadConfirm";
import { Button, IconButton } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

const Toolbar = ({ operations, setViewMode, viewMode, rowSelectionModel }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const onFileChange = (files) => {
    setFiles(files);
    setConfirmOpen(true);
  };

  const handleConfirmClose = (accepted) => {
    if (accepted) {

    }

    setFiles([]);
    setConfirmOpen(false);
  };

  const handleUpload = async (file) => {
    return await operations.create({ type: 'file', data: file, path: '' });
  }

  return (<div className="flex justify-between items-center">
    <div className="flex gap-2">
      <UploadButton
        onFileChange={onFileChange}
        multiple={true}
      />
      <Button size="small" startIcon={<DeleteIcon />}>
        Eliminar
      </Button>
      <Button size="small" startIcon={<DownloadIcon />}>
        Descargar
      </Button>
      {confirmOpen && <UploadConfirm onClose={handleConfirmClose} files={files} onUpload={handleUpload} />}
    </div>
    <div className="flex items-center">
      {rowSelectionModel.length > 0 ? (rowSelectionModel.length + ' selecionado') : ''}
      <ToggleViewMode setViewMode={setViewMode} viewMode={viewMode} />
    </div>
  </div>);
}

export default Toolbar;