import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const Item = ({ item, onDelete }) => {
  const getStatusLabel = () => {
    switch (item.status) {
      case 'uploading':
        return 'Subiendo...';
      case 'uploaded':
        return 'Completado';
      case 'error':
        return 'Error';
      default:
        return '';
    }
  };

  return (
    <div className="flex justify-between items-center" style={{ marginBottom: '.25rem', border: '1px solid var(--border-color)', padding: '0.25rem', borderRadius: '6px' }}>
      <div>
        <div><strong>{item.file.name}</strong></div>
        <div><small>{item.file.size}</small>{item.status !== 'temporary' && <span>{getStatusLabel()}</span>}</div>
      </div>
      <IconButton onClick={onDelete} size="small">
        <CloseIcon fontSize="12" />
      </IconButton>
    </div>
  );
}

const UploadConfirm = ({ onClose, onUpload, files = [] }) => {
  const [currentFiles, setCurrentFiles] = useState(files.map(file => ({ file: file, status: 'temporary', message: '' })));
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClose(false);
  };

  const handleConfirm = async () => {
    setLoading(true);

    for (let i = 0; i < currentFiles.length; i++) {
      const updated = [...currentFiles];
      updated[i].status = 'uploading';
      setCurrentFiles([...updated]);

      try {
        await onUpload(updated[i].file);
        updated[i].status = 'uploaded';
      } catch (err) {
        updated[i].status = 'error';
        updated[i].message = err.message || 'Error al subir';
      }

      setCurrentFiles([...updated]);
    }

    setLoading(false);
    onClose(true);
  };

  const handleDelete = (item) => {
    if (item.status === 'uploaded') return;
    setCurrentFiles(currentFiles.filter(i => i.file.name !== item.file.name));
  };

  return (<Dialog
    open
    onClose={onClose}
    sx={{
      '& .MuiDialogContent-root': {
        padding: '.5rem',
      },
    }}
  >
    <DialogTitle sx={{ padding: '.5rem' }}>
      <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>Confirmar subida de archivos</div>
      <div style={{ fontSize: '0.875rem' }}>Se subirán {currentFiles.length} archivo(s)</div>
    </DialogTitle>
    <DialogContent>
      {currentFiles.map(item => (
        <Item key={item.file.name} item={item} onDelete={() => handleDelete(item)} />
      ))}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleClose} size="small" disabled={loading}>Cancelar</Button>
      <Button onClick={handleConfirm} loading={loading} disabled={loading} size="small" variant="contained" autoFocus>
        {loading ? 'Subiendo...' : 'Confirmar subida'}
      </Button>
    </DialogActions>
  </Dialog>);
}

export default UploadConfirm;