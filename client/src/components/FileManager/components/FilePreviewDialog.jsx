import { Dialog, DialogContent } from "@mui/material";
import { useFileManagerContext } from "../context/FileManagerContext";
import FilePreview from "../shared/components/FilePreview";

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
    <DialogContent sx={{ padding: '.5rem' }}>
      <div style={{ height: 'calc(100vh - 100px)' }}>
        <FilePreview file={file} loadFile={loadFile} onDownload={download} />
      </div>
    </DialogContent>
  </Dialog>);
}

export default FilePreviewDialog;