import PanelPreview from "./components/PanelPreview";
import { useState } from "react";
import './styles/main.css';
import searchFiles from "./helpers/searchFile";
import FileFullPreview from "./components/FileFullPreview";
import PanelBody from "./components/PanelBody";
import Toolbar from "./components/Toolbar/Toolbar";
import Breadcrumb from "./components/Breadcrumb";
import Search from "./components/Search";
import useFileManager from "./hooks/useFileManager";
import VerticalSplitter from "./components/VerticalSplitter";

const FileManager = ({
  operations = {},
  acceptPairs = [],
  readOnly = false,
  folderModel = 'server', // server || client
  customColumns = [],
}) => {
  const {
    dataSource,
    currentItems,
    pathHistory,
    setCurrentItems,
    setPathHistory,
    refresh
  } = useFileManager({ operations, folderModel });

  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [fullPreviewFile, setFullPreviewFile] = useState(null);
  const [isFullPreviewOpen, setIsFullPreviewOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');

  const [rowSelectionModel, setRowSelectionModel] = useState([]);

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

  // Select
  const handleFileClick = (file) => {
    if (file.type === 'file') {
      setSelectedItem(file);
      return;
    }
  };

  // Open
  const handleFileDoubleClick = (item) => {
    if (item.type === 'file') {
      handleFullScreen(item);
      return;
    }

    // Si estamos en modo búsqueda, salir del modo búsqueda al abrir carpeta
    if (isSearching) {
      setSearchTerm("");
      setIsSearching(false);
    }

    // Agregar al historial de navegación
    setPathHistory(prev => [...prev, { name: item.name }]);
    setSelectedItem(null);
  }

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

    setPathHistory(newPath);
    setSelectedItem(null);
  };

  const handleDownload = async (file) => {
    const blob = await operations.load(file);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name || 'archivo';
    a.click();
    URL.revokeObjectURL(url);
  }

  const handleDelete = async (file) => {
    const response = await operations.delete(file);
  }

  const onClickMenu = async (key, file) => {
    if (key === 'delete') {
      await handleDelete(file);
    }
    if (key === 'download') {
      await handleDownload(file);
    }
  }

  const handleMultipleDelete = async () => {
    debugger;
    for (let i = 0; i < rowSelectionModel.length; i++) {
      const file = currentItems.find(r => r.id === rowSelectionModel[i]);
      await handleDelete(file);
    }
  }

  const handleMultipleDownload = async () => {
    debugger;
    for (let i = 0; i < rowSelectionModel.length; i++) {
      const file = currentItems.find(r => r.id === rowSelectionModel[i]);
      await handleDownload(file);
    }
  }

  const LeftPanel = (<div style={{ paddingRight: '.5rem' }}>
    <div>
      <Toolbar
        operations={operations}
        refresh={refresh}
        rowSelectionModel={rowSelectionModel}
        setViewMode={setViewMode}
        viewMode={viewMode}
        pathHistory={pathHistory}
        onDelete={handleMultipleDelete}
        onDownload={handleMultipleDownload}
      />
      <div className="flex justify-between items-center" style={{ padding: '4px 0' }}>
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
        onDoubleClick={handleFileDoubleClick}
        onClickMenu={onClickMenu}
        viewMode={viewMode}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        customColumns={customColumns}
      />
    </div>
  </div>);

  const RightPanel = (<PanelPreview selectedFile={selectedItem} onFullScreen={handleFullScreen} onDownload={handleDownload} operations={operations} />);

  return (
    <div className="h-full">
      <VerticalSplitter
        leftContent={LeftPanel}
        rightContent={RightPanel}
        initialLeftWidth={60}
        minLeftWidth={15}
        maxLeftWidth={85}
        splitterWidth={6}
      />
      {isFullPreviewOpen && (
        <FileFullPreview
          file={fullPreviewFile}
          onClose={handleCloseFullPreview}
          operations={operations}
        />
      )}
    </div>
  );
};

export default FileManager;