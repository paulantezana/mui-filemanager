import { useState } from "react";
import ToggleViewMode from "./ToggleViewMode";
import UploadButton from "./UploadButton";
import UploadConfirm from "./UploadConfirm";
import { Button } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';

import { useFileManagerContext } from "../../context/FileManagerContext";
import { useItemSelectedContext } from "../../context/ItemSelectionContext";

const Toolbar = () => {
  const { manager, config } = useFileManagerContext();
  const { rowSelectionModel, setRowSelectionModel } = useItemSelectedContext();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const { refresh, pathHistory, currentItems } = manager;
  const { operations, acceptPairs, customComponents } = config;

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
    for (let i = 0; i < rowSelectionModel.length; i++) {
      const file = currentItems.find(r => r.id === rowSelectionModel[i]);
      await download(file);
    }
    refresh();
  }

  const handleMultipleDelete = async () => {
    for (let i = 0; i < rowSelectionModel.length; i++) {
      const file = currentItems.find(r => r.id === rowSelectionModel[i]);
      await handleDelete(file);
    }
    refresh();
  }

  const handleClearSelected = () => {
    setRowSelectionModel([]);
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
      {
        confirmOpen && <UploadConfirm
          onClose={handleConfirmClose}
          files={files}
          onUpload={handleUpload}
          customComponents={customComponents}
        />}
    </div>
    <div className="flex items-center">
      {(rowSelectionModel.length > 0) && <Button size="small" onClick={handleClearSelected} endIcon={<CloseIcon />} >{rowSelectionModel.length} selecionados</Button>}
      <ToggleViewMode />
    </div>
  </div>);
}

export default Toolbar;