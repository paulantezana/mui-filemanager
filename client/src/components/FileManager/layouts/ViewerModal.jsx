import FilePreviewDialog from "../components/FilePreviewDialog";
import { useFullscreenPreviewFile, useSetFullscreenPreviewFile } from "../context/FullscreenPreviewContext";

const ViewerModal = () => {
  const file = useFullscreenPreviewFile();
  const setFile = useSetFullscreenPreviewFile();

  const handleClose = () => {
    setFile(null);
  }

  if (!file) {
    return null;
  }

  return (
    <FilePreviewDialog
      file={file}
      onClose={handleClose}
    />)
}

export default ViewerModal;