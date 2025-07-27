import { Button, Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import { useFileManagerContext } from "../context/FileManagerContext";
import FileViewer from "../shared/components/FileViewer";

const FilePreviewDialog = ({ file, onClose }) => {
  const { operations, download } = useFileManagerContext();

  const loadFile = async (file) => {
    const blob = await operations.load(file);
    return blob;
  }

  return (<Dialog
    open
    fullWidth
    maxWidth="lg"
    scroll="body"
    onClose={onClose}
  >
    <DialogContent sx={{ padding: '0' }}>
      <div className="flex column" style={{ height: 'calc(100vh - 80px)' }}>
        <div className="flex justify-between" style={{ padding: '.5rem 0 .5rem .5rem' }}>
          <Button size="small" onClick={() => download(file)} startIcon={<DownloadIcon />}>Descargar</Button>
          <IconButton size="small" onClick={onClose}><CloseIcon fontSize="small" /></IconButton>
        </div>
        <div className="h-full flex items-center justify-center">
          <FileViewer file={file} loadFile={loadFile}/>
        </div>
      </div>
    </DialogContent>
  </Dialog>);
}

export default FilePreviewDialog;