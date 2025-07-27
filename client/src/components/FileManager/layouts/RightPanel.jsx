import { Button } from "@mui/material";
import getFileIcon from "../helpers/fileIcon";
import formatFileSize from "../helpers/formatFileSize";

import DownloadIcon from '@mui/icons-material/Download';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useSetFullscreenPreviewFile } from "../context/FullscreenPreviewContext";
import { useSelectedFile } from "../context/FileSelectionContext";
import { useFileManagerContext } from "../context/FileManagerContext";
import FileViewer from "../shared/components/FileViewer";

const RightPanel = () => {
  const { operations, onDownload } = useFileManagerContext()
  const setFile = useSetFullscreenPreviewFile();
  const selectedFile = useSelectedFile();

  const loadFile = async (file) => await operations.load(file);

  const handleFullScreen = (file) => {
    setFile(file);
  }

  if (!selectedFile) return null

  return (
    <div className="flex column justify-between h-full" style={{ paddingLeft: '.5rem' }}>
      <div className="flex items-center gap-1">
        {getFileIcon(selectedFile.type, selectedFile.name)}
        <div>{selectedFile.name}</div>
      </div>

      <FileViewer file={selectedFile} loadFile={loadFile} onDownload={onDownload} />

      <div>
        <div>
          <strong>Tamaño:</strong> {formatFileSize(selectedFile.size)}
        </div>
        <div>
          <strong>Modificado:</strong> {selectedFile.updatedAt?.toLocaleString()}
        </div>
        <div className="flex gap-2">
          <Button size="small" onClick={() => handleFullScreen(selectedFile)} variant="outlined" startIcon={<OpenInFullIcon />}>
            Ver completo
          </Button>
          <Button size="small" onClick={() => onDownload(selectedFile)} variant="outlined" startIcon={<DownloadIcon />}>
            Descargar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RightPanel;