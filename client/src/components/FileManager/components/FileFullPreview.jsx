import { Dialog, DialogContent } from "@mui/material";
import FilePreview from "./FilePreview";

const FileFullPreview = ({ file, onClose, operations, onDownload }) => {
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
    <DialogContent sx={{ padding: '.5rem' }}>
      <div style={{ height: 'calc(100vh - 100px)' }}>
        <FilePreview file={file} loadFile={loadFile} onDownload={onDownload} />
      </div>
    </DialogContent>
  </Dialog>);
}

export default FileFullPreview;