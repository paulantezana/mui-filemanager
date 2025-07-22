import { Dialog } from "@mui/material";
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
    <FilePreview file={file} loadFile={loadFile} onDownload={onDownload} />
  </Dialog>);
}

export default FileFullPreview;