import { useState } from "react";
import ToggleViewMode from "./ToggleViewMode";
import UploadButton from "./UploadButton";
import UploadConfirm from "./UploadConfirm";
import { Button } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

const Toolbar = ({
  operations,
  refresh,
  setViewMode,
  viewMode,
  rowSelectionModel,
  pathHistory,
  onDelete,
  onDownload
}) => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const onFileChange = (files) => {
    setFiles(files);
    setConfirmOpen(true);
  };

  const handleConfirmClose = (accepted) => {
    refresh();
    setFiles([]);
    setConfirmOpen(false);
  };

  const handleUpload = async (file) => {
    const path = '/' + pathHistory.filter(item => item.name.toLocaleUpperCase() !== 'INICIO').map(item => item.name).join('/');
    return await operations.create({ type: 'file', file, path });
  }

  return (<div className="flex justify-between items-center">
    <div className="flex gap-2">
      <UploadButton
        onFileChange={onFileChange}
        multiple={true}
      />
      <Button size="small" startIcon={<DeleteIcon />} onClick={onDelete} >
        Eliminar
      </Button>
      <Button size="small" startIcon={<DownloadIcon />} onClick={onDownload}>
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