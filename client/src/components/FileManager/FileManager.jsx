import PanelPreview from "./components/PanelPreview";
import { useState, useEffect } from "react";
import './styles/main.css';
import searchFiles from "./helpers/searchFile";
import FileFullPreview from "./components/FileFullPreview";
import PanelHeader from "./components/PanelHeader";
import PanelBody from "./components/PanelBody";
import Toolbar from "./components/Toolbar/Toolbar";
import Breadcrumb from "./components/Breadcrumb";
import Search from "./components/Search";
import { Box, Grid } from "@mui/material";

const useFileManager = ({ operations }) => {
  const [currentItems, setCurrentItems] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [pathHistory, setPathHistory] = useState([]);

  useEffect(() => {
    const setNormalized = (data) => {
      if (data && data.length > 0) {
        setDataSource(data);
        setCurrentItems(data);
        setPathHistory([{ name: 'Inicio', data: data }]);
      }
    }

    const setDataFunction = async (list) => {
      const files = await list();
      setNormalized(files);
    }

    if (Array.isArray(operations.list)) {
      setNormalized(operations.list);
    }

    if (typeof operations.list === 'function') {
      setDataFunction(operations.list);
    }
  }, [operations.list]);

  return {
    currentItems,
    pathHistory,
    setCurrentItems,
    setPathHistory,
  }
}

const FileManager = ({
  operations = {},
  acceptPairs = [],
  readOnly = false,
}) => {
  const {
    dataSource,
    currentItems,
    pathHistory,
    setCurrentItems,
    setPathHistory
  } = useFileManager({ operations });

  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [fullPreviewFile, setFullPreviewFile] = useState(null);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');

  const [rowSelectionModel, setRowSelectionModel] = useState({
    type: 'include',
    ids: new Set(),
  });

  const handleSearch = (term) => {
    setSearchTerm(term);

    if (term.trim() === "") {
      // Si no hay término de búsqueda, mostrar contenido actual
      setIsSearching(false);
      const currentPath = pathHistory[pathHistory.length - 1];
      setCurrentItems(currentPath.data);
    } else {
      // Buscar en todo el fileTree
      setIsSearching(true);
      const results = searchFiles(dataSource, term);
      setCurrentItems(results);
    }

    setSelectedItem(null);
  };

  const handleFileClick = (file) => {
    if (file.type === 'file') {
      setSelectedItem(file);
      return;
    }

    // Si estamos en modo búsqueda, salir del modo búsqueda al abrir carpeta
    if (isSearching) {
      setSearchTerm("");
      setIsSearching(false);
    }

    // Agregar al historial de navegación
    setPathHistory(prev => [...prev, { name: file.name, data: file.children }]);
    setCurrentItems(file.children);
    setSelectedItem(null);
  };

  // Función para manejar doble click - abrir preview completo
  const handleFullScreen = (file) => {
    if (file.type === 'file') {
      setFullPreviewFile(file);
      setIsFullPreviewOpen(true);
    }
  };

  // Función para cerrar el preview completo
  const handleCloseFullPreview = () => {
    setIsFullPreviewOpen(false);
    setFullPreviewFile(null);
  };

  // Función para navegar hacia atrás usando el breadcrumb
  const navigateToPath = (index) => {
    // Si estamos buscando, limpiar búsqueda
    if (isSearching) {
      setSearchTerm("");
      setIsSearching(false);
    }

    const newPath = pathHistory.slice(0, index + 1);
    const targetFolder = newPath[newPath.length - 1];

    setPathHistory(newPath);
    setCurrentItems(targetFolder.data);
    setSelectedItem(null);
  };

  const handleDownload = async (file) => {
    const blob = await operations.load(file.path);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'archivo';
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleDelete = async (file) => {
    const response = await operations.delete(file.path);
  }

  const onClickMenu = async (key, file) => {
    console.log({ key, file }, '_MENU_');
    if (key === 'delete') {
      await handleDelete(file);
    }
    if (key === 'download') {
      await handleDownload(file);
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 6, md: 8, lg: 9 }}>
          <div>
            <Toolbar operations={operations} rowSelectionModel={rowSelectionModel} setViewMode={setViewMode} viewMode={viewMode} />
            <div className="flex justify-between items-center" style={{ padding: '6px 0' }}>
              <Breadcrumb pathHistory={pathHistory} onNavigate={navigateToPath} />
              <Search onSearch={handleSearch} searchTerm={searchTerm} />
            </div>
            {isSearching && (
              <div style={{ padding: '8px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
                Mostrando resultados para: "{searchTerm}" ({currentItems.length} archivo(s) encontrado(s))
              </div>
            )}
          </div>
          <div style={{ overflow: 'auto' }}>
            <PanelBody
              currentItems={currentItems}
              onClick={handleFileClick}
              onDoubleClick={handleFullScreen}
              onClickMenu={onClickMenu}
              viewMode={viewMode}
              rowSelectionModel={rowSelectionModel}
              setRowSelectionModel={setRowSelectionModel}
            />
          </div>
        </Grid>
        <Grid size={{ xs: 6, md: 4, lg: 3 }}>
          {selectedItem && <PanelPreview selectedFile={selectedItem} onFullScreen={handleFullScreen} onDownload={handleDownload} operations={operations} />}
        </Grid>
      </Grid>
      {isFullPreviewOpen && (
        <FileFullPreview
          file={fullPreviewFile}
          onClose={handleCloseFullPreview}
          operations={operations}
        />
      )}
    </Box>
  );
};

export default FileManager;