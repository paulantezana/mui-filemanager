import { useDisplayMode } from "../../context/DisplayModeContext";
import { useFileManagerContext } from "../../context/FileManagerContext";
import { useSetFullscreenPreviewFile } from "../../context/FullscreenPreviewContext";
import FileGridView from "./FileGridView";
import TableView from "./TableView";

const PanelBody = () => {
  const { manager, operations, rowSelectionModel, setRowSelectionModel } = useFileManagerContext();
  const { pathHistory, setPathHistory, currentItems } = manager;

  const setFile = useSetFullscreenPreviewFile();
  const display = useDisplayMode();

  const handleFileDoubleClick = (item) => {
    if (item.type === 'file') {
      setFile(item);
      return;
    }

    // Agregar al historial de navegación
    setPathHistory(prev => [...prev, { name: item.name }]);
    // setSelectedItem(null);
  }
  
  const onClickMenu = async (key, file) => {
    if (key === 'delete') {
      await handleDelete(file);
    }
    if (key === 'download') {
      await download(file);
    }
  }

  return (
    <div className="panel-body">
      {display === 'table' && <TableView
        files={currentItems}
        onDoubleClick={handleFileDoubleClick}
        onClickMenu={onClickMenu}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
      />}
      {display === 'grid' && <FileGridView
        files={currentItems}
        onDoubleClick={handleFileDoubleClick}
        onClickMenu={onClickMenu}
        rowSelectionModel={rowSelectionModel}
        setRowSelectionModel={setRowSelectionModel}
        operations={operations}
      />}
    </div>
  );
};

export default PanelBody;