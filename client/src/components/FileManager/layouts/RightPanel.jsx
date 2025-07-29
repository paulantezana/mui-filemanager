import { Button } from "@mui/material";
import getFileIcon from "../helpers/fileIcon";
import formatFileSize from "../helpers/formatFileSize";

import DownloadIcon from '@mui/icons-material/Download';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { useSetFullscreenPreviewFile } from "../context/FullscreenPreviewContext";
import { useSelectedFile } from "../context/FileSelectionContext";
import FileViewer from "../shared/components/FileViewer";
import useFileOperation from "../hooks/useFileOperation";
import { useFileManagerContext } from "../context/FileManagerContext";

const ComponentRenderer = ({ config, item }) => {
  if (!config.ComponentRender) return null;

  const value = item[config.key]
  const CustomComponent = config.ComponentRender;

  return (
    <div style={{ minWidth: '12rem' }}>
      <CustomComponent
        value={value}
        item={item}
      />
    </div>
  );
};

const CustomComponentRender = ({ item }) => {
  const { config } = useFileManagerContext();
  const { customComponents } = config;

  return (<>
    {customComponents.map((config) => (
      <ComponentRenderer
        key={config.key}
        config={config}
        item={item}
      />
    ))}
  </>)
}

const RightPanel = () => {
  const { dowloandFile, loadFile } = useFileOperation();
  const setFile = useSetFullscreenPreviewFile();
  const selectedFile = useSelectedFile();

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

      <FileViewer file={selectedFile} loadFile={loadFile} />

      <div>
        <CustomComponentRender item={selectedFile} />
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
          <Button size="small" onClick={() => dowloandFile(selectedFile)} variant="outlined" startIcon={<DownloadIcon />}>
            Descargar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RightPanel;