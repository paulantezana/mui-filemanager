import { useState } from "react";
import ToggleViewMode from "./ToggleViewMode";
import UploadButton from "./UploadButton";
import UploadConfirm from "./UploadConfirm";
import { Button } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { useFileManagerContext } from "../../context/FileManagerContext";

const Toolbar = () => {
  const { operations, manager, acceptPairs, customComponents, rowSelectionModel } = useFileManagerContext();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const { refresh, pathHistory } = manager;

  const onFileChange = (files) => {
    setFiles(files);
    setConfirmOpen(true);
  };

  const handleConfirmClose = (accepted) => {
    refresh();
    setFiles([]);
    setConfirmOpen(false);
  };

  const handleUpload = async (data, signal) => {
    const path = '/' + pathHistory.filter(item => item.name.toLocaleUpperCase() !== 'INICIO').map(item => item.name).join('/');
    return await operations.create({ type: 'file', data, path }, signal);
  }

  const handleMultipleDownload = async () => {
    // debugger;
    // for (let i = 0; i < rowSelectionModel.length; i++) {
    //   const file = currentItems.find(r => r.id === rowSelectionModel[i]);
    //   await download(file);
    // }
  }

  const handleMultipleDelete = async () => {
    // debugger;
    // for (let i = 0; i < rowSelectionModel.length; i++) {
    //   const file = currentItems.find(r => r.id === rowSelectionModel[i]);
    //   await handleDelete(file);
    // }
  }

  return (<div className="flex justify-between items-center">
    <div className="flex gap-2">
      <UploadButton
        onFileChange={onFileChange}
        multiple={true}
        acceptPairs={acceptPairs}
      />
      <Button size="small" startIcon={<DeleteIcon />} onClick={handleMultipleDelete} >
        Eliminar
      </Button>
      <Button size="small" startIcon={<DownloadIcon />} onClick={handleMultipleDownload}>
        Descargar
      </Button>
      {confirmOpen && <UploadConfirm onClose={handleConfirmClose} files={files} onUpload={handleUpload} customComponents={customComponents} />}
    </div>
    <div className="flex items-center">
      {rowSelectionModel.length > 0 ? (rowSelectionModel.length + ' selecionado') : ''}
      <ToggleViewMode />
    </div>
  </div>);
}

export default Toolbar;