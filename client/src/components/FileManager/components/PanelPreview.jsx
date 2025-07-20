import { Button } from "@mui/material";
import getFileIcon from "../helpers/fileIcon";
import formatFileSize from "../helpers/formatFileSize";
import FilePreview from "./FilePreview";

import DownloadIcon from '@mui/icons-material/Download';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

const PanelPreview = ({ selectedFile, operations, onFullScreen, onDownload }) => {
  if (!selectedFile) return null

  const loadFile = async (file) => {
    const blob = await operations.load(file.path);
    return blob;
  }

  return (
    <div>
      <div className="flex items-center gap-1">
        {getFileIcon(selectedFile.type, selectedFile.name)}
        <h3 className="font-semibold">{selectedFile.name}</h3>
      </div>

      <FilePreview file={selectedFile} loadFile={loadFile} onDownload={onDownload} />

      <div>
        <div>
          <strong>Tipo de archivo:</strong> {selectedFile.mimeType}
        </div>
        <div>
          <strong>Tamaño:</strong> {formatFileSize(selectedFile.size)}
        </div>
        <div>
          <strong>Modificado:</strong> {selectedFile.updatedAt.toLocaleString()}
        </div>
      </div>

      <div className="flex gap-2 justify-center">
        <Button size="small" onClick={() => onFullScreen(selectedFile)} variant="outlined" startIcon={<OpenInFullIcon />}>
          Ver completo
        </Button>
        <Button size="small" onClick={() => onDownload(selectedFile)} variant="outlined" startIcon={<DownloadIcon/>}>
          Descargar
        </Button>
      </div>
    </div>
  )
}

export default PanelPreview;