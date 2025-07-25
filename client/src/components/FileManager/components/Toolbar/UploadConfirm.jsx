import { useReducer, useCallback, useRef, useMemo } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import formatFileSize from "../../helpers/formatFileSize";

const filesReducer = (state, action) => {
  const { type, index, ...updateData } = action;
  if (type === 'UPDATE') { return state.map((item, i) => i === index ? { ...item, ...updateData } : item) }
  if (type === 'REMOVE') return state.filter((_, i) => i !== index);
  return state;
};

// Factory de componentes dinámicos
const ComponentRenderer = ({ config, value, onChange }) => {
  const handleChange = (newValue) => {
    onChange(config.key, newValue);
  };

  if (!config.Component) return null;

  const CustomComponent = config.Component;
  return (
    <div style={{ minWidth: '12rem' }}>
      <CustomComponent
        value={value}
        onChange={handleChange}
        label={config.label}
        {...config.props}
      />
    </div>
  );
};

const Item = ({
  item,
  onDelete,
  onRetry,
  onAdditionalDataChange,
  index,
  customComponents = []
}) => {
  const statusIcon = {
    uploading: '\u23F3', // ⏳
    uploaded: '\u2714',  // ✔
    error: '\u26A0',     // ⚠
    pending: '\u25CB', // ○
  }[item.status] || '';

  const canDelete = ['pending', 'error'].includes(item.status);

  const handleCustomComponentChange = (key, value) => {
    onAdditionalDataChange(index, { [key]: value });
  };

  return (
    <div className={`fm-file-item ${item.status}`}>
      <div className="fm-file-info flex justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="fm-file-icon" title={item.message}>{statusIcon}</div>
          <div className="fm-file-name">{item.file.name}</div>
          {customComponents.map((config) => (
            <ComponentRenderer
              key={config.key}
              config={config}
              value={item[config.key]}
              onChange={handleCustomComponentChange}
            />
          ))}
        </div>
        <div className="fm-file-size"><small>{formatFileSize(item.file.size)}</small></div>
        <div className="fm-file-actions flex items-center">
          {item.status === 'error' && (
            <Button size="small" onClick={() => onRetry(index)} className="fm-retry-button">
              Reintentar
            </Button>
          )}
          {canDelete && (
            <IconButton onClick={() => onDelete(index)} title="Quitar" size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
};

const UploadConfirm = ({
  onClose,
  onUpload,
  files = [],
  parallel = true,
  customComponents = []
}) => {
  const [currentFiles, dispatch] = useReducer(
    filesReducer,
    files.map(file => ({
      file,
      status: 'pending',
      message: ''
    }))
  );
  const state = useRef({ uploading: false, currentIndex: -1, abortController: null });

  const uploadFile = useCallback(async (fileData, index) => {
    dispatch({ type: 'UPDATE', index, status: 'uploading' });
    try {
      // Crear el objeto completo con file y datos adicionales
      const { file, status, message, ...additionalData } = fileData;
      const uploadData = {
        file,
        ...additionalData
      };

      await onUpload(uploadData, state.current.abortController?.signal);
      dispatch({ type: 'UPDATE', index, status: 'uploaded' });
      return true;
    } catch (err) {
      if (err.name === 'AbortError') {
        dispatch({ type: 'UPDATE', index, status: 'pending' });
        return null;
      }
      dispatch({ type: 'UPDATE', index, status: 'error', message: err.message || 'Error al subir archivo' });
      return false;
    }
  }, [onUpload]);

  const processUploads = useCallback(async (filesToUpload) => {
    state.current = { uploading: true, currentIndex: -1, abortController: new AbortController() };

    const results = parallel ?
      await Promise.allSettled(filesToUpload.map(({ originalIndex }) =>
        uploadFile(currentFiles[originalIndex], originalIndex)
      )) :
      await (async () => {
        const results = [];
        for (const { originalIndex } of filesToUpload) {
          state.current.currentIndex = originalIndex;
          const result = await uploadFile(currentFiles[originalIndex], originalIndex);
          results.push(result);
          if (result === null) break; // Cancelled
        }
        return results;
      })();

    state.current = { uploading: false, currentIndex: -1, abortController: null };
  }, [currentFiles, parallel, uploadFile]);

  const startUpload = useCallback(() => {
    const filesToUpload = currentFiles
      .map((item, index) => ({ originalIndex: index, status: item.status }))
      .filter(item => item.status === 'pending' || item.status === 'error');
    processUploads(filesToUpload);
  }, [currentFiles, processUploads]);

  const handleRetry = useCallback((index) => processUploads([{ originalIndex: index }]), [processUploads]);
  const handleDelete = useCallback((index) => {
    if (currentFiles.length === 1) {
      onClose(false);
    } else {
      dispatch({ type: 'REMOVE', index });
    }
  }, [currentFiles.length, onClose]);

  const handleAdditionalDataChange = useCallback((index, additionalData) => {
    dispatch({ type: 'UPDATE', index, ...additionalData });
  }, []);

  const handleClose = useCallback(() => {
    state.current.abortController?.abort();
    onClose(false);
  }, [onClose]);

  const {
    statusCounts,
    isUploading,
    allUploaded,
    hasErrors,
    hasPending,
  } = useMemo(() => {
    const counts = { uploaded: 0, error: 0, pending: 0, uploading: 0 };
    for (const file of currentFiles) {
      counts[file.status] = (counts[file.status] || 0) + 1;
    }
    const total = currentFiles.length;
    return {
      statusCounts: counts,
      isUploading: state.current.uploading,
      allUploaded: total > 0 && counts.uploaded === total,
      hasErrors: counts.error > 0,
      hasPending: counts.pending > 0,
    };
  }, [currentFiles]);

  const mainAction = useMemo(() => {
    if (isUploading) return { label: "Subiendo...", action: null, disabled: true };
    if (allUploaded) return { label: "Aceptar", action: () => onClose(true) };
    if (hasErrors || hasPending) {
      return {
        label: hasErrors ? "Reintentar" : "Confirmar subida",
        action: startUpload,
      };
    }
    return null;
  }, [isUploading, allUploaded, hasErrors, hasPending, onClose, startUpload]);

  const getTitle = () => {
    if (allUploaded) return "Archivos subidos exitosamente";
    if (hasErrors) return "Algunos archivos fallaron";
    return "Confirmar subida de archivos";
  };

  const getSubtitle = () => {
    const total = currentFiles.length;
    const { uploaded = 0, pending = 0, uploading = 0, error = 0 } = statusCounts;

    const parts = [];
    if (total > 0) parts.push(`Total ${total} archivo${total > 1 ? "s" : ""}`);
    if (uploaded) parts.push(`subido${uploaded > 1 ? "s" : ""} ${uploaded}`);
    if (pending) parts.push(`por subir ${pending}`);
    if (uploading) parts.push(`subiendo ${uploading}`);
    if (error) parts.push(`con error${error > 1 ? "es" : ""} ${error}`);

    return parts.join(", ") + ".";
  };

  return (
    <Dialog
      open
      onClose={null}
      disableEscapeKeyDown
      sx={{
        '& .MuiDialogContent-root': {
          padding: '.5rem',
        },
      }}
    >
      <DialogTitle sx={{ padding: '.5rem' }}>
        <div className="fm-dialog-title">{getTitle()}</div>
        <div className="fm-dialog-subtitle">{getSubtitle()}</div>
      </DialogTitle>

      <DialogContent>
        {currentFiles.map((item, index) => (
          <Item
            key={`${item.file.name}-${index}`}
            item={item}
            index={index}
            onDelete={handleDelete}
            onRetry={handleRetry}
            onAdditionalDataChange={handleAdditionalDataChange}
            customComponents={customComponents}
          />
        ))}
      </DialogContent>

      <DialogActions>
        {!isUploading && <Button onClick={handleClose} size="small">Cancelar</Button>}
        {mainAction && (
          <Button
            onClick={mainAction.action}
            disabled={mainAction.disabled}
            size="small"
            variant="contained"
            autoFocus
          >
            {mainAction.label}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UploadConfirm;